/**
 * POST /api/lead
 *
 * Приёмник лидов с inline-форм (Stage 3 в калькуляторе и т.п.).
 *
 * Доставка идёт по двум каналам:
 *   1) Email через UniSender Go HTTP API — основной канал.
 *      Работает через 443 порт, не требует открытого SMTP outbound
 *      (Selectel и другие РФ-хостеры режут 25/465/587 по умолчанию).
 *      Бесплатный лимит: 1500 писем/мес — на лиды автосервиса хватит с запасом.
 *
 *   2) Telegram-бот — best-effort, отрабатывает только если outbound на
 *      api.telegram.org разрешён. На Selectel и многих РФ-VDS заблокирован
 *      на уровне ДЦ. Оставляем код на случай, если когда-нибудь откроют
 *      или переедем на другой хостинг.
 *
 * Лид считается доставленным, если сработал ХОТЯ БЫ один канал.
 *
 * ENV переменные (.env.local на сервере):
 *   — Email через UniSender Go (основной канал):
 *     UNISENDER_GO_API_KEY  — API-ключ из UniSender Go → Settings → API Keys
 *     LEAD_EMAIL_TO         — куда слать заявки (можно несколько через запятую)
 *     LEAD_EMAIL_FROM       — отправитель, домен ДОЛЖЕН быть подтверждён в UniSender
 *
 *   — Telegram (best-effort):
 *     TELEGRAM_BOT_TOKEN    — токен бота (получен у @BotFather)
 *     TELEGRAM_CHAT_ID      — id чата, куда падают заявки
 *
 * Если ни один канал не сработал — пишем в лог (pm2 logs hptuning) и
 * возвращаем delivered=false. Форма покажет пользователю состояние
 * "не дошло, позвоните напрямую".
 *
 * Защита от спама: проверка формата телефона + honeypot-поле.
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

type LeadData = {
  phone: string;
  name: string;
  source: string;
  ctx: Record<string, unknown>;
  timestamp: string;
};

function normalizePhone(p: string): string {
  return p.replace(/[^\d+]/g, '');
}

function isValidPhone(p: string): boolean {
  const digits = p.replace(/\D/g, '');
  // Российский номер: 10 (без префикса) или 11 (с 7/8) цифр
  return digits.length === 10 || digits.length === 11;
}

// Минимальная экранизация для HTML (для Telegram parse_mode=HTML и email)
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Канал 1: Email через UniSender Go HTTP API -----------------------------

const UNISENDER_GO_ENDPOINT =
  'https://go1.unisender.ru/ru/transactional/api/v1/email/send.json';

function buildEmailHtml(data: LeadData): string {
  const ctxRows = Object.entries(data.ctx)
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:6px 16px 6px 0;color:#666;font-size:14px;white-space:nowrap">${escapeHtml(k)}</td>
          <td style="padding:6px 0;font-weight:600;font-size:15px;color:#111">${escapeHtml(String(v))}</td>
        </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ru">
<body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
    <div style="display:inline-block;padding:6px 12px;background:#39FF14;color:#111;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.5px;margin-bottom:16px">
      🔥 НОВАЯ ЗАЯВКА
    </div>
    <h2 style="margin:0 0 4px;color:#111;font-size:22px;font-weight:700">${escapeHtml(data.source)}</h2>
    <div style="color:#666;font-size:13px;margin-bottom:20px">${escapeHtml(data.timestamp)} (МСК)</div>

    <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
      <tr>
        <td style="padding:6px 16px 6px 0;color:#666;font-size:14px;white-space:nowrap">Телефон</td>
        <td style="padding:6px 0">
          <a href="tel:${escapeHtml(data.phone)}" style="color:#111;text-decoration:none;font-weight:700;font-size:20px">${escapeHtml(data.phone)}</a>
        </td>
      </tr>
      ${data.name ? `<tr>
        <td style="padding:6px 16px 6px 0;color:#666;font-size:14px">Имя</td>
        <td style="padding:6px 0;font-weight:600;font-size:15px;color:#111">${escapeHtml(data.name)}</td>
      </tr>` : ''}
      ${ctxRows}
    </table>

    <a href="tel:${escapeHtml(data.phone)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:600;font-size:15px">
      📞 Перезвонить клиенту
    </a>

    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee;color:#999;font-size:12px">
      Заявка с сайта <a href="https://hptuning.ru" style="color:#999">hptuning.ru</a>
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText(data: LeadData): string {
  const ctxLines = Object.entries(data.ctx).map(
    ([k, v]) => `${k}: ${String(v)}`,
  );
  return [
    'Новая заявка с сайта HP Тюнинг',
    '',
    `Источник: ${data.source}`,
    `Телефон: ${data.phone}`,
    data.name ? `Имя: ${data.name}` : '',
    ...ctxLines,
    '',
    `Время (МСК): ${data.timestamp}`,
    '',
    'hptuning.ru',
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendToEmail(data: LeadData): Promise<boolean> {
  const apiKey = process.env.UNISENDER_GO_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  const from = process.env.LEAD_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn('[lead] email channel not configured (missing UNISENDER_GO_API_KEY / LEAD_EMAIL_TO / LEAD_EMAIL_FROM)');
    return false;
  }

  // UniSender Go умеет несколько получателей — разрешаем "a@x.ru, b@y.ru"
  const recipients = to
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((email) => ({ email }));

  const subject = `Заявка с сайта — ${data.source}${data.name ? ' — ' + data.name : ''}${data.phone ? ' — ' + data.phone : ''}`;

  const payload = {
    message: {
      recipients,
      body: {
        html: buildEmailHtml(data),
        plaintext: buildEmailText(data),
      },
      subject,
      from_email: from,
      from_name: 'HP Тюнинг — сайт',
      // Чтоб в почте Reply-All не отвечал самому сайту
      reply_to: from,
      // Транзакционная отправка — не маркетинг, без unsubscribe
      track_links: 0,
      track_read: 0,
    },
  };

  // Жёсткий таймаут, чтобы пользователь не ждал зря, если UniSender лежит
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(UNISENDER_GO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const raw = await res.text();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // тело не JSON — оставляем как есть
    }

    // UniSender Go возвращает status: "success" / "error".
    // На успехе также есть job_id и/или failed_emails: [].
    // Документация: https://godocs.unisender.ru/web-api-ref#email-send
    if (res.ok && parsed && (parsed as { status?: string }).status === 'success') {
      return true;
    }

    console.error('[lead] unisender error', {
      httpStatus: res.status,
      body: raw.slice(0, 500),
    });
    return false;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[lead] unisender request failed:', msg);
    return false;
  } finally {
    clearTimeout(timeoutId);
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
