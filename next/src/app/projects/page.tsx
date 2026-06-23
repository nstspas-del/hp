/**
 * /projects — HP Тюнинг
 * Список всех кейсов / проектов (Layer D)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Проекты и кейсы HP Тюнинг — реальные работы в СПб',
  description:
    'Реальные проекты: чип-тюнинг, детейлинг, сервис премиальных автомобилей в Санкт-Петербурге. BMW, Mercedes, Audi, Porsche, Land Rover — фото, видео, результаты.',
  alternates: { canonical: 'https://hptuning.ru/projects/' },
};

// Временный список проектов — подключить projects.json при росте
const PROJECTS_PREVIEW = [
  {
    slug: 'bmw-x5-g05-chiptuning-stage2',
    title: 'BMW X5 G05 — чип-тюнинг Stage 2: 340 → 440 л.с.',
    brandName: 'BMW',
    model: 'X5 G05',
    services: ['Чип-тюнинг', 'Stage 2'],
    coverImage: '/images/works/10-bmw-x5-neon-workshop.jpg',
    result: 'Мощность +100 л.с., момент +130 Нм, 0–100 за 4.4 с.',
    createdAt: '2025-10-12',
  },
];

export default function ProjectsPage() {
  return (
    <div className="container py-16">
      <nav className="text-xs text-zinc-500 mb-6 flex items-center gap-1" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#39FF14] transition-colors">Главная</Link>
        <ChevronRight className="size-3" />
        <span className="text-zinc-300">Проекты</span>
      </nav>

      <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white mb-3">
        Проекты <span className="text-[#39FF14]">HP Тюнинг</span>
      </h1>
      <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
        Реальные кейсы нашей мастерской в Санкт-Петербурге: чип-тюнинг, детейлинг,
        сервис BMW, Mercedes, Audi, Porsche и Land Rover.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROJECTS_PREVIEW.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group rounded-2xl border border-white/8 bg-[#111113] overflow-hidden hover:border-[#39FF14]/30 transition-colors"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.services.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-[#39FF14] transition-colors">
                {p.title}
              </h2>
              <p className="text-zinc-500 text-xs leading-relaxed">{p.result}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
