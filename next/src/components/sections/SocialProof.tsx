'use client';
/**
 * Социальные доказательства — Bento-grid (taste-skill §9).
 *
 * Вместо унылой сетки 3×2 одинаковых карточек — асимметричный bento:
 *   ┌─────────────────────────┬───────────┐
 *   │  ALIENTECH (1 хайлайт)  │  CPU      │
 *   │      2 кол × 1 ряд       │  диагн.   │
 *   ├──────────┬──────────────┴───────────┤
 *   │ ОТКАТ    │ КОМАНДА (1 col × 1 row)  │
 *   ├──────────┼──────────────────────────┤
 *   │ БОКС     │ ЦЕНЫ (1 col × 1 row)     │
 *   └──────────┴──────────────────────────┘
 * (на md+ — bento; на мобиле — стек single-column)
 *
 * Принципы taste-skill:
 *   • DESIGN_VARIANCE = 7 (асимметрия 2fr 1fr)
 *   • MOTION_INTENSITY = 6 (whileInView + staggerChildren + spring)
 *   • Tinted shadows: тень в цвет акцента, а не пустая чёрная
 *   • Inner border для glassmorphism: rgba(255,255,255,0.06)
 *   • Никаких эмодзи в коде
 */

import { ShieldCheck, Award, Clock, Wrench, Users, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

type Fact = {
  icon: typeof Award;
  title: string;
  body: string;
  /** Размер карточки в bento (на md+) */
  span?: 'wide' | 'tall' | 'normal';
  /** Особо акцентная карта — зелёная заливка */
  accent?: boolean;
};

const FACTS: Fact[] = [
  {
    icon: Award,
    title: 'Оборудование Alientech KESS3',
    body: 'Работаем на Alientech KESS3 — эталонный программатор для чип-тюнинга премиум-марок (BMW, Mercedes, Porsche, Audi, Land Rover). Корректные карты, безопасные прошивки, оригинальный файл ЭБУ сохраняем перед каждой работой.',
    span: 'wide',
    accent: true,
  },
  {
    icon: Cpu,
    title: 'Дилерская диагностика',
    body: 'AUTEL MaxiSYS MS919, Bosch KTS, Launch X-431 — читаем ЭБУ всех немецких, британских, японских и китайских марок так же, как дилер.',
  },
  {
    icon: ShieldCheck,
    title: 'Откат к стоку',
    body: 'Перед каждой прошивкой сохраняем оригинальный файл. Перед ТО у дилера — бесплатно вернём заводскую версию.',
  },
  {
    icon: Clock,
    title: 'Команда с 2019',
    body: 'Премиум — Porsche, BMW M, AMG, Range Rover, и современные массовые — Haval, Chery, Geely, Tank, Exeed.',
  },
  {
    icon: Wrench,
    title: 'Бокс в Порошкино',
    body: 'Своя мастерская на Богородской, 3Б — два подъёмника, дизайнерский пол, клиентская зона с диваном и кофе. Большой баннер Hot Wheels Legends UK — фотозона, где снимаем каждый клиентский автомобиль.',
    span: 'wide',
  },
  {
    icon: Users,
    title: 'Прозрачные цены',
    body: 'Калькулятор на сайте показывает стоимость ТО, диагностики, ремонта, чип-тюнинга и детейлинга. Без «накруток в процессе».',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 90, damping: 18 },
  },
};

export function SocialProof() {
  return (
    <section className="container py-12 md:py-20 border-t border-white/5">
      {/* Заголовок секции — асимметричный, не центрированный */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-12 items-end">
        <div className="md:col-span-2">
          <span className="badge mb-3 inline-block">Почему доверяют</span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.02]">
            Команда, оборудование
            <br />
            и&nbsp;<span className="text-[#39FF14]" style={{ textShadow: '0 0 30px rgba(57,255,20,0.4)' }}>честная цена</span>
          </h2>
        </div>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed md:pb-2">
          Премиум-экспертиза, дилерское диагностическое оборудование, уютная мастерская
          в&nbsp;Порошкино и&nbsp;прозрачное ценообразование без&nbsp;«доплат на&nbsp;выходе».
        </p>
      </div>

      {/* BENTO GRID — асимметричная сетка 3 колонки на md+ */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-min"
      >
        {FACTS.map((f, i) => {
          const Icon = f.icon;
          const isWide = f.span === 'wide';
          return (
            <motion.article
              key={i}
              variants={cardVariants}
              className={[
                'group relative overflow-hidden rounded-3xl p-6 md:p-7 transition-all duration-300',
                'border',
                f.accent
                  ? 'bg-gradient-to-br from-[#39FF14]/[0.08] to-[#39FF14]/[0.02] border-[#39FF14]/30'
                  : 'bg-[#111113] border-white/8 hover:border-white/15',
                isWide ? 'md:col-span-2' : '',
              ].join(' ')}
              style={
                f.accent
                  ? { boxShadow: '0 20px 60px -20px rgba(57,255,20,0.15)' }
                  : undefined
              }
            >
              {/* Иконка */}
              <div
                className={[
                  'inline-flex items-center justify-center size-12 md:size-14 rounded-2xl mb-5 shrink-0 transition-transform group-hover:scale-105',
                  f.accent
                    ? 'bg-[#39FF14] text-black'
                    : 'bg-white/[0.06] text-[#39FF14] border border-white/[0.06]',
                ].join(' ')}
              >
                <Icon className="size-6" strokeWidth={1.8} />
              </div>

              <h3
                className={[
                  'font-display text-xl md:text-2xl tracking-tight mb-2.5 leading-[1.15]',
                  f.accent ? 'text-white' : 'text-white',
                ].join(' ')}
              >
                {f.title}
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                {f.body}
              </p>

              {/* Inner border (taste-skill glassmorphism refraction) */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.02)',
                }}
              />
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}

export default SocialProof;
