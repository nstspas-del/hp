import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategory, getService } from '@/lib/services';
import { ServicePage } from '@/components/ui/ServicePage';

const CAT = 'chip-tuning';

export function generateStaticParams() {
  const cat = getCategory(CAT);
  return cat?.items.map((s) => ({ service: s.slug })) ?? [];
}

export function generateMetadata({ params }: { params: { service: string } }): Metadata {
  const service = getService(CAT, params.service);
  if (!service) return {};
  return {
    title: `${service.name} в СПб — от ${service.priceFrom.toLocaleString('ru-RU')} ₽ | HP Тюнинг`,
    description: service.shortDescription ?? `${service.name} в Санкт-Петербурге. Профессиональная прошивка ЭБУ. Гарантия 1 год. Запись онлайн.`,
    alternates: { canonical: `https://hptuning.ru/services/${CAT}/${params.service}` },
    openGraph: {
      title: `${service.name} | HP Тюнинг СПб`,
      description: service.shortDescription ?? `${service.name} в СПб. От ${service.priceFrom.toLocaleString('ru-RU')} ₽.`,
      url: `https://hptuning.ru/services/${CAT}/${params.service}`,
    },
  };
}

export default function ServiceDetailPage({ params }: { params: { service: string } }) {
  const service = getService(CAT, params.service);
  if (!service) notFound();
  return <ServicePage catSlug={CAT} service={service} />;
}
