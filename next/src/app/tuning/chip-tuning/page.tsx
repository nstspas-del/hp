export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Zap, CheckCircle, Phone, TrendingUp, Shield, RotateCcw, Award } from 'lucide-react';
import { ChipCalculatorNew } from '@/components/sections/ChipCalculatorNew';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
 title: 'Чип-тюнинг и тюнинг ЭБУ в СПб — от 15 000 ₽ | HP Тюнинг',
 description: 'Профессиональный чип-тюнинг и прошивка ЭБУ в Санкт-Петербурге: от 15 000 ₽ для японских и китайских марок, от 24 000 ₽ для премиума. BMW, Mercedes, Audi, Haval, Chery, Tank, Geely. Alientech KESS3.',
 keywords: ['чип тюнинг спб', 'прошивка эбу спб', 'тюнинг haval спб', 'чип тюнинг chery', 'тюнинг geely', 'прошивка tank', 'чип тюнинг bmw спб', 'alientech kess3'],
 alternates: { canonical: 'https://hptuning.ru/tuning/chip-tuning' },
 openGraph: {
 title: 'Чип-тюнинг и тюнинг ЭБУ в Санкт-Петербурге | HP Тюнинг',
 description: 'Прошивка ЭБУ от 15 000 ₽. BMW, Mercedes, Audi, Porsche, Haval, Chery, Tank, Geely и 30+ марок. Alientech KESS3.',
 url: 'https://hptuning.ru/tuning/chip-tuning',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/chip-tuning.jpg', width: 1200, height: 630, alt: 'Чип-тюнинг Stage 1/2/3 в Санкт-Петербурге | HP Тюнинг' }],
 },
};

const serviceSchema = {
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: 'Чип-тюнинг автомобилей',
 provider: {
 '@type': 'AutoRepair',
 name: 'HP Тюнинг',
 url: 'https://hptuning.ru',
 telephone: '+79818428151',
 address: { '@type': 'PostalAddress', addressLocality: 'Санкт-Петербург', streetAddress: 'ул. Богородская, 3Б' },
 },
 offers: [
 { '@type': 'Offer', name: 'Stage 1', price: 24000, priceCurrency: 'RUB' },
 { '@type': 'Offer', name: 'Stage 2', price: 39000, priceCurrency: 'RUB' },
 { '@type': 'Offer', name: 'Stage 3', price: 95000, priceCurrency: 'RUB' },
 ],
 areaServed: { '@type': 'City', name: 'Санкт-Петербург' },
};



const GAINS = [
 { model: 'BMW M3 (G80) 3.0T', before: '510 л.с.', stage1: '575 л.с.', stage2: '650 л.с.' },
 { model: 'Mercedes C63 AMG', before: '476 л.с.', stage1: '540 л.с.', stage2: '610 л.с.' },
 { model: 'Audi RS6 (C8) 4.0T', before: '600 л.с.', stage1: '680 л.с.', stage2: '750 л.с.' },
 { model: 'Porsche 911 Turbo S', before: '650 л.с.', stage1: '730 л.с.', stage2: '—' },
 { model: 'BMW 340i 3.0T (B58)', before: '374 л.с.', stage1: '430 л.с.', stage2: '490 л.с.' },
 { model: 'Volkswagen Golf R 2.0T', before: '320 л.с.', stage1: '380 л.с.', stage2: '420 л.с.' },
];

const WHY = [
 { icon: Award, title: 'Alientech KESS3', desc: 'Официальное оборудование Alientech — лицензированные чтение/запись через OBD, Bootloader, BDM.' },
 { icon: Shield, title: 'Гарантия 12 месяцев', desc: 'Откат к стоку в любой момент. Файл оригинальной прошивки хранится у нас вечно.' },
 { icon: TrendingUp, title: '10 лет опыта', desc: 'Более 500 автомобилей, 30+ марок. Специализация на немецком и британском премиуме.' },
 { icon: RotateCcw, title: 'Откат к стоку', desc: 'Бесплатный откат к заводской прошивке в любое время — перед ТО, продажей или гарантийным случаем.' },
];

