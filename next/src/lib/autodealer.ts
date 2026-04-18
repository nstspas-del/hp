// ── AutoDealer — виджет онлайн-записи HP Тюнинг ─────────────────────────────
// Ключ: 107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd
// Официальный код инициализации взят из панели AutoDealer (апрель 2026)
// Страницы соглашений для виджета:
//   Согласие ПДн:  https://hptuning.ru/consent
//   Политика ПДн:  https://hptuning.ru/privacy

import { YM_ID } from '@/components/analytics/YandexMetrika';

const AUTODEALER_KEY = '107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd';

declare global {
  interface Window {
    autodealer?: {
      init: (k: string) => void;
      open: (cfg?: Record<string, unknown>) => void;
    };
    autodealerasync: Array<unknown>;
    // ym и YM_COUNTER_ID объявлены в YandexMetrika.tsx
  }
}

// ── Инициализация виджета ─────────────────────────────────────────────────────
export function initAutoDealer() {
  if (typeof window === 'undefined') return;
  // Если уже инициализирован — не дублируем
  if (document.querySelector('script[src*="online.autodealer.ru"]')) return;

  // Официальный init-код из панели AutoDealer
  function Build(name: string) {
    return function (...args: unknown[]) {
      window.autodealerasync = window.autodealerasync || [];
      window.autodealerasync.push(name, args);
    };
  }

  if (typeof window.autodealer === 'undefined') {
    const s = document.createElement('script');
    s.charset = 'utf-8';
    s.type = 'text/javascript';
    s.src = 'https://online.autodealer.ru/widget/app.js';
    const x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
    window.autodealer = {} as Window['autodealer'];
    window.autodealerasync = [];
    (window.autodealer as NonNullable<Window['autodealer']>).init = Build('init');
    (window.autodealer as NonNullable<Window['autodealer']>).open = Build('open');
  }

  window.autodealer!.init(AUTODEALER_KEY);

  // ── Яндекс.Метрика — цели для событий виджета ────────────────────────────
  // Типы событий AutoDealer: OPEN, SUBMIT, SUBMIT_SUCCESS, CLOSE
  document.addEventListener('autodealerEvents', (e: Event) => {
    const customEvent = e as CustomEvent<{ type: string }>;
    const eventType = customEvent?.detail?.type;

    const goalMap: Record<string, string> = {
      OPEN:           'autodealer_open',    // виджет открылся (вторичная)
      SUBMIT:         'autodealer_submit',  // нажата кнопка отправки (вторичная)
      SUBMIT_SUCCESS: 'booking_success',    // заявка успешно отправлена (первичная!)
      CLOSE:          'autodealer_close',   // закрыт без записи (антицель)
    };

    const goal = goalMap[eventType];
    if (goal && typeof window.ym === 'function') {
      window.ym(YM_ID, 'reachGoal', goal, { eventType });
    }
  });
}

// ── Открытие виджета + цель booking_open ─────────────────────────────────────
export function openBooking(serviceHint?: string) {
  if (typeof window === 'undefined') return;

  // Цель: клик по кнопке "Записаться"
  if (typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', 'booking_open',
      serviceHint ? { service: serviceHint } : undefined);
  }

  try {
    if (window.autodealer?.open) {
      window.autodealer.open(serviceHint ? { service: serviceHint } : undefined);
    } else {
      // Виджет ещё грузится — ставим в очередь
      window.autodealerasync = window.autodealerasync || [];
      window.autodealerasync.push('open', serviceHint ? [{ service: serviceHint }] : []);
    }
  } catch (err) {
    console.error('[AutoDealer] openBooking error:', err);
    // Fallback — звонок
    window.location.href = 'tel:+79818428151';
  }
}
