// ── Данные брендов для /marki/ — HP Тюнинг СПб ───────────────────────────────
// 14 ключевых марок, с которыми работаем ежедневно. Сгруппированы по 4 категориям:
// Европейские / Японские / Корейские / Китайские.
// Кнопки ведут на внутренние страницы /brands/{slug} (без субдоменов на клиенте).

export type BrandData = {
  slug: string;
  name: string;
  href?: string;
  logo: string;
  group: 'european' | 'japanese' | 'korean' | 'chinese';
  desc: string;
};

export const EUROPEAN_BRANDS: BrandData[] = [
  {
    slug: 'bmw',
    name: 'BMW',
    href: '/brands/bmw',
    logo: '/images/brands/bmw.svg',
    group: 'european',
    desc: 'ISTA+ диагностика, тюнинг B58/N55/S63, ТО 1–7 серии, X3–X7, M-модели.',
  },
  {
    slug: 'mercedes',
    name: 'Mercedes-Benz',
    href: '/brands/mercedes',
    logo: '/images/brands/mercedes.svg',
    group: 'european',
    desc: 'XENTRY, ремонт AIRMATIC, тюнинг AMG, дизели OM642/OM651.',
  },
  {
    slug: 'audi',
    name: 'Audi',
    href: '/brands/audi',
    logo: '/images/brands/audi.svg',
    group: 'european',
    desc: 'VCDS/ODIS, тюнинг EA888/EA839, ремонт DSG DQ200/DQ500, quattro, RS.',
  },
  {
    slug: 'porsche',
    name: 'Porsche',
    href: '/brands/porsche',
    logo: '/images/brands/porsche.svg',
    group: 'european',
    desc: 'PIWIS III, ТО 911/Cayenne/Macan/Panamera, тюнинг 9A1, PDK/PASM.',
  },
  {
    slug: 'landrover',
    name: 'Land Rover',
    href: '/brands/landrover',
    logo: '/images/brands/land-rover.svg',
    group: 'european',
    desc: 'JLR SDD/Pathfinder, пневмоподвеска EAS, тюнинг TD6/3.0T, Defender/Range Rover.',
  },
];

export const JAPANESE_BRANDS: BrandData[] = [
  {
    slug: 'toyota',
    name: 'Toyota',
    href: '/brands/toyota',
    logo: '/images/brands/toyota.svg',
    group: 'japanese',
    desc: 'Techstream, Land Cruiser/Camry/RAV4/Prado, тюнинг 1GD дизель, THS-гибриды.',
  },
  {
    slug: 'lexus',
    name: 'Lexus',
    href: '/brands/lexus',
    logo: '/images/brands/lexus.svg',
    group: 'japanese',
    desc: 'RX/GX/LX/LS/NX/ES, Techstream, тюнинг V8 3UR-FE, Lexus Hybrid Drive.',
  },
];

export const KOREAN_BRANDS: BrandData[] = [
  {
    slug: 'kia',
    name: 'Kia',
    href: '/brands/kia',
    logo: '/images/brands/kia.svg',
    group: 'korean',
    desc: 'Sportage, Sorento, K5, Rio, Seltos. ТО, диагностика, ремонт двигателя и коробки.',
  },
  {
    slug: 'hyundai',
    name: 'Hyundai',
    href: '/brands/hyundai',
    logo: '/images/brands/hyundai.svg',
    group: 'korean',
    desc: 'Tucson, Santa Fe, Solaris, Creta, Sonata. ТО, диагностика, ремонт.',
  },
];

export const CHINESE_BRANDS: BrandData[] = [
  {
    slug: 'haval',
    name: 'Haval',
    href: '/brands/haval',
    logo: '/images/brands/haval.svg',
    group: 'chinese',
    desc: 'Jolion, F7, M6, H3, H9, Dargo. Лидер рынка СПб — ТО, диагностика, ремонт, чип.',
  },
  {
    slug: 'chery',
    name: 'Chery',
    href: '/brands/chery',
    logo: '/images/brands/chery.svg',
    group: 'chinese',
    desc: 'Tiggo 4/7 Pro/8 Pro, Arrizo. ТО, диагностика, ремонт двигателя и подвески.',
  },
  {
    slug: 'geely',
    name: 'Geely',
    href: '/brands/geely',
    logo: '/images/brands/geely.svg',
    group: 'chinese',
    desc: 'Monjaro, Coolray, Atlas Pro, Tugella. ТО, ремонт, тюнинг.',
  },
  {
    slug: 'tank',
    name: 'Tank',
    href: '/brands/tank',
    logo: '/images/brands/tank.svg',
    group: 'chinese',
    desc: 'Tank 300 и 500. Рамные внедорожники — ТО, диагностика, тюнинг.',
  },
  {
    slug: 'exeed',
    name: 'Exeed',
    href: '/brands/exeed',
    logo: '/images/brands/exeed.svg',
    group: 'chinese',
    desc: 'LX, TXL, VX — премиум Chery. ТО, диагностика, детейлинг.',
  },
];

export const ALL_BRANDS_DATA: BrandData[] = [
  ...EUROPEAN_BRANDS,
  ...JAPANESE_BRANDS,
  ...KOREAN_BRANDS,
  ...CHINESE_BRANDS,
];
