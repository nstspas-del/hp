export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Zap, ChevronRight, CheckCircle, Phone, TrendingUp, Shield, RotateCcw, Award } from 'lucide-react';
import { ChipCalculatorNew } from '@/components/sections/ChipCalculatorNew';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
 title: 'Чип-тюнинг Stage 1/2/3 в СПб — от 24 000 ₽ | HP Тюнинг',
 description: 'Профессиональный чип-тюнинг в Санкт-Петербурге: Stage 1 от 24 000 ₽, Stage 2 от 39 000 ₽, Stage 3 от 99 000 ₽. Прирост +20–100% мощности. BMW, Mercedes, Audi, Porsche, Land Rover. ',
 keywords: ['чип тюнинг спб', 'stage 1 чип тюнинг спб', 'stage 2 тюнинг', 'прошивка эбу спб', 'чип тюнинг bmw спб', 'alientech kess3'],
 alternates: { canonical: 'https://hptuning.ru/tuning/chip-tuning' },
 openGraph: {
 title: 'Чип-тюнинг Stage 1/2/3 в Санкт-Петербурге | HP Тюнинг',
 description: 'Stage 1 от 24 000 ₽. Прошивка BMW, Mercedes, Audi, Porsche, Land Rover. Alientech. ',
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

const STAGES = [
 {
 slug: 'stage-1',
 label: 'Stage 1',
 badge: 'Самый популярный',
 badgeColor: 'bg-[#39FF14]/20 text-[#39FF14]',
 price: '24 000',
 priceNote: 'от',
 time: '2–3 часа',
 power: '+15–30%',
 torque: '+20–40%',
 desc: 'Оптимизация прошивки без замены железа. Рост мощности, момента и снижение расхода топлива. Идеально для повседневной эксплуатации.',
 includes: [
 'Чтение и анализ оригинальной прошивки',
 'Оптимизация карт впрыска и зажигания',
 'Настройка турбонаддува',
 'Запись и проверка на стенде',
 'Тест-драйв с инженером',
 ],
 href: '/tuning/chip-tuning/stage-1',
 color: 'border-[#39FF14]/40 hover:border-[#39FF14]',
 },
 {
 slug: 'stage-2',
 label: 'Stage 2',
 badge: 'Максимальная отдача',
 badgeColor: 'bg-blue-500/20 text-blue-400',
 price: '39 000',
 priceNote: 'от',
 time: '1 день',
 power: '+30–45%',
 torque: '+40–60%',
 desc: 'Прошивка под спортивный выхлоп, увеличенный интеркулер и усиленное сцепление. Серьёзный прирост для тех, кто хочет больше.',
 includes: [
 'Всё из Stage 1',
 'Настройка под модифицированный выхлоп',
 'Оптимизация под усиленный интеркулер',
 'Настройка сцепления/трансмиссии',
 'Настройка на диностенде (опционально)',
 ],
 href: '/tuning/chip-tuning/stage-2',
 color: 'border-blue-500/40 hover:border-blue-400',
 },
 {
 slug: 'stage-3',
 label: 'Stage 3',
 badge: 'Экстремальный',
 badgeColor: 'bg-orange-500/20 text-orange-400',
 price: '95 000',
 priceNote: 'от',
 time: '2–5 дней',
 power: '+50–100%',
 torque: '+60–100%',
 desc: 'Полная форсировка: турбина big-turbo, кованые поршни, топливная система. Мощность 400–700+ л.с. Только для подготовленных автомобилей.',
 includes: [
 'Разработка индивидуальной прошивки',
 'Настройка под big-turbo и форсунки',
 'Работа с LPFP/HPFP насосами',
 'Настройка систем охлаждения',
 'Несколько сессий на диностенде',
 ],
 href: '/tuning/chip-tuning/stage-3',
 color: 'border-orange-500/40 hover:border-orange-400',
 },
];

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

 {/* ── 3 Stage карточки ── */}
 <section className="py-16 container">
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">ТЮНИНГ И ЧИП-ТЮНИНГ</h2>
 <p className="text-text-muted mb-10">Прошивка ЭБУ, аппаратные доработки и проекты полного форсирования под задачи клиента</p>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {STAGES.map((stage) => (
 <div key={stage.slug} className={`card border transition-colors flex flex-col ${stage.color}`}>
 <div className="flex items-start justify-between mb-4">
 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stage.badgeColor}`}>
 {stage.badge}
 </span>
 <span className="font-display text-2xl text-text">{stage.label}</span>
 </div>

 <div className="mb-4">
 <div className="text-text-subtle text-xs uppercase tracking-wider mb-1">Стоимость</div>
 <div className="font-display text-4xl text-[#39FF14]">{stage.priceNote} {stage.price} ₽</div>
 </div>

 <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-white/5 rounded-xl">
 <div className="text-center">
 <div className="text-text-subtle text-xs mb-1">Время</div>
 <div className="text-text text-sm font-medium">{stage.time}</div>
 </div>
 <div className="text-center border-x border-border">
 <div className="text-text-subtle text-xs mb-1">Мощность</div>
 <div className="text-[#39FF14] text-sm font-semibold">{stage.power}</div>
 </div>
 <div className="text-center">
 <div className="text-text-subtle text-xs mb-1">Момент</div>
 <div className="text-[#39FF14] text-sm font-semibold">{stage.torque}</div>
 </div>
 </div>

 <p className="text-text-muted text-sm leading-relaxed mb-4">{stage.desc}</p>

 <ul className="flex flex-col gap-2 mb-6 flex-1">
 {stage.includes.map((item, i) => (
 <li key={i} className="flex items-start gap-2 text-text-subtle text-sm">
 <CheckCircle className="size-4 text-[#39FF14] shrink-0 mt-0.5" />
 {item}
 </li>
 ))}
 </ul>

 <Link href={stage.href} className="btn-primary w-full justify-center">
 Подробнее о {stage.label}
 <ChevronRight className="size-4" />
 </Link>
 </div>
 ))}
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
