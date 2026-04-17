'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { openBooking } from '@/lib/autodealer';

const DIRECTIONS = [
  {
    href: '/services/chip-tuning',
    image: '/images/works/subaru-wrx-lift.jpg',
    tag: 'Чип-тюнинг',
    title: 'Прошивка под ваши задачи',
    desc: 'Stage 1, 2, 3 — прирост мощности от +15% до +80%. Удаление сажевого, EGR, Immo. Фирменный OBD-доступ к каждой марке.',
    price: 'от 24 000 ₽',
    accent: '#39FF14',
    links: [
      { label: 'Stage 1 · мягкий', href: '/services/chip-tuning/stage-1' },
      { label: 'Stage 2 · продвинутый', href: '/services/chip-tuning/stage-2' },
      { label: 'Stage 3 · максимум', href: '/services/chip-tuning/stage-3' },
      { label: 'Удаление сажевого / EGR', href: '/services/chip-tuning/dpf-egr-off' },
    ],
  },
  {
    href: '/services/detailing',
    image: '/images/works/mercedes-gle63-foam-wash.jpg',
    tag: 'Детейлинг',
    title: 'Защита кузова и салона',
    desc: 'Керамика 9H на 3–5 лет, PPF-броня от сколов, полировка ЛКП, химчистка, тонировка. Работаем только с профессиональными материалами.',
    price: 'от 5 000 ₽',
    accent: '#38bdf8',
    links: [
      { label: 'Полировка кузова', href: '/services/detailing/polishing' },
      { label: 'Керамическое покрытие 9H', href: '/services/detailing/ceramic' },
      { label: 'PPF антигравийная плёнка', href: '/services/detailing/ppf' },
      { label: 'Химчистка салона', href: '/services/detailing/dry-cleaning' },
    ],
  },
  {
    href: '/services/service',
    image: '/images/works/mercedes-amg-orange-lift.jpg',
    tag: 'Автосервис',
    title: 'Техобслуживание и ремонт',
    desc: 'Плановое ТО, диагностика по OBD, тормозная система, подвеска, двигатель. Дилерское оборудование без дилерских цен.',
    price: 'от 1 500 ₽',
    accent: '#a78bfa',
    links: [
      { label: 'Плановое ТО', href: '/services/service/to' },
      { label: 'Диагностика', href: '/services/service/diagnostics' },
      { label: 'Тормозная система', href: '/services/service/brakes' },
      { label: 'Подвеска', href: '/services/service/suspension' },
    ],
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-[#09090b]">
      <div className="container">

        {/* Заголовок секции */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge mb-4">Три направления</span>
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white">
            Что мы делаем
          </h2>
        </motion.div>

        {/* Карточки направлений */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {DIRECTIONS.map((dir, i) => (
            <motion.div
              key={dir.href}
              className="group relative rounded-2xl overflow-hidden bg-[#111113] border border-white/8 hover:border-white/20 transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Фото */}
              <div className="relative h-52 overflow-hidden flex-shrink-0">
                <Image
                  src={dir.image}
                  alt={dir.tag}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent" />
                {/* Бейдж цены */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-bold">
                  {dir.price}
                </div>
              </div>

              {/* Контент */}
              <div className="flex flex-col flex-1 p-6">
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: dir.accent }}
                >
                  {dir.tag}
                </span>
                <h3 className="text-white text-xl font-bold mb-2">{dir.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-5">{dir.desc}</p>

                {/* Быстрые ссылки */}
                <ul className="space-y-1 mb-6 flex-1">
                  {dir.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="flex items-center gap-2 text-[13px] text-zinc-400 hover:text-white transition-colors py-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Кнопки */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={dir.href}
                    className="flex-1 text-center py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white text-sm font-medium transition-colors"
                  >
                    Подробнее
                  </Link>
                  <button
                    onClick={() => openBooking(dir.tag)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors text-black"
                    style={{ backgroundColor: dir.accent }}
                  >
                    Записаться
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
