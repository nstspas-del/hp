import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { WorksPreview } from '@/components/sections/WorksPreview';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { ShowcaseSection } from '@/components/ShowcaseSection';
import seoData from '@/data/seo.json';
import { Zap, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HP Тюнинг — чип-тюнинг, детейлинг и автосервис в СПб',
  description: 'HP Тюнинг в Санкт-Петербурге: чип-тюнинг Stage 1/2/3 от 17 000 ₽, керамика 9H от 22 000 ₽, ТО от 3 000 ₽. BMW, Mercedes, Audi, Porsche, Land Rover, Lexus. Alientech. Гарантия 12 мес.',
  keywords: ['чип тюнинг спб', 'детейлинг спб', 'автосервис спб', 'hp тюнинг', 'тюнинг автомобилей санкт-петербург'],
  alternates: { canonical: 'https://hptuning.ru/' },
  openGraph: {
    title: 'HP Тюнинг — чип-тюнинг, детейлинг и автосервис в СПб',
    description: 'HP Тюнинг в Санкт-Петербурге: чип-тюнинг Stage 1/2/3 от 17 000 ₽, керамика 9H от 22 000 ₽, ТО от 3 000 ₽. BMW, Mercedes, Audi, Porsche, Land Rover, Lexus. Aliente',
    url: 'https://hptuning.ru/',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/home.jpg', width: 1200, height: 630, alt: 'HP Тюнинг — чип-тюнинг, детейлинг и автосервис в СПб' }],
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

const reviewsSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://hptuning.ru/#org',
  name: 'HP Тюнинг',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: String(seoData.reviews.length),
    bestRating: '5',
    worstRating: '1',
  },
  review: seoData.reviews.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.name },
    datePublished: r.date,
    reviewBody: r.text,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.rating),
      bestRating: '5',
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      {/* Герой с BMW X7 */}
      <Hero />

      {/* Что мы делаем — ShowcaseSection (3 таба) */}
      <ShowcaseSection />

      {/* Услуги */}
      <ServicesSection />

      {/* Тизер-блок: калькулятор чип-тюнинга */}
      <section className="section bg-background-alt">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="heading-2 mb-3">Рассчитайте стоимость онлайн</h2>
            <p className="text-text-muted text-base max-w-lg mx-auto">
              Выберите марку и модель — узнайте прирост мощности и цену прошивки за 30 секунд
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Чип-тюнинг калькулятор */}
            <div className="card border border-[#39FF14]/20 hover:border-[#39FF14]/50 transition-all group p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 flex items-center justify-center">
                  <Zap className="size-6 text-[#39FF14]" />
                </div>
                <div>
                  <div className="font-display text-xl text-text tracking-wide">Калькулятор чип-тюнинга</div>
                  <div className="text-xs text-text-subtle">Stage 1 от 17 000 ₽ · Alientech KESSv3</div>
                </div>
              </div>

              <p className="text-text-muted text-sm leading-relaxed mb-5">
                Выберите марку, модель и двигатель — калькулятор покажет реальный прирост мощности,
                крутящего момента и точную стоимость прошивки для вашего автомобиля.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['BMW', 'Mercedes', 'Audi', 'Porsche', 'Land Rover', 'Lexus', '+ 7 марок'].map((b) => (
                  <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
                    {b}
                  </span>
                ))}
              </div>

              <Link
                href="/tuning/chip-tuning#chip-calculator"
                className="btn-primary w-full justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] py-4 text-base"
              >
                Открыть калькулятор
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Бренды */}
      <BrandsSection />

      {/* Работы */}
      <WorksPreview />

      {/* Видео RuTube */}
      <VideoSection />

      {/* Отзывы */}
      <ReviewsSection />

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <CtaSection />
    </>
  );
}
