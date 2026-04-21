'use client';

// ── AutoDealer Widget Loader ─────────────────────────────────────────────────
// Подключается один раз в layout.tsx
// strategy="afterInteractive" — не блокирует рендер первого экрана
// Инициализирует window.autodealer ровно 1 раз (guard __autodealerInitialized)

import Script from 'next/script';
import { registerAutodealerGoals } from '@/lib/autodealer';

const AUTODEALER_KEY = '107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd';
const AUTODEALER_SRC = 'https://online.autodealer.ru/widget/app.js';

// Внутренняя функция инициализации с polling-защитой:
// некоторые виджеты устанавливают window.autodealer не синхронно
// в момент загрузки скрипта, а немного позже (через setTimeout/microtask)
function initWithRetry(attempts = 0) {
  if (typeof window === 'undefined') return;

  // Защита от повторной инициализации при SPA-навигации
  if (window.__autodealerInitialized) return;

  if (typeof window.autodealer?.init === 'function') {
    window.__autodealerInitialized = true;
    try {
      window.autodealer.init(AUTODEALER_KEY);
      registerAutodealerGoals();
      console.info('[AutoDealer] ✓ Инициализирован успешно');
    } catch (e) {
      console.error('[AutoDealer] init error:', e);
    }
    return;
  }

  // window.autodealer ещё не появился — пробуем ещё раз (до 20 попыток × 250мс = 5с)
  if (attempts < 20) {
    setTimeout(() => initWithRetry(attempts + 1), 250);
  } else {
    console.warn('[AutoDealer] window.autodealer не появился за 5с после загрузки скрипта');
  }
}

export function AutoDealerWidget() {
  return (
    <Script
      id="autodealer-widget"
      src={AUTODEALER_SRC}
      strategy="afterInteractive"
      onLoad={() => {
        initWithRetry(0);
      }}
      onError={() => {
        console.error('[AutoDealer] Не удалось загрузить:', AUTODEALER_SRC);
      }}
    />
  );
}
