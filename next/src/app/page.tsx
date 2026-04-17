import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { WorksPreview } from '@/components/sections/WorksPreview';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
  title: seoData.pages.home.title,
  description: seoData.pages.home.description,
  alternates: { canonical: 'https://hptuning.ru' },
  openGraph: {
    title: seoData.pages.home.title,
    description: seoData.pages.home.description,
    url: 'https://hptuning.ru',
    images: [{ url: 'https://hptuning.ru/images/mercedes-s-class-hero.jpg', width: 1200, height: 800 }],
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
      <BrandsSection />
      <WorksPreview />
      <FaqSection />
      <CtaSection />
    </>
  );
}
