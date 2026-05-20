/**
 * POST /api/lead
 *
 * Минимальный приёмник лидов с inline-форм (Stage 3 в калькуляторе и т.п.).
 * Отправляет заявку в Telegram-бот HP Тюнинг.
 *
 * ENV переменные (задаются в .env.local на сервере):
 *   TELEGRAM_BOT_TOKEN   — токен бота (получен у @BotFather)
 *   TELEGRAM_CHAT_ID     — id чата, куда падают заявки (личка/группа)
 *
 * Если ENV не настроены — заявка пишется в лог (pm2 logs hptuning) и
 * клиенту всё равно отдаём 200, чтобы UX не ломался. На прод обязательно
 * проставить переменные.
 *
 * Защита от спама: минимальные проверки на длину/формат + honeypot.
 */

import { NextResponse } from 'next/server';

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

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

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
    });
    return res.ok;
  } catch (e) {
    console.error('[lead] telegram error:', e);
    return false;
  }
}

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  // Honeypot — если заполнен, это бот. Делаем вид что приняли.
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const phone = (body.phone ?? '').trim();
  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
  }

  const name = (body.name ?? '').trim().slice(0, 80);
  const source = (body.source ?? 'unknown').slice(0, 80);
  const ctx = body.context ?? {};
  const normalized = normalizePhone(phone);

  // Формируем сообщение
  const lines = [
    '<b>🔥 Новая заявка с сайта</b>',
    `<b>Источник:</b> ${escapeHtml(source)}`,
    `<b>Телефон:</b> <code>${escapeHtml(normalized)}</code>`,
    name ? `<b>Имя:</b> ${escapeHtml(name)}` : '',
    Object.keys(ctx).length
      ? `<b>Контекст:</b>\n<pre>${escapeHtml(JSON.stringify(ctx, null, 2))}</pre>`
      : '',
    `<i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</i>`,
  ]
    .filter(Boolean)
    .join('\n');

  const sent = await sendToTelegram(lines);
  if (!sent) {
    // Не упало через TG — пишем в лог, чтобы Дима поднял хотя бы из pm2 logs
    console.log('[lead] FALLBACK LOG:', { phone: normalized, name, source, ctx });
  }

  return NextResponse.json({ ok: true, delivered: sent });
}

// Минимальная экранизация для Telegram HTML parse_mode
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
