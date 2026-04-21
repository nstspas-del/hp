// ── AutoDealer — виджет онлайн-записи HP Тюнинг ─────────────────────────────
// Ключ: 107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd
//
// АРХИТЕКТУРА:
// - Скрипт виджета грузится через <AutoDealerWidget> (next/script, afterInteractive)
//   в app/layout.tsx — один раз для всего приложения
// - autodealer.init() вызывается в onLoad callback Script-компонента
// - Этот файл содержит openBooking() и регистрацию целей Яндекс.Метрики
//
// Страницы соглашений для виджета:
//   Согласие ПДн:  https://hptuning.ru/consent
//   Политика ПДн:  https://hptuning.ru/privacy

import { YM_ID } from '@/components/analytics/YandexMetrika';

declare global {
  interface Window {
    autodealer?: {
      init: (k: string) => void;
      open: (cfg?: Record<string, unknown>) => void;
    };
    // Официальная очередь автодилера: каждая команда — отдельный элемент-массив
    // Формат: [['methodName', arg1, arg2, ...], ...]
    autodealerasync?: Array<Array<unknown>>;
    __autodealerInitialized?: boolean;
    // ym и YM_COUNTER_ID объявлены в YandexMetrika.tsx
  }
}

// ── Регистрация целей Метрики для событий виджета ────────────────────────────
// Вызывается один раз после init виджета (из AutoDealerWidget.tsx onLoad)
export function registerAutodealerGoals() {
  if (typeof document === 'undefined') return;

  document.addEventListener('autodealerEvents', (e: Event) => {
    const customEvent = e as CustomEvent<{ type: string }>;
    const eventType = customEvent?.detail?.type;

    const goalMap: Record<string, string> = {
      OPEN:           'autodealer_open',    // виджет открылся
      SUBMIT:         'autodealer_submit',  // нажата кнопка отправки
      SUBMIT_SUCCESS: 'booking_success',    // заявка успешно отправлена ← главная цель
      CLOSE:          'autodealer_close',   // закрыт без записи
    };

    const goal = goalMap[eventType];
    if (goal && typeof window.ym === 'function') {
      window.ym(YM_ID, 'reachGoal', goal, { eventType });
    }
  });
}

// ── Внутренний хелпер: попытка открыть виджет ────────────────────────────────
function tryOpen(serviceHint?: string) {
  const cfg = serviceHint ? { service: serviceHint } : undefined;

  if (typeof window.autodealer?.open === 'function') {
    window.autodealer.open(cfg);
    return true;
  }
  return false;
}

// ── Открытие виджета ─────────────────────────────────────────────────────────
// Безопасно вызывать в любой момент:
// - если виджет уже загружен → открывает немедленно
// - если ещё грузится → polling 100мс × 50 попыток (5 сек)
// - если не загрузился за 5 сек → fallback на звонок
export function openBooking(serviceHint?: string) {
  if (typeof window === 'undefined') return;

  // Цель: клик по кнопке "Записаться"
  if (typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', 'booking_open',
      serviceHint ? { service: serviceHint } : undefined);
  }

  // Попытка 1: виджет уже готов
  if (tryOpen(serviceHint)) return;

  // Попытка 2: polling — виджет может появиться через несколько сотен мс
  // (скрипт загружается асинхронно, init выполняется в onLoad)
  let attempts = 0;
  const MAX_ATTEMPTS = 50; // 50 × 100мс = 5 сек
  const INTERVAL_MS = 100;

  const timer = setInterval(() => {
    attempts++;

    if (tryOpen(serviceHint)) {
      clearInterval(timer);
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      clearInterval(timer);
      console.warn('[AutoDealer] Виджет не загрузился за 5с — переходим на звонок');
      window.location.href = 'tel:+79818428151';
    }
  }, INTERVAL_MS);
}
