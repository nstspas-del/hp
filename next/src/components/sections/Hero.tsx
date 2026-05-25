'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Stethoscope, Wrench, Zap, Sparkles } from 'lucide-react';

// 14 ключевых марок, сгруппированы по сегментам — все в HTML для Яндекса.
// На мобиле этот блок скрыт — слишком тяжёлый; есть BrandsSection ниже.
const BRAND_GROUPS = [
  {
    label: 'Европейские',
    tab: 'european',
    brands: ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Land Rover'],
  },
  {
    label: 'Японские',
    tab: 'japanese',
    brands: ['Toyota', 'Lexus'],
  },
  {
    label: 'Корейские',
    tab: 'korean',
    brands: ['Kia', 'Hyundai'],
  },
  {
    label: 'Китайские',
    tab: 'chinese',
    brands: ['Haval', 'Chery', 'Geely', 'Tank', 'Exeed'],
  },
];

// 4 ключевых сервисных блока — кликабельные карточки.
// На мобиле — это ОСНОВНОЙ сценарий движения, на десктопе — нижняя полоска.
const KEY_SERVICES = [
  {
    href: '/service/diagnostics',
    icon: Stethoscope,
    label: 'Диагностика',
    sub: 'Компьютерная, ходовая, развал',
    accent: '#39FF14',
    ymGoal: 'hero_diagnostics',
  },
  {
    href: '/service/to',
    icon: Wrench,
    label: 'ТО под ключ',
    sub: 'От 4 900 ₽',
    accent: '#39FF14',
    ymGoal: 'hero_to',
  },
  {
    href: '/tuning/chip-tuning',
    icon: Zap,
    label: 'Чип-тюнинг',
    sub: 'Stage 1 / 2 / 3',
    accent: '#A855F7',
    ymGoal: 'hero_chiptuning',
  },
  {
    href: '/detailing',
    icon: Sparkles,
    label: 'Детейлинг',
    sub: 'Керамика, PPF, химчистка',
    accent: '#A855F7',
    ymGoal: 'hero_detailing',
  },
];

