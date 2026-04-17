'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

const NAV = [
  {
    label: 'Услуги', href: '/services',
    sub: [
      { label: 'Чип-тюнинг', href: '/services/chip-tuning' },
      { label: 'Детейлинг', href: '/services/detailing' },
      { label: 'Автосервис', href: '/services/service' },
    ],
  },
  {
    label: 'Бренды', href: '/brands',
    sub: [
      { label: 'BMW', href: '/brands/bmw' },
      { label: 'Mercedes-Benz', href: '/brands/mercedes' },
      { label: 'Audi', href: '/brands/audi' },
      { label: 'Porsche', href: '/brands/porsche' },
      { label: 'Lexus', href: '/brands/lexus' },
      { label: 'Land Rover', href: '/brands/land-rover' },
      { label: 'Все бренды →', href: '/brands' },
    ],
  },
  { label: 'Работы', href: '/works' },
  { label: 'Блог', href: '/blog' },
  { label: 'Районы', href: '/locations' },
  { label: 'Отзывы', href: '/reviews' },
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-widest text-accent group-hover:glow-accent transition-all">HP</span>
          <span className="font-display text-2xl tracking-widest text-text">ТЮНИНГ</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map((item) => (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors py-2"
                onMouseEnter={() => item.sub && setOpenDrop(item.href)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                {item.label}
                {item.sub && <ChevronDown className="size-3" />}
              </Link>
              {item.sub && openDrop === item.href && (
                <div
                  className="absolute top-full left-0 mt-1 bg-bg-elevated border border-border rounded-xl p-2 min-w-[200px] shadow-xl"
                  onMouseEnter={() => setOpenDrop(item.href)}
                  onMouseLeave={() => setOpenDrop(null)}
                >
                  {item.sub.map((s) => (
                    <Link key={s.href} href={s.href}
                      className="block px-3 py-2 text-sm text-text-muted hover:text-accent hover:bg-accent-glow rounded-lg transition-colors">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+79818428151"
            className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
            onClick={() => window.ym?.(window.YM_COUNTER_ID!, 'reachGoal', 'phone_click')}>
            <Phone className="size-4" />
            +7 (981) 842-81-51
          </a>
          <button onClick={() => openBooking()} className="btn-primary text-xs px-4 py-2">
            Записаться
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="lg:hidden text-text-muted hover:text-text p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-bg-elevated border-t border-border">
          <div className="container py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}
                className="py-3 text-text-muted hover:text-accent transition-colors border-b border-border last:border-0"
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4">
              <a href="tel:+79818428151" className="flex items-center gap-2 text-accent text-sm">
                <Phone className="size-4" /> +7 (981) 842-81-51
              </a>
            </div>
            <button onClick={() => { openBooking(); setMobileOpen(false); }} className="btn-primary mt-3 justify-center">
              Записаться
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
