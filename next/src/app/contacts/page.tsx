export const dynamic = 'force-static';
import type { Metadata } from 'next';
import seoData from '@/data/seo.json';
import { ContactsClient } from './ContactsClient';

export const metadata: Metadata = {
 title: seoData.pages.contacts.title,
 description: seoData.pages.contacts.description,
 alternates: { canonical: 'https://hptuning.ru/contacts' },
 openGraph: {
 title: seoData.pages.contacts.title,
 description: seoData.pages.contacts.description,
 url: 'https://hptuning.ru/contacts',
 images: [{ url: 'https://hptuning.ru/images/og/home.jpg', width: 1200, height: 630, alt: 'Контакты HP Тюнинг — адрес, телефон, как добраться' }],
 },
};

const localBusinessSchema = {
 '@context': 'https://schema.org',
 '@type': ['AutoRepair', 'LocalBusiness'],
 '@id': 'https://hptuning.ru/#org',
 name: 'HP Тюнинг',
 description: 'Чип-тюнинг, детейлинг и автосервис премиум-авто в Санкт-Петербурге',
 url: 'https://hptuning.ru',
 telephone: '+79818428151',
 address: {
 '@type': 'PostalAddress',
 streetAddress: 'ул. Богородская, 3Б',
 addressLocality: 'Санкт-Петербург',
 addressRegion: 'Ленинградская область',
 postalCode: '188683',
 addressCountry: 'RU',
 },
 geo: {
 '@type': 'GeoCoordinates',
 latitude: 60.096423,
 longitude: 30.304163,
 },
 openingHoursSpecification: {
 '@type': 'OpeningHoursSpecification',
 dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
 opens: '10:00',
 closes: '20:00',
 },
 hasMap: 'https://yandex.ru/maps/org/99062407907',
 priceRange: '₽₽₽',
 areaServed: { '@type': 'City', name: 'Санкт-Петербург' },
 privacyPolicy: 'https://hptuning.ru/privacy',
};

export default function ContactsPage() {
 return (
 <>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
 />
 <ContactsClient />
 </>
 );
}
