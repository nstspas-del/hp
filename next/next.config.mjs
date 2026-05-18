/** @type {import('next').NextConfig} */
const nextConfig = {
  // Увеличенный таймаут статической генерации (секунды)
  staticPageGenerationTimeout: 180,

  // Убираем X-Powered-By заголовок (безопасность + скорость)
  poweredByHeader: false,

  // Gzip-сжатие (помогает PageSpeed)
  compress: true,

  // Строгий TypeScript-режим
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // линтер отдельно
  },

  // next/image: разрешённые домены
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'hptuning.ru' },
      { protocol: 'https', hostname: 'mc.yandex.ru' },
      { protocol: 'https', hostname: 'www.genspark.ai' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Постоянные редиректы
  async redirects() {
    return [
      // ── Блок 2: реструктуризация URL (301) ───────────────────────────
      { source: '/services/chip-tuning/:path*', destination: '/tuning/chip-tuning/:path*', permanent: true },
      { source: '/services/detailing/:path*',   destination: '/detailing/:path*',           permanent: true },
      { source: '/services/service/:path*',     destination: '/service/:path*',             permanent: true },
      { source: '/services/detailing',          destination: '/detailing',                  permanent: true },
      { source: '/services/service',            destination: '/service',                    permanent: true },
      { source: '/services/chip-tuning',        destination: '/tuning/chip-tuning',         permanent: true },
      { source: '/services',                    destination: '/',                            permanent: true },
      { source: '/calculator',                  destination: '/tuning/chip-tuning#chip-calculator', permanent: true },

      // ── 2026-05 Битые .webp из старого индекса Яндекса/Google ──
      // На старом сайте картинки кейсов были в .webp с другими именами; они до сих пор
      // в индексе и боты регулярно стучатся 404. Мапим на реальные существующие jpg.
      { source: '/images/works/bmw-m3-chip.webp',          destination: '/images/works/10-bmw-x5-neon-workshop.jpg',          permanent: true },
      { source: '/images/works/bmw-5er-ceramic.webp',      destination: '/images/works/04-ceramic-coating-application.jpg',  permanent: true },
      { source: '/images/works/bmw-x5m-stage2.webp',       destination: '/images/works/10-bmw-x5-neon-workshop.jpg',          permanent: true },
      { source: '/images/works/mercedes-amg-stage1.webp',  destination: '/images/works/06-mercedes-cls-yellow-amg.jpg',       permanent: true },
      { source: '/images/works/mercedes-gle-ppf.webp',     destination: '/images/works/05-mercedes-gle-coupe-dark-blue.jpg',  permanent: true },
      { source: '/images/works/porsche-cayenne-chip.webp', destination: '/images/works/01-porsche-cayman-pink-lift.jpg',      permanent: true },
      { source: '/images/works/audi-rs6-stage1.webp',      destination: '/images/works/15-mercedes-cls-orange-lift.jpg',      permanent: true },
      { source: '/images/works/volvo-xc90-chip.webp',      destination: '/images/works/02-underbody-exhaust-work.jpg',        permanent: true },
      { source: '/images/works/land-rover-defender-chip.webp', destination: '/images/works/05-mercedes-gle-coupe-dark-blue.jpg', permanent: true },
      { source: '/images/works/subaru-wrx-chip.webp',      destination: '/images/works/17-subaru-wrx-sti-exhaust.jpg',        permanent: true },
      // Универсальный fallback: любой .webp в /images/works/ → дефолтное фото
      { source: '/images/works/:name.webp',                destination: '/images/works/mercedes-amg-orange-lift.jpg',         permanent: true },

      // ── 2025-12 Blog/Works/Projects consolidation ──
      // /works/* → /blog?cat=works    (старый листинг работ → новая объединённая страница «Блог»)
      // /projects → /blog?cat=projects (старый листинг проектов → новая объединённая)
      // /projects/:slug — оставляем как есть (детальные кейсы)
      { source: '/works',                       destination: '/blog?cat=works',   permanent: true },
      { source: '/works/:slug',                 destination: '/blog/:slug',       permanent: true },
      { source: '/projects',                    destination: '/blog?cat=projects', permanent: true },

      // ── 2025-12 Service taxonomy fix ──
      // Шумоизоляция и тюнинг салона переехали из /tuning/* в /detailing/*
      { source: '/tuning/sound',     destination: '/detailing/sound-isolation',  permanent: true },
      { source: '/tuning/interior',  destination: '/detailing/interior-styling', permanent: true },
      { source: '/tuning/brakes',    destination: '/service/brakes',              permanent: true },
      { source: '/tuning/exhaust',   destination: '/tuning/chip-tuning',          permanent: true },

      // ── Старые URL детейлинга (поправили опечатки в slug-ах) ──
      { source: '/detailing/polish',   destination: '/detailing/polishing',    permanent: true },
      { source: '/detailing/cleaning', destination: '/detailing/dry-cleaning', permanent: true },
      { source: '/detailing/tinting',  destination: '/detailing',              permanent: true },
      // ─────────────────────────────────────────────────────────────────
      // Статические страницы старого сайта → новые пути
      { source: '/site', destination: '/', permanent: true },
      { source: '/site/', destination: '/', permanent: true },
      { source: '/site/contacts.html', destination: '/contacts', permanent: true },
      { source: '/site/privacy.html', destination: '/privacy', permanent: true },
      { source: '/site/cookies.html', destination: '/cookies', permanent: true },
      { source: '/site/index.html', destination: '/', permanent: true },
      // Старые статические HTML → субдомены (301)
      { source: '/site/bmw.html',        destination: 'https://bmw.hptuning.ru/',        permanent: true },
      { source: '/site/mercedes.html',   destination: 'https://mercedes.hptuning.ru/',   permanent: true },
      { source: '/site/audi.html',       destination: 'https://audi.hptuning.ru/',       permanent: true },
      { source: '/site/porsche.html',    destination: 'https://porsche.hptuning.ru/',    permanent: true },
      { source: '/site/lexus.html',      destination: 'https://lexus.hptuning.ru/',      permanent: true },
      { source: '/site/land-rover.html', destination: 'https://landrover.hptuning.ru/', permanent: true },
      { source: '/site/volkswagen.html', destination: 'https://volkswagen.hptuning.ru/', permanent: true },
      { source: '/site/toyota.html',     destination: 'https://toyota.hptuning.ru/',     permanent: true },
      // Бренды без субдоменов — остаются на основном домене
      { source: '/site/volvo.html',   destination: '/brands/volvo',   permanent: true },
      { source: '/site/jaguar.html',  destination: '/brands/jaguar',  permanent: true },
      { source: '/site/genesis.html', destination: '/brands/genesis', permanent: true },
      { source: '/site/kia.html',     destination: '/brands/kia',     permanent: true },
      { source: '/site/nissan.html',  destination: '/brands/nissan',  permanent: true },
    ];
  },

  // Заголовки безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Российские сервисы: Яндекс Метрика, Яндекс Карты, Autodealer, RuTube
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://online.autodealer.ru https://api-maps.yandex.ru https://yandex.ru",
              "style-src 'self' 'unsafe-inline' https://api-maps.yandex.ru",
              "img-src 'self' data: blob: https://mc.yandex.ru https://hptuning.ru https://api-maps.yandex.ru https://yandex.ru https://avatars.mds.yandex.net",
              // Шрифты self-hosted через next/font (Inter, Oswald кешируются локально)
              "font-src 'self' data:",
              "connect-src 'self' https://mc.yandex.ru https://online.autodealer.ru https://api-maps.yandex.ru https://yandex.ru https://api.business.yandex.net",
              // RuTube вместо YouTube (YouTube заблокирован в РФ)
              "frame-src 'self' https://yandex.ru https://online.autodealer.ru https://rutube.ru",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
      // Кэширование статики
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;
