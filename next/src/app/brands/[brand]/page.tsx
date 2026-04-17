import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle, AlertTriangle, ArrowRight, Phone, Zap, Sparkles, Wrench } from 'lucide-react';
import brands from '@/data/brands.json';
import { BookingButton } from '@/components/ui/BookingButton';

/* ── Маппинг фото брендов к реальным фото ── */
const BRAND_PHOTOS: Record<string, string> = {
  bmw:         '/images/works/10-bmw-x5-neon-workshop.jpg',
  mercedes:    '/images/works/11-mercedes-s-class-black-front.jpg',
  audi:        '/images/works/subaru-wrx-lift.jpg',
  porsche:     '/images/works/01-porsche-cayman-pink-lift.jpg',
  volkswagen:  '/images/works/subaru-wrx-lift.jpg',
  land_rover:  '/images/works/05-mercedes-gle-coupe-dark-blue.jpg',
  volvo:       '/images/works/02-underbody-exhaust-work.jpg',
  lexus:       '/images/works/06-mercedes-cls-yellow-amg.jpg',
  jaguar:      '/images/works/06-mercedes-cls-yellow-amg.jpg',
  toyota:      '/images/works/15-mercedes-cls-orange-lift.jpg',
  kia:         '/images/works/subaru-wrx-lift.jpg',
  nissan:      '/images/works/17-subaru-wrx-sti-exhaust.jpg',
  genesis:     '/images/works/15-mercedes-cls-orange-lift.jpg',
};
const DEFAULT_PHOTO = '/images/works/mercedes-amg-orange-lift.jpg';

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const brand = brands.find((b) => b.slug === params.brand);
  if (!brand) return {};
  return {
    title: brand.seo?.title ?? `Чип-тюнинг ${brand.name} в СПб | HP Тюнинг`,
    description: brand.seo?.description ?? brand.description,
    keywords: brand.seo?.keywords,
    alternates: { canonical: `https://hptuning.ru/brands/${brand.slug}` },
    openGraph: {
      title: brand.seo?.title ?? `Чип-тюнинг ${brand.name} в СПб`,
      description: brand.seo?.description ?? brand.description,
      url: `https://hptuning.ru/brands/${brand.slug}`,
      images: [{ url: 'https://hptuning.ru/images/og/chip-tuning.jpg', width: 1200, height: 630, alt: `Чип-тюнинг ${brand.name} в СПб | HP Тюнинг` }],
    },
  };
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = brands.find((b) => b.slug === params.brand);
  if (!brand) notFound();

  const heroPhoto = BRAND_PHOTOS[brand.slug] ?? DEFAULT_PHOTO;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
      { '@type': 'ListItem', position: 2, name: 'Бренды', item: 'https://hptuning.ru/brands' },
      { '@type': 'ListItem', position: 3, name: brand.name, item: `https://hptuning.ru/brands/${brand.slug}` },
    ],
  };

  // Structured data — Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Чип-тюнинг ${brand.name} в Санкт-Петербурге`,
    provider: {
      '@type': 'AutoRepair',
      name: 'HP Тюнинг',
      url: 'https://hptuning.ru',
      telephone: '+79818428151',
    },
    areaServed: 'Санкт-Петербург',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: brand.priceFrom,
      priceSpecification: { '@type': 'UnitPriceSpecification', price: brand.priceFrom, priceCurrency: 'RUB' },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* ── Hero-секция бренда ── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src={heroPhoto}
          alt={`${brand.name} в HP Тюнинг СПб`}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/70 to-transparent" />

        <div className="relative container pb-10">
          <nav className="text-sm text-zinc-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#39FF14] transition-colors">Главная</Link>
            <span className="mx-2">→</span>
            <Link href="/brands" className="hover:text-[#39FF14] transition-colors">Бренды</Link>
            <span className="mx-2">→</span>
            <span className="text-zinc-300">{brand.name}</span>
          </nav>
          <span className="inline-block px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-3">
            Автосервис СПб
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
            {brand.name}
            <span className="text-[#39FF14]" style={{ textShadow: '0 0 30px rgba(57,255,20,0.5)' }}> в HP Тюнинг</span>
          </h1>
          <p className="text-zinc-400 text-lg mt-3 max-w-xl">{brand.description}</p>
        </div>
      </section>

      {/* ── Основной контент ── */}
      <div className="container py-12">

        {/* Быстрый выбор услуги для этого бренда */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {[
            {
              icon: Zap,
              color: '#39FF14',
              bg: 'bg-[#39FF14]/8 border-[#39FF14]/20',
              title: 'Чип-тюнинг',
              desc: 'Stage 1/2/3, DPF/EGR off, Immo',
              price: `от ${brand.priceFrom.toLocaleString('ru-RU')} ₽`,
              href: `/tuning/chip-tuning#chip-calculator`,
            },
            {
              icon: Sparkles,
              color: '#38bdf8',
              bg: 'bg-sky-500/8 border-sky-500/20',
              title: 'Детейлинг',
              desc: 'Керамика, PPF, химчистка, полировка',
              price: 'от 6 000 ₽',
              href: '/detailing',
            },
            {
              icon: Wrench,
              color: '#a78bfa',
              bg: 'bg-violet-500/8 border-violet-500/20',
              title: 'Техобслуживание',
              desc: 'ТО, диагностика, ремонт',
              price: 'от 1 500 ₽',
              href: '/service',
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`flex items-start gap-4 p-5 rounded-2xl border ${card.bg} hover:scale-[1.01] transition-transform`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="size-5" style={{ color: card.color }} />
              </div>
              <div>
                <div className="text-white font-semibold">{card.title}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{card.desc}</div>
                <div className="text-xs font-bold mt-2" style={{ color: card.color }}>{card.price}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Серии / модели */}
        {brand.series && brand.series.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-6">
              Модели {brand.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brand.series.map((s) => (
                <Link
                  key={s.slug}
                  href={`/brands/${brand.slug}/${s.slug}`}
                  className="group flex items-center justify-between p-4 rounded-xl bg-[#111113] border border-white/8 hover:border-[#39FF14]/30 hover:bg-[#39FF14]/5 transition-all"
                >
                  <div>
                    <div className="text-white text-sm font-medium group-hover:text-[#39FF14] transition-colors">{s.name}</div>
                    {'years' in s && <div className="text-zinc-600 text-xs mt-0.5">{s.years}</div>}
                    <div className="text-[#39FF14] text-sm font-bold mt-1">от {s.priceFrom.toLocaleString('ru-RU')} ₽</div>
                  </div>
                  <ArrowRight className="size-4 text-zinc-600 group-hover:text-[#39FF14] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Типичные проблемы + Что делаем */}
        {brand.typicalProblems && brand.typicalProblems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
            <div className="bg-[#111113] rounded-2xl border border-white/8 p-6">
              <h2 className="flex items-center gap-2 font-display text-xl text-white uppercase tracking-wide mb-5">
                <AlertTriangle className="size-5 text-amber-400" />
                Типичные проблемы {brand.name}
              </h2>
              <ul className="space-y-3">
                {brand.typicalProblems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                    <span className="text-amber-400 font-bold mt-0.5 shrink-0">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {brand.whatWeDo && (
              <div className="bg-[#111113] rounded-2xl border border-white/8 p-6">
                <h2 className="flex items-center gap-2 font-display text-xl text-white uppercase tracking-wide mb-5">
                  <CheckCircle className="size-5 text-[#39FF14]" />
                  Что мы делаем
                </h2>
                <ul className="space-y-3">
                  {brand.whatWeDo.map((w, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                      <CheckCircle className="size-4 text-[#39FF14] shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-[#39FF14]/10 to-transparent border border-[#39FF14]/20 p-8 text-center">
          <h3 className="font-display text-3xl text-white uppercase tracking-wide mb-2">
            Записать {brand.name} на сервис
          </h3>
          <p className="text-zinc-500 mb-6">
            Ответим за 15 минут — выберем время и услугу под ваш автомобиль.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookingButton label="Записаться онлайн" serviceHint={brand.name} className="btn-primary text-base px-10 py-4" />
            <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
              <Phone className="size-4" /> +7 (981) 842-81-51
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
