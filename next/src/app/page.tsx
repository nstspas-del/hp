export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ShowcaseSection } from '@/components/ShowcaseSection';

import { BrandsSection } from '@/components/sections/BrandsSection';
import { WorksPreview } from '@/components/sections/WorksPreview';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { ProjectCarsSection } from '@/components/sections/ProjectCarsSection';
import { BrandStripSection } from '@/components/sections/BrandStripSection';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
 title: 'Автосервис в Санкт-Петербурге | ТО, диагностика, ремонт, детейлинг и тюнинг | HP Тюнинг',
 description: 'Автосервис в Санкт-Петербурге: ТО от 4 900 ₽, компьютерная диагностика, ремонт двигателя, коробки, подвески. Детейлинг и чип-тюнинг. BMW, Mercedes, Audi, Haval, Chery, Geely и 38 марок. Богородская 3Б, СПб. ☎ +7 (981) 842-81-51',
 keywords: ['автосервис спб', 'чип тюнинг спб', 'детейлинг спб', 'hp тюнинг', 'тюнинг автомобилей санкт-петербург'],
 alternates: { canonical: 'https://hptuning.ru/' },
 openGraph: {
 title: 'Автосервис премиум-класса в СПб | HP Тюнинг',
 description: 'ТО, диагностика, ремонт, детейлинг и тюнинг для BMW, Mercedes-Benz, Audi, Porsche, VW, Toyota, Lexus, Land Rover, Haval, Chery, Tank, Geely в Петербурге.',
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
 privacyPolicy: 'https://hptuning.ru/privacy',
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

 {/* Полоска брендов → /marki/ */}
 <BrandStripSection />

 {/* Что мы делаем — табы без картинок */}
 <ShowcaseSection />

 {/* Бренды */}
 <BrandsSection />

 {/* Работы */}
 <WorksPreview />

 {/* Проектные автомобили */}
 <ProjectCarsSection />

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
