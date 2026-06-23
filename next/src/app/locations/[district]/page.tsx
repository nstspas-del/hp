export const revalidate = 86400;
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Car, Phone, CheckCircle } from 'lucide-react';
import districts from '@/data/districts.json';
import brands from '@/data/brands.json';
import { BookingButton } from '@/components/ui/BookingButton';

type District = (typeof districts)[number];

export function generateStaticParams() {
 return districts.map((d) => ({ district: d.slug }));
}

export function generateMetadata({ params }: { params: { district: string } }): Metadata {
 const d = districts.find((d) => d.slug === params.district) as District | undefined;
 if (!d) return {};

 const title = `Чип-тюнинг ${d.name} — выгодно и быстро | HP Тюнинг СПб`;
 const description = `Чип-тюнинг Stage 1/2/3 и детейлинг для жителей ${d.name}а. ${d.distanceKm ? `${d.distanceKm} км от ${d.name.replace(' район', '')}` : ''}, ${d.drivingTimeMin ? `~${d.drivingTimeMin} минут езды` : ''}. Бесплатная парковка. HP Тюнинг, Порошкино.`;

 return {
 title,
 description,
 alternates: { canonical: `https://hptuning.ru/locations/${params.district}` },
 openGraph: {
 title,
 description,
 url: `https://hptuning.ru/locations/${params.district}`,
 images: [{ url: 'https://hptuning.ru/images/og/locations.jpg', width: 1200, height: 630, alt: 'HP Тюнинг — чип-тюнинг рядом с вами в СПб' }],
 },
 };
}

