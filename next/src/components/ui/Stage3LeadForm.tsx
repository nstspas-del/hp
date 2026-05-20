'use client';

/**
 * Stage3LeadForm — компактная форма "оставьте телефон, рассчитаем за 15 минут".
 *
 * Рендерится внутри красного блока калькулятора при выборе Stage 3
 * (когда цена и характеристики — "по запросу", чтобы клиент не уходил
 * из контекста, а сразу оставил заявку).
 *
 * Отправляет POST /api/lead с контекстом (бренд, движок, stage).
 * Имеет honeypot-поле (website) для защиты от ботов.
 *
 * Цели в Метрике: stage3_lead_submit (success) / stage3_lead_fail.
 */

import { useState, FormEvent } from 'react';
import { Send, Loader2, Check, AlertTriangle } from 'lucide-react';
import { YM_ID } from '@/components/analytics/YandexMetrika';

type Props = {
  context: {
    brand?: string;
    line?: string;
    generation?: string;
    engine?: string;
    stage: 'Stage 3';
  };
};

type Status = 'idle' | 'sending' | 'ok' | 'fail';

export function Stage3LeadForm({ context }: Props) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState(''); // ловушка для ботов
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setErrorMsg('Введите корректный номер');
      setStatus('fail');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name,
          website: honeypot,
          source: `Чип-тюнинг Stage 3 — ${context.brand ?? ''} ${context.engine ?? ''}`.trim(),
          context,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setStatus('ok');
        setPhone('');
        setName('');
        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
          window.ym(YM_ID, 'reachGoal', 'stage3_lead_submit', context as Record<string, unknown>);
        }
      } else {
        setStatus('fail');
        setErrorMsg('Не удалось отправить. Позвоните, пожалуйста.');
        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
          window.ym(YM_ID, 'reachGoal', 'stage3_lead_fail');
        }
      }
    } catch {
      setStatus('fail');
      setErrorMsg('Сеть недоступна. Попробуйте ещё раз или позвоните.');
    }
  }

  // ── Состояние "успех" ───────────────────────────────────────────────────────
  if (status === 'ok') {
    return (
      <div className="mt-4 rounded-2xl bg-white/15 border border-white/30 p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-full bg-white text-red-700 flex items-center justify-center shrink-0">
            <Check className="size-5" strokeWidth={3} />
          </div>
          <div>
            <div className="text-white font-bold text-sm mb-0.5">Заявка принята</div>
            <div className="text-white/85 text-xs leading-snug">
              Мастер свяжется с вами в течение 15 минут. Если нужно срочно — позвоните
              напрямую: <a href="tel:+79818428151" className="underline">+7 (981) 842-81-51</a>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Форма ───────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 rounded-2xl bg-white/10 border border-white/25 p-4 backdrop-blur-sm"
      noValidate
    >
      <div className="text-white text-sm font-semibold mb-1">
        Оставьте телефон — рассчитаем за 15 минут
      </div>
      <div className="text-white/75 text-xs mb-3">
        Stage 3 — индивидуальная сборка под ваш мотор. Мастер уточнит конфигурацию
        и пришлёт точную цену.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
        {/* Honeypot — невидимое поле, ловит ботов */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={status === 'sending'}
          required
          className="bg-white/95 text-gray-900 placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/60 disabled:opacity-60"
        />
        <input
          type="text"
          autoComplete="name"
          placeholder="Имя (по желанию)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === 'sending'}
          className="bg-white/95 text-gray-900 placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/60 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-black/85 hover:bg-black text-white rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Отправка
            </>
          ) : (
            <>
              <Send className="size-4" />
              Отправить
            </>
          )}
        </button>
      </div>

      {/* Ошибка */}
      {status === 'fail' && errorMsg && (
        <div className="mt-2 flex items-center gap-2 text-white/90 text-xs">
          <AlertTriangle className="size-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Микро-согласие */}
      <div className="mt-2 text-white/65 text-[11px] leading-snug">
        Нажимая «Отправить», вы соглашаетесь с{' '}
        <a href="/consent" target="_blank" className="underline hover:text-white">
          обработкой персональных данных
        </a>
        .
      </div>
    </form>
  );
}

export default Stage3LeadForm;
