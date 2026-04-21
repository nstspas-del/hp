'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie_accepted');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_accepted', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    /* На мобайле отступ снизу учитывает sticky CTA (~68px) + gap 8px = 76px */
    <div className="
      fixed z-40
      bottom-[76px] left-3 right-3
      md:bottom-6 md:left-auto md:right-6 md:max-w-sm
      bg-[#111113] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/60
    ">
      <p className="text-zinc-400 text-sm mb-3 leading-snug">
        Мы используем файлы cookie для улучшения работы сайта.{' '}
        <Link href="/cookies" className="text-[#39FF14] hover:underline">Подробнее</Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={accept}
          className="btn-primary text-xs px-4 py-2 flex-1 justify-center rounded-xl"
        >
          Принять
        </button>
        <Link
          href="/cookies"
          className="flex items-center justify-center text-xs px-4 py-2 flex-1 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
        >
          Настройки
        </Link>
      </div>
    </div>
  );
}
