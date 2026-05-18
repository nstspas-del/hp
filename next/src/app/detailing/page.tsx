export const dynamic = 'force-static';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Sparkles, ChevronRight, CheckCircle, Phone, Shield, Award, Star, Layers, Volume2, Armchair, Droplets, Eye } from 'lucide-react';
import { DetailingCalculator } from '@/components/sections/DetailingCalculator';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
 title: 'Детейлинг в СПб — керамика 9H, PPF XPEL, полировка | HP Тюнинг',
 description: 'Детейлинг-студия в Санкт-Петербурге: керамика 9H Gyeon от 22 000 ₽, PPF XPEL/SunTek от 8 000 ₽, полировка от 10 000 ₽, химчистка от 4 000 ₽, тонировка.',
 keywords: ['детейлинг спб', 'керамика авто спб', 'ppf плёнка спб', 'полировка кузова спб', 'химчистка салона спб', 'тонировка авто спб'],
 alternates: { canonical: 'https://hptuning.ru/detailing' },
 openGraph: {
 title: 'Детейлинг в СПб — керамика 9H, PPF, полировка | HP Тюнинг',
 description: 'Керамика от 22 000 ₽, PPF от 8 000 ₽, полировка от 10 000 ₽. Gyeon, XPEL, 3M.',
 url: 'https://hptuning.ru/detailing',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/detailing.jpg', width: 1200, height: 630, alt: 'Детейлинг в СПб — керамика 9H, PPF, полировка | HP Тюнинг' }],
 },
};

