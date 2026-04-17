'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

/* ─── Структура навигации (flat, без мегаменю-перегруза) ────────── */
const NAV = [
  {
    label: 'Чип-тюнинг',
    href: '/services/chip-tuning',
    sub: [
      { label: 'Stage 1 · +15–20%', href: '/services/chip-tuning/stage-1', badge: 'от 25 000 ₽' },
      { label: 'Stage 2 · +30%', href: '/services/chip-tuning/stage-2', badge: 'от 45 000 ₽' },
      { label: 'Stage 3 · максимум', href: '/services/chip-tuning/stage-3', badge: 'от 100 000 ₽' },
      { label: 'Удаление сажевого / EGR', href: '/services/chip-tuning/dpf-egr-off', badge: 'от 15 000 ₽' },
      { label: 'Отключение Immo / Start-Stop', href: '/services/chip-tuning/immo-off', badge: '' },
      { label: '─── Калькулятор стоимости', href: '/calculator', badge: '30+ марок' },
    ],
  },
  {
    label: 'Детейлинг',
    href: '/services/detailing',
    sub: [
      { label: 'Полировка кузова', href: '/services/detailing/polishing', badge: 'от 12 000 ₽' },
      { label: 'Керамическое покрытие', href: '/services/detailing/ceramic', badge: 'от 25 000 ₽' },
      { label: 'PPF антигравийная плёнка', href: '/services/detailing/ppf', badge: 'от 25 000 ₽' },
      { label: 'Химчистка салона', href: '/services/detailing/dry-cleaning', badge: 'от 6 000 ₽' },
      { label: 'Тонировка стёкол', href: '/services/detailing/tinting', badge: 'от 5 000 ₽' },
      { label: '─── Калькулятор детейлинга', href: '/services/detailing#calculator', badge: '' },
    ],
  },
  {
    label: 'Бренды',
    href: '/brands',
    sub: [
      { label: 'BMW', href: '/brands/bmw', badge: '' },
      { label: 'Mercedes-Benz', href: '/brands/mercedes', badge: '' },
      { label: 'Audi', href: '/brands/audi', badge: '' },
      { label: 'Porsche', href: '/brands/porsche', badge: '' },
      { label: 'Land Rover', href: '/brands/land-rover', badge: '' },
      { label: 'Все 30+ брендов →', href: '/brands', badge: '' },
    ],
  },
  { label: 'Работы', href: '/works' },
  { label: 'Цены', href: '/calculator' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contacts' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#mobile-menu') && !target.closest('#burger-btn')) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [mobileOpen]);

  const handleMouseEnter = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDrop(href);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDrop(null), 120);
  };

  return (
    <>
      {/* ── Шапка ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#09090b]/97 backdrop-blur-xl border-b border-white/8 shadow-2xl'
            : 'bg-gradient-to-b from-black/70 to-transparent'
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-[70px]">

          {/* Логотип */}
          <Link
            href="/"
            className="flex items-center gap-1 group flex-shrink-0"
            aria-label="HP Тюнинг — главная"
          >
            <span
              className="font-display text-3xl tracking-widest text-[#39FF14]"
              style={{ textShadow: '0 0 18px rgba(57,255,20,0.55)' }}
            >
              HP
            </span>
            <span className="font-display text-3xl tracking-widest text-white">ТЮНИНГ</span>
          </Link>

          {/* ── Десктоп навигация ── */}
          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Основная навигация">
            {NAV.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.sub && handleMouseEnter(item.href)}
                onMouseLeave={() => item.sub && handleMouseLeave()}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                    openDrop === item.href
                      ? 'text-[#39FF14] bg-[#39FF14]/8'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.sub && (
                    <ChevronDown
                      className={`size-3 transition-transform duration-200 ${
                        openDrop === item.href ? 'rotate-180 text-[#39FF14]' : 'text-zinc-500'
                      }`}
                    />
                  )}
                </Link>

                {/* Дропдаун */}
                {item.sub && openDrop === item.href && (
                  <div
                    className="absolute top-full left-0 mt-1.5 bg-[#111113] border border-white/10 rounded-xl shadow-2xl py-1.5 min-w-[260px]"
                    onMouseEnter={() => handleMouseEnter(item.href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.sub.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors ${
                          s.label.startsWith('───')
                            ? 'text-[#39FF14]/70 hover:text-[#39FF14] hover:bg-[#39FF14]/5 border-t border-white/5 mt-1 pt-3'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setOpenDrop(null)}
                      >
                        <span>{s.label.replace('─── ', '')}</span>
                        {s.badge && (
                          <span className="text-[11px] text-zinc-500 ml-3 shrink-0">
                            {s.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Правый блок (десктоп) ── */}
          <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            <a
              href="tel:+79818428151"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-400 hover:text-[#39FF14] transition-colors"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-4" />
              +7 (981) 842-81-51
            </a>
            <button
              onClick={() => openBooking()}
              className="btn-primary text-[13px] px-5 py-2.5 rounded-full font-bold"
            >
              Записаться
            </button>
          </div>

          {/* ── Бургер (мобильный) ── */}
          <div className="xl:hidden flex items-center gap-3">
            <a
              href="tel:+79818428151"
              className="flex items-center gap-1.5 text-[#39FF14] text-[13px] font-bold"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-4" />
              <span className="hidden sm:inline">+7 (981) 842-81-51</span>
            </a>
            <button
              id="burger-btn"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Открыть меню"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* ── Мобильное меню ── */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="xl:hidden bg-[#09090b] border-t border-white/8 max-h-[85vh] overflow-y-auto"
          >
            <div className="container py-3 space-y-0.5">
              {NAV.map((item) => (
                <div key={item.href}>
                  {item.sub ? (
                    <>
                      <button
                        className="w-full flex items-center justify-between py-3 px-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                        onClick={() =>
                          setExpandedMobile(expandedMobile === item.href ? null : item.href)
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={`size-4 transition-transform ${
                            expandedMobile === item.href ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedMobile === item.href && (
                        <div className="ml-4 my-1 border-l-2 border-[#39FF14]/30 pl-3 space-y-0.5">
                          {item.sub.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              className={`flex items-center justify-between py-2 px-2 rounded-lg text-[13px] transition-colors ${
                                s.label.startsWith('───')
                                  ? 'text-[#39FF14]/80 hover:text-[#39FF14]'
                                  : 'text-zinc-500 hover:text-white'
                              }`}
                              onClick={() => setMobileOpen(false)}
                            >
                              <span>{s.label.replace('─── ', '')}</span>
                              {s.badge && (
                                <span className="text-[11px] text-zinc-600">{s.badge}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 px-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* CTA */}
              <div className="pt-4 pb-2 space-y-3">
                <button
                  onClick={() => {
                    openBooking();
                    setMobileOpen(false);
                  }}
                  className="btn-primary w-full justify-center py-3.5 text-sm font-bold rounded-xl"
                >
                  Записаться онлайн
                </button>
                <a
                  href="tel:+79818428151"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-[#39FF14] hover:border-[#39FF14]/40 transition-colors text-sm"
                  onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
                >
                  <Phone className="size-4" />
                  +7 (981) 842-81-51
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Мобильная нижняя панель ── */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/97 backdrop-blur-xl border-t border-white/8">
        <div className="grid grid-cols-3 divide-x divide-white/8">
          <a
            href="tel:+79818428151"
            className="flex flex-col items-center gap-1 py-3 text-zinc-500 hover:text-[#39FF14] transition-colors"
            onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
          >
            <Phone className="size-5" />
            <span className="text-[10px] font-medium">Позвонить</span>
          </a>
          <button
            onClick={() => openBooking()}
            className="flex flex-col items-center gap-1 py-3 bg-[#39FF14] text-black font-bold hover:bg-[#2de010] transition-colors"
          >
            <span className="text-[18px] leading-none">✓</span>
            <span className="text-[10px] font-bold">Записаться</span>
          </button>
          <a
            href="https://t.me/hptuningspb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-3 text-zinc-500 hover:text-sky-400 transition-colors"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.13.58-.47.72-.95.45l-2.6-1.92-1.26 1.22c-.14.14-.26.26-.52.26l.18-2.64 4.74-4.28c.2-.18-.05-.28-.32-.1L8.9 14.44l-2.54-.79c-.55-.17-.56-.55.12-.82l9.9-3.82c.46-.17.86.11.72.79z" />
            </svg>
            <span className="text-[10px] font-medium">Telegram</span>
          </a>
        </div>
      </div>
    </>
  );
}
