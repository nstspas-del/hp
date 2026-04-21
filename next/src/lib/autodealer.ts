// ── AutoDealer — виджет онлайн-записи HP Тюнинг ─────────────────────────────
// Ключ: 107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd
//
// КАК РАБОТАЕТ ВИДЖЕТ (важно для дебага!):
//
// 1. app.js загружен → window.autodealer создан СИНХРОННО (объект с методами)
// 2. autodealer.init(key) → async XHR на /api/widget/repairingSked
//    → onload: autodealer.settings = response, addWidget() добавляет DOM
// 3. Только после addWidget() виджет готов к open()
//
// Признак готовности: autodealer.settings?.id существует (число)
// autodealer.open() сам проверяет settings.id → без него ничего не делает
//
// Страницы соглашений:
//   Согласие ПДн:  https://hptuning.ru/consent
//   Политика ПДн:  https://hptuning.ru/privacy

import { YM_ID } from '@/components/analytics/YandexMetrika';

declare global {
  interface Window {
    autodealer?: {
      init: (k: string) => void;
      open: (cfg?: Record<string, unknown>) => void;
      settings?: { id?: number | string } | null;
    };
    __autodealerInitialized?: boolean;
  }
}

// ── Регистрация целей Метрики для событий виджета ────────────────────────────
export function registerAutodealerGoals() {
  if (typeof document === 'undefined') return;

  document.addEventListener('autodealerEvents', (e: Event) => {
    const customEvent = e as CustomEvent<{ type: string }>;
    const eventType = customEvent?.detail?.type;

    const goalMap: Record<string, string> = {
      OPEN:           'autodealer_open',
      SUBMIT:         'autodealer_submit',
      SUBMIT_SUCCESS: 'booking_success',
      CLOSE:          'autodealer_close',
    };

    const goal = goalMap[eventType];
    if (goal && typeof window.ym === 'function') {
      window.ym(YM_ID, 'reachGoal', goal, { eventType });
    }
  });
}

// ── Открытие виджета ─────────────────────────────────────────────────────────
// Ждём пока autodealer.settings.id появится (значит XHR завершился + addWidget сработал)
// Таймаут 8 сек, затем fallback на звонок
export function openBooking(serviceHint?: string) {
  if (typeof window === 'undefined') return;

  // Цель Метрики: клик по «Записаться»
  if (typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', 'booking_open',
      serviceHint ? { service: serviceHint } : undefined);
  }

  const cfg = serviceHint ? { service: serviceHint } : undefined;

  // Виджет полностью готов — открываем сразу
  if (window.autodealer?.settings?.id && typeof window.autodealer?.open === 'function') {
    window.autodealer.open(cfg);
    return;
  }

  // Виджет ещё инициализируется (XHR в процессе) — polling
  let attempts = 0;
  const MAX = 80;        // 80 × 100мс = 8 секунд
  const TICK = 100;

  const timer = setInterval(() => {
    attempts++;

    // Проверяем что settings.id появился (XHR завершён, DOM создан)
    if (window.autodealer?.settings?.id && typeof window.autodealer?.open === 'function') {
      clearInterval(timer);
      window.autodealer.open(cfg);
      return;
    }

    if (attempts >= MAX) {
      clearInterval(timer);
      // Если init вообще не был вызван (скрипт не загрузился) — fallback
      console.warn('[AutoDealer] Виджет не готов за 8с — fallback на звонок');
      window.location.href = 'tel:+79818428151';
    }
  }, TICK);
}
