'use client';
/**
 * CookieBanner — баннер согласия на cookies + аналитику.
 *
 * Что делает:
 *   1) Показывает баннер, если согласие не получено
 *   2) Три исхода: «Принять всё» / «Только необходимые» / «Настройки → /cookies»
 *   3) Записывает решение в localStorage['hp_cookie_consent']
 *   4) Если выбрано «Принять всё» — инициализирует Яндекс.Метрику
 *      (по умолчанию Метрика НЕ грузится до согласия — это требование 152-ФЗ
 *      и хорошая практика по cookie-законодательству РФ).
 *
 * Технически: загрузка скрипта Метрики делается отложенно через window.__hpYmInit(),
 * который определён в YandexMetrika.tsx и активируется только после согласия.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ConsentState = null | 'all' | 'necessary';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Мигрируем старый ключ cookie_accepted=1 → новый формат
    const oldAccepted = localStorage.getItem('cookie_accepted');
    const current = localStorage.getItem('hp_cookie_consent') as ConsentState;

    if (oldAccepted === '1' && !current) {
      localStorage.setItem('hp_cookie_consent', 'all');
      tryInitMetrika();
      return;
    }

    if (!current) {
      setVisible(true);
    } else if (current === 'all') {
      tryInitMetrika();
    }
  }, []);

  function tryInitMetrika() {
    if (typeof window === 'undefined') return;
    // Хук, который определит YandexMetrika.tsx после согласия
    const init = (window as unknown as { __hpYmInit?: () => void }).__hpYmInit;
    if (typeof init === 'function') init();
  }

  function acceptAll() {
    localStorage.setItem('hp_cookie_consent', 'all');
    tryInitMetrika();
    setVisible(false);
  }

  function acceptNecessary() {
    localStorage.setItem('hp_cookie_consent', 'necessary');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    /* На мобайле — компактная плашка снизу.
       bottom-20 = отступ снизу 80px, чтобы не перекрывать FloatingTelegram (bottom-5 + size-14 ≈ 76px). */
    <div
      role="dialog"
      aria-label="Согласие на использование cookie"
      className="
        fixed z-40
        bottom-20 left-2 right-20
        md:bottom-6 md:left-auto md:right-6 md:max-w-sm
        bg-[#111113]/95 backdrop-blur-md border border-white/10 rounded-2xl
        px-3 py-2.5 md:p-4
        shadow-2xl shadow-black/60
      "
    >
      <p className="text-zinc-300 text-[11px] md:text-xs mb-2 md:mb-3 leading-snug">
        🍪 Используем cookie и Яндекс.Метрику.{' '}
        <Link href="/cookies" className="text-[#39FF14] hover:underline">
          Подробнее
        </Link>
      </p>
      <div className="flex gap-1.5 md:flex-col md:gap-2">
        <button
          onClick={acceptAll}
          className="btn-primary flex-1 text-[11px] md:text-xs px-3 py-1.5 md:py-2 justify-center rounded-lg md:rounded-xl whitespace-nowrap"
          aria-label="Принять все cookie, включая аналитические"
        >
          Принять
        </button>
        <button
          onClick={acceptNecessary}
          className="flex-1 text-[11px] md:text-xs px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-colors whitespace-nowrap"
          aria-label="Принять только необходимые cookie"
        >
          Только нужные
        </button>
      </div>
    </div>
  );
}
