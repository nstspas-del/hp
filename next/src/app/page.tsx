import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { PriceCalculator } from '@/components/ui/PriceCalculator';
import { DetailingCalculator } from '@/components/ui/DetailingCalculator';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
  title: seoData.pages.home.title,
  description: seoData.pages.home.description,
  alternates: { canonical: 'https://hptuning.ru' },
  openGraph: {
    title: seoData.pages.home.title,
    description: seoData.pages.home.description,
    url: 'https://hptuning.ru',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: seoData.faqCommon.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <ServicesSection />
      <PriceCalculator />
      <DetailingCalculator />
      <BrandsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
