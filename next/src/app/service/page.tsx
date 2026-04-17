import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Wrench, ChevronRight, CheckCircle, Phone, Gauge, Zap, Settings, Disc, Car, Cpu } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Автосервис BMW, Mercedes, Audi в СПб — ТО от 3 000 ₽ | HP Тюнинг',
  description: 'Автосервис премиум-класса в Санкт-Петербурге: ТО от 3 000 ₽, диагностика от 1 500 ₽, ремонт двигателя, тормозов, подвески, АКПП. BMW, Mercedes, Audi, Porsche, Land Rover, Lexus. Гарантия.',
  keywords: ['автосервис спб', 'то бмв спб', 'ремонт мерседес спб', 'автосервис премиум петербург', 'диагностика авто спб'],
  alternates: { canonical: 'https://hptuning.ru/service' },
  openGraph: {
    title: 'Автосервис BMW, Mercedes, Audi в СПб | HP Тюнинг',
    description: 'ТО от 3 000 ₽, диагностика от 1 500 ₽, ремонт двигателя, тормозов, подвески, АКПП. Санкт-Петербург.',
    url: 'https://hptuning.ru/service',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/service.jpg', width: 1200, height: 630, alt: 'Автосервис BMW, Mercedes, Audi в СПб | HP Тюнинг' }],
  },
};

const SERVICES = [
  {
    icon: Settings,
    slug: 'to',
    title: 'Техническое обслуживание',
    desc: 'Замена масла, фильтров, жидкостей, свечей по регламенту. Фиксированные цены.',
    price: 'от 3 000 ₽',
    time: '2–4 ч',
    color: 'text-[#39FF14]',
    bg: 'bg-[#39FF14]/10',
    href: '/service/to',
  },
  {
    icon: Cpu,
    slug: 'diagnostics',
    title: 'Компьютерная диагностика',
    desc: 'Считываем ошибки ЭБУ, определяем причину неисправности. Заключение с расшифровкой.',
    price: 'от 1 500 ₽',
    time: '1–2 ч',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    href: '/service/diagnostics',
  },
  {
    icon: Gauge,
    slug: 'engine',
    title: 'Ремонт двигателя',
    desc: 'Замена ГРМ, прокладки ГБЦ, маслосъёмных колец, форсунок. Сложный ремонт любых моторов.',
    price: 'от 10 000 ₽',
    time: '1–5 дней',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    href: '/service/engine',
  },
  {
    icon: Disc,
    slug: 'brakes',
    title: 'Тормозная система',
    desc: 'Замена колодок, дисков, суппортов, тормозных трубок, прокачка системы.',
    price: 'от 4 000 ₽',
    time: '2–4 ч',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    href: '/service/brakes',
  },
  {
    icon: Car,
    slug: 'suspension',
    title: 'Ходовая часть',
    desc: 'Замена амортизаторов, пружин, сайлентблоков, рычагов. Диагностика и ремонт рулевого управления.',
    price: 'от 5 000 ₽',
    time: '2–6 ч',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    href: '/service/suspension',
  },
  {
    icon: Settings,
    slug: 'transmission',
    title: 'Коробка передач',
    desc: 'Обслуживание МКПП, АКПП, DSG, PDK. Замена масла, ремонт, адаптация.',
    price: 'от 8 000 ₽',
    time: '1–3 дня',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    href: '/service/transmission',
  },
  {
    icon: Zap,
    slug: 'electrics',
    title: 'Электрика и электроника',
    desc: 'Диагностика и ремонт электрических цепей, замена датчиков, кодирование блоков управления.',
    price: 'от 2 000 ₽',
    time: '1–4 ч',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    href: '/service/electrics',
  },
];

const BRANDS = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Lexus', 'Land Rover', 'Volvo', 'Volkswagen', 'Jaguar', 'Genesis', 'Toyota', 'KIA', 'Nissan'];

const ADVANTAGES = [
  { title: '10 лет опыта', desc: 'Специализация на немецком и британском премиуме.' },
  { title: 'Фирменное оборудование', desc: 'AUTEL MaxiSYS, Bosch, Launch для диагностики.' },
  { title: 'Фиксированные цены', desc: 'Называем стоимость до начала работ. Без скрытых наценок.' },
  { title: 'Гарантия на работы', desc: 'Гарантия 6 месяцев на все виды ремонта.' },
  { title: 'Оригинальные запчасти', desc: 'Только оригинал или проверенные аналоги OEM-качества.' },
  { title: 'Видеофиксация', desc: 'Снимаем весь процесс ремонта — вы видите что делаем.' },
];

const REVIEWS = [
  { name: 'Алексей К.', car: 'BMW 5 (G30)', text: 'Делал ТО и диагностику. Всё чётко, по времени, без лишних навязывания. Цены честные.', stars: 5 },
  { name: 'Мария В.', car: 'Mercedes GLE', text: 'Меняли тормозные диски и колодки. Быстро, аккуратно, показали старые запчасти. Рекомендую.', stars: 5 },
  { name: 'Дмитрий С.', car: 'Audi Q7', text: 'Ремонт подвески — сделали за день. Приятно удивил подход к клиентам.', stars: 5 },
];