export default function DistrictPage({ params }: { params: { district: string } }) {
 const d = districts.find((d) => d.slug === params.district) as District | undefined;
 if (!d) notFound();

 const districtName = d.name.replace(' район', '');
 const districtGen = d.name; // родительный падеж нужен UI, оставим простым

 const breadcrumb = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
 { '@type': 'ListItem', position: 2, name: 'Районы СПб', item: 'https://hptuning.ru/locations' },
 { '@type': 'ListItem', position: 3, name: d.name, item: `https://hptuning.ru/locations/${d.slug}` },
 ],
 };

 const localBusinessSchema = {
 '@context': 'https://schema.org',
 '@type': 'AutoRepair',
 name: 'HP Тюнинг',
 url: 'https://hptuning.ru',
 telephone: '+79818428151',
 address: {
 '@type': 'PostalAddress',
 streetAddress: 'Богородская, 3Б',
 addressLocality: 'Порошкино',
 addressRegion: 'Санкт-Петербург',
 addressCountry: 'RU',
 },
 geo: { '@type': 'GeoCoordinates', latitude: 60.096423, longitude: 30.304163 },
 areaServed: { '@type': 'AdministrativeArea', name: d.name },
 openingHours: 'Mo-Su 10:00-20:00',
 };

 const featuredBrands = brands.filter((b) => b.featured).slice(0, 6);

 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

 <div className="section container">
 {/* Breadcrumb */}
 <nav className="text-sm text-text-subtle mb-8">
 <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
 <span className="mx-2">→</span>
 <Link href="/locations" className="hover:text-accent transition-colors">Районы СПб</Link>
 <span className="mx-2">→</span>
 <span className="text-text-muted">{d.name}</span>
 </nav>

 {/* Hero */}
 <span className="badge mb-4">Чип-тюнинг рядом</span>
 <h1 className="section-title text-4xl md:text-6xl mb-4">
 ЧИП-ТЮНИНГ<br />
 <span className="text-accent glow-accent">{districtName.toUpperCase()}</span>
 </h1>
 <p className="text-text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
 Чип-тюнинг Stage&nbsp;1/2/3, детейлинг и автосервис для жителей {districtGen}а.
 {d.distanceKm && ` Всего ${d.distanceKm} км от вас`} — HP Тюнинг в Порошкино.
 </p>

 {/* Маршрут */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
 {[
 d.distanceKm && { icon: MapPin, label: `${d.distanceKm} км`, sub: 'от района до нас' },
 d.drivingTimeMin && { icon: Car, label: `~${d.drivingTimeMin} мин`, sub: 'на машине по КАД' },
 { icon: Clock, label: '10:00–20:00', sub: 'пн–вс без выходных' },
 { icon: CheckCircle, label: 'Парковка', sub: 'бесплатно, 10+ мест' },
 ].filter(Boolean).map((item, i) => {
 if (!item) return null;
 const Icon = item.icon;
 return (
 <div key={i} className="card text-center">
 <Icon className="size-6 text-accent mx-auto mb-2" />
 <div className="text-text font-semibold text-sm">{item.label}</div>
 <div className="text-text-subtle text-xs mt-0.5">{item.sub}</div>
 </div>
 );
 })}
 </div>

 {/* Как добраться */}
 <section className="mb-14">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
 КАК ДОБРАТЬСЯ ИЗ {d.name.toUpperCase().replace(' РАЙОН', 'ОГО РАЙОНА')}
 </h2>
 <div className="card">
 <div className="flex flex-col gap-3 text-text-muted">
 {d.metro && d.metro.length > 0 && (
 <p><span className="text-text font-medium">На метро + такси:</span>{' '}
 {d.metro.slice(0, 2).join(' или ')} → Яндекс.Такси до «HP Тюнинг, Богородская 3Б»
 </p>
 )}
 <p><span className="text-text font-medium">На машине:</span>{' '}
 КАД → выезд «Горская» → поворот на Порошкино → Богородская 3Б.
 Навигатор: «HP Тюнинг Порошкино» или координаты 60.096423, 30.304163
 </p>
 {d.notes && (
 <p><span className="text-text font-medium">Особенности:</span> {d.notes}</p>
 )}
 </div>
 </div>
 </section>

 {/* Услуги для этого района */}
 <section className="mb-14">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-6">
 ПОПУЛЯРНЫЕ УСЛУГИ ДЛЯ ЖИТЕЛЕЙ {d.name.toUpperCase().replace(' РАЙОН', 'ОГО РАЙОНА')}
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {[
 { name: 'Чип-тюнинг Stage 1', href: '/tuning/chip-tuning/stage-1', price: '24 000 ₽', desc: 'Прирост мощности +20-40 л.с.' },
 { name: 'Чип-тюнинг Stage 2', href: '/tuning/chip-tuning/stage-2', price: '39 000 ₽', desc: 'Серьёзный прирост для продвинутых водителей' },
 { name: 'Керамическое покрытие', href: '/detailing/ceramic', price: '25 000 ₽', desc: 'Защита 9H до 5 лет, гидрофоб' },
 { name: 'Удаление DPF/EGR', href: '/tuning/chip-tuning/dpf-egr-off', price: '15 000 ₽', desc: 'Устранение ошибок, восстановление тяги' },
 { name: 'Химчистка салона', href: '/detailing/dry-cleaning', price: '8 500 ₽', desc: 'Удаление стойких загрязнений и запахов' },
 { name: 'Диагностика', href: '/service/diagnostics', price: '1 500 ₽', desc: 'Считывание всех ошибок ЭБУ' },
 ].map((s) => (
 <Link key={s.href} href={s.href} className="card group hover:border-accent-dim flex flex-col gap-2">
 <div className="text-text font-medium group-hover:text-accent transition-colors">{s.name}</div>
 <div className="text-text-subtle text-xs leading-relaxed">{s.desc}</div>
 <div className="text-accent font-bold text-sm mt-auto pt-2 border-t border-border">от {s.price}</div>
 </Link>
 ))}
 </div>
 </section>

 {/* Бренды */}
 <section className="mb-14">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-6">
 МАРКИ АВТОМОБИЛЕЙ
 </h2>
 <div className="flex flex-wrap gap-3">
 {featuredBrands.map((b) => (
 <Link key={b.slug} href={`/brands/${b.slug}`}
 className="px-4 py-2 rounded-full border border-border hover:border-accent-dim text-text-muted hover:text-accent transition-all text-sm font-medium">
 {b.name}
 </Link>
 ))}
 <Link href="/brands" className="px-4 py-2 rounded-full border border-accent-dim text-accent text-sm font-medium hover:bg-accent/10 transition-all">
 Все марки →
 </Link>
 </div>
 </section>

 {/* CTA */}
 <div className="card border-accent-dim text-center p-10 glow-box">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">
 ЗАПИСАТЬСЯ ИЗ {districtName.toUpperCase()}А
 </h2>
 <p className="text-text-muted mb-6">
 Запишитесь онлайн — ответим за 15 минут и уточним удобное время.
 </p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
 <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
 <Phone className="size-4" /> +7 (981) 842-81-51
 </a>
 </div>
 </div>
 </div>
 </>
 );
}
