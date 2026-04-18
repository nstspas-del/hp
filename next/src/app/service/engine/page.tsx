import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Gauge, ChevronRight, CheckCircle, Phone, Clock } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
 title: 'Ремонт двигателя BMW, Mercedes, Audi в СПб | HP Тюнинг',
 description: 'Ремонт двигателей в Санкт-Петербурге: замена цепи ГРМ от 25 000 ₽, замена прокладки ГБЦ от 30 000 ₽. BMW, Mercedes, Audi, Porsche, Land Rover, Lexus. Диагностика, оригинальные запчасти.',
 keywords: ['ремонт двигателя бмв спб', 'ремонт двигателя мерседес спб', 'замена цепи грм спб', 'прокладка гбц спб', 'ремонт мотора петербург'],
 alternates: { canonical: 'https://hptuning.ru/service/engine' },
 openGraph: {
 title: 'Ремонт двигателя BMW, Mercedes, Audi в СПб | HP Тюнинг',
 description: 'Ремонт двигателей: ГРМ от 25 000 ₽, ГБЦ от 30 000 ₽. BMW, Mercedes, Audi, Porsche, Land Rover.',
 url: 'https://hptuning.ru/service/engine',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/engine.jpg', width: 1200, height: 630, alt: 'Ремонт двигателя BMW, Mercedes, Audi в СПб | HP Тюнинг' }],
 },
};

const PRICES = [
 { service: 'Замена ремня/цепи ГРМ', min: '15 000', max: '35 000' },
 { service: 'Замена прокладки ГБЦ', min: '25 000', max: '60 000' },
 { service: 'Замена маслосъёмных колец', min: '40 000', max: '90 000' },
 { service: 'Замена форсунок (1 шт.)', min: '3 000', max: '8 000' },
 { service: 'Промывка форсунок', min: '5 000', max: '12 000' },
 { service: 'Капитальный ремонт двигателя', min: '80 000', max: '300 000+' },
];

const WORKS = [
 'Диагностика неисправности двигателя',
 'Замена ремня / цепи ГРМ с роликами и помпой',
 'Замена прокладки головки блока цилиндров',
 'Ремонт головки блока цилиндров',
 'Замена маслосъёмных колпачков и колец',
 'Замена и промывка форсунок',
 'Ремонт системы охлаждения',
 'Устранение течей масла и антифриза',
 'Чистка и промывка системы смазки',
 'Капитальный ремонт с расточкой',
];

const STEPS = [
 { step: '01', title: 'Диагностика', desc: 'Считываем ошибки, проверяем компрессию, давление масла, анализируем симптомы.' },
 { step: '02', title: 'Разборка', desc: 'Демонтаж необходимых узлов, видеофиксация процесса разборки.' },
 { step: '03', title: 'Ремонт', desc: 'Замена или восстановление повреждённых компонентов, чистка, промывка.' },
 { step: '04', title: 'Сборка и тест', desc: 'Сборка, запуск, проверка герметичности, тест-драйв.' },
];

const FAQ = [
 { q: 'Сколько стоит замена ГРМ?', a: 'Замена ремня/цепи ГРМ — от 15 000 ₽. Цена зависит от марки и модели: для BMW N20/N26 — от 20 000 ₽, для Audi 2.0 TFSI — от 18 000 ₽. Обязательно меняем ролики, натяжители и помпу — в комплекте.' },
 { q: 'Как понять, что пора менять ГРМ?', a: 'По регламенту — каждые 60 000–120 000 км (зависит от марки). Признаки: посторонние шумы при запуске, ухудшение динамики, вибрации двигателя.' },
 { q: 'Что включает капитальный ремонт двигателя?', a: 'Расточка блока, замена поршней и колец, шатунных и коренных вкладышей, шлифовка коленвала, ремонт ГБЦ, сборка и обкатка. Сроки — 1–2 недели.' },
 { q: 'Даёте ли гарантию на ремонт двигателя?', a: 'Да — гарантия 6 месяцев на все работы, 12 месяцев на запчасти по гарантии производителя.' },
];


const serviceSchema = {
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: 'Ремонт двигателя BMW, Mercedes, Audi в Санкт-Петербурге',
 provider: {
 '@type': 'AutoRepair',
 name: 'HP Тюнинг',
 url: 'https://hptuning.ru',
 telephone: '+79818428151',
 address: {
 '@type': 'PostalAddress',
 streetAddress: 'ул. Богородская, 3Б',
 addressLocality: 'Санкт-Петербург',
 addressCountry: 'RU',
 },
 },
 offers: {
 '@type': 'Offer',
 priceCurrency: 'RUB',
 price: '10000',
 availability: 'https://schema.org/InStock',
 },
 areaServed: {
 '@type': 'City',
 name: 'Санкт-Петербург',
 },
};


