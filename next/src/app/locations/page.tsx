export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { MapPin, ArrowRight, Clock, Car } from 'lucide-react';
import districts from '@/data/districts.json';

export const metadata: Metadata = {
 title: 'Чип-тюнинг по районам Санкт-Петербурга — HP Тюнинг рядом',
 description: 'Добраться в HP Тюнинг из любого района СПб: Приморского, Выборгского, Калининского, Невского, Московского и других. Ул. Богородская 3Б, Порошкино. Бесплатная парковка.',
 keywords: ['чип тюнинг рядом спб', 'тюнинг по районам петербург', 'автосервис порошкино', 'чип тюнинг приморский район'],
 alternates: { canonical: 'https://hptuning.ru/locations' },
 openGraph: {
 title: 'HP Тюнинг — удобно из любого района СПб',
 description: 'Добраться в HP Тюнинг из любого района СПб: Приморского, Выборгского, Калининского, Невского, Московского и других. Ул. Богородская 3Б, Порошкино. Бес',
 url: 'https://hptuning.ru/locations',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/locations.jpg', width: 1200, height: 630, alt: 'HP Тюнинг — удобно из любого района СПб' }],
 },
};

export default function LocationsPage() {
 const sorted = [...districts].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));

 return (
 <div className="section container">
<Breadcrumbs items={[{ label: "Районы доставки" }]} />

 <span className="badge mb-4">Все районы Санкт-Петербурга</span>
 <h1 className="section-title mb-4">ДОБЕРЁМСЯ ИЗ ЛЮБОГО РАЙОНА</h1>
 <p className="section-subtitle mb-6">
 HP Тюнинг находится в Порошкино — 5 минут от КАД, бесплатная парковка.
 Удобно добираться из всех районов СПб и области.
 </p>

 {/* Ключевые факты */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
 {[
 { icon: MapPin, label: 'Богородская, 3Б', sub: 'Порошкино' },
 { icon: Clock, label: 'Пн–Вс 10:00–20:00', sub: 'Без выходных' },
 { icon: Car, label: 'Бесплатная парковка', sub: 'Вместимость 10+ авто' },
 { icon: ArrowRight, label: '5 мин от КАД', sub: 'Выезд Горской' },
 ].map(({ icon: Icon, label, sub }) => (
 <div key={label} className="card text-center">
 <Icon className="size-6 text-accent mx-auto mb-2" />
 <div className="text-text font-semibold text-sm">{label}</div>
 <div className="text-text-subtle text-xs mt-0.5">{sub}</div>
 </div>
 ))}
 </div>

 {/* Список районов */}
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-6">ВЫБЕРИТЕ ВАШ РАЙОН</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {sorted.map((d) => (
 <Link key={d.slug} href={`/locations/${d.slug}`}
 className="card group hover:border-accent-dim flex items-center justify-between gap-4">
 <div className="flex-1">
 <div className="text-text font-medium group-hover:text-accent transition-colors">{d.name}</div>
 <div className="flex items-center gap-3 mt-1 text-text-subtle text-xs">
 {d.distanceKm && <span>{d.distanceKm} км</span>}
 {d.drivingTimeMin && <span>~{d.drivingTimeMin} мин</span>}
 {d.metro && d.metro[0] && <span>м. {d.metro[0]}</span>}
 </div>
 </div>
 <ArrowRight className="size-4 text-text-subtle group-hover:text-accent transition-colors shrink-0" />
 </Link>
 ))}
 </div>

 {/* CTA */}
 <div className="card border-accent-dim text-center p-10 glow-box mt-14">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">
 ПРИЕДЕМ К ВАМ?
 </h2>
 <p className="text-text-muted mb-6">
 Если сложно доехать — узнайте о выездной диагностике. Или закажите трансфер.
 </p>
 <a href="tel:+79818428151" className="btn-primary text-base px-10 py-4">
 +7 (981) 842-81-51
 </a>
 </div>
 </div>
 );
}
