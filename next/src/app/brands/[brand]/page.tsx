/**
 * /brands/[brand]/page.tsx — HP Тюнинг
 *
 * Два режима работы:
 *  1. Субдомен bmw.hptuning.ru → middleware делает rewrite сюда.
 *     x-brand-slug header = 'bmw'
 *     Canonical = https://bmw.hptuning.ru/
 *
 *  2. Прямой URL hptuning.ru/brands/bmw → middleware делает 301 на субдомен.
 *     Эта страница больше не рендерится напрямую для субдоменных брендов.
 *     Для остальных брендов (не в BRAND_SUBDOMAIN_MAP) — рендерится как раньше.
 */
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle, AlertTriangle, Phone, Zap, Sparkles, Wrench } from 'lucide-react';
import brands from '@/data/brands.json';
import { BookingButton } from '@/components/ui/BookingButton';
import {
  getBrandFromHeaders,
  getBrandFromHost,
  getBrandCanonical,
  getBrandUrl,
  BRAND_SUBDOMAIN_MAP,
} from '@/lib/brand-host';

// Dynamic — нужен чтобы читать x-brand-slug из request headers
export const dynamic = 'force-dynamic';

/** Allowlist брендовых slug-ов — только эти значения принимаются от middleware */
const ALLOWED_BRANDS = new Set([
  'bmw', 'mercedes', 'audi', 'porsche', 'volkswagen',
  'toyota', 'lexus', 'landrover',
]);

/* ── Маппинг фото брендов ── */
const BRAND_PHOTOS: Record<string, string> = {
  bmw:        '/images/works/10-bmw-x5-neon-workshop.jpg',
  mercedes:   '/images/works/11-mercedes-s-class-black-front.jpg',
  audi:       '/images/works/subaru-wrx-lift.jpg',
  porsche:    '/images/works/01-porsche-cayman-pink-lift.jpg',
  volkswagen: '/images/works/subaru-wrx-lift.jpg',
  land_rover: '/images/works/05-mercedes-gle-coupe-dark-blue.jpg',
  landrover:  '/images/works/05-mercedes-gle-coupe-dark-blue.jpg',
  volvo:      '/images/works/02-underbody-exhaust-work.jpg',
  lexus:      '/images/works/06-mercedes-cls-yellow-amg.jpg',
  jaguar:     '/images/works/06-mercedes-cls-yellow-amg.jpg',
  toyota:     '/images/works/15-mercedes-cls-orange-lift.jpg',
  kia:        '/images/works/subaru-wrx-lift.jpg',
  nissan:     '/images/works/17-subaru-wrx-sti-exhaust.jpg',
  genesis:    '/images/works/15-mercedes-cls-orange-lift.jpg',
};
const DEFAULT_PHOTO = '/images/works/mercedes-amg-orange-lift.jpg';