const FAQ = [
 {
 q: 'Безопасен ли чип-тюнинг для двигателя?',
 a: 'Да, если выполнен профессионально. Stage 1 работает в безопасных пределах мощности двигателя. Мы не превышаем заводской запас прочности: все параметры (давление, температура, детонация) остаются в штатных рамках.',
 },
 {
 q: 'Можно ли сделать откат к стоку перед ТО?',
 a: 'Да, абсолютно. Откат к оригинальной прошивке занимает 30 минут и бесплатен для наших клиентов в течение всего срока. Оригинальный файл хранится у нас постоянно.',
 },
 {
 q: 'Сколько стоит чип-тюнинг Stage 1?',
 a: 'Stage 1 — от 24 000 ₽. Точная цена зависит от марки, модели и года автомобиля. Используйте калькулятор выше или позвоните — назовём цену за 2 минуты.',
 },
 {
 q: 'Сколько времени занимает процедура?',
 a: 'Stage 1 — 2–3 часа. Stage 2 — 1 рабочий день. Stage 3 — индивидуально, обычно 2–5 дней с настройкой на диностенде.',
 },
 {
 q: 'Нужно ли что-то менять в двигателе перед Stage 1?',
 a: 'Нет. Stage 1 — это только прошивка, никаких механических изменений не требуется. Автомобиль должен быть в исправном техническом состоянии.',
 },
 {
 q: 'Влияет ли чип-тюнинг на гарантию производителя?',
 a: 'Формально изменение прошивки может стать поводом для отказа в гарантии на силовой агрегат. Именно поэтому мы предлагаем бесплатный откат к стоку перед любым обращением к дилеру.',
 },
 {
 q: 'Снизится ли расход топлива после тюнинга?',
 a: 'В спокойном режиме — да, на 5–15%. Оптимизация впрыска и зажигания повышает КПД двигателя. При активной езде расход, конечно, увеличится.',
 },
];

