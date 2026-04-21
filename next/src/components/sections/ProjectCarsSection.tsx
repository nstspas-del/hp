/**
 * ProjectCarsSection — HP Тюнинг
 * Раздел «Наши проектные машины» на главной странице.
 * Показывает drift- и daily-автомобили мастерской с ссылками на полные кейсы.
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gauge, Wrench } from 'lucide-react';

type ProjectCar = {
  slug: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  engine: string;
  power: string;
  services: string[];
  coverImage: string;
  href: string;
};

const PROJECT_CARS: ProjectCar[] = [
  {
    slug: 'drift-bmw-e46-m3',
    tag: 'Drift',
    tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    title: 'BMW E46 M3 — дрифт-проект',
    subtitle: 'Боевая подготовка, каркас безопасности, тюнинг S54',
    engine: 'S54B32',
    power: '360+ л.с.',
    services: ['Тюнинг мотора', 'Каркас', 'Подвеска'],
    coverImage: '/images/works/10-bmw-x5-neon-workshop.jpg',
    href: '/projects/drift-bmw-e46-m3',
  },
  {
    slug: 'daily-vw-golf-r-mk8',
    tag: 'Daily',
    tagColor: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
    title: 'Volkswagen Golf R Mk8 — комплексный апгрейд',
    subtitle: 'Stage 2, выхлоп Milltek, шумка, керамика 9H',
    engine: 'EA888 Gen4',
    power: '420 л.с.',
    services: ['Чип-тюнинг', 'Детейлинг', 'Шумоизоляция'],
    coverImage: '/images/works/10-bmw-x5-neon-workshop.jpg',
    href: '/projects/daily-vw-golf-r-mk8',
  },
];

export function ProjectCarsSection() {
  return (
    <section className="py-20 bg-[#111113]">
      <div className="container">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[#39FF14] text-xs font-semibold uppercase tracking-widest mb-2">
              Проектные автомобили
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight">
              Наши машины
            </h2>
            <p className="text-zinc-400 mt-2 max-w-lg">
              Дрифт-подготовка и комплексные daily-проекты — строим, документируем, показываем.
            </p>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-[#39FF14] transition-colors shrink-0"
          >
            Все кейсы
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Карточки */}
        <div className="grid sm:grid-cols-2 gap-6">
          {PROJECT_CARS.map((car) => (
            <Link
              key={car.slug}
              href={car.href}
              className="group relative rounded-2xl overflow-hidden border border-white/8 hover:border-[#39FF14]/30 transition-colors bg-[#09090b]"
            >
              {/* Обложка */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={car.coverImage}
                  alt={car.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width:640px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/30 to-transparent" />

                {/* Тег */}
                <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold border ${car.tagColor}`}>
                  {car.tag}
                </span>
              </div>

              {/* Контент */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg leading-snug mb-1 group-hover:text-[#39FF14] transition-colors">
                  {car.title}
                </h3>
                <p className="text-zinc-500 text-sm mb-4">{car.subtitle}</p>

                {/* Метрики */}
                <div className="flex items-center gap-4 mb-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Wrench className="size-3 text-[#39FF14]" />
                    {car.engine}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Gauge className="size-3 text-[#39FF14]" />
                    {car.power}
                  </span>
                </div>

                {/* Теги сервисов */}
                <div className="flex flex-wrap gap-1.5">
                  {car.services.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-zinc-400 border border-white/8"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA строка */}
        <p className="text-center text-zinc-500 text-sm mt-8">
          Хотите такой же результат?{' '}
          <a href="https://t.me/hptuning_spb" target="_blank" rel="noopener noreferrer"
            className="text-[#39FF14] hover:underline">
            Напишите нам в Telegram
          </a>{' '}
          или позвоните{' '}
          <a href="tel:+79818428151" className="text-[#39FF14] hover:underline">
            +7 (981) 842-81-51
          </a>
        </p>
      </div>
    </section>
  );
}
