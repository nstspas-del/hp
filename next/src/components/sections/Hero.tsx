'use client';
import { motion } from 'framer-motion';
import { openBooking } from '@/lib/autodealer';
import { Phone, ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg-elevated to-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(57,255,20,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(57,255,20,0.04),transparent_60%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(57,255,20,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="container relative z-10 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="badge mb-6">Тюнинг-ателье в СПб с 2015 года</span>

          <h1 className="section-title text-5xl md:text-7xl lg:text-8xl mb-6">
            ТЮНИНГ{' '}
            <span className="text-accent glow-accent">ТВОЕГО</span>
            <br />УРОВНЯ
          </h1>

          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Чип-тюнинг Stage&nbsp;1/2/3, керамическое покрытие 9H, PPF плёнка и премиальный автосервис.
            BMW, Mercedes, Audi, Porsche и ещё 9 марок.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => openBooking()} className="btn-primary text-base px-8 py-4">
              Записаться на тюнинг
            </button>
            <a href="tel:+79818428151"
              className="btn-secondary text-base px-8 py-4"
              onClick={() => window.ym?.(window.YM_COUNTER_ID!, 'reachGoal', 'phone_click')}>
              <Phone className="size-4" />
              +7 (981) 842-81-51
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-14 text-center">
            {[
              { value: '9+', label: 'лет опыта' },
              { value: '13', label: 'брендов' },
              { value: '500+', label: 'автомобилей' },
              { value: '1 год', label: 'гарантия' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl md:text-4xl text-accent">{s.value}</div>
                <div className="text-text-muted text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="size-6 text-text-subtle" />
      </motion.div>
    </section>
  );
}
