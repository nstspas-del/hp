import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Volume2, Wind, CheckCircle } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Тюнинг автомобилей в СПб — чип-тюнинг Stage 1/2/3 | HP Тюнинг',
  description: 'Профессиональный тюнинг в Санкт-Петербурге: чип-тюнинг от 17 000 ₽, тормозной тюнинг Brembo, спортивный выхлоп, шумоизоляция. BMW, Mercedes, Audi, Porsche, Land Rover. Alientech KESSv3.',
  keywords: ['тюнинг авто спб', 'чип тюнинг петербург', 'тюнинг бмв спб', 'тюнинг мерседес спб', 'stage 1 спб', 'alientech спб'],
  alternates: { canonical: 'https://hptuning.ru/tuning' },
  openGraph: {
    title: 'Тюнинг автомобилей в Санкт-Петербурге | HP Тюнинг',
    description: 'Чип-тюнинг от 17 000 ₽, тормозной тюнинг Brembo, выхлоп, шумка. Alientech KESSv3.',
    url: 'https://hptuning.ru/tuning',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/tuning.jpg', width: 1200, height: 630, alt: 'Тюнинг автомобилей в Санкт-Петербурге | HP Тюнинг' }],
  },
};

const SERVICES = [
  {
    icon: Zap,
    title: 'Чип-тюнинг',
    sub: 'Stage 1 / 2 / 3',
    desc: 'Перепрошивка ЭБУ для роста мощности до +40% и момента до +50%. Гарантия 1 год, откат к стоку в любой момент.',
    href: '/tuning/chip-tuning',
    from: '24 000 ₽',
    badge: 'Хит',
    color: 'text-[#39FF14]',
    bg: 'bg-[#39FF14]/10',
  },
  {
    icon: Shield,
    title: 'Тормозной тюнинг',
    sub: 'Brembo, AP Racing',
    desc: 'Спортивные тормозные системы, увеличенные диски, многопоршневые суппорты для максимальной эффективности торможения.',
    href: '/service/brakes',
    from: '45 000 ₽',
    badge: null,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: Wind,
    title: 'Выхлопная система',
    sub: 'Sport-выхлоп, клапаны',
    desc: 'Установка спортивных катбэков, даунпайпов, клапанных выхлопов. Повышение мощности и характерный звук.',
    href: '/tuning/chip-tuning',
    from: '35 000 ₽',
    badge: null,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Volume2,
    title: 'Шумоизоляция',
    sub: 'Виброизол, шумка',
    desc: 'Профессиональная шумоизоляция дверей, пола, арок, багажника и крыши. Материалы STP, Comfort Mat, Бипласт.',
    href: '/service/suspension',
    from: '18 000 ₽',
    badge: null,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
];

const WHY = [
  { val: '9+',    label: 'лет на рынке' },
  { val: '500+',  label: 'авто прошито' },
  { val: '30+',   label: 'марок' },
  { val: '1 год', label: 'гарантия' },
];

const EQUIPMENT = ['Alientech KESSv3', 'Dimsport MyGenius', 'CMD Flash', 'MPPS v22', 'WinOLS 4'];

export default function TuningPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Тюнинг' }]} />

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-[#09090b]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(57,255,20,0.08),transparent)]" />
        <div className="relative container pb-16 pt-36">
          <span className="badge mb-4">Тюнинг автомобилей</span>
          <h1 className="section-title text-5xl md:text-7xl mb-4">
            ТЮНИНГ{' '}
            <span className="text-[#39FF14]" style={{ textShadow: '0 0 40px rgba(57,255,20,0.5)' }}>
              АВТО
            </span>
            <br />В САНКТ-ПЕТЕРБУРГЕ
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mb-8">
            Чип-тюнинг Stage 1/2/3, тормозной тюнинг, спортивные выхлопные системы и шумоизоляция.
            Работаем с BMW, Mercedes, Audi, Porsche, Land Rover и ещё 26 марками.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookingButton className="btn-primary px-8 py-4 text-base" />
            <Link href="/tuning/chip-tuning" className="btn-secondary px-8 py-4 text-base">
              Чип-тюнинг →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Статистика ── */}
      <section className="border-y border-white/8 bg-[#111113]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {WHY.map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <div className="font-display text-4xl text-[#39FF14]" style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}>
                  {s.val}
                </div>
                <div className="text-zinc-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 карточки услуг ── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge mb-4">Направления</span>
            <h2 className="section-title">ВИДЫ ТЮНИНГА</h2>
            <p className="text-zinc-500 mt-3 max-w-xl mx-auto">
              Каждое направление — отдельная экспертиза с профессиональным оборудованием
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="card group hover:border-[#39FF14]/30 flex flex-col gap-4 relative overflow-hidden"
                >
                  {s.badge && (
                    <span className="absolute top-4 right-4 text-[10px] bg-[#39FF14]/20 text-[#39FF14] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                      {s.badge}
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`size-6 ${s.color}`} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-display text-2xl text-white group-hover:text-[#39FF14] transition-colors">
                        {s.title}
                      </h3>
                      <span className="text-zinc-600 text-sm">{s.sub}</span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/8">
                    <span className="text-[#39FF14] font-bold">от {s.from}</span>
                    <ArrowRight className="size-4 text-zinc-600 group-hover:text-[#39FF14] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Оборудование ── */}
      <section className="section bg-[#111113]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">Профессиональный инструмент</span>
              <h2 className="section-title text-4xl mb-4">РАБОТАЕМ<br />НА ЛУЧШЕМ<br />ОБОРУДОВАНИИ</h2>
              <p className="text-zinc-500 leading-relaxed mb-6">
                Используем только сертифицированное оборудование ведущих европейских производителей.
                Каждый файл прошивки разрабатывается индивидуально под параметры конкретного автомобиля.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Индивидуальные калибровки для каждого авто',
                  'Оригинальные прошивки сохраняем перед работой',
                  'Откат к стоку в любой момент',
                  'Гарантия 1 год на двигатель',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-400 text-sm">
                    <CheckCircle className="size-4 text-[#39FF14] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {EQUIPMENT.map((eq) => (
                <div key={eq} className="flex items-center gap-4 bg-[#09090b] border border-white/8 rounded-xl px-5 py-4">
                  <div className="w-2 h-2 rounded-full bg-[#39FF14] shrink-0" />
                  <span className="text-white font-semibold">{eq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden border border-[#39FF14]/20 p-10 md:p-16 text-center"
               style={{ boxShadow: '0 0 60px rgba(57,255,20,0.06)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.06),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="section-title text-4xl md:text-5xl mb-4">ГОТОВЫ К ТЮНИНГУ?</h2>
              <p className="text-zinc-500 max-w-xl mx-auto mb-8">
                Запишитесь онлайн или позвоните — подберём оптимальную программу для вашего авто
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <BookingButton className="btn-primary px-10 py-4 text-base" />
                <a href="tel:+79818428151" className="btn-secondary px-10 py-4 text-base">
                  +7 (981) 842-81-51
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
