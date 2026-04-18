// AutoDealer — виджет онлайн-записи
// Ключ: 107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd
// Официальный код инициализации взят из панели AutoDealer (апрель 2026)

const AUTODEALER_KEY = '107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd';

declare global {
  interface Window {
    autodealer?: {
      init: (k: string) => void;
      open: (cfg?: Record<string, unknown>) => void;
    };
    autodealerasync: Array<unknown>;
    YM_COUNTER_ID?: number;
    ym?: (...args: unknown[]) => void;
  }
}

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

  // Яндекс.Метрика — цели для виджета
  document.addEventListener('autodealerEvents', (e: Event) => {
    const customEvent = e as CustomEvent<{ type: string }>;
    if (!window.YM_COUNTER_ID || typeof window.ym !== 'function') return;
    const goalMap: Record<string, string> = {
      OPEN: 'autodealer_open',
      SUBMIT: 'autodealer_submit',
      SUBMIT_SUCCESS: 'booking_success',
      CLOSE: 'autodealer_close',
    };
    const goal = goalMap[customEvent?.detail?.type];
    if (goal) window.ym(window.YM_COUNTER_ID, 'reachGoal', goal);
  });
}

export function openBooking(serviceHint?: string) {
  if (typeof window === 'undefined') return;
  try {
    if (window.autodealer?.open) {
      window.autodealer.open(serviceHint ? { service: serviceHint } : undefined);
    } else {
      window.autodealerasync = window.autodealerasync || [];
      window.autodealerasync.push('open', serviceHint ? [{ service: serviceHint }] : []);
    }
    // Метрика — клик по кнопке записаться
    if (window.YM_COUNTER_ID && typeof window.ym === 'function') {
      window.ym(window.YM_COUNTER_ID, 'reachGoal', 'booking_open',
        serviceHint ? { service: serviceHint } : undefined);
    }
  } catch (err) {
    console.error('[AutoDealer] openBooking error:', err);
    window.location.href = 'tel:+79818428151';
  }
}
