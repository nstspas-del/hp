'use client';

/**
 * 404 — Страница не найдена.
 *
 * Cinematic full-screen видео-фон (взрыв + чёрная машина + большая «404»)
 * + крупный заголовок в верхнем-левом тёмном углу + 3 умные ссылки
 * (главная / марки / звонок).
 *
 * taste-skill параметры:
 *   DESIGN_VARIANCE  = 8 — асимметрия, верхний-левый якорь, не центр
 *   MOTION_INTENSITY = 7 — spring physics на кнопках, staggered fade-in
 *   VISUAL_DENSITY   = 3 — много воздуха, минимум данных
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Phone, Cog } from 'lucide-react';

export default function NotFoundClient() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07111D] -mt-16 pt-16">
      {/* ── Video background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/videos/404-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/videos/404-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Затемняющий градиент: слева/сверху темнее (где будет текст),
              справа/снизу светлее (видно огонь и машину) ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#07111D]/85 via-[#07111D]/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-transparent to-transparent" />

      {/* ── Контент ── */}
      <div className="relative container min-h-[100dvh] flex flex-col justify-between py-12 md:py-16">
        {/* ── ВЕРХ: текст в левом-верхнем углу ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.2 }}
          className="max-w-xl"
        >
          {/* Бейдж — мигающий статус */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 mb-5">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]" />
            </span>
            <span className="text-[#39FF14] text-[10px] md:text-xs font-bold tracking-widest uppercase">
              Error · 404 · Page Not Found
            </span>
          </div>

          {/* Главный заголовок */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white">
            Тут{' '}
            <span
              className="text-[#39FF14]"
              style={{ textShadow: '0 0 30px rgba(57,255,20,0.5)' }}
            >
              пусто
            </span>
            .<br />
            Свернули
            <br />
            не туда.
          </h1>

          {/* Подзаголовок */}
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed mt-5 max-w-md">
            Страница переехала, удалена&nbsp;— или её&nbsp;никогда не было.
            Не&nbsp;стоит этого делать — давайте вернёмся к&nbsp;работающей
            части сайта.
          </p>
        </motion.div>

        {/* ── НИЗ: 3 варианта куда пойти + контакт ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
          }}
          className="max-w-3xl"
        >
          <p className="text-zinc-400 text-xs md:text-sm uppercase tracking-widest mb-3 font-semibold">
            Куда дальше?
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
              }}
            >
              <Link
                href="/"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#39FF14] text-black font-bold text-base hover:bg-[#2ee00f] active:scale-[0.97] transition-all"
              >
                <Home className="size-5" />
                На главную
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
              }}
            >
              <Link
                href="/marki"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold text-base hover:border-[#A855F7]/60 hover:text-[#A855F7] active:scale-[0.97] transition-all"
              >
                <Cog className="size-5" />
                Наши марки
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
              }}
            >
              <a
                href="tel:+79818428151"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold text-base hover:border-[#39FF14]/60 hover:text-[#39FF14] active:scale-[0.97] transition-all"
              >
                <Phone className="size-5" />
                +7 (981) 842-81-51
              </a>
            </motion.div>
          </div>

          {/* Тех-приписка маленьким шрифтом */}
          <p className="text-zinc-500 text-xs md:text-sm mt-5 max-w-md tabular-nums">
            HP Тюнинг · СПб, Богородская&nbsp;3Б · 10:00–22:00 без&nbsp;выходных
          </p>
        </motion.div>
      </div>
    </section>
  );
}
