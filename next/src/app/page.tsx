export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { BrandsMarquee } from '@/components/sections/BrandsMarquee';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { WorksPreview } from '@/components/sections/WorksPreview';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { ProjectCarsSection } from '@/components/sections/ProjectCarsSection';
import { SocialProof } from '@/components/sections/SocialProof';
import { WorkshopVideo } from '@/components/sections/WorkshopVideo';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
 title: 'HP Тюнинг — автосервис в СПб: ТО, ремонт, детейлинг, чип-тюнинг',
 description: 'Автосервис в Санкт-Петербурге: ТО от 4 900 ₽, диагностика, ремонт, шиномонтаж, детейлинг, чип-тюнинг. BMW, Mercedes-Benz, Audi, Porsche, Land Rover, Toyota, Lexus, Kia, Hyundai, Haval, Chery, Geely, Tank, Exeed. Богородская 3Б. Ежедневно 10:00–22:00.',
 keywords: ['автосервис спб', 'mercedes сервис спб', 'bmw сервис спб', 'то спб', 'ремонт двигателя спб', 'шиномонтаж спб', 'детейлинг спб', 'чип тюнинг спб', 'hp тюнинг'],
 alternates: { canonical: 'https://hptuning.ru/' },
 openGraph: {
 title: 'HP Тюнинг — автосервис в Санкт-Петербурге',
 description: 'ТО, ремонт, шиномонтаж, детейлинг и чип-тюнинг для 14 ключевых марок: BMW, Mercedes, Audi, Porsche, Land Rover, Toyota, Lexus, Kia, Hyundai, Haval, Chery, Geely, Tank, Exeed. Богородская 3Б, СПб.',
 url: 'https://hptuning.ru/',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/home.jpg', width: 1200, height: 630, alt: 'HP Тюнинг — автосервис в СПб' }],
 },
};

// FAQPage — даём Яндексу и Google FAQ-сниппеты
const faqSchema = {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: seoData.faqCommon.map((item) => ({
 '@type': 'Question',
 name: item.question,
 acceptedAnswer: { '@type': 'Answer', text: item.answer },
 })),
};

// Реальные текстовые отзывы (без AggregateRating — пока отзывов мало).
// Когда соберётся ≥20 реальных отзывов в Яндекс.Картах, вернём агрегат.
const reviewsSchema = {
 '@context': 'https://schema.org',
 '@type': 'LocalBusiness',
 '@id': 'https://hptuning.ru/#org',
 name: 'HP Тюнинг',
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

// BreadcrumbList — навигационный путь для главной (single-step)
const breadcrumbSchema = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru/' },
 ],
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
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
 />

 {/* 1. Hero с BMW X7 — внутри 4 карточки услуг (Диагностика/ТО/Чип/Детейлинг). */}
 <Hero />

 {/* 1.5. Kinetic Marquee — бесконечная лента всех марок, сразу после Hero.
        Cinematic wow-эффект (taste-skill §8 Typography & Text — Kinetic Marquee). */}
 <BrandsMarquee />

 {/* 2. Наши марки — детальная сетка по группам (Европа/Япония/Корея/Китай).
        Marquee показал «что есть», сетка позволяет выбрать конкретное. */}
 <BrandsSection />

 {/* 3. Видео мастерской — показываем бокс, фотозону Hot Wheels и клиентскую зону. */}
 <WorkshopVideo />

 {/* 4. Социальные доказательства — почему нам доверяют. */}
 <SocialProof />

 {/* 4. Работы */}
 <WorksPreview />

 {/* 5. Проектные автомобили */}
 <ProjectCarsSection />

 {/* 6. Отзывы */}
 <ReviewsSection />

 {/* 7. FAQ */}
 <FaqSection />

 {/* 8. CTA */}
 <CtaSection />
 </>
 );
}
