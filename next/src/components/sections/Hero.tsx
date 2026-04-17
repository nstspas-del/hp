'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">

      {/* ── Фон: BMW X7 в гараже ── */}
      <Image
        src="/images/hero-bmw-x7.jpg"
        alt="HP Тюнинг — премиальный автосервис в Санкт-Петербурге"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
        quality={90}
      />

      {/* ── Градиентные оверлеи ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/80 via-transparent to-transparent" />

      {/* ── Контент ── */}
      <div className="relative container pb-16 md:pb-24 pt-32">
        <div className="max-w-2xl">

          {/* Бейдж */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[#39FF14] text-xs font-bold tracking-widest uppercase">
              Санкт-Петербург · Богородская 3Б
            </span>
          </div>

          {/* Заголовок */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-none uppercase tracking-tight text-white mb-4">
            Премиальный{' '}
            <span
              className="text-[#39FF14]"
              style={{ textShadow: '0 0 40px rgba(57,255,20,0.6)' }}
            >
              автосервис
            </span>
            <br />в Петербурге
          </h1>

          {/* Подзаголовок */}
          <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            Чип-тюнинг, детейлинг и техническое обслуживание премиальных марок.
            BMW, Mercedes, Porsche, Audi — опыт 9+ лет.
          </p>

          {/* CTA кнопки */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => openBooking()}
              className="btn-primary text-base px-8 py-4 rounded-full font-bold"
            >
              Записаться на сервис
            </button>
            <a
              href="tel:+79818428151"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 text-white font-semibold text-base hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-4" />
              +7 (981) 842-81-51
            </a>
          </div>

          {/* Статистика */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              { value: '9+', label: 'лет на рынке' },
              { value: '500+', label: 'авто обслужено' },
              { value: '1 год', label: 'гарантия' },
              { value: '10:00–20:00', label: 'ежедневно' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-display font-bold text-[#39FF14]"
                  style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
                >
                  {s.value}
                </div>
                <div className="text-zinc-500 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Нижние ссылки-направления ── */}
      <div className="relative border-t border-white/8 bg-[#09090b]/80 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-3 divide-x divide-white/8">
            {[
              { href: '/services/chip-tuning', icon: '⚡', label: 'Чип-тюнинг', sub: 'Stage 1–3, EGR/DPF' },
              { href: '/services/detailing', icon: '◈', label: 'Детейлинг', sub: 'Керамика, PPF, химчистка' },
              { href: '/services/service', icon: '🔧', label: 'Автосервис', sub: 'ТО, диагностика, ремонт' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-4 md:px-8 py-4 md:py-5 hover:bg-white/3 transition-colors"
              >
                <span className="text-xl md:text-2xl">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-white text-sm md:text-base font-semibold group-hover:text-[#39FF14] transition-colors truncate">
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
