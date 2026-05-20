/**
 * POST /api/lead
 *
 * Приёмник лидов с inline-форм (Stage 3 в калькуляторе и т.п.).
 *
 * Доставка идёт по двум каналам:
 *   1) Email через Яндекс SMTP — основной канал (надёжно работает с РФ-сервера).
 *   2) Telegram-бот — best-effort, отрабатывает только если outbound на
 *      api.telegram.org разрешён. На некоторых хостингах в РФ заблокирован.
 *
 * Лид считается доставленным, если сработал хотя бы один канал.
 *
 * ENV переменные (.env.local на сервере):
 *   — Email (основной):
 *     YANDEX_SMTP_USER     — логин Яндекс.Почты, обычно совпадает с FROM
 *     YANDEX_SMTP_PASS     — пароль приложения (не обычный пароль!)
 *     LEAD_EMAIL_TO        — куда слать заявки (можно несколько через запятую)
 *     LEAD_EMAIL_FROM      — опционально, по умолчанию = YANDEX_SMTP_USER
 *
 *   — Telegram (best-effort):
 *     TELEGRAM_BOT_TOKEN   — токен бота (получен у @BotFather)
 *     TELEGRAM_CHAT_ID     — id чата, куда падают заявки
 *
 * Если ни один канал не сработал — пишем в лог (pm2 logs hptuning) и
 * возвращаем delivered=false, форма покажет пользователю состояние "не дошло,
 * позвоните напрямую".
 *
 * Защита от спама: проверка формата телефона + honeypot-поле.
 */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LeadPayload = {
  phone?: string;
  name?: string;
  source?: string;
  context?: Record<string, unknown>;
  // honeypot — невидимое поле, заполняется только ботами
  website?: string;
};

function normalizePhone(p: string): string {
  return p.replace(/[^\d+]/g, '');
}

function isValidPhone(p: string): boolean {
  const digits = p.replace(/\D/g, '');
  // Российский номер: 10 (без префикса) или 11 (с 7/8) цифр
  return digits.length === 10 || digits.length === 11;
}

// Минимальная экранизация для HTML (и для Telegram parse_mode=HTML, и для email)
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// --- Канал 1: Email через Яндекс SMTP ---------------------------------------

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.YANDEX_SMTP_USER;
  const pass = process.env.YANDEX_SMTP_PASS;
  if (!user || !pass) return null;
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // SSL
    auth: { user, pass },
  });
  return cachedTransporter;
}

type LeadData = {
  phone: string;
  name: string;
  source: string;
  ctx: Record<string, unknown>;
  timestamp: string;
};

async function sendToEmail(data: LeadData): Promise<boolean> {
  const transporter = getTransporter();
  const to = process.env.LEAD_EMAIL_TO;
  if (!transporter || !to) return false;

  const from = process.env.LEAD_EMAIL_FROM || process.env.YANDEX_SMTP_USER!;

  const subject = `Новая заявка с сайта — ${data.source}${data.name ? ' — ' + data.name : ''}`;

  const ctxRows = Object.entries(data.ctx)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0;font-weight:600">${escapeHtml(String(v))}</td></tr>`,
    )
    .join('');

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;color:#111">
      <h2 style="margin:0 0 16px;color:#111">🔥 Новая заявка с сайта</h2>
      <table style="border-collapse:collapse;font-size:15px;line-height:1.5">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Источник</td><td style="padding:4px 0;font-weight:600">${escapeHtml(data.source)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Телефон</td><td style="padding:4px 0;font-weight:700;font-size:17px"><a href="tel:${escapeHtml(data.phone)}" style="color:#111;text-decoration:none">${escapeHtml(data.phone)}</a></td></tr>
        ${data.name ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Имя</td><td style="padding:4px 0;font-weight:600">${escapeHtml(data.name)}</td></tr>` : ''}
        ${ctxRows}
        <tr><td style="padding:12px 12px 4px 0;color:#666">Время (МСК)</td><td style="padding:12px 0 4px;color:#666">${escapeHtml(data.timestamp)}</td></tr>
      </table>
    </div>
  `;

  const textLines = [
    'Новая заявка с сайта',
    `Источник: ${data.source}`,
    `Телефон: ${data.phone}`,
    data.name ? `Имя: ${data.name}` : '',
    ...Object.entries(data.ctx).map(([k, v]) => `${k}: ${String(v)}`),
    `Время (МСК): ${data.timestamp}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await transporter.sendMail({
      from: `"HP Тюнинг сайт" <${from}>`,
      to,
      replyTo: data.phone ? undefined : from,
      subject,
      text: textLines,
      html,
    });
    return true;
  } catch (e) {
    console.error('[lead] email error:', e);
    return false;
  }
}

// --- Канал 2: Telegram (best-effort) ----------------------------------------

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  // Короткий таймаут — если outbound на api.telegram.org заблокирован,
  // мы не хотим, чтобы запрос висел и тормозил ответ пользователю.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    return res.ok;
  } catch (e) {
    // fetch failed / aborted — Telegram скорее всего недоступен с этого хоста.
    // Молча возвращаем false, лог в одну строку чтобы не засорять pm2 logs.
    const msg = e instanceof Error ? e.message : String(e);
    console.warn('[lead] telegram unavailable:', msg);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- Handler ---------------------------------------------------------------

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  // Honeypot — если заполнен, это бот. Делаем вид что приняли.
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const phone = (body.phone ?? '').trim();
  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
  }

  const name = (body.name ?? '').trim().slice(0, 80);
  const source = (body.source ?? 'unknown').slice(0, 80);
  const ctx = body.context ?? {};
  const normalized = normalizePhone(phone);
  const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

  const data: LeadData = { phone: normalized, name, source, ctx, timestamp };

  // Формируем текст для Telegram
  const tgLines = [
    '<b>🔥 Новая заявка с сайта</b>',
    `<b>Источник:</b> ${escapeHtml(source)}`,
    `<b>Телефон:</b> <code>${escapeHtml(normalized)}</code>`,
    name ? `<b>Имя:</b> ${escapeHtml(name)}` : '',
    Object.keys(ctx).length
      ? `<b>Контекст:</b>\n<pre>${escapeHtml(JSON.stringify(ctx, null, 2))}</pre>`
      : '',
    `<i>${escapeHtml(timestamp)}</i>`,
  ]
    .filter(Boolean)
    .join('\n');

  // Пробуем оба канала параллельно — каждый со своим таймаутом.
  // Заявка считается доставленной, если сработал ХОТЯ БЫ один.
  const [emailOk, telegramOk] = await Promise.all([
    sendToEmail(data),
    sendToTelegram(tgLines),
  ]);

  const delivered = emailOk || telegramOk;

  if (!delivered) {
    // Никуда не доехало — критично, в лог во весь голос.
    console.error('[lead] ALL CHANNELS FAILED', {
      phone: normalized,
      name,
      source,
      ctx,
      emailOk,
      telegramOk,
    });
  } else if (!emailOk || !telegramOk) {
    // Один канал упал — фиксируем для мониторинга, но клиенту это ОК.
    console.warn('[lead] partial delivery', { emailOk, telegramOk });
  }

  return NextResponse.json({
    ok: true,
    delivered,
    channels: { email: emailOk, telegram: telegramOk },
  });
}
