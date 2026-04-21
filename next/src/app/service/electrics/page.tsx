export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Zap, ChevronRight, CheckCircle, Phone, Clock } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
 title: 'Электрика и кодирование BMW, Mercedes, Audi в СПб | HP Тюнинг',
 description: 'Ремонт электрики и кодирование в Санкт-Петербурге: диагностика от 1 500 ₽, активация скрытых функций BMW, Mercedes, Audi. Ремонт блоков управления, проводки, фар.',
 keywords: ['электрика бмв спб', 'кодирование бмв спб', 'кодирование мерседес спб', 'активация функций аudi спб', 'ремонт блоков управления спб'],
 alternates: { canonical: 'https://hptuning.ru/service/electrics' },
 openGraph: {
 title: 'Электрика и кодирование BMW, Mercedes, Audi в СПб | HP Тюнинг',
 description: 'Кодирование, активация скрытых функций, ремонт проводки. BMW, Mercedes, Audi.',
 url: 'https://hptuning.ru/service/electrics',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/electrics.jpg', width: 1200, height: 630, alt: 'Электрика и кодирование BMW, Mercedes, Audi в СПб | HP Тюнинг' }],
 },
};

const PRICES = [
 { service: 'Диагностика электрики', min: '2 000', max: '5 000' },
 { service: 'Кодирование блока (1 шт.)', min: '3 000', max: '8 000' },
 { service: 'Замена датчика (+ работа)', min: '2 500', max: '12 000' },
 { service: 'Ремонт проводки (1 цепь)', min: '3 000', max: '15 000' },
 { service: 'Замена блока управления', min: '5 000', max: '25 000' },
];

const WORKS = [
 'Диагностика электрических цепей',
 'Замена и кодирование датчиков',
 'Ремонт жгутов проводки',
 'Замена предохранителей и реле',
 'Ремонт стартера и генератора',
 'Кодирование блоков управления',
 'Настройка ADAS / ассистентов',
 'Ремонт систем освещения',
];

const FAQ = [
 { q: 'Что такое кодирование блоков?', a: 'Программирование параметров нового блока управления (ЭБУ, АКПП, ABS и др.) под конкретный VIN автомобиля. Без кодирования блок не заработает корректно.' },
 { q: 'Почему горит Check Engine?', a: 'Check Engine может гореть из-за датчика кислорода, катализатора, форсунки, системы EGR, утечки вакуума и десятков других причин. Требует диагностики — за 30 минут определим причину.' },
 { q: 'Ремонтируете ли вы ABS/ESP?', a: 'Да. Диагностируем и заменяем датчики ABS, насос-модулятор, гидроблок. Кодируем после замены.' },
 { q: 'Можно ли разблокировать скрытые функции?', a: 'Да! Активация скрытых функций — например, видеозапись во время движения, отображение на спидометре, складывание зеркал при закрытии — доступна для BMW, Audi, Mercedes, Volkswagen, Porsche.' },
];


const serviceSchema = {
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: 'Ремонт электрики и кодирование BMW, Mercedes, Audi',
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
 price: '1500',
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

export default function Page() {
 return (
 <>
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
 <section className="relative pt-28 pb-16">
 <div className="container">
 
 <Breadcrumbs items={[{ label: "Автосервис", href: "/service" }, { label: "Электрика" }]} />
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
 <div className="lg:col-span-2">
 <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
 <Zap className="size-7 text-cyan-400" />
 </div>
 <span className="badge mb-4">Электрика</span>
 <h1 className="section-title text-4xl md:text-5xl mb-4">РЕМОНТ ЭЛЕКТРИКИ И ЭЛЕКТРОНИКИ</h1>
 <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-xl">
 Диагностика и ремонт электрических цепей, ЭБУ, датчиков, замков, стекол, света, систем помощи водителю. Кодирование и программирование блоков.
 </p>
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {WORKS.map((w, i) => (
 <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
 <CheckCircle className="size-4 text-cyan-400 shrink-0 mt-0.5" />{w}
 </li>
 ))}
 </ul>
 </div>
 <aside>
 <div className="card sticky top-24">
 <div className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
 <div className="font-display text-4xl text-text mb-1">от 2 000 ₽</div>
 <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
 <Clock className="size-3.5" />{'1–4 часа'}
 </div>
 <BookingButton label="Записаться" className="btn-primary w-full justify-center mb-3" />
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
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЦЕНЫ</h2>
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

 <section className="py-16 container max-w-3xl">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЧАСТЫЕ ВОПРОСЫ</h2>
 <div className="flex flex-col gap-4">
 {FAQ.map((item, i) => (
 <details key={i} className="card group">
 <summary className="flex items-center justify-between cursor-pointer list-none">
 <span className="font-medium text-text group-open:text-cyan-400 transition-colors pr-4">{item.q}</span>
 <span className="text-text-subtle group-open:text-cyan-400 shrink-0 text-lg leading-none">+</span>
 </summary>
 <p className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-border">{item.a}</p>
 </details>
 ))}
 </div>
 </section>

 <section className="py-16 bg-[#111113] container">
 <div className="card text-center p-10">
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">ЗАПИСАТЬСЯ НА СЕРВИС</h2>
 <p className="text-text-muted mb-6">Ответим в течение 15 минут.</p>
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
