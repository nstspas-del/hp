'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Phone, Menu, X, ChevronDown, Calculator, Wrench, Sparkles, Star } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

const NAV = [
  {
    label: 'Услуги',
    href: '/services',
    sub: [
      { label: 'Чип-тюнинг', href: '/services/chip-tuning', icon: '⚡', desc: 'Stage 1 / 2 / 3' },
      { label: 'Детейлинг', href: '/services/detailing', icon: '✨', desc: 'Керамика, PPF, химчистка' },
      { label: 'Автосервис', href: '/services/service', icon: '🔧', desc: 'ТО, диагностика, ремонт' },
    ],
  },
  {
    label: 'Бренды',
    href: '/brands',
    sub: [
      { label: 'BMW', href: '/brands/bmw', icon: '🔵' },
      { label: 'Mercedes-Benz', href: '/brands/mercedes', icon: '⭐' },
      { label: 'Audi', href: '/brands/audi', icon: '⚙️' },
      { label: 'Porsche', href: '/brands/porsche', icon: '🏎️' },
      { label: 'Lexus', href: '/brands/lexus', icon: '🟠' },
      { label: 'Land Rover', href: '/brands/land-rover', icon: '🟢' },
      { label: 'Все 13 брендов →', href: '/brands', icon: '📋' },
    ],
  },
  { label: 'Цены', href: '/calculator', badge: 'Онлайн' },
  { label: 'Работы', href: '/works' },
  { label: 'Видео', href: '/video' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contacts' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Блокировка скролла при открытом мобильном меню
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/96 backdrop-blur-md border-b border-border shadow-xl' : 'bg-bg/60 backdrop-blur-sm'
      }`}>
        <div className="container flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={() => setMobileOpen(false)}>
            <span className="font-display text-2xl tracking-widest text-accent group-hover:glow-accent transition-all">HP</span>
            <span className="font-display text-2xl tracking-widest text-text">ТЮНИНГ</span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation">
            {NAV.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.sub && setOpenDrop(item.href)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors px-3 py-2 rounded-lg hover:bg-bg-elevated"
                >
                  {item.label}
                  {'badge' in item && item.badge && (
                    <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                  {item.sub && <ChevronDown className="size-3 opacity-60" />}
                </Link>

                {/* Дропдаун */}
                {item.sub && openDrop === item.href && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-bg border border-border rounded-2xl p-3 min-w-[220px] shadow-2xl shadow-black/40 z-50"
                    onMouseEnter={() => setOpenDrop(item.href)}
                    onMouseLeave={() => setOpenDrop(null)}
                  >
                    {item.sub.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-elevated transition-colors group"
                      >
                        <span className="text-base mt-0.5 shrink-0">{s.icon}</span>
                        <div>
                          <div className="text-sm text-text font-medium group-hover:text-accent transition-colors">
                            {s.label}
                          </div>
                          {'desc' in s && s.desc && (
                            <div className="text-xs text-text-subtle mt-0.5">{s.desc}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Правые действия — десктоп */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="tel:+79818428151"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              onClick={() => typeof window !== 'undefined' && window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-4" />
              <span className="hidden xl:inline">+7 (981) 842-81-51</span>
            </a>
            <button
              onClick={() => openBooking()}
              className="btn-primary text-sm px-4 py-2 rounded-xl"
            >
              Записаться
            </button>
          </div>

          {/* Мобильный бургер */}
          <div className="lg:hidden flex items-center gap-3">
            <a
              href="tel:+79818428151"
              className="flex items-center justify-center size-10 rounded-xl bg-accent/10 text-accent"
              aria-label="Позвонить"
            >
              <Phone className="size-5" />
            </a>
            <button
              className="flex items-center justify-center size-10 rounded-xl bg-bg-elevated text-text-muted hover:text-text transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню — полноэкранный overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-bg flex flex-col">
          {/* Шапка меню */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <span className="font-display text-2xl tracking-widest text-accent">HP</span>
              <span className="font-display text-2xl tracking-widest text-text">ТЮНИНГ</span>
            </Link>
            <button
              className="flex items-center justify-center size-10 rounded-xl bg-bg-elevated text-text-muted"
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Навигация */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {/* Быстрые кнопки */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => { openBooking(); setMobileOpen(false); }}
                className="btn-primary py-3 text-sm justify-center rounded-xl"
              >
                Записаться онлайн
              </button>
              <a
                href="tel:+79818428151"
                className="flex items-center justify-center gap-2 py-3 text-sm bg-bg-elevated text-accent rounded-xl font-medium"
                onClick={() => setMobileOpen(false)}
              >
                <Phone className="size-4" />
                Позвонить
              </a>
            </div>

            {/* Группа: Услуги */}
            <div className="mb-2">
              <div className="text-xs text-text-subtle uppercase tracking-wider px-3 py-1 mb-1">Услуги</div>
              <Link href="/services/chip-tuning" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg-elevated transition-colors" onClick={() => setMobileOpen(false)}>
                <span className="text-xl">⚡</span>
                <div>
                  <div className="text-text font-medium text-sm">Чип-тюнинг</div>
                  <div className="text-text-subtle text-xs">Stage 1 / 2 / 3 от 18 300 ₽</div>
                </div>
              </Link>
              <Link href="/services/detailing" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg-elevated transition-colors" onClick={() => setMobileOpen(false)}>
                <span className="text-xl">✨</span>
                <div>
                  <div className="text-text font-medium text-sm">Детейлинг</div>
                  <div className="text-text-subtle text-xs">Керамика, PPF, химчистка</div>
                </div>
              </Link>
              <Link href="/services/service" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg-elevated transition-colors" onClick={() => setMobileOpen(false)}>
                <span className="text-xl">🔧</span>
                <div>
                  <div className="text-text font-medium text-sm">Автосервис</div>
                  <div className="text-text-subtle text-xs">ТО, диагностика, ремонт</div>
                </div>
              </Link>
            </div>

            <div className="border-t border-border/50 pt-2">
              <div className="text-xs text-text-subtle uppercase tracking-wider px-3 py-1 mb-1">Навигация</div>
              {[
                { href: '/brands', label: 'Бренды', icon: '🚗' },
                { href: '/calculator', label: 'Цены онлайн', icon: '💰', badge: 'Онлайн' },
                { href: '/works', label: 'Наши работы', icon: '📸' },
                { href: '/video', label: 'Видео', icon: '▶️' },
                { href: '/blog', label: 'Блог', icon: '📝' },
                { href: '/contacts', label: 'Контакты', icon: '📍' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg-elevated transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <span className="text-text font-medium text-sm">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="ml-auto text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Подвал меню */}
          <div className="shrink-0 p-4 border-t border-border">
            <p className="text-center text-text-subtle text-xs">
              +7 (981) 842-81-51 · Богородская, 3Б · 10:00–20:00
            </p>
          </div>
        </div>
      )}

      {/* Мобильный sticky CTA снизу экрана */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg/95 backdrop-blur-md border-t border-border p-3">
        <div className="flex gap-2">
          <button
            onClick={() => openBooking()}
            className="btn-primary flex-1 py-3 text-sm justify-center rounded-xl"
          >
            Записаться
          </button>
          <a
            href="tel:+79818428151"
            className="flex items-center justify-center size-12 rounded-xl bg-bg-elevated text-accent shrink-0"
          >
            <Phone className="size-5" />
          </a>
        </div>
      </div>
    </>
  );
}
