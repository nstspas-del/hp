import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import brands from '@/data/brands.json';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
 title: 'Чип-тюнинг и детейлинг для BMW, Mercedes, Audi, Porsche, Land Rover в СПб | HP Тюнинг',
 description: 'Специализируемся на 13 премиальных брендах: BMW, Mercedes-Benz, Audi, Porsche, Lexus, Land Rover, Volvo, VW, Jaguar, Genesis, Toyota, KIA, Nissan. Чип-тюнинг и детейлинг в СПб.',
 keywords: ['чип тюнинг бренды спб', 'тюнинг bmw mercedes audi', 'автосервис премиум спб'],
 alternates: { canonical: 'https://hptuning.ru/brands' },
 openGraph: {
 title: 'Чип-тюнинг и детейлинг 32+ марок в СПб | HP Тюнинг',
 description: 'BMW, Mercedes, Audi, Porsche, Land Rover, Lexus — глубокая специализация на каждом бренде. Чип-тюнинг, детейлинг, автосервис.',
 url: 'https://hptuning.ru/brands',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/brands.jpg', width: 1200, height: 630, alt: 'Бренды HP Тюнинг' }],
 },
};

const itemListSchema = {
 '@context': 'https://schema.org',
 '@type': 'ItemList',
 name: 'Бренды HP Тюнинг — чип-тюнинг и детейлинг в СПб',
 itemListElement: brands.map((b, i) => ({
 '@type': 'ListItem',
 position: i + 1,
 name: b.name,
 url: `https://hptuning.ru/brands/${b.slug}`,
 })),
};

export default function BrandsPage() {
 const featured = brands.filter((b) => b.featured);
 const rest = brands.filter((b) => !b.featured);

 return (
 <div className="section container">
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

 {/* Breadcrumb */}
 <Breadcrumbs items={[{ label: "Бренды" }]} />

 <h1 className="section-title mb-4">{seoData.pages.brands.h1}</h1>
 <p className="section-subtitle mb-12">{seoData.pages.brands.description}</p>

 <h2 className="font-display text-2xl text-accent uppercase tracking-wider mb-6">Премиум бренды</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
 {featured.map((brand) => (
 <Link key={brand.slug} href={`/brands/${brand.slug}`}
 className="card flex flex-col gap-3 hover:border-accent-dim group">
 <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-display font-bold"
 style={{ backgroundColor: `${brand.color}20`, color: brand.color }}>
 {brand.name.slice(0, 2).toUpperCase()}
 </div>
 <div>
 <h3 className="font-display text-xl text-text tracking-wider group-hover:text-accent transition-colors">
 {brand.name}
 </h3>
 <p className="text-text-subtle text-xs mt-1">{brand.description}</p>
 </div>
 <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
 <span className="text-accent text-sm font-semibold">
 от {brand.priceFrom.toLocaleString('ru-RU')} ₽
 </span>
 <ArrowRight className="size-4 text-text-subtle group-hover:text-accent transition-colors" />
 </div>
 </Link>
 ))}
 </div>

 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-6">Все марки</h2>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
 {rest.map((brand) => (
 <Link key={brand.slug} href={`/brands/${brand.slug}`}
 className="card flex items-center gap-3 hover:border-accent-dim group">
 <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-display font-bold shrink-0"
 style={{ backgroundColor: `${brand.color ?? '#39FF14'}20`, color: brand.color ?? '#39FF14' }}>
 {brand.name.slice(0, 2).toUpperCase()}
 </div>
 <div>
 <div className="text-text text-sm font-medium group-hover:text-accent transition-colors">{brand.name}</div>
 <div className="text-text-subtle text-xs">от {brand.priceFrom.toLocaleString('ru-RU')} ₽</div>
 </div>
 </Link>
 ))}
 </div>
 </div>
 );
}