export default function ChipTuningPage() {
 return (
 <>
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

 {/* ── Hero ── */}
 <section className="relative pt-28 pb-16 overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-b from-[#39FF14]/5 via-transparent to-transparent pointer-events-none" />
 {/* Фото автомобиля на подъёмнике — фон */}
 <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block opacity-20 pointer-events-none overflow-hidden">
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img src="/images/works/10-bmw-x5-neon-workshop.jpg" alt="Mercedes на подъёмнике HP" className="h-full w-full object-cover object-center" />
   <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent" />
 </div>
 <div className="container relative z-10">
 {/* Breadcrumb */}
 <Breadcrumbs items={[{ label: "Тюнинг", href: "/tuning" }, { label: "Чип-тюнинг" }]} />

 <div className="max-w-3xl">
 <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] text-sm font-medium mb-6">
 <Zap className="size-3.5" />
 Alientech KESS3 · Лицензия
 </span>
 <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6">
 ЧИП-ТЮНИНГ<br />
 <span className="text-[#39FF14]">STAGE 1 / 2 / 3</span><br />
 В САНКТ-ПЕТЕРБУРГЕ
 </h1>
 <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
 Профессиональная прошивка ЭБУ для BMW, Mercedes, Audi, Porsche, Land Rover и 30+ марок.
 Рост мощности до +100%, откат к стоку бесплатно.
 </p>
 <div className="flex flex-wrap gap-4">
 <a href="#chip-calculator" className="btn-primary text-base px-8 py-4">
 <Zap className="size-5" />
 Рассчитать стоимость
 </a>
 <BookingButton label="Записаться на тюнинг" className="btn-secondary text-base px-8 py-4" />
 </div>
 </div>

 {/* Быстрые цифры */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
 {[
 { val: 'от 24 000 ₽', label: 'Stage 1' },
 { val: '+15–100%', label: 'Прирост мощности' },
 { val: '500+', label: 'Автомобилей' },
 { val: '9+ лет', label: 'опыта в тюнинге' },
 ].map((s) => (
 <div key={s.label} className="card text-center">
 <div className="font-display text-2xl md:text-3xl text-[#39FF14] mb-1">{s.val}</div>
 <div className="text-text-subtle text-sm">{s.label}</div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── Калькулятор ── */}
 <ChipCalculatorNew />

 {/* ── Индивидуальный подход ── */}
 <section className="py-16 container">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
 <div>
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-4">
 КАЖДАЯ МАШИНА —<br/>
 <span className="text-[#39FF14]">ИНДИВИДУАЛЬНЫЙ ПРОЕКТ</span>
 </h2>
 <p className="text-text-muted text-base leading-relaxed mb-6">
 Мы не продаём «коробочные» прошивки. Каждый автомобиль диагностируется
 отдельно: состояние двигателя, пробег, история обслуживания, топливо.
 Только после этого инженер подбирает параметры прошивки — давление наддува,
 углы зажигания, карты впрыска.
 </p>
 <p className="text-text-muted text-base leading-relaxed mb-6">
 Объём доработок зависит от задач клиента: одним нужна экономия топлива,
 другим — максимальная тяга под трек, третьим — ежедневный комфорт без
 потери надёжности. Цена рассчитывается под конкретный автомобиль и ваши цели.
 </p>
 <ul className="flex flex-col gap-3 mb-8">
 {[
 'Читаем оригинальную прошивку — не шьём «с нуля»',
 'Сохраняем файл оригинала навсегда — откат бесплатно',
 'Тест-драйв с инженером после каждой работы',
 'Гарантия 12 месяцев на любую прошивку',
 ].map((item, i) => (
 <li key={i} className="flex items-start gap-3 text-text-subtle text-sm">
 <CheckCircle className="size-4 text-[#39FF14] shrink-0 mt-0.5" />
 {item}
 </li>
 ))}
 </ul>
 <BookingButton label="Рассчитать стоимость под мой авто" className="btn-primary" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 {[
 { val: 'от 15 000 ₽', label: 'Прошивка ЭБУ', sub: 'Японские и китайские марки' },
 { val: 'от 24 000 ₽', label: 'Тюнинг ЭБУ', sub: 'Немецкий и британский премиум' },
 { val: '+15–100%', label: 'Прирост мощности', sub: 'В зависимости от задач' },
 { val: '30 мин', label: 'Откат к стоку', sub: 'Перед ТО или продажей' },
 ].map((item) => (
 <div key={item.label} className="card text-center p-5">
 <div className="font-display text-2xl text-[#39FF14] mb-1">{item.val}</div>
 <div className="text-text text-sm font-semibold mb-1">{item.label}</div>
 <div className="text-text-subtle text-xs">{item.sub}</div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── Таблица прироста ── */}
 <section className="py-16 bg-[#111113]">
 <div className="container">
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">
 ПРИМЕРЫ ПРИРОСТА МОЩНОСТИ
 </h2>
 <p className="text-text-muted mb-8">Реальные результаты на популярных моделях</p>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="border-b border-border">
 <th className="text-left py-3 px-4 text-text-subtle text-sm font-medium">Модель</th>
 <th className="text-center py-3 px-4 text-text-subtle text-sm font-medium">Сток</th>
 <th className="text-center py-3 px-4 text-[#39FF14] text-sm font-medium">Stage 1</th>
 <th className="text-center py-3 px-4 text-blue-400 text-sm font-medium">Stage 2</th>
 </tr>
 </thead>
 <tbody>
 {GAINS.map((row, i) => (
 <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
 <td className="py-3 px-4 text-text text-sm font-medium">{row.model}</td>
 <td className="py-3 px-4 text-center text-text-muted text-sm">{row.before}</td>
 <td className="py-3 px-4 text-center text-[#39FF14] font-semibold text-sm">{row.stage1}</td>
 <td className="py-3 px-4 text-center text-blue-400 font-semibold text-sm">{row.stage2}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <p className="text-text-subtle text-xs mt-4">* Данные усреднённые, точный результат зависит от состояния автомобиля</p>
 </div>
 </section>

 {/* ── Почему HP Тюнинг ── */}
 <section className="py-16 container">
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-10">
 ПОЧЕМУ HP ТЮНИНГ
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {WHY.map(({ icon: Icon, title, desc }) => (
 <div key={title} className="card">
 <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 flex items-center justify-center mb-4">
 <Icon className="size-6 text-[#39FF14]" />
 </div>
 <h3 className="font-semibold text-text mb-2">{title}</h3>
 <p className="text-text-subtle text-sm leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </section>

 {/* ── FAQ ── */}
 <section className="py-16 bg-[#111113]">
 <div className="container max-w-3xl">
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-10">
 ЧАСТЫЕ ВОПРОСЫ
 </h2>
 <div className="flex flex-col gap-4">
 {FAQ.map((item, i) => (
 <details key={i} className="card group">
 <summary className="flex items-center justify-between cursor-pointer list-none">
 <span className="font-medium text-text group-open:text-[#39FF14] transition-colors pr-4">{item.q}</span>
 <span className="text-text-subtle group-open:text-[#39FF14] shrink-0 text-lg leading-none">+</span>
 </summary>
 <p className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-border">{item.a}</p>
 </details>
 ))}
 </div>
 </div>
 </section>

 {/* ── CTA ── */}
 <section className="py-16 container">
 <div className="card border-[#39FF14]/20 text-center p-10 glow-box">
 <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 flex items-center justify-center mx-auto mb-6">
 <Zap className="size-8 text-[#39FF14]" />
 </div>
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">
 ЗАПИСАТЬСЯ НА ЧИП-ТЮНИНГ
 </h2>
 <p className="text-text-muted mb-8 max-w-md mx-auto">
 Оставьте заявку — перезвоним в течение 15 минут, уточним модель и назначим время.
 </p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
 <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
 <Phone className="size-4" />
 +7 (981) 842-81-51
 </a>
 </div>
 </div>
 </section>
 </>
 );
}
