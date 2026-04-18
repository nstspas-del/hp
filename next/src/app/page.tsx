import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ShowcaseSection } from '@/components/ShowcaseSection';
import { ChipCalculatorNew } from '@/components/sections/ChipCalculatorNew';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { WorksPreview } from '@/components/sections/WorksPreview';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { VideoSection } from '@/components/sections/VideoSection';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
 title: 'HP Тюнинг — чип-тюнинг, детейлинг и автосервис в СПб',
 description: 'HP Тюнинг в Санкт-Петербурге: чип-тюнинг Stage 1/2/3 от 17 000 ₽, керамика 9H от 22 000 ₽, ТО от 3 000 ₽. BMW, Mercedes, Audi, Porsche, Land Rover, Lexus. Alientech. ',
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

 {/* Что мы делаем — табы без картинок */}
 <ShowcaseSection />

 {/* Калькулятор чип-тюнинга — реальные данные SevenForce, -25% */}
 <ChipCalculatorNew />

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