export function generateStaticParams() {
  // Генерируем только НЕ-субдоменные бренды статически.
  // Субдоменные бренды рендерятся динамически (force-dynamic).
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Promise<Metadata> {
  try {
    // Валидация param — защита от подделки
    if (!params.brand || typeof params.brand !== 'string') return {};

    const brand = brands.find((b) => b.slug === params.brand);
    if (!brand) return {};

    // Читаем host из headers — установлен middleware.
    // headers() работает только в Server Components / route handlers.
    const headersList = await headers();

    // Приоритет: x-brand-slug (установлен middleware) → host → params.brand
    const slugFromHeader = getBrandFromHeaders(headersList);
    const hostHeader = headersList.get('host') ?? '';
    const slugFromHost = getBrandFromHost(hostHeader);

    // Берём slug из middleware-заголовка или из Host, валидируем по allowlist
    const rawSlug = slugFromHeader ?? slugFromHost ?? params.brand;
    const isSubdomain = ALLOWED_BRANDS.has(rawSlug) &&
                        Object.values(BRAND_SUBDOMAIN_MAP).includes(rawSlug);
    const brandSlug = isSubdomain ? rawSlug : params.brand;

    // Canonical: субдомен → https://bmw.hptuning.ru/, иначе → legacy path
    const canonicalUrl = isSubdomain
      ? getBrandCanonical(brandSlug, '/')
      : `https://hptuning.ru/brands/${brand.slug}`;

    const ogUrl = isSubdomain
      ? getBrandUrl(brandSlug)
      : `https://hptuning.ru/brands/${brand.slug}`;

    const title = brand.seo?.title ?? `Чип-тюнинг ${brand.name} в СПб | HP Тюнинг`;
    const description = brand.seo?.description ?? brand.description;

    return {
      title,
      description,
      keywords: brand.seo?.keywords,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: ogUrl,
        type: 'website',
        locale: 'ru_RU',
        siteName: 'HP Тюнинг',
        images: [
          {
            url: 'https://hptuning.ru/images/og/chip-tuning.jpg',
            width: 1200,
            height: 630,
            alt: `Чип-тюнинг ${brand.name} в СПб | HP Тюнинг`,
          },
        ],
      },
    };
  } catch {
    return {};
  }
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  // Валидация param
  if (!params.brand || typeof params.brand !== 'string') notFound();

  let brand;
  try {
    brand = brands.find((b) => b.slug === params.brand);
  } catch {
    notFound();
  }
  if (!brand) notFound();

  // Читаем из headers (установил middleware)
  let brandSlug: string;
  let isSubdomain: boolean;
  try {
    const headersList = await headers();
    const slugFromHeader = getBrandFromHeaders(headersList);
    const hostHeader = headersList.get('host') ?? '';
    const slugFromHost = getBrandFromHost(hostHeader);
    const rawSlug = slugFromHeader ?? slugFromHost ?? params.brand;
    isSubdomain = ALLOWED_BRANDS.has(rawSlug) &&
                  Object.values(BRAND_SUBDOMAIN_MAP).includes(rawSlug);
    brandSlug = isSubdomain ? rawSlug : params.brand;
  } catch {
    brandSlug = params.brand;
    isSubdomain = false;
  }

  const heroPhoto = BRAND_PHOTOS[brand.slug] ?? DEFAULT_PHOTO;

  // Canonical URL для schema.org
  const pageUrl = isSubdomain
    ? getBrandCanonical(brandSlug, '/')
    : `https://hptuning.ru/brands/${brand.slug}`;

  const mainSiteUrl = 'https://hptuning.ru';

  // Хлебные крошки — для субдомена корень = сам субдомен
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: isSubdomain
      ? [
          { '@type': 'ListItem', position: 1, name: 'HP Тюнинг', item: mainSiteUrl },
          { '@type': 'ListItem', position: 2, name: brand.name, item: pageUrl },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: mainSiteUrl },
          { '@type': 'ListItem', position: 2, name: 'Бренды', item: `${mainSiteUrl}/brands` },
          { '@type': 'ListItem', position: 3, name: brand.name, item: pageUrl },
        ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Чип-тюнинг ${brand.name} в Санкт-Петербурге`,
    url: pageUrl,
    provider: {
      '@type': 'AutoRepair',
      name: 'HP Тюнинг',
      url: mainSiteUrl,
      telephone: '+79818428151',
    },
    areaServed: 'Санкт-Петербург',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: brand.priceFrom,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: brand.priceFrom,
        priceCurrency: 'RUB',
      },
    },
  };

  // Ссылки навигации — на субдомене ведём обратно на основной сайт
  const homeHref  = isSubdomain ? mainSiteUrl : '/';
  const brandsHref = isSubdomain ? `${mainSiteUrl}/brands` : '/brands';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

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
            <a href={homeHref} className="hover:text-[#39FF14] transition-colors">
              Главная
            </a>
            {!isSubdomain && (
              <>
                <span className="mx-2">→</span>
                <Link href={brandsHref} className="hover:text-[#39FF14] transition-colors">
                  Бренды
                </Link>
              </>
            )}
            <span className="mx-2">→</span>
            <span className="text-zinc-300">{brand.name}</span>
          </nav>
          <span className="inline-block px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-3">
            Автосервис СПб
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
            {brand.name}
            <span
              className="text-[#39FF14]"
              style={{ textShadow: '0 0 30px rgba(57,255,20,0.5)' }}
            >
              {' '}в HP Тюнинг
            </span>
          </h1>
          <p className="text-zinc-400 text-lg mt-3 max-w-xl">{brand.description}</p>
        </div>
      </section>

      {/* ── Основной контент ── */}
      <div className="container py-12">

        {/* Быстрый выбор услуги */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {[
            {
              icon: Wrench,
              color: '#a78bfa',
              bg: 'bg-violet-500/8 border-violet-500/20',
              title: 'Техобслуживание',
              desc: 'ТО, диагностика, ремонт двигателя и подвески',
              price: 'от 1 500 ₽',
              href: isSubdomain ? `${mainSiteUrl}/service` : '/service',
            },
            {
              icon: Zap,
              color: '#39FF14',
              bg: 'bg-[#39FF14]/8 border-[#39FF14]/20',
              title: 'Тюнинг',
              desc: 'Чип Stage 1/2/3, EGR/DPF off, выхлоп',
              price: `от ${brand.priceFrom.toLocaleString('ru-RU')} ₽`,
              href: isSubdomain ? `${mainSiteUrl}/tuning/chip-tuning` : '/tuning/chip-tuning',
            },
            {
              icon: Sparkles,
              color: '#38bdf8',
              bg: 'bg-sky-500/8 border-sky-500/20',
              title: 'Детейлинг',
              desc: 'Керамика 9H, PPF плёнка, химчистка, полировка',
              price: 'от 6 000 ₽',
              href: isSubdomain ? `${mainSiteUrl}/detailing` : '/detailing',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={`flex items-start gap-4 p-5 rounded-2xl border ${card.bg} hover:scale-[1.01] transition-transform`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="size-5" style={{ color: card.color }} />
              </div>
              <div>
                <div className="text-white font-semibold">{card.title}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{card.desc}</div>
                <div className="text-xs font-bold mt-2" style={{ color: card.color }}>
                  {card.price}
                </div>
              </div>
            </a>
          ))}
        </div>

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
            <BookingButton
              label="Записаться онлайн"
              serviceHint={brand.name}
              className="btn-primary text-base px-10 py-4"
            />
            <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
              <Phone className="size-4" /> +7 (981) 842-81-51
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
