// ── Данные брендов для /marki/ — HP Тюнинг СПб ───────────────────────────────
// Вынесены из page.tsx, т.к. Next.js не разрешает произвольные export const в page-файлах

export type BrandData = {
  slug: string;
  name: string;
  href?: string;
  logo: string;
  group: string;
  desc: string;
};

export const SPECIALIZATION: BrandData[] = [
  { slug: 'bmw',       name: 'BMW',          href: 'https://bmw.hptuning.ru',        logo: '/images/brands/bmw.svg',        group: 'spec',
    desc: 'ISTA+ диагностика, тюнинг B58/N55/S63, ТО 1–7 серия, X3–X7, M-модели.' },
  { slug: 'mercedes',  name: 'Mercedes-Benz', href: 'https://mercedes.hptuning.ru',   logo: '/images/brands/mercedes.svg',   group: 'spec',
    desc: 'XENTRY, ремонт AIRMATIC, тюнинг AMG, дизели OM642/OM651.' },
  { slug: 'audi',      name: 'Audi',          href: 'https://audi.hptuning.ru',       logo: '/images/brands/audi.svg',       group: 'spec',
    desc: 'VCDS/ODIS, тюнинг EA888/EA839, ремонт DSG DQ200/DQ500, quattro, RS.' },
  { slug: 'porsche',   name: 'Porsche',       href: 'https://porsche.hptuning.ru',    logo: '/images/brands/porsche.svg',    group: 'spec',
    desc: 'PIWIS III, ТО 911/Cayenne/Macan/Panamera, тюнинг 9A1, PDK/PASM.' },
  { slug: 'volkswagen',name: 'Volkswagen',    href: 'https://volkswagen.hptuning.ru', logo: '/images/brands/volkswagen.svg', group: 'spec',
    desc: 'VCDS, Golf/Tiguan/Passat/Touareg, тюнинг EA888/EA211, DSG.' },
  { slug: 'toyota',    name: 'Toyota',        href: 'https://toyota.hptuning.ru',     logo: '/images/brands/toyota.svg',     group: 'spec',
    desc: 'Techstream, Land Cruiser/Camry/RAV4/Prado, тюнинг 1GD дизель, THS гибриды.' },
  { slug: 'lexus',     name: 'Lexus',         href: 'https://lexus.hptuning.ru',      logo: '/images/brands/lexus.svg',      group: 'spec',
    desc: 'RX/GX/LX/LS/NX/ES, Techstream, тюнинг V8 3UR-FE, Lexus Hybrid Drive.' },
  { slug: 'landrover', name: 'Land Rover',    href: 'https://landrover.hptuning.ru',  logo: '/images/brands/land-rover.svg', group: 'spec',
    desc: 'JLR SDD/Pathfinder, пневмоподвеска EAS, тюнинг TD6/3.0T, Defender/Range Rover.' },
];

export const CHINESE_BRANDS: BrandData[] = [
  { slug: 'haval',    name: 'Haval',    logo: '/images/brands/haval.svg',    group: 'chinese',
    desc: 'Jolion, F7, M6, H3, H9, Dargo. Лидер рынка СПб — ТО, диагностика, ремонт, чип.' },
  { slug: 'chery',    name: 'Chery',    logo: '/images/brands/chery.svg',    group: 'chinese',
    desc: 'Tiggo 4/7 Pro/8 Pro, Arrizo. ТО, диагностика, ремонт двигателя и подвески.' },
  { slug: 'geely',    name: 'Geely',    logo: '/images/brands/geely.svg',    group: 'chinese',
    desc: 'Monjaro, Coolray, Atlas Pro, Tugella. ТО, ремонт, тюнинг.' },
  { slug: 'tank',     name: 'Tank',     logo: '/images/brands/tank.svg',     group: 'chinese',
    desc: 'Tank 300 и 500. Рамные внедорожники — ТО, диагностика, тюнинг.' },
  { slug: 'changan',  name: 'Changan',  logo: '/images/brands/changan.svg',  group: 'chinese',
    desc: 'UNI-S, CS55 Plus, CS35. ТО, диагностика, ремонт ходовой.' },
  { slug: 'jetour',   name: 'Jetour',   logo: '/images/brands/jetour.svg',   group: 'chinese',
    desc: 'X70, X90, Dashing, T1, T2. ТО, диагностика, ремонт.' },
  { slug: 'exeed',    name: 'Exeed',    logo: '/images/brands/exeed.svg',    group: 'chinese',
    desc: 'LX, TXL, VX — премиум Chery. ТО, диагностика, детейлинг.' },
  { slug: 'jaecoo',   name: 'Jaecoo',   logo: '/images/brands/jaecoo.svg',   group: 'chinese',
    desc: 'J7 и J8. ТО, диагностика, ремонт подвески и тормозов.' },
  { slug: 'omoda',    name: 'Omoda',    logo: '/images/brands/omoda.svg',    group: 'chinese',
    desc: 'C5 и S5. Диагностика, ТО, ремонт по гарантийному пробегу.' },
  { slug: 'belgee',   name: 'Belgee',   logo: '/images/brands/belgee.svg',   group: 'chinese',
    desc: 'X50, X70 (Geely-платформа). ТО, диагностика, детейлинг.' },
  { slug: 'voyah',    name: 'Voyah',    logo: '/images/brands/voyah.svg',    group: 'chinese',
    desc: 'Free и Dream — премиальные гибриды. ТО и диагностика.' },
  { slug: 'hongqi',   name: 'Hongqi',   logo: '/images/brands/hongqi.svg',   group: 'chinese',
    desc: 'H5, H9, HS5, HS7 — китайский премиум. ТО, диагностика, детейлинг.' },
  { slug: 'tenet',    name: 'Tenet',    logo: '/images/brands/tenet.svg',    group: 'chinese',
    desc: 'T4, T7. ТО, диагностика, ремонт.' },
];

