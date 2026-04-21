/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://hptuning.ru',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/privacy', '/cookies', '/404', '/500', '/api/*'],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/privacy', '/cookies', '/api/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/privacy', '/cookies', '/api/'],
        crawlDelay: 2,
      },
    ],
    additionalSitemaps: [],
    additionalPolicies: [
      { policy: 'Host: hptuning.ru' },
      { policy: 'Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term' },
    ],
  },

  // Кастомные приоритеты по разделам
  transform: async (config, path) => {
    const priorityMap = {
      '/': 1.0,
      '/brands': 0.9,
      '/services': 0.9,
      '/contacts': 0.8,
      '/works': 0.7,
      '/blog': 0.7,
      '/locations': 0.7,
      '/reviews': 0.6,
      '/about': 0.6,
    };

    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/brands/') && path.split('/').length === 3) {
      priority = 0.8; // страницы брендов
    } else if (path.startsWith('/services/')) {
      priority = 0.8;
    } else if (path.startsWith('/blog/')) {
      priority = 0.7;
      changefreq = 'monthly';
    } else if (path.startsWith('/locations/')) {
      priority = 0.7;
    } else if (priorityMap[path]) {
      priority = priorityMap[path];
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

module.exports = config;