const FAQ = [
  {
    q: 'Сколько стоит ТО в HP Тюнинг?',
    a: 'ТО от 3 000 ₽ — зависит от марки, модели и пробега. Включает замену масла, масляного фильтра, проверку всех систем. Точная цена по звонку или через форму записи.',
  },
  {
    q: 'Какие марки вы обслуживаете?',
    a: 'Специализируемся на BMW, Mercedes-Benz, Audi, Porsche, Lexus, Land Rover, Volvo, Volkswagen, Jaguar. Принимаем также Genesis, Toyota, KIA, Nissan.',
  },
  {
    q: 'Используете ли вы оригинальные запчасти?',
    a: 'Да, работаем с оригинальными запчастями и проверенными аналогами OEM-качества (Febi, Meyle, Bosch, SKF). Только по согласованию с клиентом.',
  },
  {
    q: 'Есть ли гарантия на ремонт?',
    a: 'Да — гарантия 6 месяцев на все работы, 12 месяцев на запчасти по гарантии производителя.',
  },
  {
    q: 'Могу ли я приехать без записи?',
    a: 'По возможности принимаем, но лучше записаться заранее — тогда мастер и бокс будут готовы именно к вашему автомобилю.',
  },
  {
    q: 'Где вы находитесь?',
    a: 'Мы в Санкт-Петербурге, ул. Богородская, 3Б (Порошкино). Работаем ежедневно с 10:00 до 20:00.',
  },
];

export default function ServicePage() {
  return (
    <>
{/* ── Hero ── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10">
      <Breadcrumbs items={[{ label: "Автосервис" }]} />

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
              <Wrench className="size-3.5" />
              Авторизованный сервис · 10 лет опыта
            </span>
            <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6">
              АВТОСЕРВИС<br />
              <span className="text-[#39FF14]">ПРЕМИУМ-КЛАССА</span><br />
              В САНКТ-ПЕТЕРБУРГЕ
            </h1>
            <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              ТО, компьютерная диагностика, ремонт двигателя, тормозов, подвески и коробки
              для BMW, Mercedes, Audi, Porsche, Land Rover и других премиум-марок.
            </p>
            <div className="flex flex-wrap gap-4">
              <BookingButton label="Записаться на сервис" className="btn-primary text-base px-8 py-4" />
              <a href="tel:+79818428151" className="btn-secondary text-base px-8 py-4">
                <Phone className="size-5" />
                +7 (981) 842-81-51
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { val: 'от 1 500 ₽', label: 'Диагностика' },
              { val: 'от 3 000 ₽', label: 'ТО' },
              { val: '13 марок', label: 'Специализация' },
              { val: '6 мес.', label: 'Гарантия' },
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <div className="font-display text-2xl md:text-3xl text-[#39FF14] mb-1">{s.val}</div>
                <div className="text-text-subtle text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 карточек услуг ── */}
      <section className="py-16 bg-[#111113]">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">ВИДЫ РАБОТ</h2>
          <p className="text-text-muted mb-10">Полный спектр обслуживания и ремонта для вашего автомобиля</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.slug}
                  href={svc.href}
                  className="card group hover:border-[#39FF14]/30 transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`size-6 ${svc.color}`} />
                  </div>
                  <h3 className="font-semibold text-text group-hover:text-[#39FF14] transition-colors mb-2 flex-1">
                    {svc.title}
                  </h3>
                  <p className="text-text-subtle text-sm leading-relaxed mb-4">{svc.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${svc.color}`}>{svc.price}</span>
                    <div className="flex items-center gap-1 text-text-subtle text-xs">
                      <span>{svc.time}</span>
                      <ChevronRight className="size-3.5 group-hover:text-[#39FF14] transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Карусель брендов ── */}
      <section className="py-16 container">
        <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">
          ПОДДЕРЖИВАЕМЫЕ МАРКИ
        </h2>
        <p className="text-text-muted mb-8">13 премиум-брендов — наша специализация</p>
        <div className="flex flex-wrap gap-3">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/brands/${brand.toLowerCase().replace(/\s/g, '-').replace('.', '')}`}
              className="px-4 py-2 rounded-full border border-border hover:border-[#39FF14]/40 hover:text-[#39FF14] text-text-muted text-sm transition-colors"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Преимущества ── */}
      <section className="py-16 bg-[#111113]">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-10">
            ПОЧЕМУ ВЫБИРАЮТ НАС
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((adv) => (
              <div key={adv.title} className="card">
                <CheckCircle className="size-6 text-[#39FF14] mb-4" />
                <h3 className="font-semibold text-text mb-2">{adv.title}</h3>
                <p className="text-text-subtle text-sm leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Отзывы ── */}
      <section className="py-16 container">
        <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-10">ОТЗЫВЫ КЛИЕНТОВ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div>
                <div className="font-medium text-text text-sm">{r.name}</div>
                <div className="text-text-subtle text-xs">{r.car}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-[#111113]">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-10">ЧАСТЫЕ ВОПРОСЫ</h2>
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
          <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-3">
            ЗАПИСАТЬСЯ НА СЕРВИС
          </h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Запишитесь онлайн или позвоните — ответим за 15 минут.
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
