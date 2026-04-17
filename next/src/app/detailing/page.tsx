import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronRight, CheckCircle, Phone, Shield, Award, Star, Layers } from 'lucide-react';
import { DetailingCalculator } from '@/components/sections/DetailingCalculator';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Детейлинг в СПб — керамика 9H, PPF XPEL, полировка | HP Тюнинг',
  description: 'Детейлинг-студия в Санкт-Петербурге: керамика 9H Gyeon от 22 000 ₽, PPF XPEL/SunTek от 8 000 ₽, полировка от 10 000 ₽, химчистка от 4 000 ₽, тонировка. Гарантия качества.',
  keywords: ['детейлинг спб', 'керамика авто спб', 'ppf плёнка спб', 'полировка кузова спб', 'химчистка салона спб', 'тонировка авто спб'],
  alternates: { canonical: 'https://hptuning.ru/detailing' },
  openGraph: {
    title: 'Детейлинг в СПб — керамика 9H, PPF, полировка | HP Тюнинг',
    description: 'Керамика от 22 000 ₽, PPF от 8 000 ₽, полировка от 10 000 ₽. Gyeon, XPEL, 3M. Гарантия.',
    url: 'https://hptuning.ru/detailing',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/detailing.jpg', width: 1200, height: 630, alt: 'Детейлинг в СПб — керамика 9H, PPF, полировка | HP Тюнинг' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
    { '@type': 'ListItem', position: 2, name: 'Детейлинг', item: 'https://hptuning.ru/detailing' },
  ],
};

const SERVICES = [
  {
    icon: Layers,
    slug: 'ceramic',
    title: 'Керамическое покрытие',
    badge: 'Популярно',
    badgeColor: 'bg-[#39FF14]/20 text-[#39FF14]',
    price: 'от 35 000 ₽',
    time: '2–3 дня',
    desc: 'Покрытие твёрдостью 9H защищает от царапин, УФ-излучения, химии и упрощает мойку на 2–5 лет.',
    features: ['Твёрдость 9H', 'Срок 2–5 лет', 'Hydrophobic-эффект', 'Gyeon / Koch-Chemie'],
    color: 'border-[#39FF14]/30 hover:border-[#39FF14]/60',
    href: '/detailing/ceramic',
  },
  {
    icon: Shield,
    slug: 'ppf',
    title: 'PPF плёнка',
    badge: 'Максимальная защита',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    price: 'от 45 000 ₽',
    time: '3–5 дней',
    desc: 'Полиуретановая плёнка XPEL/SunTek защищает лакокрасочное покрытие от камней, царапин и сколов.',
    features: ['Самозаживление', 'XPEL / SunTek / 3M', 'Срок до 10 лет', 'Гарантия производителя'],
    color: 'border-blue-500/30 hover:border-blue-400/60',
    href: '/detailing/ppf',
  },
  {
    icon: Star,
    slug: 'polish',
    title: 'Полировка кузова',
    badge: 'Восстановление',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    price: 'от 15 000 ₽',
    time: '1–2 дня',
    desc: 'Удаление царапин, голограмм и окислений. Одношаговая и двухшаговая корректирующая полировка.',
    features: ['1- и 2-шаговая', 'Koch-Chemie', 'Машинная и ручная', 'Перед нанесением защиты'],
    color: 'border-purple-500/30 hover:border-purple-400/60',
    href: '/detailing/polish',
  },
  {
    icon: Sparkles,
    slug: 'interior',
    title: 'Химчистка салона',
    badge: 'Очистка',
    badgeColor: 'bg-orange-500/20 text-orange-400',
    price: 'от 8 000 ₽',
    time: '1 день',
    desc: 'Профессиональная чистка кожи, алькантары, ковров и потолка. Озонирование и дезинфекция.',
    features: ['Кожа / алькантара', 'Ковры и потолок', 'Озонирование', 'Koch-Chemie'],
    color: 'border-orange-500/30 hover:border-orange-400/60',
    href: '/detailing/interior',
  },
  {
    icon: Award,
    slug: 'tint',
    title: 'Тонировка',
    badge: 'Комфорт',
    badgeColor: 'bg-gray-500/20 text-gray-400',
    price: 'от 3 500 ₽',
    time: '2–4 часа',
    desc: 'Тонировка плёнками LLumar, 3M, SunTek. Стёкла, панорамная крыша. Соответствие ПДД.',
    features: ['LLumar / 3M / SunTek', 'Боковые + задние', 'Панорамная крыша', 'Без пузырей и разводов'],
    color: 'border-gray-500/30 hover:border-gray-400/60',
    href: '/detailing/tint',
  },
];

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
  { step: '04', title: 'Контроль качества', desc: 'Проверка в LED-освещении, финальный осмотр с клиентом, выдача гарантийного талона и инструкций по уходу.' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-subtle mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
            <ChevronRight className="size-4" />
            <span className="text-text-muted">Детейлинг</span>
          </nav>

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
              { val: '5 лет', label: 'Гарантия на PPF' },
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <div className="font-display text-2xl md:text-3xl text-[#39FF14] mb-1">{s.val}</div>
                <div className="text-text-subtle text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 карточек услуг ── */}
      <section className="py-16 bg-[#111113]">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">УСЛУГИ ДЕТЕЙЛИНГА</h2>
          <p className="text-text-muted mb-10">Выберите нужную услугу или воспользуйтесь калькулятором</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.slug} className={`card border transition-colors flex flex-col ${svc.color}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="size-5 text-text-muted" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${svc.badgeColor}`}>
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-text mb-1">{svc.title}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#39FF14] font-semibold text-sm">{svc.price}</span>
                    <span className="text-text-subtle text-xs">· {svc.time}</span>
                  </div>

                  <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">{svc.desc}</p>

                  <ul className="grid grid-cols-2 gap-1.5 mb-5">
                    {svc.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-text-subtle text-xs">
                        <CheckCircle className="size-3 text-[#39FF14] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={svc.href} className="btn-secondary w-full justify-center text-sm">
                    Подробнее <ChevronRight className="size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
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
