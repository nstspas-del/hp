'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { openBooking } from '@/lib/autodealer';
import { Phone, ChevronDown, Zap, Shield, Wrench } from 'lucide-react';

const STATS = [
  { value: '9+', label: 'лет опыта' },
  { value: '30+', label: 'брендов' },
  { value: '500+', label: 'автомобилей' },
  { value: '1 год', label: 'гарантия' },
];

const SERVICES = [
  { icon: Zap, label: 'Чип-тюнинг', href: '/services/chip-tuning', color: 'text-accent' },
  { icon: Shield, label: 'Детейлинг', href: '/services/detailing', color: 'text-violet-400' },
  { icon: Wrench, label: 'Автосервис', href: '/services/service', color: 'text-blue-400' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
      {/* ── Фоновый баннер ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner.jpg"
          alt="HP Тюнинг — BMW X7 в боксе"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Градиент: слева плотнее (текст), справа прозрачнее (авто виден) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        {/* Зелёный неон-акцент снизу */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      <div className="container relative z-10 pt-24 pb-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Бейдж */}
            <span className="badge mb-6 inline-flex">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2" />
              Тюнинг-ателье · СПб · с 2015 года
            </span>

            {/* Заголовок */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-[88px] leading-none mb-6 text-text">
              HP<br />
              <span className="text-accent" style={{ textShadow: '0 0 40px rgba(57,255,20,0.5)' }}>
                ТЮНИНГ
              </span>
            </h1>

            {/* Теглайн */}
            <p className="text-[#c8c8cc] text-base md:text-lg mb-3 font-medium tracking-wider uppercase">
              АВТОСЕРВИС · ДЕТЕЙЛИНГ · ТЮНИНГ
            </p>

            <p className="text-text-muted text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              Чип-тюнинг Stage&nbsp;1/2/3, керамика 9H, PPF плёнка и полный спектр
              технического обслуживания премиальных авто в Санкт-Петербурге.
            </p>

            {/* Кнопки CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={() => openBooking()}
                className="btn-primary text-sm px-7 py-3.5 rounded-full font-bold"
              >
                Записаться онлайн
              </button>
              <a
                href="tel:+79818428151"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-text hover:border-accent/50 hover:text-accent transition-colors text-sm font-semibold"
                onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
              >
                <Phone className="size-4" />
                +7 (981) 842-81-51
              </a>
            </div>

            {/* Быстрые ссылки на услуги */}
            <div className="flex flex-wrap gap-2 mb-12">
              {SERVICES.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-[13px] font-medium transition-all ${s.color}`}
                >
                  <s.icon className="size-3.5" />
                  {s.label}
                </a>
              ))}
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <div
                    className="font-display text-3xl md:text-4xl text-accent"
                    style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-text-subtle text-xs mt-1 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Скролл-стрелка */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="size-6 text-white/40" />
      </motion.div>

      {/* Отступ снизу под мобильную CTA-полосу */}
      <div className="xl:hidden h-16" />
    </section>
  );
}
