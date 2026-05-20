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
    /* На мобайле отступ снизу учитывает sticky CTA (~68px) + gap 8px = 76px */
    <div
      role="dialog"
      aria-label="Согласие на использование cookie"
      className="
        fixed z-40
        bottom-[76px] left-3 right-3
        md:bottom-6 md:left-auto md:right-6 md:max-w-sm
        bg-[#111113] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/60
      "
    >
      <p className="text-zinc-200 text-sm font-semibold mb-1.5 leading-snug">
        Cookie и аналитика
      </p>
      <p className="text-zinc-400 text-xs mb-3 leading-snug">
        Мы используем файлы cookie и Яндекс.Метрику, чтобы сайт работал корректно
        и мы могли улучшать сервис. Подробнее — в{' '}
        <Link href="/cookies" className="text-[#39FF14] hover:underline">
          политике cookie
        </Link>
        .
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={acceptAll}
          className="btn-primary text-xs px-4 py-2 justify-center rounded-xl w-full"
          aria-label="Принять все cookie, включая аналитические"
        >
          Принять все
        </button>
        <div className="flex gap-2">
          <button
            onClick={acceptNecessary}
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
            aria-label="Принять только необходимые cookie"
          >
            Только необходимые
          </button>
          <Link
            href="/cookies"
            className="flex-1 flex items-center justify-center text-xs px-3 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}
