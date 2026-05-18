import type { MetadataRoute } from 'next';

/**
 * robots.txt — генерируется Next.js App Router.
 * Заменяет старый next-sitemap postbuild.
 *
 * Один источник истины для sitemap → /sitemap.xml (см. src/app/sitemap.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/privacy', '/cookies', '/api/', '/404', '/500'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/privacy', '/cookies', '/api/', '/404', '/500'],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://hptuning.ru/sitemap.xml',
    host: 'https://hptuning.ru',
  };
}