// ── Услуги детейлинга, разбитые на 3 категории ──
// 🛡️ Защита кузова — Керамика, PPF, Полировка
// ✨ Уход — Химчистка, Тонировка, Полировка фар
// 🔇 Комфорт — Шумоизоляция, Тюнинг салона (карбон / алькантара / кожа)
const SERVICE_CATEGORIES = [
  {
    id: 'protection',
    label: '🛡️ Защита кузова',
    description: 'Покрытия и плёнки, которые защищают ЛКП от камней, царапин и УФ',
    accent: '#39FF14',
    services: [
      {
        icon: Layers, slug: 'ceramic', title: 'Керамическое покрытие 9H',
        badge: 'Популярно', badgeColor: 'bg-[#39FF14]/20 text-[#39FF14]',
        price: 'от 22 000 ₽', time: '2–3 дня',
        desc: 'Твёрдость 9H, защита на 2–5 лет. Gyeon Q² / Ceramic Pro / Koch-Chemie.',
        features: ['Твёрдость 9H', 'Срок 2–5 лет', 'Hydrophobic-эффект', 'Gyeon / Ceramic Pro'],
        href: '/detailing/ceramic',
      },
      {
        icon: Shield, slug: 'ppf', title: 'PPF плёнка',
        badge: 'Максимальная защита', badgeColor: 'bg-blue-500/20 text-blue-400',
        price: 'от 8 000 ₽', time: '4 ч – 5 дней',
        desc: 'Самозаживляющаяся полиуретановая плёнка XPEL / SunTek / 3M от камней и сколов.',
        features: ['Самозаживление', 'XPEL / SunTek / 3M', 'Срок до 10 лет', 'Капот / перед / кузов'],
        href: '/detailing/ppf',
      },
      {
        icon: Star, slug: 'polishing', title: 'Полировка кузова',
        badge: 'Восстановление', badgeColor: 'bg-purple-500/20 text-purple-400',
        price: 'от 10 000 ₽', time: '1–2 дня',
        desc: 'Удаление царапин, голограмм и окислений. 1-, 2- и 3-шаговая полировка.',
        features: ['1-/2-/3-шаговая', 'Koch-Chemie', 'Перед керамикой', 'Машинная + ручная'],
        href: '/detailing/polishing',
      },
    ],
  },
  {
    id: 'care',
    label: '✨ Уход',
    description: 'Восстановление салона, оптики и стёкол до состояния «как из салона»',
    accent: '#A855F7',
    services: [
      {
        icon: Sparkles, slug: 'dry-cleaning', title: 'Химчистка салона',
        badge: 'Очистка', badgeColor: 'bg-orange-500/20 text-orange-400',
        price: 'от 4 000 ₽', time: '1 день',
        desc: 'Чистка кожи, алькантары, ковров и потолка. Озонирование, питание кожи.',
        features: ['Кожа / алькантара', 'Питание кожи Leather Doctor', 'Озонирование', 'Удаление запахов'],
        href: '/detailing/dry-cleaning',
      },
      {
        icon: Eye, slug: 'headlights-restoration', title: 'Полировка фар',
        badge: 'Оптика', badgeColor: 'bg-yellow-500/20 text-yellow-400',
        price: 'от 5 000 ₽', time: '1–2 часа',
        desc: 'Устранение помутнения и пожелтения. Защитное покрытие от повторного выгорания.',
        features: ['Светопропускание +90%', 'Защитное покрытие', 'УФ-стойкость 2–3 года', '1–2 часа'],
        href: '/detailing/headlights-restoration',
      },
      {
        icon: Droplets, slug: 'tinting', title: 'Тонировка стёкол',
        badge: 'По ПДД', badgeColor: 'bg-gray-500/20 text-gray-400',
        price: 'от 3 500 ₽', time: '2–4 часа',
        desc: 'Плёнки LLumar / 3M / SunTek. Передние боковые, задние, панорамная крыша.',
        features: ['LLumar / 3M / SunTek', 'Боковые + заднее', 'Панорамная крыша', 'В пределах ПДД'],
        href: '/detailing#tint',
      },
    ],
  },
  {
    id: 'comfort',
    label: '🔇 Комфорт',
    description: 'Шумоизоляция и тюнинг салона — премиум-материалы, индивидуальный стиль',
    accent: '#39FF14',
    services: [
      {
        icon: Volume2, slug: 'sound-isolation', title: 'Шумоизоляция салона',
        badge: 'Тишина', badgeColor: 'bg-[#39FF14]/20 text-[#39FF14]',
        price: 'от 35 000 ₽', time: '2–4 дня',
        desc: 'Виброизол StP, Comfortmat, Шумофф. Снижение шума на 6–12 дБ — двери, пол, потолок.',
        features: ['Виброизол + Шумофф', 'Двери / пол / потолок', '-6 до -12 дБ', 'Премиум-материалы'],
        href: '/detailing/sound-isolation',
      },
      {
        icon: Armchair, slug: 'interior-styling', title: 'Тюнинг салона',
        badge: 'Премиум', badgeColor: 'bg-purple-500/20 text-purple-400',
        price: 'от 25 000 ₽', time: '3–7 дней',
        desc: 'Перетяжка руля, торпедо, дверных карт. Карбон, алькантара, кожа Nappa.',
        features: ['Алькантара / Nappa', 'Карбон (real / aqua-print)', 'Контрастная прострочка', 'RGB / Ambient'],
        href: '/detailing/interior-styling',
      },
    ],
  },
];

// Уплощённый список для backward compatibility (используется в старом коде)
const SERVICES = SERVICE_CATEGORIES.flatMap((c) => c.services);

const MATERIALS = [
 { name: 'Gyeon', label: 'Керамика', color: 'text-[#39FF14]' },
 { name: 'Koch-Chemie', label: 'Полировка / Химчистка', color: 'text-blue-400' },
 { name: 'XPEL', label: 'PPF', color: 'text-orange-400' },
 { name: 'SunTek', label: 'PPF / Тонировка', color: 'text-purple-400' },
 { name: '3M', label: 'PPF / Тонировка', color: 'text-red-400' },
 { name: 'LLumar', label: 'Тонировка', color: 'text-gray-400' },
];

const PROCESS = [
 { step: '01', title: 'Осмотр и диагностика', desc: 'Фиксируем состояние ЛКП, выявляем царапины, сколы, окисления. Согласовываем объём работ и итоговую стоимость.' },
 { step: '02', title: 'Подготовка', desc: 'Детальная мойка, обезжиривание, при необходимости — полировка для выравнивания ЛКП перед нанесением защиты.' },
 { step: '03', title: 'Нанесение покрытия', desc: 'Профессиональное нанесение выбранного материала: керамика, PPF или тонировка в климатически контролируемом боксе.' },
 { step: '04', title: 'Контроль качества', desc: 'Проверка в LED-освещении, финальный осмотр с клиентом, выдача документов по уходу за покрытием.' },
];

