'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Phone, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { openBooking } from '@/lib/autodealer';

// ── Навигация ─────────────────────────────────────────────────────────────────
const NAV_SERVICE = [
  { label: 'Техническое обслуживание', href: '/service/to',          desc: 'Замена масла, фильтров, свечей' },
  { label: 'Диагностика',              href: '/service/diagnostics', desc: 'Компьютерная и ходовая' },
  { label: 'Двигатель',                href: '/service/engine',      desc: 'Ремонт и обслуживание' },
  { label: 'Тормоза',                  href: '/service/brakes',      desc: 'Колодки, диски, суппорты' },
  { label: 'Подвеска',                 href: '/service/suspension',  desc: 'Амортизаторы, рычаги, ступицы' },
  { label: 'Коробка передач',          href: '/service/gearbox',     desc: 'АКПП, DSG, вариатор' },
  { label: 'Электрика',                href: '/service/electrics',   desc: 'Проводка, датчики, блоки' },
];

const NAV_TUNING = [
  { label: 'Чип-тюнинг',       href: '/tuning/chip-tuning', desc: 'Прошивка ЭБУ, от 24 000 ₽' },
  { label: 'Тормозной тюнинг', href: '/tuning/brakes',      desc: 'Brembo, AP Racing' },
  { label: 'Выхлопная система', href: '/tuning/exhaust',     desc: 'Sport-выхлоп, клапаны' },
  { label: 'Шумоизоляция',     href: '/tuning/sound',       desc: 'Виброизол, шумка' },
  { label: 'Тюнинг салона',    href: '/tuning/interior',    desc: 'Карбон, алькантара' },
];

const NAV_DETAILING = [
  { label: 'Керамика 9H',  href: '/detailing/ceramic',  desc: 'Gyeon, Ceramic Pro, от 25 000 ₽' },
  { label: 'PPF плёнка',   href: '/detailing/ppf',      desc: 'XPEL, SunTek — защита кузова' },
  { label: 'Полировка',    href: '/detailing/polish',   desc: 'Коррекция царапин' },
  { label: 'Химчистка',    href: '/detailing/cleaning', desc: 'Салон, кожа, ковры, потолок' },
  { label: 'Тонировка',    href: '/detailing/tinting',  desc: 'LLUMAR, SunTek, съёмная' },
];

// Мега-меню марок — сгруппированы по сегментам
const BRANDS_MEGA = [
  {
    group: 'Специализация',
    color: 'text-[#39FF14]',
    brands: [
      { label: 'BMW',          href: 'https://bmw.hptuning.ru',        logo: '/images/brands/bmw.svg' },
      { label: 'Mercedes-Benz',href: 'https://mercedes.hptuning.ru',   logo: '/images/brands/mercedes.svg' },
      { label: 'Audi',         href: 'https://audi.hptuning.ru',       logo: '/images/brands/audi.svg' },
      { label: 'Porsche',      href: 'https://porsche.hptuning.ru',    logo: '/images/brands/porsche.svg' },
      { label: 'Volkswagen',   href: 'https://volkswagen.hptuning.ru', logo: '/images/brands/volkswagen.svg' },
      { label: 'Toyota',       href: 'https://toyota.hptuning.ru',     logo: '/images/brands/toyota.svg' },
      { label: 'Lexus',        href: 'https://lexus.hptuning.ru',      logo: '/images/brands/lexus.svg' },
      { label: 'Land Rover',   href: 'https://landrover.hptuning.ru',  logo: '/images/brands/land-rover.svg' },
    ],
  },
  {
    group: 'Китайские',
    color: 'text-zinc-400',
    brands: [
      { label: 'Haval',   href: '/marki', logo: '/images/brands/haval.svg' },
      { label: 'Chery',   href: '/marki', logo: '/images/brands/chery.svg' },
      { label: 'Geely',   href: '/marki', logo: '/images/brands/geely.svg' },
      { label: 'Tank',    href: '/marki', logo: '/images/brands/tank.svg' },
      { label: 'Exeed',   href: '/marki', logo: '/images/brands/exeed.svg' },
      { label: 'Jaecoo',  href: '/marki', logo: '/images/brands/jaecoo.svg' },
    ],
  },
  {
    group: 'Японские / Корейские',
    color: 'text-zinc-400',
    brands: [
      { label: 'Kia',      href: '/marki', logo: '/images/brands/kia.svg' },
      { label: 'Hyundai',  href: '/marki', logo: '/images/brands/hyundai.svg' },
      { label: 'Mazda',    href: '/marki', logo: '/images/brands/mazda.svg' },
      { label: 'Nissan',   href: '/marki', logo: '/images/brands/nissan.svg' },
      { label: 'Subaru',   href: '/marki', logo: '/images/brands/subaru.svg' },
      { label: 'Honda',    href: '/marki', logo: '/images/brands/honda.svg' },
    ],
  },
];

