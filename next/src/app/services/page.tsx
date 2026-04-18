import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight, Zap, Sparkles, Wrench } from 'lucide-react';
import services from '@/data/services.json';

export const metadata: Metadata = {
 title: 'Услуги чип-тюнинга и детейлинга в СПб | HP Тюнинг',
 description: 'Полный спектр услуг: чип-тюнинг Stage 1/2/3, керамика 9H, PPF плёнка, химчистка, ТО. Порошкино, СПб. Цены от 3 000 ₽.',
 alternates: { canonical: 'https://hptuning.ru/services' },
 openGraph: {
 title: 'Услуги HP Тюнинг — чип-тюнинг, детейлинг, автосервис в СПб',
 description: 'Чип-тюнинг Stage 1/2/3, детейлинг, автосервис. Цены, сроки, подробности.',
 url: 'https://hptuning.ru/services',
 images: [{ url: 'https://hptuning.ru/images/og/home.jpg', width: 1200, height: 630, alt: 'Услуги HP Тюнинг — чип-тюнинг, детейлинг, автосервис' }],
 },
};

const CAT_META = {
 'chip-tuning': { icon: Zap, label: 'Чип-тюнинг', color: '#39FF14', desc: 'Прошивка ЭБУ для роста мощности и тяги. Stage 1, 2, 3 и спецоперации.' },
 'detailing': { icon: Sparkles, label: 'Детейлинг', color: '#60a5fa', desc: 'Защита кузова, химчистка, полировка. Керамика 9H и PPF плёнка.' },
 'service': { icon: Wrench, label: 'Автосервис', color: '#f97316', desc: 'ТО, диагностика, тормоза, подвеска, ДВС и АКПП.' },
} as const;

const CAT_SLUGS = ['chip-tuning', 'detailing', 'service'] as const;

const breadcrumb = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
 { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://hptuning.ru/services' },
 ],
};

export default function ServicesPage() {
 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

 <div className="section container">
 <Breadcrumbs items={[{ label: "Услуги" }]} />

 <span className="badge mb-4">Прайс HP Тюнинг СПб</span>
 <h1 className="section-title mb-4">УСЛУГИ И ЦЕНЫ</h1>
 <p className="section-subtitle mb-14">
 Чип-тюнинг, детейлинг и автосервис в одном месте. Все цены указаны от — точная стоимость
 после консультации и диагностики.
 </p>

 {services.categories.map((cat) => {
 const meta = CAT_META[cat.slug as keyof typeof CAT_META];
 const Icon = meta?.icon ?? Wrench;
 return (
 <section key={cat.slug} className="mb-16">
 <div className="flex items-center gap-4 mb-8">
 <div className="w-12 h-12 rounded-xl flex items-center justify-center"
 style={{ backgroundColor: `${meta?.color ?? '#39FF14'}20` }}>
 <Icon className="size-6" style={{ color: meta?.color ?? '#39FF14' }} />
 </div>
 <div>
 <h2 className="font-display text-3xl text-text uppercase tracking-wider">{cat.name}</h2>
 <p className="text-text-subtle text-sm mt-0.5">{meta?.desc}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {cat.items.map((item) => (
 <Link
 key={item.slug}
 href={`/services/${cat.slug}/${item.slug}`}
 className="card group hover:border-accent-dim flex flex-col gap-3"
 >
 <div className="flex items-start justify-between gap-2">
 <h3 className="text-text font-semibold group-hover:text-accent transition-colors leading-snug">
 {item.name}
 </h3>
 <ArrowRight className="size-4 text-text-subtle group-hover:text-accent transition-colors shrink-0 mt-0.5" />
 </div>
 {item.shortDescription && (
 <p className="text-text-subtle text-sm leading-relaxed line-clamp-2">{item.shortDescription}</p>
 )}
 <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
 <span className="text-accent font-bold text-sm">
 от {item.priceFrom.toLocaleString('ru-RU')} ₽
 </span>
 {item.duration && (
 <span className="text-text-subtle text-xs">{item.duration}</span>
 )}
 </div>
 </Link>
 ))}
 </div>
 </section>
 );
 })}

 {/* CTA */}
 <div className="card border-accent-dim text-center p-10 glow-box mt-8">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">
 НЕ НАШЛИ НУЖНУЮ УСЛУГУ?
 </h2>
 <p className="text-text-muted mb-6">Позвоните — расскажем о всех возможностях вашего авто.</p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <a href="tel:+79818428151" className="btn-primary text-base px-10 py-4">
 +7 (981) 842-81-51
 </a>
 <Link href="/contacts" className="btn-secondary text-base px-10 py-4">
 Написать в Telegram
 </Link>
 </div>
 </div>
 </div>
 </>
 );
}