const FAQ = [
 {
 q: 'Сколько стоит керамическое покрытие?',
 a: 'Керамика стоит от 35 000 ₽ для малого класса (A/B). Цена зависит от размера кузова, состояния ЛКП и выбранного состава. Используйте калькулятор ниже — точная цена за 30 секунд.',
 },
 {
 q: 'Чем PPF лучше керамики?',
 a: 'PPF защищает физически — плёнка поглощает удары камней и предотвращает сколы. Керамика защищает химически — от реагентов, птичьего помёта, УФ-лучей и упрощает мойку. Идеальная комбинация — PPF + керамика поверх.',
 },
 {
 q: 'Как долго держится керамика?',
 a: 'Gyeon Quartz — 2–3 года при правильном уходе, Pro-версии — до 5 лет. Срок зависит от условий эксплуатации и интенсивности мойки.',
 },
 {
 q: 'Можно ли мыть машину после нанесения керамики?',
 a: 'Первые 5–7 дней нельзя мочить автомобиль. Затем — только бесконтактная или ручная мойка. Автомойки с жёсткими щётками исключены — они царапают керамику.',
 },
 {
 q: 'Тонировка передних стёкол — это законно?',
 a: 'По ПДД передние боковые стёкла должны пропускать не менее 70% света. Мы работаем только в пределах ПДД — лобовое и передние боковые тонируются разрешёнными плёнками, остальные — по желанию.',
 },
 {
 q: 'Сколько времени займёт химчистка салона?',
 a: 'Стандартная химчистка — 1 рабочий день. С озонированием и глубокой чисткой кожи — 1–2 дня. Точное время зависит от состояния салона.',
 },
];