const NAV = [
  { label: 'Автосервис', href: '/service',           type: 'service' as const },
  { label: 'Марки',      href: '/marki',              type: 'brands' as const },
  { label: 'Тюнинг',    href: '/tuning/chip-tuning', type: 'tuning' as const },
  { label: 'Детейлинг', href: '/detailing',           type: 'detailing' as const },
  { label: 'Работы',    href: '/works',               type: 'link' as const },
  { label: 'Контакты',  href: '/contacts',            type: 'link' as const },
];

// ── Обычный дропдаун ──────────────────────────────────────────────────────────
function SimpleDropdown({ items, onClose }: {
  items: { label: string; href: string; desc?: string }[];
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full left-0 mt-2 bg-[#111113] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-50 w-64 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={false}
          onClick={onClose}
          className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/40 mt-2 shrink-0" />
          <div>
            <div className="text-sm text-white font-medium group-hover:text-[#39FF14] transition-colors">{item.label}</div>
            {item.desc && <div className="text-xs text-zinc-600 mt-0.5">{item.desc}</div>}
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Мега-меню марок ────────────────────────────────────────────────────────────
function BrandsMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#111113] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-50 w-[680px] p-5 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="grid grid-cols-3 gap-6">
        {BRANDS_MEGA.map((section) => (
          <div key={section.group}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${section.color}`}>
                {section.group}
              </p>
              <span className="text-[10px] text-zinc-600 font-medium">{section.brands.length}</span>
            </div>
            <div className="space-y-0.5">
              {section.brands.map((brand) => {
                const isExternal = brand.href.startsWith('http');
                const cls = 'flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group';
                const inner = (
                  <>
                    <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={brand.logo} alt={brand.label} width={24} height={24} className="max-h-5 w-auto object-contain" loading="lazy" />
                    </div>
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors font-medium">{brand.label}</span>
                  </>
                );
                return isExternal ? (
                  <a key={brand.label} href={brand.href} className={cls} onClick={onClose} rel="noopener noreferrer">{inner}</a>
                ) : (
                  <Link key={brand.label} href={brand.href} prefetch={false} className={cls} onClick={onClose}>{inner}</Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* Все марки */}
      <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between gap-3">
        <span className="text-zinc-500 text-xs">Работаем с 38+ марками в СПб</span>
        <Link
          href="/marki"
          prefetch={false}
          onClick={onClose}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 text-xs text-[#39FF14] font-bold hover:bg-[#39FF14]/20 transition-colors"
        >
          Смотреть все 38 марок <ChevronRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const open = (key: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpenDrop(key); };
  const close = () => { closeTimer.current = setTimeout(() => setOpenDrop(null), 120); };

  // Мобильное меню — все ссылки для брендов
  const mobileBrands = BRANDS_MEGA.flatMap((g) => g.brands);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#09090b]/96 backdrop-blur-xl shadow-xl shadow-black/40' : 'bg-[#09090b]/70 backdrop-blur-md'
      }`}>
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-300 ${
          scrolled ? 'bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent' : 'opacity-0'
        }`} />

        <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex items-center justify-between h-16">
          <Logo />

          {/* Десктоп-навигация */}
          <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Основное меню">
            {NAV.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.type !== 'link' && open(item.href)}
                onMouseLeave={() => item.type !== 'link' && close()}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-colors ${
                    openDrop === item.href
                      ? 'text-[#39FF14] bg-[#39FF14]/8'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.type !== 'link' && (
                    <ChevronDown className={`size-3 transition-transform duration-200 ${openDrop === item.href ? 'rotate-180 text-[#39FF14]' : 'opacity-50'}`} />
                  )}
                </Link>

                {/* Дропдауны */}
                {openDrop === item.href && item.type === 'service' && (
                  <SimpleDropdown items={NAV_SERVICE} onClose={() => setOpenDrop(null)} />
                )}
                {openDrop === item.href && item.type === 'tuning' && (
                  <SimpleDropdown items={NAV_TUNING} onClose={() => setOpenDrop(null)} />
                )}
                {openDrop === item.href && item.type === 'detailing' && (
                  <SimpleDropdown items={NAV_DETAILING} onClose={() => setOpenDrop(null)} />
                )}
                {openDrop === item.href && item.type === 'brands' && (
                  <BrandsMegaMenu onClose={() => setOpenDrop(null)} />
                )}
              </div>
            ))}
          </nav>

          {/* Правые кнопки */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="tel:+79818428151"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#39FF14] transition-colors"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-4" />
              <span className="hidden xl:inline font-medium">+7 (981) 842-81-51</span>
            </a>
            <button onClick={() => openBooking()} className="btn-primary text-xs px-5 py-2.5 rounded-xl">
              Записаться
            </button>
          </div>

          {/* Мобильный бургер */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="tel:+79818428151"
              className="flex items-center justify-center size-10 rounded-xl bg-[#39FF14]/10 text-[#39FF14]"
              aria-label="Позвонить"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-5" />
            </a>
            <button
              className="flex items-center justify-center size-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#09090b] flex flex-col">
          <div className="flex items-center justify-between h-16 px-5 border-b border-white/8 shrink-0">
            <Logo onClick={() => setMobileOpen(false)} />
            <button
              className="flex items-center justify-center size-10 rounded-xl bg-white/5 text-zinc-400"
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1 pb-28">
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => { openBooking(); setMobileOpen(false); }}
                className="btn-primary py-3 text-sm justify-center rounded-xl"
              >
                Записаться
              </button>
              <a
                href="tel:+79818428151"
                className="flex items-center justify-center gap-2 py-3 text-sm bg-white/5 text-[#39FF14] rounded-xl font-medium"
                onClick={() => setMobileOpen(false)}
              >
                <Phone className="size-4" />
                Позвонить
              </a>
            </div>

            {/* Автосервис */}
            <div>
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                onClick={() => setMobileExpanded(mobileExpanded === 'service' ? null : 'service')}
              >
                <span className="text-white font-medium text-sm">Автосервис</span>
                <ChevronDown className={`size-4 text-zinc-500 transition-transform ${mobileExpanded === 'service' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpanded === 'service' && (
                <div className="pl-4 flex flex-col gap-0.5 mb-1">
                  {NAV_SERVICE.map((s) => (
                    <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/50 shrink-0" />
                      <span className="text-sm text-zinc-300">{s.label}</span>
                    </Link>
                  ))}
                  <Link href="/service" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/50 shrink-0" />
                    <span className="text-sm text-[#39FF14]">Все услуги →</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Марки — мега-меню в мобайле */}
            <div>
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                onClick={() => setMobileExpanded(mobileExpanded === 'brands' ? null : 'brands')}
              >
                <span className="text-white font-medium text-sm">Марки авто</span>
                <ChevronDown className={`size-4 text-zinc-500 transition-transform ${mobileExpanded === 'brands' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpanded === 'brands' && (
                <div className="pl-4 flex flex-col gap-0.5 mb-1">
                  {BRANDS_MEGA.map((group) => (
                    <div key={group.group}>
                      <p className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest ${group.color}`}>{group.group}</p>
                      {group.brands.map((b) => {
                        const isExt = b.href.startsWith('http');
                        const cls = 'flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-white/5';
                        const inner = (
                          <>
                            <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={b.logo} alt={b.label} width={20} height={20} className="max-h-4 w-auto object-contain" loading="lazy" />
                            </div>
                            <span className="text-sm text-zinc-300">{b.label}</span>
                          </>
                        );
                        return isExt
                          ? <a key={b.label} href={b.href} className={cls} onClick={() => setMobileOpen(false)} rel="noopener noreferrer">{inner}</a>
                          : <Link key={b.label} href={b.href} prefetch={false} className={cls} onClick={() => setMobileOpen(false)}>{inner}</Link>;
                      })}
                    </div>
                  ))}
                  <Link href="/marki" prefetch={false} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/50 shrink-0" />
                    <span className="text-sm text-[#39FF14]">Смотреть все 38 марок →</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Тюнинг */}
            <div>
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                onClick={() => setMobileExpanded(mobileExpanded === 'tuning' ? null : 'tuning')}
              >
                <span className="text-white font-medium text-sm">Тюнинг</span>
                <ChevronDown className={`size-4 text-zinc-500 transition-transform ${mobileExpanded === 'tuning' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpanded === 'tuning' && (
                <div className="pl-4 flex flex-col gap-0.5 mb-1">
                  {NAV_TUNING.map((s) => (
                    <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/50 shrink-0" />
                      <span className="text-sm text-zinc-300">{s.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Детейлинг */}
            <div>
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                onClick={() => setMobileExpanded(mobileExpanded === 'detailing' ? null : 'detailing')}
              >
                <span className="text-white font-medium text-sm">Детейлинг</span>
                <ChevronDown className={`size-4 text-zinc-500 transition-transform ${mobileExpanded === 'detailing' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpanded === 'detailing' && (
                <div className="pl-4 flex flex-col gap-0.5 mb-1">
                  {NAV_DETAILING.map((s) => (
                    <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/50 shrink-0" />
                      <span className="text-sm text-zinc-300">{s.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Простые ссылки */}
            {[{ label: 'Работы', href: '/works' }, { label: 'Контакты', href: '/contacts' }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-white font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="shrink-0 p-4 border-t border-white/8">
            <p className="text-center text-zinc-600 text-xs">
              +7 (981) 842-81-51 · Богородская, 3Б · 10:00–20:00
            </p>
          </div>
        </div>
      )}

      {/* Мобильный sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#09090b]/95 backdrop-blur-md border-t border-white/8 p-3 safe-area-pb">
        <div className="flex gap-2">
          <button
            onClick={() => openBooking()}
            className="btn-primary flex-1 py-3 text-sm justify-center rounded-xl"
          >
            Записаться
          </button>
          <a
            href="tel:+79818428151"
            className="flex items-center justify-center size-12 rounded-xl bg-white/5 text-[#39FF14] shrink-0"
            onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
          >
            <Phone className="size-5" />
          </a>
        </div>
      </div>
    </>
  );
}
