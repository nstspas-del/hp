import type { Metadata } from 'next';
// Шрифты подключены через @font-face в globals.css (self-hosted, no Google Fonts CDN)
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { YandexMetrika } from '@/components/analytics/YandexMetrika';
import { AutoDealerWidget } from '@/components/analytics/AutoDealerWidget';
import company from '@/data/company.json';
import seoData from '@/data/seo.json';

// ── Метаданные ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
 metadataBase: new URL('https://hptuning.ru'),
 title: { default: seoData.defaults.title, template: seoData.defaults.titleTemplate },
 description: seoData.defaults.description,
 keywords: seoData.defaults.keywords,
 robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
 openGraph: {
 type: 'website',
 locale: 'ru_RU',
 siteName: seoData.defaults.siteName,
 images: [{ url: seoData.defaults.openGraph.image, width: 1200, height: 630 }],
 },
 other: {
 'geo.region': seoData.defaults.region,
 'geo.placename': seoData.defaults.geo.placename,
 'geo.position': `${seoData.defaults.geo.latitude};${seoData.defaults.geo.longitude}`,
 'ICBM': `${seoData.defaults.geo.latitude}, ${seoData.defaults.geo.longitude}`,
 // Яндекс.Вебмастер — код верификации (апрель 2026)
 'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? '612ea2d0128620d8',
 },
};

// ── Schema.org LocalBusiness + Organization ───────────────────────────────────
const localBusinessSchema = {
 '@context': 'https://schema.org',
 '@type': ['AutoRepair', 'LocalBusiness'],
 '@id': 'https://hptuning.ru/#org',
 name: company.name,
 legalName: company.legalName,
 description: seoData.defaults.description,
 url: company.domain.url,
 telephone: company.contacts.phone.raw,
 email: company.contacts.email.display,
 priceRange: company.priceRange,
 logo: {
 '@type': 'ImageObject',
 url: 'https://hptuning.ru/images/logo.svg',
 width: 200,
 height: 60,
 },
 image: 'https://hptuning.ru/images/og/home.jpg',
 address: {
 '@type': 'PostalAddress',
 streetAddress: `${company.address.street}, ${company.address.building}`,
 addressLocality: company.address.locality,
 addressRegion: company.address.region,
 postalCode: company.address.postalCode,
 addressCountry: 'RU',
 },
 geo: {
 '@type': 'GeoCoordinates',
 latitude: company.geo.latitude,
 longitude: company.geo.longitude,
 },
 openingHoursSpecification: {
 '@type': 'OpeningHoursSpecification',
 dayOfWeek: company.workHours.days,
 opens: company.workHours.opens,
 closes: company.workHours.closes,
 },
 hasMap: company.geo.yandexMapUrl,
 areaServed: { '@type': 'City', name: 'Санкт-Петербург' },
 aggregateRating: {
 '@type': 'AggregateRating',
 ratingValue: '4.9',
 bestRating: '5',
 ratingCount: '247',
 },
 sameAs: [
 'https://t.me/hptuningspb',
 'https://yandex.ru/maps/org/99062407907/',
 ],
};

// ── Schema.org WebSite + SearchAction ────────────────────────────────────────
const websiteSchema = {
 '@context': 'https://schema.org',
 '@type': 'WebSite',
 '@id': 'https://hptuning.ru/#website',
 url: 'https://hptuning.ru',
 name: company.name,
 description: seoData.defaults.description,
 publisher: { '@id': 'https://hptuning.ru/#org' },
 potentialAction: {
 '@type': 'SearchAction',
 target: { '@type': 'EntryPoint', urlTemplate: 'https://hptuning.ru/brands?q={search_term_string}' },
 'query-input': 'required name=search_term_string',
 },
 inLanguage: 'ru-RU',
};

// ── Layout ────────────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
 <html lang="ru">
 <head>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
 </head>
 <body className="flex flex-col min-h-screen font-sans antialiased bg-[#09090b] text-white">
 <YandexMetrika />
 <AutoDealerWidget />
 <Header />
 <main className="flex-1 pt-16">{children}</main>
 <Footer />
 <CookieBanner />
 </body>
 </html>
 );
}
