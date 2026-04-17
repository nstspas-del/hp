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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50
                    bg-bg-card border border-border rounded-2xl p-4 shadow-2xl">
      <p className="text-text-muted text-sm mb-3">
        Мы используем файлы cookie для улучшения работы сайта.{' '}
        <Link href="/cookies" className="text-accent hover:underline">Подробнее</Link>
      </p>
      <div className="flex gap-2">
        <button onClick={accept} className="btn-primary text-xs px-4 py-2 flex-1 justify-center">
          Принять
        </button>
        <Link href="/cookies"
          className="btn-secondary text-xs px-4 py-2 flex-1 justify-center">
          Настройки
        </Link>
      </div>
    </div>
  );
}