const faqSchema = {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: FAQ.map((item) => ({
 '@type': 'Question',
 name: item.q,
 acceptedAnswer: {
 '@type': 'Answer',
 text: item.a,
 },
 })),
};

export default function EnginePage() {
 return (
 <>
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
 <section className="relative pt-28 pb-16">
 <div className="container">
 
 <Breadcrumbs items={[{ label: "Автосервис", href: "/service" }, { label: "Двигатель" }]} />
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
 <div className="lg:col-span-2">
 <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
 <Gauge className="size-7 text-red-400" />
 </div>
 <span className="badge mb-4">Ремонт двигателя</span>
 <h1 className="section-title text-4xl md:text-5xl mb-4">РЕМОНТ ДВИГАТЕЛЯ</h1>
 <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-xl">
 Ремонт любой сложности: от замены ГРМ до капитального ремонта двигателя.
 Специализируемся на BMW, Mercedes, Audi, Porsche, Land Rover, Lexus.
 </p>
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {WORKS.map((w, i) => (
 <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
 <CheckCircle className="size-4 text-red-400 shrink-0 mt-0.5" />{w}
 </li>
 ))}
 </ul>
 </div>
 <aside>
 <div className="card sticky top-24">
 <div className="text-red-400 font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
 <div className="font-display text-4xl text-text mb-1">от 10 000 ₽</div>
 <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
 <Clock className="size-3.5" />1–5 дней
 </div>
 <BookingButton label="Записаться на ремонт" className="btn-primary w-full justify-center mb-3" />
 <a href="tel:+79818428151" className="btn-secondary w-full justify-center">
 <Phone className="size-4" />+7 (981) 842-81-51
 </a>
 </div>
 </aside>
 </div>
 </div>
 </section>

 <section className="py-16 bg-[#111113]">
 <div className="container">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЦЕНЫ НА РЕМОНТ ДВИГАТЕЛЯ</h2>
 <div className="overflow-x-auto">
 <table className="w-full max-w-2xl">
 <thead>
 <tr className="border-b border-border">
 <th className="text-left py-3 px-4 text-text-subtle text-sm">Вид работ</th>
 <th className="text-center py-3 px-4 text-text-subtle text-sm">от</th>
 <th className="text-center py-3 px-4 text-text-subtle text-sm">до</th>
 </tr>
 </thead>
 <tbody>
 {PRICES.map((p, i) => (
 <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
 <td className="py-3 px-4 text-text-muted text-sm">{p.service}</td>
 <td className="py-3 px-4 text-center text-[#39FF14] font-semibold text-sm">{p.min} ₽</td>
 <td className="py-3 px-4 text-center text-text-subtle text-sm">{p.max} ₽</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </section>

 <section className="py-16 container">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">КАК МЫ РАБОТАЕМ</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
 {STEPS.map((s) => (
 <div key={s.step} className="card">
 <div className="font-display text-3xl text-red-400/30 mb-3">{s.step}</div>
 <h3 className="font-semibold text-text mb-2">{s.title}</h3>
 <p className="text-text-subtle text-sm leading-relaxed">{s.desc}</p>
 </div>
 ))}
 </div>
 </section>

 <section className="py-16 bg-[#111113]">
 <div className="container max-w-3xl">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЧАСТЫЕ ВОПРОСЫ</h2>
 <div className="flex flex-col gap-4">
 {FAQ.map((item, i) => (
 <details key={i} className="card group">
 <summary className="flex items-center justify-between cursor-pointer list-none">
 <span className="font-medium text-text group-open:text-red-400 transition-colors pr-4">{item.q}</span>
 <span className="text-text-subtle group-open:text-red-400 shrink-0 text-lg leading-none">+</span>
 </summary>
 <p className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-border">{item.a}</p>
 </details>
 ))}
 </div>
 </div>
 </section>

 <section className="py-16 container">
 <div className="card border-red-500/20 text-center p-10">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">ЗАПИСАТЬСЯ НА РЕМОНТ ДВИГАТЕЛЯ</h2>
 <p className="text-text-muted mb-6">Опишите симптомы — подскажем причину и цену.</p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
 <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
 <Phone className="size-4" /> +7 (981) 842-81-51
 </a>
 </div>
 </div>
 </section>
 </>
 );
}
