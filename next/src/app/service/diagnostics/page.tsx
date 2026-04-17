import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Cpu, ChevronRight, CheckCircle, Phone, Clock } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Компьютерная диагностика авто в СПб — от 1 500 ₽ | HP Тюнинг',
  description: 'Компьютерная диагностика BMW, Mercedes, Audi, Porsche, Land Rover в СПб от 1 500 ₽. AUTEL MaxiSYS MS906, дилерское ПО. Расшифровка ошибок ЭБУ, диагностика всех систем автомобиля. Без записи.',
  keywords: ['компьютерная диагностика авто спб', 'диагностика бмв спб', 'диагностика мерседес спб', 'autel maxisys спб', 'ошибки эбу спб'],
  alternates: { canonical: 'https://hptuning.ru/service/diagnostics' },
  openGraph: {
    title: 'Диагностика авто от 1 500 ₽ в СПб | HP Тюнинг',
    description: 'AUTEL MaxiSYS: полная диагностика BMW, Mercedes, Audi, Porsche, Land Rover. Расшифровка ошибок ЭБУ.',
    url: 'https://hptuning.ru/service/diagnostics',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/diagnostics.jpg', width: 1200, height: 630, alt: 'Диагностика авто от 1 500 ₽ в СПб | HP Тюнинг' }],
  },
};

const PRICES = [
  { service: 'Считывание ошибок ЭБУ', price: '1 500 ₽' },
  { service: 'Диагностика всех систем', price: '3 000 ₽' },
  { service: 'Диагностика ходовой части', price: '2 000 ₽' },
  { service: 'Диагностика электрики', price: '2 500 ₽' },
  { service: 'Комплексная диагностика', price: '4 500 ₽' },
];

const CAPABILITIES = [
  'Считывание и сброс кодов ошибок всех ЭБУ',
  'Диагностика двигателя, АКПП, ABS, ESP',
  'Проверка подушек безопасности',
  'Считывание параметров в реальном времени',
  'Кодирование и адаптация блоков',
  'Диагностика парктроника, камер, мультимедиа',
  'Проверка электрических цепей мультиметром',
  'Написание детального отчёта',
];

const STEPS = [
  { step: '01', title: 'Подключение', desc: 'Подключаем сканер AUTEL MaxiSYS к OBD-разъёму автомобиля.' },
  { step: '02', title: 'Сканирование', desc: 'Считываем ошибки из всех ЭБУ — двигатель, АКПП, ABS, ESP, подушки, электрика.' },
  { step: '03', title: 'Анализ', desc: 'Расшифровываем коды ошибок, определяем первопричину неисправности.' },
  { step: '04', title: 'Заключение', desc: 'Выдаём письменный отчёт с рекомендациями и сметой на ремонт.' },
];

const FAQ = [
  { q: 'Что показывает компьютерная диагностика?', a: 'Диагностика считывает коды неисправностей из всех электронных блоков управления: двигатель, АКПП, ABS, ESP, подушки безопасности, электрика, мультимедиа. Выявляем как активные ошибки, так и сохранённые (memory codes).' },
  { q: 'Сколько стоит диагностика?', a: 'Считывание ошибок ЭБУ — от 1 500 ₽. Комплексная диагностика всех систем — от 4 500 ₽. Стоимость диагностики засчитывается при ремонте.' },
  { q: 'Какое оборудование используете?', a: 'AUTEL MaxiSYS MS919, Bosch KTS, Launch X431 — профессиональное оборудование, поддерживающее все протоколы немецких, британских и азиатских марок.' },
  { q: 'Можно ли просто считать ошибки и уехать?', a: 'Да. Считываем ошибки, выдаём распечатку с расшифровкой и рекомендациями. Никакого принудительного ремонта — только ваше решение.' },
];


const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Компьютерная диагностика автомобиля в Санкт-Петербурге',
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

export default function DiagnosticsPage() {
  return (
    <>
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative pt-28 pb-16">
        <div className="container">
          
      <Breadcrumbs items={[{ label: "Автосервис", href: "/service" }, { label: "Диагностика" }]} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                <Cpu className="size-7 text-blue-400" />
              </div>
              <span className="badge mb-4">Компьютерная диагностика</span>
              <h1 className="section-title text-4xl md:text-5xl mb-4">ДИАГНОСТИКА АВТОМОБИЛЯ</h1>
              <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-xl">
                Считываем ошибки из всех ЭБУ на профессиональном оборудовании AUTEL MaxiSYS.
                Получаете письменный отчёт с расшифровкой и рекомендациями.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAPABILITIES.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                    <CheckCircle className="size-4 text-blue-400 shrink-0 mt-0.5" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <aside>
              <div className="card sticky top-24">
                <div className="text-blue-400 font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
                <div className="font-display text-4xl text-text mb-1">от 1 500 ₽</div>
                <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
                  <Clock className="size-3.5" />1–2 часа
                </div>
                <BookingButton label="Записаться на диагностику" className="btn-primary w-full justify-center mb-3" />
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
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЦЕНЫ НА ДИАГНОСТИКУ</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl">
              <tbody>
                {PRICES.map((p, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-text-muted text-sm">{p.service}</td>
                    <td className="py-3 px-4 text-right text-blue-400 font-semibold text-sm">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-subtle text-xs mt-3">Стоимость диагностики засчитывается при ремонте.</p>
        </div>
      </section>

      <section className="py-16 container">
        <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">КАК МЫ РАБОТАЕМ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.step} className="card">
              <div className="font-display text-3xl text-blue-400/30 mb-3">{s.step}</div>
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
                  <span className="font-medium text-text group-open:text-blue-400 transition-colors pr-4">{item.q}</span>
                  <span className="text-text-subtle group-open:text-blue-400 shrink-0 text-lg leading-none">+</span>
                </summary>
                <p className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-border">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container">
        <div className="card border-blue-500/20 text-center p-10">
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">ЗАПИСАТЬСЯ НА ДИАГНОСТИКУ</h2>
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
