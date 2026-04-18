import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { CheckCircle, Award, Users, Wrench } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import company from '@/data/company.json';

export const metadata: Metadata = {
 title: 'О компании HP Тюнинг — 10+ лет опыта в СПб | Alientech',
 description: 'HP Тюнинг с 2015 года: более 500 автомобилей, Alientech KESSv3, 32+ марки. Чип-тюнинг Stage 1/2/3, детейлинг, автосервис в Санкт-Петербурге.',
 keywords: ['о компании hp тюнинг', 'чип тюнинг студия спб', 'alientech спб', 'тюнинг ателье петербург'],
 alternates: { canonical: 'https://hptuning.ru/about' },
 openGraph: {
 title: 'О HP Тюнинг — профессиональный тюнинг в СПб',
 description: 'HP Тюнинг с 2015 года: более 500 автомобилей, Alientech KESSv3, 32+ марки. Чип-тюнинг Stage 1/2/3, детейлинг, автосервис в Санкт-Петербурге.',
 url: 'https://hptuning.ru/about',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/about.jpg', width: 1200, height: 630, alt: 'О HP Тюнинг — профессиональный тюнинг в СПб' }],
 },
};

const organizationSchema = {
 '@context': 'https://schema.org',
 '@type': 'AutoRepair',
 '@id': 'https://hptuning.ru/#org',
 name: 'HP Тюнинг',
 foundingDate: '2015',
 description: 'Тюнинг-ателье в Порошкино (СПб): чип-тюнинг Stage 1/2/3, детейлинг и автосервис для BMW, Mercedes, Audi, Porsche, Land Rover',
 url: 'https://hptuning.ru',
 logo: 'https://hptuning.ru/images/logo.svg',
 telephone: '+79818428151',
 address: {
 '@type': 'PostalAddress',
 streetAddress: 'ул. Богородская, 3Б',
 addressLocality: 'Санкт-Петербург',
 addressCountry: 'RU',
 },
 numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
 aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '200', bestRating: '5' },
};

export default function AboutPage() {
 return (
 <div className="section container">
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

 
 <Breadcrumbs items={[{ label: "О компании" }]} />

 {/* Hero */}
 <span className="badge mb-4">С 2015 года в СПб</span>
 <h1 className="section-title mb-4">О НАС</h1>
 <p className="section-subtitle mb-14">
 HP Тюнинг — тюнинг-ателье в Порошкино. Чип-тюнинг Stage 1/2/3,
 детейлинг и автосервис для владельцев BMW, Mercedes, Audi, Porsche, Land Rover и ещё 9 марок.
 </p>

 {/* Статистика */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
 {[
 { icon: Award, value: '10+', label: 'лет на рынке', sub: 'с 2015 года' },
 { icon: Users, value: '500+', label: 'автомобилей', sub: 'прошито и обработано' },
 { icon: Wrench, value: '13', label: 'марок', sub: 'BMW, Mercedes, Audi…' },
 { icon: CheckCircle, value: '500+', label: 'автомобилей', sub: 'выполнено работ' },
 ].map(({ icon: Icon, value, label, sub }) => (
 <div key={label} className="card text-center">
 <Icon className="size-6 text-accent mx-auto mb-3" />
 <div className="font-display text-3xl text-accent mb-1">{value}</div>
 <div className="text-text font-medium text-sm">{label}</div>
 <div className="text-text-subtle text-xs mt-0.5">{sub}</div>
 </div>
 ))}
 </div>

 {/* Основная история */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
 <div>
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-6">НАША ИСТОРИЯ</h2>
 <div className="flex flex-col gap-4 text-text-muted leading-relaxed">
 <p>
 HP Тюнинг начался в 2015 году как небольшая мастерская в Санкт-Петербурге.
 Первыми клиентами были энтузиасты BMW, которые хотели получить больше от своих
 автомобилей, не жертвуя надёжностью.
 </p>
 <p>
 За 10+ лет мы выросли в полноценное тюнинг-ателье с собственным боксом в Порошкино.
 Сегодня работаем с 13 марками, предлагаем чип-тюнинг, детейлинг и полный
 автосервис — всё в одном месте.
 </p>
 <p>
 Каждый автомобиль — это индивидуальный проект. Мы не делаем универсальных прошивок:
 калибруем каждую машину под её состояние, топливо и цели владельца.
 </p>
 </div>
 </div>

 <div>
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-6">ПОЧЕМУ МЫ</h2>
 <ul className="flex flex-col gap-4">
 {[
 { title: 'Специализация на премиум', desc: 'Работаем только с BMW, Mercedes, Audi, Porsche, Land Rover и ещё 9 брендами. Не берём что попало.' },
 { title: 'Оригинальное оборудование', desc: 'Диагностика на официальном дилерском оборудовании. Читаем ЭБУ так же, как читает дилер.' },
 { title: 'Откат к стоку', desc: 'Оригинальная прошивка сохраняется — откат бесплатно в любой момент.' },
 { title: 'Честная цена', desc: 'Называем финальную цену сразу. Без скрытых доплат за работу или расходники.' },
 ].map((item) => (
 <li key={item.title} className="flex items-start gap-3">
 <CheckCircle className="size-5 text-accent shrink-0 mt-0.5" />
 <div>
 <div className="text-text font-semibold text-sm mb-0.5">{item.title}</div>
 <div className="text-text-muted text-sm leading-relaxed">{item.desc}</div>
 </div>
 </li>
 ))}
 </ul>
 </div>
 </div>

 {/* Реквизиты */}
 <section className="mb-16">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-6">ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ</h2>
 <div className="card">
 <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
 <div>
 <dt className="text-text-subtle mb-0.5">Полное наименование</dt>
 <dd className="text-text">{company.legalName}</dd>
 </div>
 <div>
 <dt className="text-text-subtle mb-0.5">ИНН</dt>
 <dd className="text-text">{company.inn}</dd>
 </div>
 <div>
 <dt className="text-text-subtle mb-0.5">ОГРНИП</dt>
 <dd className="text-text">{company.ogrnip}</dd>
 </div>
 <div>
 <dt className="text-text-subtle mb-0.5">Адрес</dt>
 <dd className="text-text">{company.address.full}</dd>
 </div>
 <div>
 <dt className="text-text-subtle mb-0.5">Телефон</dt>
 <dd className="text-text">
 <a href={company.contacts.phone.href} className="text-accent hover:underline">
 {company.contacts.phone.display}
 </a>
 </dd>
 </div>
 <div>
 <dt className="text-text-subtle mb-0.5">Email</dt>
 <dd className="text-text">
 <a href={company.contacts.email.href} className="text-accent hover:underline">
 {company.contacts.email.display}
 </a>
 </dd>
 </div>
 </dl>
 </div>
 </section>

 {/* CTA */}
 <div className="card border-accent-dim text-center p-10 glow-box">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">ГОТОВЫ ПОЗНАКОМИТЬСЯ?</h2>
 <p className="text-text-muted mb-6">Приезжайте на бесплатную консультацию или запишитесь онлайн.</p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
 <Link href="/contacts" className="btn-secondary text-base px-10 py-4">Как добраться</Link>
 </div>
 </div>
 </div>
 );
}
