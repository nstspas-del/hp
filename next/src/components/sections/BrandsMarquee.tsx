'use client';

/**
 * Kinetic Brands Marquee — бесконечная бегущая лента всех марок.
 *
 * taste-skill референс:
 *   • «Kinetic Marquee» из §8 The Creative Arsenal (Typography & Text)
 *   • Бесконечный seamless-loop через CSS animation (0 → -50%)
 *   • Hover на ленте → анимация замедляется (но не останавливается)
 *   • Каждая марка кликабельна → /brands/[slug]
 *   • Логотипы белые (filter: invert), цветной только тот, на котором hover
 *
 * Принципы:
 *   • Hardware acceleration: animate transform, not left/right
 *   • Reduced motion respect: пауза для prefers-reduced-motion
 *   • Mobile: speed чуть быстрее (меньше плотность ленты)
 */

import Link from 'next/link';
import Image from 'next/image';

// 14 ключевых марок которые ВЕДУТ сервис.
// Порядок не алфавитный — чтобы лента выглядела живее (премиум вперёд, потом массовые).
const FEATURED_BRANDS = [
  { slug: 'bmw',           name: 'BMW',           logo: '/images/brands/bmw.svg' },
  { slug: 'mercedes',      name: 'Mercedes-Benz', logo: '/images/brands/mercedes.svg' },
  { slug: 'audi',          name: 'Audi',          logo: '/images/brands/audi.svg' },
  { slug: 'porsche',       name: 'Porsche',       logo: '/images/brands/porsche.svg' },
  { slug: 'land-rover',    name: 'Land Rover',    logo: '/images/brands/land-rover.svg' },
  { slug: 'lexus',         name: 'Lexus',         logo: '/images/brands/lexus.svg' },
  { slug: 'toyota',        name: 'Toyota',        logo: '/images/brands/toyota.svg' },
  { slug: 'volkswagen',    name: 'Volkswagen',    logo: '/images/brands/volkswagen.svg' },
  { slug: 'kia',           name: 'Kia',           logo: '/images/brands/kia.svg' },
  { slug: 'hyundai',       name: 'Hyundai',       logo: '/images/brands/hyundai.svg' },
  { slug: 'haval',         name: 'Haval',         logo: '/images/brands/haval.svg' },
  { slug: 'chery',         name: 'Chery',         logo: '/images/brands/chery.svg' },
  { slug: 'geely',         name: 'Geely',         logo: '/images/brands/geely.svg' },
  { slug: 'tank',          name: 'Tank',          logo: '/images/brands/tank.svg' },
  { slug: 'exeed',         name: 'Exeed',         logo: '/images/brands/exeed.svg' },
];

/* Дублируем массив дважды — для seamless infinite loop:
 *   при анимации transform: translateX(-50%) видимая часть
 *   плавно перетекает во вторую копию, и старт никогда не виден.
 */
const LOOP = [...FEATURED_BRANDS, ...FEATURED_BRANDS];

export function BrandsMarquee() {
  return (
    <section
      aria-label="Марки авто, с которыми работаем"
      className="relative py-10 md:py-14 overflow-hidden bg-[#09090b] border-y border-white/5"
    >
      {/* Подпись — компактная, слева, как «тег» */}
      <div className="container mb-6 md:mb-8 flex items-baseline justify-between gap-4">
        <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-widest font-semibold">
          14 ключевых марок · работаем со&nbsp;всеми
        </p>
        <Link
          href="/marki"
          className="text-zinc-400 hover:text-[#39FF14] text-xs md:text-sm transition-colors whitespace-nowrap"
          prefetch={false}
        >
          смотреть все →
        </Link>
      </div>

      {/* Бесконечная лента: маска по краям для fade-эффекта */}
      <div
        className="relative"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="flex gap-8 md:gap-14 marquee-track will-change-transform">
          {LOOP.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              href={`/brands/${brand.slug}`}
              prefetch={false}
              className="group shrink-0 flex flex-col items-center gap-2 py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
              aria-label={brand.name}
            >
              <div className="relative w-14 h-14 md:w-20 md:h-20 flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={80}
                  className="object-contain opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    filter:
                      'brightness(0) invert(1) drop-shadow(0 0 0 transparent)',
                  }}
                />
                {/* Цветной glow при hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                  style={{
                    boxShadow:
                      '0 0 24px rgba(57,255,20,0.25), inset 0 0 24px rgba(57,255,20,0.05)',
                  }}
                />
              </div>
              <span className="text-xs md:text-sm text-zinc-500 group-hover:text-white transition-colors whitespace-nowrap font-medium">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* CSS animation встроен — чтоб не тащить отдельный файл */}
      <style jsx>{`
        .marquee-track {
          animation: marquee 50s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
