'use client';

// ── AutoDealer Widget Loader ─────────────────────────────────────────────────
// Подключается один раз в layout.tsx
// strategy="afterInteractive" — не блокирует рендер первого экрана
//
// КАК РАБОТАЕТ ВИДЖЕТ:
// 1. app.js грузится → window.autodealer объект создаётся СИНХРОННО
// 2. autodealer.init(key) делает async XHR → получает настройки → addWidget()
// 3. Только после addWidget() DOM-форма виджета готова
// 4. autodealer.open() работает ТОЛЬКО после addWidget()
//
// ПОЭТОМУ: открытие по клику работает через polling в openBooking() в autodealer.ts
// Здесь только грузим скрипт и вызываем init.

import Script from 'next/script';
import { registerAutodealerGoals } from '@/lib/autodealer';

const AUTODEALER_KEY = '107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd';
const AUTODEALER_SRC = 'https://online.autodealer.ru/widget/app.js';

export function AutoDealerWidget() {
  return (
    <Script
      id="autodealer-widget"
      src={AUTODEALER_SRC}
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window === 'undefined') return;
        if (window.__autodealerInitialized) return;

        // window.autodealer гарантированно существует сразу после загрузки скрипта
        if (typeof window.autodealer?.init !== 'function') {
          console.error('[AutoDealer] window.autodealer.init не найден после загрузки');
          return;
        }

        window.__autodealerInitialized = true;

        try {
          // init запускает async XHR → addWidget() → DOM виджета готов
          window.autodealer.init(AUTODEALER_KEY);
          registerAutodealerGoals();
          console.info('[AutoDealer] ✓ init вызван, виджет загружается...');
        } catch (e) {
          console.error('[AutoDealer] init error:', e);
          window.__autodealerInitialized = false;
        }
      }}
      onError={() => {
        console.error('[AutoDealer] Не удалось загрузить скрипт:', AUTODEALER_SRC);
      }}
    />
  );
}
