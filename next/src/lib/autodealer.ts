const AUTODEALER_KEY = '107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd';

declare global {
  interface Window {
    autodealer?: { init: (k: string) => void; open: (cfg?: Record<string, unknown>) => void };
    autodealerasync?: unknown[];
    YM_COUNTER_ID?: number;
    ym?: (...args: unknown[]) => void;
  }
}

export function initAutoDealer() {
  if (typeof window === 'undefined' || window.autodealer) return;
  const build = (name: string) => (...args: unknown[]) => {
    window.autodealerasync = window.autodealerasync || [];
    window.autodealerasync.push(name, args);
  };
  const s = document.createElement('script');
  s.charset = 'utf-8'; s.async = true;
  s.src = 'https://online.autodealer.ru/widget/app.js';
  document.head.appendChild(s);
  window.autodealer = { init: build('init'), open: build('open') } as Window['autodealer'];
  window.autodealerasync = [];
  window.autodealer!.init(AUTODEALER_KEY);

  document.addEventListener('autodealerEvents', (e: Event) => {
    const customEvent = e as CustomEvent<{ type: string }>;
    if (!window.YM_COUNTER_ID || typeof window.ym !== 'function') return;
    const map: Record<string, string> = {
      OPEN: 'autodealer_open',
      SUBMIT: 'autodealer_submit',
      SUBMIT_SUCCESS: 'booking_success',
      CLOSE: 'autodealer_close',
    };
    const goal = map[customEvent?.detail?.type];
    if (goal) window.ym(window.YM_COUNTER_ID, 'reachGoal', goal);
  });
}

export function openBooking(serviceHint?: string) {
  if (typeof window === 'undefined') return;
  try {
    if (window.autodealer?.open) {
      window.autodealer.open(serviceHint ? { service: serviceHint } : undefined);
    } else {
      (window.autodealerasync = window.autodealerasync || []).push(
        'open', serviceHint ? [{ service: serviceHint }] : []
      );
    }
    if (window.YM_COUNTER_ID && typeof window.ym === 'function') {
      window.ym(window.YM_COUNTER_ID, 'reachGoal', 'booking_open',
        serviceHint ? { service: serviceHint } : undefined);
    }
  } catch (err) {
    console.error('[AutoDealer]', err);
    window.location.href = 'tel:+79818428151';
  }
}
