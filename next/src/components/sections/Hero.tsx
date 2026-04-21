'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

// Марки сгруппированы по сегментам — все в HTML для Яндекса
const BRAND_GROUPS = [
  {
    label: 'Европейские',
    tab: 'european',
    brands: ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'VW', 'Land Rover', 'Volvo', 'MINI'],
  },
  {
    label: 'Японские',
    tab: 'japanese',
    brands: ['Toyota', 'Lexus', 'Mazda', 'Nissan', 'Subaru', 'Honda', 'Infiniti'],
  },
  {
    label: 'Корейские',
    tab: 'japanese',
    brands: ['Kia', 'Hyundai', 'Genesis'],
  },
  {
    label: 'Китайские',
    tab: 'chinese',
    brands: ['Haval', 'Chery', 'Geely', 'Tank', 'Exeed', 'Jaecoo', 'Omoda', 'Changan', 'Jetour'],
  },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">

      {/* ── Фон ── */}
      <Image
        src="/images/hero-bmw-x7.jpg"
        alt="Автосервис HP Тюнинг — Санкт-Петербург, Богородская 3Б"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/75 via-transparent to-transparent" />

      {/* ── Основной контент ── */}
      <div className="relative container pb-12 md:pb-20 pt-28">
        <div className="max-w-2xl">

          {/* Бейдж */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[#39FF14] text-xs font-bold tracking-widest uppercase">
              Санкт-Петербург · Богородская 3Б · 10:00–20:00
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-none uppercase tracking-tight text-white mb-4">
            <span className="text-[#39FF14]" style={{ textShadow: '0 0 40px rgba(57,255,20,0.5)' }}>
              Автосервис в СПб
            </span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl">
              ТО · Диагностика · Ремонт<br className="hidden sm:block" /> Детейлинг · Тюнинг
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-2 max-w-xl">
            Сервис для европейских, японских, корейских и современных китайских автомобилей в Санкт-Петербурге:
          </p>
          {/* Марки в HTML — видно Яндексу без JS */}
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-7 max-w-xl">
            BMW, Mercedes-Benz, Audi, Porsche, Toyota, Lexus, Volkswagen, Land Rover,
            Kia, Hyundai,{' '}
            <strong className="text-white">Haval, Chery, Geely, Tank, Exeed, Jaecoo</strong>{' '}
            и другие марки — всё в одном месте, от ТО и диагностики до сложного ремонта и дооснащения.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <button
              onClick={() => openBooking()}
              className="btn-primary text-sm md:text-base px-7 py-3.5 rounded-full font-bold"
            >
              Записаться в сервис
            </button>
            <a
              href="tel:+79818428151"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white font-semibold text-sm md:text-base hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-4" />
              +7 (981) 842-81-51
            </a>
          </div>
          <p className="text-zinc-600 text-xs mb-10">
            Ответим в течение 15 минут · возможна дистанционная консультация
          </p>

          {/* Статистика */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              { value: '10+', label: 'лет опыта' },
              { value: '500+', label: 'авто обслужено' },
              { value: '38+', label: 'марок авто' },
              { value: 'от 4 900 ₽', label: 'ТО' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl md:text-3xl font-display font-bold text-[#39FF14]"
                  style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
                >
                  {s.value}
                </div>
                <div className="text-zinc-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Блок марок по сегментам (SEO + навигация) — кликабельный ── */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          {BRAND_GROUPS.map((group) => (
            <Link
              key={group.label}
              href={`/marki?tab=${group.tab}`}
              prefetch={false}
              className="rounded-xl border border-white/8 bg-[#09090b]/60 p-3 hover:border-[#39FF14]/30 hover:bg-[#09090b]/80 transition-colors group"
            >
              <p className="text-[10px] font-semibold text-[#39FF14]/70 uppercase tracking-widest mb-2 group-hover:text-[#39FF14] transition-colors">
                {group.label}
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {group.brands.join(', ')}
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/marki"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-zinc-500 hover:text-[#39FF14] transition-colors"
          prefetch={false}
        >
          Смотреть все 38 марок →
        </Link>
      </div>

      {/* ── Нижние ссылки-направления ── */}
      <div className="relative border-t border-white/8 bg-[#09090b]/85 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-3 divide-x divide-white/8">
            {[
              { href: '/tuning/chip-tuning', icon: '⚡', label: 'Тюнинг', sub: 'Чип-тюнинг от 24 000 ₽' },
              { href: '/detailing', icon: '◈', label: 'Детейлинг', sub: 'Керамика, PPF, химчистка' },
              { href: '/service', icon: '🔧', label: 'Автосервис', sub: 'ТО от 4 900 ₽' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-2 md:gap-3 px-3 md:px-8 py-4 md:py-5 hover:bg-white/3 transition-colors"
              >
                <span className="text-lg md:text-2xl">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-white text-xs md:text-base font-semibold group-hover:text-[#39FF14] transition-colors truncate">
                    {item.label}
                  </div>
                  <div className="text-zinc-600 text-xs truncate hidden sm:block">{item.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
