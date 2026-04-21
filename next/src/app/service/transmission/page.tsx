export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Settings, ChevronRight, CheckCircle, Phone, Clock } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
 title: 'Ремонт АКПП, DSG, МКПП в СПб — BMW, Mercedes, Audi | HP Тюнинг',
 description: 'Ремонт коробок передач в Санкт-Петербурге: АКПП, DSG, Tiptronic, МКПП. Замена масла АКПП от 8 000 ₽, ремонт DSG от 35 000 ₽. BMW, Mercedes, Audi, Porsche, Land Rover, VW.',
 keywords: ['ремонт акпп спб', 'ремонт dsg спб', 'замена масла акпп спб', 'акпп бмв спб', 'ремонт коробки передач петербург'],
 alternates: { canonical: 'https://hptuning.ru/service/transmission' },
 openGraph: {
 title: 'Ремонт АКПП и DSG BMW, Mercedes, Audi в СПб | HP Тюнинг',
 description: 'АКПП, DSG, Tiptronic, МКПП. Замена масла от 8 000 ₽, ремонт DSG от 35 000 ₽.',
 url: 'https://hptuning.ru/service/transmission',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/transmission.jpg', width: 1200, height: 630, alt: 'Ремонт АКПП и DSG BMW, Mercedes, Audi в СПб | HP Тюнинг' }],
 },
};

const PRICES = [
 { service: 'Замена масла АКПП', min: '8 000', max: '18 000' },
 { service: 'Замена масла МКПП', min: '3 000', max: '8 000' },
 { service: 'Адаптация АКПП', min: '2 500', max: '5 000' },
 { service: 'Ремонт DSG (7-ступ.)', min: '25 000', max: '80 000' },
 { service: 'Замена гидротрансформатора', min: '30 000', max: '90 000' },
];

const WORKS = [
 'Диагностика коробки передач',
 'Замена масла в АКПП/МКПП',
 'Замена фильтра АКПП',
 'Адаптация АКПП',
 'Чистка и промывка АКПП',
 'Замена гидротрансформатора',
 'Ремонт DSG/PDK',
 'Обслуживание вариатора (CVT)',
];

const FAQ = [
 { q: 'Как часто менять масло в АКПП?', a: 'Производители часто пишут "необслуживаемая коробка", но на практике масло нужно менять каждые 60 000–80 000 км. Для DSG — каждые 40 000–60 000 км.' },
 { q: 'Какие симптомы неисправности АКПП?', a: 'Рывки при переключении, задержки, пробуксовки, вибрации, посторонние шумы, горит индикатор. При любом из симптомов — срочная диагностика.' },
 { q: 'Что такое адаптация АКПП?', a: 'Процедура программного "обучения" коробки после замены масла или ремонта. Восстанавливает плавность и чёткость переключений.' },
 { q: 'Ремонтируете ли DSG 7 (сухое сцепление)?', a: 'Да. Диагностируем мехатроник, сцепление, вилки переключения. Стоимость ремонта DSG DQ200 — от 25 000 ₽ в зависимости от неисправности.' },
];


const serviceSchema = {
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: 'Ремонт АКПП, DSG, МКПП BMW, Mercedes, Audi',
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
 price: '8000',
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
 
 <Breadcrumbs items={[{ label: "Автосервис", href: "/service" }, { label: "АКПП" }]} />
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
 <div className="lg:col-span-2">
 <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-6">
 <Settings className="size-7 text-yellow-400" />
 </div>
 <span className="badge mb-4">АКПП / МКПП</span>
 <h1 className="section-title text-4xl md:text-5xl mb-4">ОБСЛУЖИВАНИЕ КОРОБКИ ПЕРЕДАЧ</h1>
 <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-xl">
 Обслуживание и ремонт автоматических, механических, роботизированных и вариаторных коробок передач. АКПП, МКПП, DSG/DQ250/DQ381, PDK, ZF.
 </p>
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {WORKS.map((w, i) => (
 <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
 <CheckCircle className="size-4 text-yellow-400 shrink-0 mt-0.5" />{w}
 </li>
 ))}
 </ul>
 </div>
 <aside>
 <div className="card sticky top-24">
 <div className="text-yellow-400 font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
 <div className="font-display text-4xl text-text mb-1">от 8 000 ₽</div>
 <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
 <Clock className="size-3.5" />{'1–3 дня'}
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
 <span className="font-medium text-text group-open:text-yellow-400 transition-colors pr-4">{item.q}</span>
 <span className="text-text-subtle group-open:text-yellow-400 shrink-0 text-lg leading-none">+</span>
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
