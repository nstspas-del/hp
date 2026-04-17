/** @type {import('next').NextConfig} */
const nextConfig = {
  // Увеличенный таймаут статической генерации (секунды)
  staticPageGenerationTimeout: 180,

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
      // ─────────────────────────────────────────────────────────────────

      // Старый домен с дефисом → правильный
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'hp-tuning.ru' }],
        destination: 'https://hptuning.ru/:path*',
        permanent: true,
      },
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'www.hptuning.ru' }],
        destination: 'https://hptuning.ru/:path*',
        permanent: true,
      },
      // Статические страницы старого сайта → новые пути
      { source: '/site', destination: '/', permanent: true },
      { source: '/site/', destination: '/', permanent: true },
      { source: '/site/contacts.html', destination: '/contacts', permanent: true },
      { source: '/site/privacy.html', destination: '/privacy', permanent: true },
      { source: '/site/cookies.html', destination: '/cookies', permanent: true },
      { source: '/site/index.html', destination: '/', permanent: true },
      // Старые brand pages
      { source: '/site/bmw.html', destination: '/brands/bmw', permanent: true },
      { source: '/site/mercedes.html', destination: '/brands/mercedes', permanent: true },
      { source: '/site/audi.html', destination: '/brands/audi', permanent: true },
      { source: '/site/porsche.html', destination: '/brands/porsche', permanent: true },
      { source: '/site/lexus.html', destination: '/brands/lexus', permanent: true },
      { source: '/site/land-rover.html', destination: '/brands/land-rover', permanent: true },
      { source: '/site/volvo.html', destination: '/brands/volvo', permanent: true },
      { source: '/site/volkswagen.html', destination: '/brands/volkswagen', permanent: true },
      { source: '/site/jaguar.html', destination: '/brands/jaguar', permanent: true },
      { source: '/site/genesis.html', destination: '/brands/genesis', permanent: true },
      { source: '/site/toyota.html', destination: '/brands/toyota', permanent: true },
      { source: '/site/kia.html', destination: '/brands/kia', permanent: true },
      { source: '/site/nissan.html', destination: '/brands/nissan', permanent: true },
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://online.autodealer.ru",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://mc.yandex.ru https://hptuning.ru",
              "font-src 'self'",
              "connect-src 'self' https://mc.yandex.ru https://online.autodealer.ru",
              "frame-src 'self' https://yandex.ru https://online.autodealer.ru",
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
