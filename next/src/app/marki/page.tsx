export const dynamic = 'force-static';
/**
 * /marki/ — HP Тюнинг СПб
 * Хаб-страница всех брендов: специализация, китайские, корейские/японские, европейские.
 * Canonical: https://hptuning.ru/marki/
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, MessageCircle, Phone } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Марки автомобилей — HP Тюнинг Санкт-Петербург | Полный список брендов',
  description:
    'ТО, диагностика, ремонт, детейлинг и тюнинг для BMW, Mercedes-Benz, Audi, Porsche, Volkswagen, Toyota, Lexus, Land Rover, Haval, Chery, Tank, Geely, Changan, Jetour, Kia, Hyundai, Mazda и других марок в Санкт-Петербурге.',
  keywords: [
    'автосервис спб марки',
    'сервис китайских автомобилей спб',
    'то bmw mercedes audi спб',
    'haval сервис спб',
    'автосервис для всех марок санкт-петербург',
  ],
  alternates: { canonical: 'https://hptuning.ru/marki/' },
  openGraph: {
    title: 'Марки автомобилей — HP Тюнинг Санкт-Петербург',
    description:
      'Европейские, японские, корейские и современные китайские автомобили — ТО, диагностика, ремонт, детейлинг и тюнинг в одном месте, без беготни между сервисами.',
    url: 'https://hptuning.ru/marki/',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [
      {
        url: 'https://hptuning.ru/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'HP Тюнинг — все марки автомобилей в Санкт-Петербурге',
      },
    ],
  },
};

// ── JSON-LD ItemList ──────────────────────────────────────────────────────────
const ALL_BRANDS_FOR_SCHEMA = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Volkswagen', 'Toyota', 'Lexus', 'Land Rover',
  'Haval', 'Chery', 'Geely', 'Tank', 'Changan', 'Jetour', 'Exeed', 'Jaecoo', 'Omoda',
  'Belgee', 'Voyah', 'Hongqi', 'Tenet',
  'Kia', 'Hyundai', 'Mazda', 'Nissan', 'Infiniti', 'Subaru', 'Mitsubishi', 'Honda',
  'Škoda', 'SEAT', 'Renault', 'Ford', 'Volvo', 'MINI', 'Peugeot', 'Citroën', 'Opel',
];

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Марки автомобилей — HP Тюнинг СПб',
  description: 'Полный список брендов, с которыми работает HP Тюнинг в Санкт-Петербурге',
  numberOfItems: ALL_BRANDS_FOR_SCHEMA.length,
  itemListElement: ALL_BRANDS_FOR_SCHEMA.map((name, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
  })),
};

// ── Блок 1: Специализация (субдомены) ────────────────────────────────────────
const SPECIALIZATION = [
  {
    slug: 'bmw',
    name: 'BMW',
    href: '/brands/bmw',
    logo: '/images/brands/bmw.svg',
    desc: 'Диагностика ISTA+/ISTA-D, тюнинг B58/N55/S63, ТО всей линейки от 1-й серии до X7 и M-моделей в Санкт-Петербурге.',
  },
  {
    slug: 'mercedes',
    name: 'Mercedes-Benz',
    href: '/brands/mercedes',
    logo: '/images/brands/mercedes.svg',
    desc: 'XENTRY-диагностика, ремонт AIRMATIC, тюнинг AMG-моторов, ТО дизелей OM642/OM651 — для всего модельного ряда в СПб.',
  },
  {
    slug: 'audi',
    name: 'Audi',
    href: '/brands/audi',
    logo: '/images/brands/audi.svg',
    desc: 'VCDS/ODIS, тюнинг EA888/EA839, ремонт DSG DQ200/DQ500, сервис quattro и Haldex. A4, A6, Q5, Q7, RS-модели.',
  },
  {
    slug: 'porsche',
    name: 'Porsche',
    href: '/brands/porsche',
    logo: '/images/brands/porsche.svg',
    desc: 'PIWIS III диагностика, ТО 911/Cayenne/Macan/Panamera, тюнинг 9A1 и EA839, обслуживание PDK и PASM в Санкт-Петербурге.',
  },
  {
    slug: 'volkswagen',
    name: 'Volkswagen',
    href: '/brands/volkswagen',
    logo: '/images/brands/volkswagen.svg',
    desc: 'VCDS-диагностика, ТО Golf/Tiguan/Passat/Touareg, тюнинг EA888/EA211, ремонт DSG — практичный VAG-сервис без накруток.',
  },
  {
    slug: 'toyota',
    name: 'Toyota',
    href: '/brands/toyota',
    logo: '/images/brands/toyota.svg',
    desc: 'Techstream-диагностика, ТО Land Cruiser/Camry/RAV4/Prado, тюнинг 1GD-FTV дизель, обслуживание гибридов THS II.',
  },
  {
    slug: 'lexus',
    name: 'Lexus',
    href: '/brands/lexus',
    logo: '/images/brands/lexus.svg',
    desc: 'ТО RX/GX/LX/LS/NX/ES, диагностика Techstream, тюнинг V8 3UR-FE, обслуживание Lexus Hybrid Drive в Санкт-Петербурге.',
  },
  {
    slug: 'landrover',
    name: 'Land Rover',
    href: '/brands/land-rover',
    logo: '/images/brands/land-rover.svg',
    desc: 'JLR SDD/Pathfinder, ремонт пневмоподвески EAS, тюнинг TD6/3.0T, ТО Defender/Discovery/Range Rover в СПб.',
  },
];

// ── Блок 2: Китайские бренды ──────────────────────────────────────────────────
const CHINESE_BRANDS = [
  {
    slug: 'haval',
    name: 'Haval',
    logo: '/images/brands/haval.svg',
    models: 'Jolion, F7, M6, H3, H9, Dargo',
    desc: 'Haval — лидер петербургского рынка. ТО, диагностика, ремонт и детейлинг для Jolion, F7, M6, H3, H9 и Dargo. Есть тюнинг и чип-тюнинг для Jolion и F7.',
  },
  {
    slug: 'chery',
    name: 'Chery',
    logo: '/images/brands/chery.svg',
    models: 'Tiggo 4, 7, 8, Arrizo',
    desc: 'ТО, диагностика и ремонт Tiggo 4, Tiggo 7 Pro, Tiggo 8 Pro, Arrizo 8 в Санкт-Петербурге. Работаем с дизельными и бензиновыми версиями.',
  },
  {
    slug: 'geely',
    name: 'Geely',
    logo: '/images/brands/geely.svg',
    models: 'Monjaro, Coolray, Atlas, Tugella',
    desc: 'Geely Monjaro, Coolray, Atlas Pro, Tugella — ТО, диагностика, ремонт ходовой, детейлинг и тюнинг в Петербурге.',
  },
  {
    slug: 'tank',
    name: 'Tank',
    logo: '/images/brands/tank.svg',
    models: 'Tank 300, Tank 500',
    desc: 'Tank — рамные внедорожники. ТО, диагностика, ремонт и тюнинг для Tank 300 и Tank 500. В Петербурге спрос на чип-тюнинг Tank уже формируется — работаем с программной частью аккуратно.',
  },
  {
    slug: 'changan',
    name: 'Changan',
    logo: '/images/brands/changan.svg',
    models: 'UNI-S, CS55 Plus, CS35',
    desc: 'ТО и диагностика Changan UNI-S, CS55 Plus, CS35 Plus. Ремонт ходовой, детейлинг и электрика в Санкт-Петербурге.',
  },
  {
    slug: 'jetour',
    name: 'Jetour',
    logo: '/images/brands/jetour.svg',
    models: 'X70, X90, Dashing, T1, T2',
    desc: 'Jetour X70, X90 Plus, Dashing, T1, T2 — ТО, диагностика, ремонт двигателя и подвески в Петербурге.',
  },
  {
    slug: 'exeed',
    name: 'Exeed',
    logo: '/images/brands/exeed.svg',
    models: 'LX, TXL, VX',
    desc: 'Exeed LX, TXL, VX — премиальное плечо Chery. ТО, диагностика, кузовной и механический ремонт, детейлинг в СПб.',
  },
  {
    slug: 'jaecoo',
    name: 'Jaecoo',
    logo: '/images/brands/jaecoo.svg',
    models: 'J7, J8',
    desc: 'Jaecoo J7 и J8 — ТО, диагностика, ремонт подвески и тормозов, детейлинг в Санкт-Петербурге.',
  },
  {
    slug: 'omoda',
    name: 'Omoda',
    logo: '/images/brands/omoda.svg',
    models: 'C5, S5',
    desc: 'Omoda C5 и S5 — диагностика, ТО, ремонт по гарантийному и послегарантийному пробегу в Петербурге.',
  },
  {
    slug: 'belgee',
    name: 'Belgee',
    logo: '/images/brands/belgee.svg',
    models: 'X50, X70',
    desc: 'Belgee X50 и X70 (Geely-платформа) — ТО, диагностика, детейлинг в Санкт-Петербурге.',
  },
  {
    slug: 'voyah',
    name: 'Voyah',
    logo: '/images/brands/voyah.svg',
    models: 'Free, Dream',
    desc: 'Voyah Free и Dream — премиальные гибриды. Диагностика, ТО и детейлинг для электрических и гибридных версий в СПб.',
  },
  {
    slug: 'hongqi',
    name: 'Hongqi',
    logo: '/images/brands/hongqi.svg',
    models: 'H5, H9, HS5, HS7',
    desc: 'Hongqi H5, H9, HS5, HS7 — китайский премиум. ТО, диагностика и детейлинг для редких и представительских версий в Петербурге.',
  },
  {
    slug: 'tenet',
    name: 'Tenet',
    logo: '/images/brands/tenet.svg',
    models: 'T4, T7',
    desc: 'Tenet T4 и T7 (бывший Chery под СНГ-брендом) — ТО, диагностика и ремонт в Санкт-Петербурге.',
  },
];

// ── Блок 3: Корейские и японские ─────────────────────────────────────────────
const KOREAN_JAPANESE = [
  {
    slug: 'kia',
    name: 'Kia',
    logo: '/images/brands/kia.svg',
    desc: 'Kia — один из самых частых гостей у нас. ТО, диагностика, ремонт двигателя, коробки, тормозов и подвески для Sportage, Sorento, K5, Rio и Seltos.',
  },
  {
    slug: 'hyundai',
    name: 'Hyundai',
    logo: '/images/brands/hyundai.svg',
    desc: 'Hyundai Tucson, Santa Fe, Solaris, Creta, Sonata — ТО, диагностика, ремонт и детейлинг в Санкт-Петербурге.',
  },
  {
    slug: 'mazda',
    name: 'Mazda',
    logo: '/images/brands/mazda.svg',
    desc: 'Mazda CX-5, CX-9, Mazda 3, Mazda 6 — ТО по регламенту, диагностика, ремонт SKYACTIV и детейлинг в Петербурге.',
  },
  {
    slug: 'nissan',
    name: 'Nissan',
    logo: '/images/brands/nissan.svg',
    desc: 'Nissan X-Trail, Qashqai, Murano, Patrol — ТО, диагностика, ремонт вариатора и ходовой в Санкт-Петербурге.',
  },
  {
    slug: 'infiniti',
    name: 'Infiniti',
    logo: '/images/brands/infiniti.svg',
    desc: 'Infiniti QX50, QX60, QX70, Q50 — диагностика, ТО, детейлинг и тюнинг VQ-двигателей в Петербурге.',
  },
  {
    slug: 'subaru',
    name: 'Subaru',
    logo: '/images/brands/subaru.svg',
    desc: 'Subaru Forester, Outback, XV — ТО, диагностика, ремонт оппозитных двигателей и симметричного AWD в СПб.',
  },
  {
    slug: 'mitsubishi',
    name: 'Mitsubishi',
    logo: '/images/brands/mitsubishi.svg',
    desc: 'Mitsubishi Outlander, Pajero Sport, Lancer — ТО, диагностика, ремонт и детейлинг в Санкт-Петербурге.',
  },
  {
    slug: 'honda',
    name: 'Honda',
    logo: '/images/brands/honda.svg',
    desc: 'Honda CR-V, Pilot, Accord — ТО, диагностика и ремонт по российскому вторичному рынку в Петербурге.',
  },
];

// ── Блок 4: Европейские ───────────────────────────────────────────────────────
const EUROPEAN = [
  {
    slug: 'volvo',
    name: 'Volvo',
    logo: '/images/brands/volvo.svg',
    desc: 'Volvo XC60, XC90, S60 — ТО, диагностика VIDA/VIDA2, ремонт и детейлинг в Санкт-Петербурге.',
  },
  {
    slug: 'skoda',
    name: 'Škoda',
    logo: '/images/brands/skoda.svg',
    desc: 'Škoda Octavia, Kodiaq, Superb — диагностика VCDS, ТО по VAG-регламенту, тюнинг EA888 в Петербурге.',
  },
  {
    slug: 'ford',
    name: 'Ford',
    logo: '/images/brands/ford.svg',
    desc: 'Ford Focus, Kuga, Mondeo, Explorer — ТО, диагностика, ремонт и детейлинг в Санкт-Петербурге.',
  },
  {
    slug: 'seat',
    name: 'SEAT',
    logo: '/images/brands/seat.svg',
    desc: 'SEAT Leon, Ateca — диагностика VCDS, ТО и тюнинг EA888 как часть VAG-группы в Петербурге.',
  },
  {
    slug: 'renault',
    name: 'Renault',
    logo: '/images/brands/renault.svg',
    desc: 'Renault Duster, Kaptur, Arkana — ТО, диагностика, ремонт и детейлинг по вторичному рынку в СПб.',
  },
  {
    slug: 'mini',
    name: 'MINI',
    logo: '/images/brands/mini.svg',
    desc: 'MINI Cooper, Clubman, Countryman — диагностика BMW-инструментами ISTA, ТО и детейлинг в Петербурге.',
  },
  {
    slug: 'peugeot',
    name: 'Peugeot',
    logo: '/images/brands/peugeot.svg',
    desc: 'Peugeot 3008, 5008, 508 — ТО, диагностика, ремонт ходовой по вторичному рынку в Санкт-Петербурге.',
  },
  {
    slug: 'opel',
    name: 'Opel',
    logo: '/images/brands/opel.svg',
    desc: 'Opel Astra, Insignia, Mokka — ТО, диагностика, ремонт и детейлинг по вторичному рынку в Петербурге.',
  },
];

// ── Компонент карточки бренда ─────────────────────────────────────────────────
function BrandCard({
  name,
  logo,
  desc,
  href,
  isExternal = false,
}: {
  name: string;
  logo: string;
  desc: string;
  href?: string;
  isExternal?: boolean;
}) {
  const inner = (
    <>
      {/* Логотип */}
      <div className="w-full h-14 flex items-center justify-center mb-4 rounded-lg bg-white/3 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={`${name} — ТО, диагностика, ремонт в СПб`}
          width={100}
          height={44}
          loading="lazy"
          decoding="async"
          className="max-h-10 w-auto object-contain"
        />
      </div>
      <h3 className="text-white font-bold text-sm mb-2 leading-snug">{name}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{desc}</p>
      {href && (
        <span className="mt-3 inline-flex items-center gap-1 text-xs text-[#39FF14] font-medium">
          Подробнее <ChevronRight className="size-3" />
        </span>
      )}
    </>
  );

  const cls =
    'rounded-xl border border-white/8 bg-[#111113] p-4 hover:border-[#39FF14]/30 transition-colors flex flex-col';

  if (!href) return <div className={cls}>{inner}</div>;

  if (isExternal) {
    return (
      <a href={href} className={cls} rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} prefetch={false} className={cls}>
      {inner}
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MarkiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-[#09090b] border-b border-white/5">
        <div className="container max-w-4xl">
          {/* Breadcrumb */}
          <nav className="text-xs text-zinc-500 mb-6 flex items-center gap-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#39FF14] transition-colors">Главная</Link>
            <ChevronRight className="size-3" />
            <span className="text-zinc-300">Марки</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white mb-4">
            Марки, с которыми мы работаем{' '}
            <span className="text-[#39FF14]">в Санкт-Петербурге</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            ТО, диагностика, ремонт, детейлинг и тюнинг — для европейских, японских и
            современных китайских автомобилей. Работаем со всеми, кто сейчас реально ездит
            по Петербургу.
          </p>
        </div>
      </section>

      <div className="container py-16 space-y-20">

        {/* ── Блок 1: Специализация ── */}
        <section aria-label="Наша специализация — бренды с субдоменами">
          <div className="mb-8">
            <p className="text-[#39FF14] text-xs font-semibold uppercase tracking-widest mb-2">
              Глубокая экспертиза
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-2">
              Наша специализация
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              Восемь брендов, под которые у нас заточен инструмент, прошивки и знания.
              Каждый бренд — отдельная экспертная страница с ценами, FAQ и кейсами.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPECIALIZATION.map((b) => (
              <section key={b.slug} aria-label={`Brand: ${b.name}`}>
                <BrandCard
                  name={b.name}
                  logo={b.logo}
                  desc={b.desc}
                  href={b.href}
                />
              </section>
            ))}
          </div>
        </section>

        {/* ── Блок 2: Китайские ── */}
        <section aria-label="Современные китайские бренды">
          <div className="mb-8">
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Актуальный рынок 2025–2026
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-2">
              Современные китайские бренды
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              Haval, Chery, Geely, Tank и другие — уже занимают значительную долю
              петербургского рынка. Берём в работу, разбираемся с диагностикой, знаем расходники.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {CHINESE_BRANDS.map((b) => (
              <section key={b.slug} aria-label={`Brand: ${b.name}`}>
                <BrandCard
                  name={b.name}
                  logo={b.logo}
                  desc={b.desc}
                />
              </section>
            ))}
          </div>
        </section>

        {/* ── Блок 3: Корейские и японские ── */}
        <section aria-label="Корейские и японские бренды">
          <div className="mb-8">
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Надёжность и ресурс
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-2">
              Корейские и японские
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              Kia, Hyundai, Mazda, Nissan, Subaru и другие — регулярные клиенты.
              ТО по регламенту, диагностика, ремонт без мифических «рекомендаций».
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {KOREAN_JAPANESE.map((b) => (
              <section key={b.slug} aria-label={`Brand: ${b.name}`}>
                <BrandCard
                  name={b.name}
                  logo={b.logo}
                  desc={b.desc}
                />
              </section>
            ))}
          </div>
        </section>

        {/* ── Блок 4: Европейские ── */}
        <section aria-label="Европейские бренды">
          <div className="mb-8">
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Вторичный рынок и поклонники немецкого качества
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-2">
              Европейские
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              Volvo, Škoda, Ford, Renault, MINI, Opel — берём в работу по вторичному рынку.
              ТО, диагностика, ремонт и детейлинг.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {EUROPEAN.map((b) => (
              <section key={b.slug} aria-label={`Brand: ${b.name}`}>
                <BrandCard
                  name={b.name}
                  logo={b.logo}
                  desc={b.desc}
                />
              </section>
            ))}
          </div>
        </section>

        {/* ── Fallback / Not found ── */}
        <section
          aria-label="Не нашли свою марку"
          className="rounded-2xl border border-[#39FF14]/20 bg-gradient-to-br from-[#39FF14]/5 to-transparent p-8 md:p-12 text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-3">
            Не нашли свою марку?
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Если машина современная и подъёмник её выдерживает — обычно берём в работу.
            Напишите нам: бесплатная онлайн-консультация за 15 минут.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <BookingButton
              label="Записаться онлайн"
              className="btn-primary px-8 py-3.5 text-sm font-semibold"
            />
            <a
              href="https://t.me/hptuning_spb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14] text-sm font-semibold hover:bg-[#39FF14]/20 transition-colors"
            >
              <MessageCircle className="size-4" />
              Telegram
            </a>
            <a
              href="tel:+79818428151"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white text-sm font-semibold hover:border-[#39FF14]/30 hover:text-[#39FF14] transition-colors"
            >
              <Phone className="size-4" />
              +7 (981) 842-81-51
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
