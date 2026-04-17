import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { WorkCard } from '@/components/ui/WorkCard';

export const metadata: Metadata = {
  title: 'Наши работы — портфолио чип-тюнинга и детейлинга | HP Тюнинг СПб',
  description: 'Портфолио HP Тюнинг: чип-тюнинг Stage 1/2/3 BMW, Mercedes, Audi, Porsche — замеры до/после. PPF XPEL, керамика Gyeon, полировка. Реальные кейсы из Санкт-Петербурга.',
  keywords: ['портфолио тюнинг спб', 'кейсы чип тюнинг', 'работы hp тюнинг', 'детейлинг до после спб'],
  alternates: { canonical: 'https://hptuning.ru/works' },
  openGraph: {
    title: 'Портфолио HP Тюнинг — результаты тюнинга и детейлинга',
    description: 'Портфолио HP Тюнинг: чип-тюнинг Stage 1/2/3 BMW, Mercedes, Audi, Porsche — замеры до/после. PPF XPEL, керамика Gyeon, полировка. Реальные кейсы из Сан',
    url: 'https://hptuning.ru/works',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/works.jpg', width: 1200, height: 630, alt: 'Портфолио HP Тюнинг — результаты тюнинга и детейлинга' }],
  },
};

const WORKS = [
  {
    id: 1, brand: 'BMW', model: 'M3 F80', service: 'Stage 2', slug: 'bmw',
    hp_before: 431, hp_after: 510, nm_before: 550, nm_after: 680,
    tags: ['Чип-тюнинг', 'Stage 2'], color: '#1c69d4',
    image: '/images/works/bmw-m3-chip.webp',
  },
  {
    id: 2, brand: 'Mercedes', model: 'C63 AMG W205', service: 'Stage 1', slug: 'mercedes',
    hp_before: 476, hp_after: 530, nm_before: 650, nm_after: 750,
    tags: ['Чип-тюнинг', 'Stage 1'], color: '#2d3748',
    image: '/images/works/mercedes-amg-stage1.webp',
  },
  {
    id: 3, brand: 'Porsche', model: 'Cayenne 3.0T', service: 'Stage 1 + DPF-off', slug: 'porsche',
    hp_before: 340, hp_after: 395, nm_before: 450, nm_after: 540,
    tags: ['Чип-тюнинг', 'DPF-off'], color: '#718096',
    image: '/images/works/porsche-cayenne-chip.webp',
  },
  {
    id: 4, brand: 'Audi', model: 'RS6 C8', service: 'Stage 1', slug: 'audi',
    hp_before: 600, hp_after: 680, nm_before: 800, nm_after: 920,
    tags: ['Чип-тюнинг', 'Stage 1'], color: '#e53e3e',
    image: '/images/works/audi-rs6-stage1.webp',
  },
  {
    id: 5, brand: 'BMW', model: '5er G30 530i', service: 'Ceramic 9H', slug: 'bmw',
    hp_before: 0, hp_after: 0, nm_before: 0, nm_after: 0,
    tags: ['Детейлинг', 'Керамика 9H'], color: '#1c69d4',
    image: '/images/works/bmw-5er-ceramic.webp',
  },
  {
    id: 6, brand: 'Volvo', model: 'XC90 2.0T', service: 'Stage 1', slug: 'volvo',
    hp_before: 249, hp_after: 295, nm_before: 350, nm_after: 430,
    tags: ['Чип-тюнинг', 'Stage 1'], color: '#003057',
    image: '/images/works/volvo-xc90-chip.webp',
  },
  {
    id: 7, brand: 'Land Rover', model: 'Defender 3.0D', service: 'Stage 1 + EGR-off', slug: 'land-rover',
    hp_before: 300, hp_after: 360, nm_before: 650, nm_after: 780,
    tags: ['Чип-тюнинг', 'EGR-off'], color: '#2f4f4f',
    image: '/images/works/land-rover-defender-chip.webp',
  },
  {
    id: 8, brand: 'Mercedes', model: 'GLE 400d', service: 'PPF капот + крылья', slug: 'mercedes',
    hp_before: 0, hp_after: 0, nm_before: 0, nm_after: 0,
    tags: ['Детейлинг', 'PPF'], color: '#2d3748',
    image: '/images/works/mercedes-gle-ppf.webp',
  },
  {
    id: 9, brand: 'BMW', model: 'X5M F95', service: 'Stage 2', slug: 'bmw',
    hp_before: 625, hp_after: 720, nm_before: 750, nm_after: 900,
    tags: ['Чип-тюнинг', 'Stage 2'], color: '#1c69d4',
    image: '/images/works/bmw-x5m-stage2.webp',
  },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
    { '@type': 'ListItem', position: 2, name: 'Наши работы', item: 'https://hptuning.ru/works' },
  ],
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Портфолио HP Тюнинг — чип-тюнинг и детейлинг',
  description: 'Реальные результаты чип-тюнинга и детейлинга от HP Тюнинг в Санкт-Петербурге',
  itemListElement: WORKS.map((w, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${w.brand} ${w.model} — ${w.service}`,
    url: `https://hptuning.ru/brands/${w.slug}`,
  })),
};

export default function WorksPage() {
  return (
    <div className="section container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Хлебные крошки */}
      <nav className="text-sm text-text-subtle mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
        <span className="mx-2">→</span>
        <span className="text-text-muted">Наши работы</span>
      </nav>

      <span className="badge mb-4">Реальные результаты</span>
      <h1 className="section-title mb-4">НАШИ РАБОТЫ</h1>
      <p className="section-subtitle mb-14">
        Чип-тюнинг и детейлинг реальных автомобилей наших клиентов.
        Все замеры подтверждены на мотодинамометре.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {WORKS.map((w) => (
          <WorkCard key={w.id} w={w} />
        ))}
      </div>

      {/* CTA */}
      <div className="card border-accent-dim text-center p-10 glow-box">
        <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">
          ХОЧУ РЕЗУЛЬТАТ КАК У НИХ
        </h2>
        <p className="text-text-muted mb-6">
          Запишитесь — подберём оптимальный вариант именно для вашего авто.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
          <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
            <Phone className="size-4" /> +7 (981) 842-81-51
          </a>
        </div>
      </div>
    </div>
  );
}
