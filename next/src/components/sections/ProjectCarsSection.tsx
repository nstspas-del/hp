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
    slug: 'dodge-challenger-ta-hemi',
    tag: 'Daily-Muscle',
    tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    title: 'Dodge Challenger T/A 5.7 HEMI — daily-muscle build',
    subtitle: 'Kooks Long Tube, Texas Speed Stage 2, Flex Fuel, Body Look Hellcat, XGLOW',
    engine: '5.7 HEMI V8',
    power: 'Stage 2',
    services: ['Тюнинг мотора', 'Body Look', 'Выхлоп', 'Подсветка'],
    coverImage: '/images/projects/dodge-challenger-ta/02-outdoor-sunset-halo.jpg',
    href: '/projects/dodge-challenger-ta-hemi',
  },
  // BMW X5 G05 удалён 2026-05-19 — фейковый кейс без реальных фото
];

export function ProjectCarsSection() {
  return (
    <section className="py-10 md:py-14 bg-[#111113] border-t border-white/5">
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
            href="/blog?cat=projects"
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
              {/* Обложка — позиция 50% 60% чтобы фары/морда машины не обрезались */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                <Image
                  src={car.coverImage}
                  alt={car.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: '50% 60%' }}
                  sizes="(max-width:640px) 100vw, 50vw"
                  loading="lazy"
                />
                {/* Лёгкий градиент ТОЛЬКО снизу (был «via-[#09090b]/30» — закрывал центр) */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#09090b] to-transparent" />

                {/* Тег */}
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${car.tagColor}`}>
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
          <a href="https://t.me/hptuningspb" target="_blank" rel="noopener noreferrer"
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