export function Hero() {
  return (
    <section className="relative min-h-[88svh] md:min-h-[92svh] flex flex-col justify-end overflow-hidden">

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

      {/* ── Основной контент. Снизил pb-20 → pb-12 на десктопе чтобы убрать пустоту ── */}
      <div className="relative container pb-6 md:pb-12 pt-20 md:pt-24">
        <div className="max-w-3xl">

          {/* Бейдж */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 mb-4 md:mb-5">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[#39FF14] text-[10px] md:text-xs font-bold tracking-widest uppercase">
              СПб · Богородская 3Б · 10:00–22:00
            </span>
          </div>

          {/* H1 — единый, чистый, без двойного вложения.
              Увеличены шрифты на десктопе (text-7xl на >md), мобильно остаётся 3xl. */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] uppercase tracking-tight text-white mb-4 md:mb-5">
            Автосервис в&nbsp;
            <span className="text-[#39FF14]" style={{ textShadow: '0 0 40px rgba(57,255,20,0.5)' }}>
              Санкт-Петербурге
            </span>
            <span className="block text-zinc-300 text-2xl sm:text-3xl md:text-5xl mt-2 md:mt-3 normal-case tracking-normal font-display">
              ТО, ремонт, чип-тюнинг и&nbsp;детейлинг
            </span>
          </h1>

          {/* Подзаголовок — крупнее на десктопе, объединён без дубля с BrandsSection */}
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-5 md:mb-7 max-w-2xl">
            14 ключевых марок — европейские, японские, корейские и&nbsp;китайские. От ТО
            и&nbsp;диагностики до&nbsp;чип-тюнинга и&nbsp;детейлинга — всё&nbsp;в&nbsp;одном
            месте на&nbsp;Богородской&nbsp;3Б.
          </p>

          {/* ───────── ГЛАВНЫЙ CTA — звонок, без "записаться в сервис" ───────── */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-2">
            <a
              href="tel:+79818428151"
              className="btn-primary text-base md:text-lg px-7 py-4 rounded-full font-bold justify-center gap-2"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
            >
              <Phone className="size-5" />
              +7 (981) 842-81-51
            </a>
            <a
              href="https://t.me/hptunspb"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.ym?.(108614238, 'reachGoal', 'telegram_click')}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/15 text-white font-semibold text-base hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
          <p className="text-zinc-500 text-sm mb-5 md:mb-7">
            Ответим в течение 15 минут · возможна дистанционная консультация
          </p>

          {/* ───────── 4 КЛЮЧЕВЫХ СЕРВИСНЫХ БЛОКА ─────────
              На мобиле — основной сценарий движения, ОЧЕНЬ заметные карточки.
              На десктопе — выглядят чуть компактнее, но всё равно кликабельные.
          */}
          <nav aria-label="Ключевые услуги" className="mb-5 md:mb-7">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {KEY_SERVICES.map((srv) => {
                const Icon = srv.icon;
                return (
                  /* ВАЖНО: тут <a>, а не <Link> — чтобы клик ловился сразу,
                     даже до окончания React hydration на медленных устройствах. */
                  <a
                    key={srv.href}
                    href={srv.href}
                    onClick={() => window.ym?.(108614238, 'reachGoal', srv.ymGoal)}
                    className="group relative flex flex-col items-start gap-2.5 p-4 md:p-5 rounded-2xl bg-[#09090b]/85 backdrop-blur-md border border-white/10 hover:border-[color:var(--srv-accent)] active:scale-[0.98] transition-all min-h-[100px] md:min-h-[120px]"
                    style={{ '--srv-accent': srv.accent } as React.CSSProperties}
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl shrink-0"
                      style={{ backgroundColor: `${srv.accent}1A`, boxShadow: `0 0 14px ${srv.accent}30 inset` }}
                    >
                      <Icon className="size-5 md:size-6" color={srv.accent} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-white text-base md:text-lg font-bold leading-tight group-hover:text-[color:var(--srv-accent)] transition-colors"
                      >
                        {srv.label}
                      </div>
                      <div className="text-zinc-400 text-xs md:text-sm mt-1 leading-tight">
                        {srv.sub}
                      </div>
                    </div>
                    {/* Стрелочка-индикатор справа сверху */}
                    <span
                      className="absolute top-3 right-3 text-zinc-600 group-hover:text-[color:var(--srv-accent)] transition-colors text-sm leading-none"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Статистика — крупнее, читаемее */}
          <div className="flex flex-wrap gap-5 md:gap-10">
            {[
              { value: '14', label: 'ключевых марок' },
              { value: '457+', label: 'собранных проектов' },
              { value: 'от 4 900 ₽', label: 'ТО под ключ' },
              { value: '10:00–22:00', label: 'без выходных' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-xl md:text-3xl font-display font-bold text-[#39FF14]"
                  style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
                >
                  {s.value}
                </div>
                <div className="text-zinc-400 text-xs md:text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Яндекс.Бизнес — реальный рейтинг (id 99062407907) */}
          <div className="mt-5 md:mt-6">
            <iframe
              src="https://yandex.ru/sprav/widget/rating-badge/99062407907?type=rating&theme=dark"
              width={150}
              height={50}
              frameBorder={0}
              loading="lazy"
              title="Рейтинг HP Тюнинг в Яндекс.Бизнес"
              className="block"
            />
          </div>
        </div>

        {/* ── Блок марок по сегментам (SEO + навигация) — ТОЛЬКО ДЕСКТОП ──
            На мобиле скрыт, чтобы не перегружать Hero. Есть BrandsSection ниже.
        */}
        <div className="hidden md:grid mt-10 grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
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
          className="hidden md:inline-flex items-center gap-1.5 mt-4 text-xs text-zinc-500 hover:text-[#A855F7] transition-colors"
          prefetch={false}
        >
          Открыть страницу марок →
        </Link>
      </div>

      {/* 4-х карточек KEY_SERVICES в Hero достаточно как entry-point. */}
    </section>
  );
}
