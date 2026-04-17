import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle, AlertTriangle, ArrowRight, Phone } from 'lucide-react';
import brands from '@/data/brands.json';
import { BookingButton } from '@/components/ui/BookingButton';


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
    },
  };
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = brands.find((b) => b.slug === params.brand);
  if (!brand) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
      { '@type': 'ListItem', position: 2, name: 'Бренды', item: 'https://hptuning.ru/brands' },
      { '@type': 'ListItem', position: 3, name: brand.name, item: `https://hptuning.ru/brands/${brand.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="section container">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-subtle mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
          <span className="mx-2">→</span>
          <Link href="/brands" className="hover:text-accent transition-colors">Бренды</Link>
          <span className="mx-2">→</span>
          <span className="text-text-muted">{brand.name}</span>
        </nav>

        {/* Hero */}
        <div className="flex flex-col lg:flex-row gap-10 items-start mb-16">
          <div className="flex-1">
            {/* Brand hero image — кладём в public/images/brands/{slug}/hero.webp */}
            <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 bg-bg-elevated">
              <Image
                src={`/images/brands/${brand.slug}/hero.webp`}
                alt={`${brand.name} — чип-тюнинг в СПб | HP Тюнинг`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {/* Fallback-плашка пока нет фото */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold"
                  style={{ backgroundColor: `${brand.color}20`, color: brand.color }}>
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
            <span className="badge mb-4">Чип-тюнинг в СПб</span>
            <h1 className="section-title text-4xl md:text-6xl mb-4">
              ЧИП-ТЮНИНГ<br />
              <span className="text-accent glow-accent">{brand.name.toUpperCase()}</span>
            </h1>
            <p className="text-text-muted text-lg mb-8 max-w-xl">{brand.description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <BookingButton label={`Записать ${brand.name}`} serviceHint={brand.name} />
              <a href="tel:+79818428151" className="btn-secondary text-base px-8 py-4">
                <Phone className="size-4" />
                Позвонить
              </a>
            </div>
          </div>
          <div className="lg:w-80 shrink-0">
            <div className="card">
              <div className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Стоимость тюнинга</div>
              <div className="text-3xl font-display text-text mb-1">
                от {brand.priceFrom.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-text-subtle text-sm mb-4">Stage 1 · 2-3 часа</div>
              <div className="flex flex-col gap-2 text-sm text-text-muted">
                <div className="flex items-center gap-2"><CheckCircle className="size-4 text-accent" /> Гарантия 1 год</div>
                <div className="flex items-center gap-2"><CheckCircle className="size-4 text-accent" /> Дилерское оборудование</div>
                <div className="flex items-center gap-2"><CheckCircle className="size-4 text-accent" /> Откат к стоку бесплатно</div>
              </div>
            </div>
          </div>
        </div>

        {/* Серии / модели */}
        {brand.series && brand.series.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-6">
              МОДЕЛИ {brand.name.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brand.series.map((s) => (
                <Link key={s.slug} href={`/brands/${brand.slug}/${s.slug}`}
                  className="card flex items-center justify-between group hover:border-accent-dim">
                  <div>
                    <div className="text-text font-medium group-hover:text-accent transition-colors">{s.name}</div>
                    {'years' in s && <div className="text-text-subtle text-xs mt-0.5">{s.years}</div>}
                    <div className="text-accent text-sm mt-1">от {s.priceFrom.toLocaleString('ru-RU')} ₽</div>
                  </div>
                  <ArrowRight className="size-4 text-text-subtle group-hover:text-accent transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Типичные проблемы */}
        {brand.typicalProblems && brand.typicalProblems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="size-6 text-accent" />
                ТИПИЧНЫЕ ПРОБЛЕМЫ
              </h2>
              <ul className="flex flex-col gap-3">
                {brand.typicalProblems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                    <span className="text-accent font-bold mt-0.5">—</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            {brand.whatWeDo && (
              <div>
                <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle className="size-6 text-accent" />
                  ЧТО МЫ ДЕЛАЕМ
                </h2>
                <ul className="flex flex-col gap-3">
                  {brand.whatWeDo.map((w, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                      <CheckCircle className="size-4 text-accent shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="card border-accent-dim text-center p-10 glow-box">
          <h3 className="font-display text-3xl text-text uppercase tracking-wider mb-3">
            ЗАПИСАТЬ {brand.name.toUpperCase()} НА ТЮНИНГ
          </h3>
          <p className="text-text-muted mb-6">Ответим в течение 15 минут и подберём удобное время.</p>
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
