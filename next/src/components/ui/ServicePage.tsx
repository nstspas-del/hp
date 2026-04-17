import Link from 'next/link';
import { CheckCircle, Phone, Clock, ChevronDown } from 'lucide-react';
import { BookingButton } from './BookingButton';
import { SERVICE_CONTENT, getCategoryLabel } from '@/lib/services';

interface ServiceItem {
  slug: string;
  name: string;
  shortDescription?: string;
  priceFrom: number;
  duration?: string;
}

interface Props {
  catSlug: string;
  service: ServiceItem;
}

export function ServicePage({ catSlug, service }: Props) {
  const key = `${catSlug}/${service.slug}`;
  const content = SERVICE_CONTENT[key];
  const catLabel = getCategoryLabel(catSlug);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
      { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://hptuning.ru/services' },
      { '@type': 'ListItem', position: 3, name: catLabel, item: `https://hptuning.ru/services/${catSlug}` },
      { '@type': 'ListItem', position: 4, name: service.name, item: `https://hptuning.ru/services/${catSlug}/${service.slug}` },
    ],
  };

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    provider: {
      '@type': 'AutoRepair',
      name: 'HP Тюнинг',
      url: 'https://hptuning.ru',
      telephone: '+79818428151',
    },
    offers: {
      '@type': 'Offer',
      price: service.priceFrom,
      priceCurrency: 'RUB',
      priceValidUntil: '2026-12-31',
    },
    areaServed: { '@type': 'City', name: 'Санкт-Петербург' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }} />

      <div className="section container">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-subtle mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
          <span className="mx-2">→</span>
          <Link href="/services" className="hover:text-accent transition-colors">Услуги</Link>
          <span className="mx-2">→</span>
          <Link href={`/services/${catSlug}`} className="hover:text-accent transition-colors">{catLabel}</Link>
          <span className="mx-2">→</span>
          <span className="text-text-muted">{service.name}</span>
        </nav>

        {/* Hero блок */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2">
            <span className="badge mb-4">{catLabel}</span>
            <h1 className="section-title text-4xl md:text-5xl mb-4">{service.name.toUpperCase()}</h1>
            {content?.tagline && (
              <p className="text-text-muted text-lg md:text-xl mb-6 max-w-xl leading-relaxed">
                {content.tagline}
              </p>
            )}
            {service.shortDescription && (
              <p className="text-text-subtle text-base leading-relaxed mb-8">{service.shortDescription}</p>
            )}

            {/* Преимущества */}
            {content?.benefits && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {content.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                    <CheckCircle className="size-4 text-accent shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Сайдбар с ценой */}
          <aside className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="text-accent font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
              <div className="font-display text-4xl text-text mb-1">
                от {service.priceFrom.toLocaleString('ru-RU')} ₽
              </div>
              {service.duration && (
                <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
                  <Clock className="size-3.5" />
                  {service.duration}
                </div>
              )}
              <BookingButton
                label="Записаться онлайн"
                serviceHint={service.name}
                className="btn-primary w-full justify-center mb-3"
              />
              <a href="tel:+79818428151" className="btn-secondary w-full justify-center">
                <Phone className="size-4" />
                +7 (981) 842-81-51
              </a>
              <p className="text-text-subtle text-xs text-center mt-4">
                Ответим в течение 15 минут
              </p>
            </div>
          </aside>
        </div>

        {/* Этапы работы */}
        {content?.stages && (
          <section className="mb-16">
            <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">КАК МЫ РАБОТАЕМ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.stages.map((stage, i) => (
                <div key={i} className="card">
                  <div className="font-display text-3xl text-accent-dim mb-3">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="font-semibold text-text mb-2">{stage.name}</h3>
                  <p className="text-text-subtle text-sm leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {content?.faq && content.faq.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЧАСТЫЕ ВОПРОСЫ</h2>
            <div className="flex flex-col gap-4">
              {content.faq.map((item, i) => (
                <details key={i} className="card group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-text group-open:text-accent transition-colors pr-4">{item.q}</span>
                    <ChevronDown className="size-5 text-text-subtle shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-border">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="card border-accent-dim text-center p-10 glow-box">
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">
            ЗАПИСАТЬСЯ НА {service.name.toUpperCase()}
          </h2>
          <p className="text-text-muted mb-6">Запишитесь онлайн или позвоните — подберём удобное время.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookingButton label="Записаться онлайн" serviceHint={service.name} className="btn-primary text-base px-10 py-4" />
            <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
              <Phone className="size-4" /> +7 (981) 842-81-51
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