export const JAPANESE_KOREAN: BrandData[] = [
  { slug: 'kia',        name: 'Kia',        logo: '/images/brands/kia.svg',        group: 'japanese',
    desc: 'Sportage, Sorento, K5, Rio, Seltos. ТО, диагностика, ремонт двигателя и коробки.' },
  { slug: 'hyundai',    name: 'Hyundai',    logo: '/images/brands/hyundai.svg',    group: 'japanese',
    desc: 'Tucson, Santa Fe, Solaris, Creta, Sonata. ТО, диагностика, ремонт.' },
  { slug: 'mazda',      name: 'Mazda',      logo: '/images/brands/mazda.svg',      group: 'japanese',
    desc: 'CX-5, CX-9, Mazda 3/6. ТО по регламенту, SKYACTIV.' },
  { slug: 'nissan',     name: 'Nissan',     logo: '/images/brands/nissan.svg',     group: 'japanese',
    desc: 'X-Trail, Qashqai, Murano, Patrol. ТО, вариатор, диагностика.' },
  { slug: 'infiniti',   name: 'Infiniti',   logo: '/images/brands/infiniti.svg',   group: 'japanese',
    desc: 'QX50, QX60, QX70, Q50. Диагностика, тюнинг VQ.' },
  { slug: 'subaru',     name: 'Subaru',     logo: '/images/brands/subaru.svg',     group: 'japanese',
    desc: 'Forester, Outback, XV. Оппозитные двигатели, симметричный AWD.' },
  { slug: 'mitsubishi', name: 'Mitsubishi', logo: '/images/brands/mitsubishi.svg', group: 'japanese',
    desc: 'Outlander, Pajero Sport, Lancer. ТО, диагностика, ремонт.' },
  { slug: 'honda',      name: 'Honda',      logo: '/images/brands/honda.svg',      group: 'japanese',
    desc: 'CR-V, Pilot, Accord. ТО, диагностика, ремонт.' },
];

export const EUROPEAN_OTHER: BrandData[] = [
  { slug: 'volvo',   name: 'Volvo',   logo: '/images/brands/volvo.svg',   group: 'european',
    desc: 'XC60, XC90, S60. VIDA диагностика, ТО.' },
  { slug: 'skoda',   name: 'Škoda',   logo: '/images/brands/skoda.svg',   group: 'european',
    desc: 'Octavia, Kodiaq, Superb. VCDS, VAG-регламент, тюнинг EA888.' },
  { slug: 'ford',    name: 'Ford',    logo: '/images/brands/ford.svg',    group: 'european',
    desc: 'Focus, Kuga, Mondeo, Explorer. ТО, диагностика, ремонт.' },
  { slug: 'seat',    name: 'SEAT',    logo: '/images/brands/seat.svg',    group: 'european',
    desc: 'Leon, Ateca. VCDS, тюнинг EA888, VAG-группа.' },
  { slug: 'renault', name: 'Renault', logo: '/images/brands/renault.svg', group: 'european',
    desc: 'Duster, Kaptur, Arkana. ТО, диагностика, ремонт.' },
  { slug: 'mini',    name: 'MINI',    logo: '/images/brands/mini.svg',    group: 'european',
    desc: 'Cooper, Clubman, Countryman. BMW-инструменты ISTA.' },
  { slug: 'peugeot', name: 'Peugeot', logo: '/images/brands/peugeot.svg', group: 'european',
    desc: '3008, 5008, 508. ТО, диагностика, ремонт.' },
  { slug: 'opel',    name: 'Opel',    logo: '/images/brands/opel.svg',    group: 'european',
    desc: 'Astra, Insignia, Mokka. ТО, диагностика, ремонт.' },
];

export const ALL_BRANDS_DATA: BrandData[] = [
  ...SPECIALIZATION,
  ...CHINESE_BRANDS,
  ...JAPANESE_KOREAN,
  ...EUROPEAN_OTHER,
];