export default function DetailingPage() {
 return (
 <>
{/* ── Hero ── */}
 <section className="relative pt-28 pb-16 overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
 {/* BMW X7 в неоне — фоновое фото */}
 <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block opacity-15 pointer-events-none overflow-hidden">
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img src="/images/works/04-ceramic-coating-application.jpg" alt="BMW X7 детейлинг HP" className="h-full w-full object-cover object-left-top" />
   <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent" />
 </div>
 <div className="container relative z-10">
 {/* Breadcrumb */}
 <Breadcrumbs items={[{ label: "Детейлинг" }]} />

 <div className="max-w-3xl">
 <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
 <Sparkles className="size-3.5" />
 Gyeon · XPEL · Koch-Chemie · 3M
 </span>
 <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6">
 ДЕТЕЙЛИНГ<br />
 <span className="text-[#39FF14]">И ЗАЩИТНЫЕ</span><br />
 ПОКРЫТИЯ В СПБ
 </h1>
 <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
 Керамика 9H, PPF-плёнка, профессиональная полировка, химчистка и тонировка
 для вашего автомобиля. Только сертифицированные материалы.
 </p>
 <div className="flex flex-wrap gap-4">
 <a href="#detailing-calculator" className="btn-primary text-base px-8 py-4">
 <Sparkles className="size-5" />
 Рассчитать стоимость
 </a>
 <BookingButton label="Записаться на детейлинг" className="btn-secondary text-base px-8 py-4" />
 </div>
 </div>

 {/* Быстрые цифры */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
 {[
 { val: 'от 3 500 ₽', label: 'Тонировка' },
 { val: 'от 8 000 ₽', label: 'Химчистка' },
 { val: 'от 35 000 ₽', label: 'Керамика 9H' },
 { val: 'XPEL', label: 'плёнка PPF' },
 ].map((s) => (
 <div key={s.label} className="card text-center">
 <div className="font-display text-2xl md:text-3xl text-[#39FF14] mb-1">{s.val}</div>
 <div className="text-text-subtle text-sm">{s.label}</div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── Услуги детейлинга, разбитые на 3 категории ── */}
 <section className="py-12 md:py-16 bg-[#111113]">
   <div className="container">
     <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">УСЛУГИ ДЕТЕЙЛИНГА</h2>
     <p className="text-text-muted mb-10">Защита, уход и комфорт — выберите направление или используйте калькулятор ниже</p>

     {SERVICE_CATEGORIES.map((cat) => (
       <div key={cat.id} id={cat.id} className="mb-12 last:mb-0 scroll-mt-24">
         <div className="flex items-baseline justify-between mb-2 border-b border-white/8 pb-2">
           <h3 className="font-display text-xl md:text-2xl text-white uppercase tracking-wide">
             {cat.label}
           </h3>
           <span className="text-zinc-500 text-xs">{cat.services.length} услуг</span>
         </div>
         <p className="text-text-muted text-sm mb-5">{cat.description}</p>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
           {cat.services.map((svc) => {
             const Icon = svc.icon;
             return (
               <Link
                 key={svc.slug}
                 href={svc.href}
                 className="card border border-white/10 hover:border-[color:var(--cat-accent)] transition-colors flex flex-col group"
                 style={{ '--cat-accent': cat.accent } as React.CSSProperties}
               >
                 <div className="flex items-start justify-between mb-4">
                   <div
                     className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: `${cat.accent}15` }}
                   >
                     <Icon className="size-5" color={cat.accent} />
                   </div>
                   <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${svc.badgeColor}`}>
                     {svc.badge}
                   </span>
                 </div>

                 <h4 className="font-display text-lg text-text mb-1 group-hover:text-[color:var(--cat-accent)] transition-colors">
                   {svc.title}
                 </h4>
                 <div className="flex items-center gap-3 mb-3">
                   <span className="text-[#39FF14] font-semibold text-sm">{svc.price}</span>
                   <span className="text-text-subtle text-xs">· {svc.time}</span>
                 </div>

                 <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">{svc.desc}</p>

                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
                   {svc.features.map((f, i) => (
                     <li key={i} className="flex items-center gap-1.5 text-text-subtle text-xs">
                       <CheckCircle className="size-3 text-[#39FF14] shrink-0" />
                       {f}
                     </li>
                   ))}
                 </ul>

                 <span className="text-sm text-[color:var(--cat-accent)] font-medium inline-flex items-center gap-1 mt-auto">
                   Подробнее <ChevronRight className="size-4" />
                 </span>
               </Link>
             );
           })}
         </div>
       </div>
     ))}
   </div>
 </section>

 {/* ── Калькулятор детейлинга ── */}
 <section id="detailing-calculator" className="py-16 container">
 <div className="text-center mb-10">
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">
 КАЛЬКУЛЯТОР ДЕТЕЙЛИНГА
 </h2>
 <p className="text-text-muted">Выберите класс автомобиля и услуги — получите итоговую стоимость</p>
 </div>
 <DetailingCalculator />
 </section>

 {/* ── Материалы ── */}
 <section className="py-16 bg-[#111113]">
 <div className="container">
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">
 СЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ
 </h2>
 <p className="text-text-muted mb-10">Работаем только с профессиональными составами от ведущих производителей</p>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
 {MATERIALS.map((m) => (
 <div key={m.name} className="card text-center hover:border-[#39FF14]/30 transition-colors">
 <div className={`font-display text-2xl mb-2 ${m.color}`}>{m.name}</div>
 <div className="text-text-subtle text-xs">{m.label}</div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── Процесс ── */}
 <section className="py-16 container">
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-10">
 КАК МЫ РАБОТАЕМ
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {PROCESS.map((step) => (
 <div key={step.step} className="card">
 <div className="font-display text-4xl text-[#39FF14]/30 mb-4">{step.step}</div>
 <h3 className="font-semibold text-text mb-2">{step.title}</h3>
 <p className="text-text-subtle text-sm leading-relaxed">{step.desc}</p>
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
 <Sparkles className="size-8 text-[#39FF14]" />
 </div>
 <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">
 ЗАПИСАТЬСЯ НА ДЕТЕЙЛИНГ
 </h2>
 <p className="text-text-muted mb-8 max-w-md mx-auto">
 Оставьте заявку — перезвоним за 15 минут, уточним модель и запишем на удобное время.
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
