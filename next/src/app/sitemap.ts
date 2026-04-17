import { MetadataRoute } from 'next';
import brands from '@/data/brands.json';
import districts from '@/data/districts.json';
import services from '@/data/services.json';

const BASE = 'https://hptuning.ru';

// Даты для свежести контента
const NOW = new Date().toISOString();
const MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Статические страницы ──────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: NOW, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contacts`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/reviews`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/works`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/video`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/calculator`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/brands`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/locations`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },

    // Основные категории услуг
    { url: `${BASE}/tuning`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tuning/chip-tuning`, lastModified: NOW, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/detailing`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/service`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.8 },

    // Страницы сервиса
    { url: `${BASE}/service/brakes`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/service/diagnostics`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/service/electrics`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/service/engine`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/service/suspension`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/service/to`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/service/transmission`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.6 },

    // Редиректные /services/* (для crawl — canonical уже указывает на правильный URL)
    { url: `${BASE}/services`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/services/chip-tuning`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services/detailing`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services/service`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.6 },

    // Юридические
    { url: `${BASE}/privacy`, lastModified: MONTH_AGO, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/cookies`, lastModified: MONTH_AGO, changeFrequency: 'yearly', priority: 0.1 },
  ];

  // ── Бренды (динамические) ─────────────────────────────────────────────────
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${BASE}/brands/${brand.slug}`,
    lastModified: MONTH_AGO,
    changeFrequency: 'monthly' as const,
    priority: brand.featured ? 0.9 : 0.7,
  }));

  // ── Районы (динамические) ─────────────────────────────────────────────────
  const districtPages: MetadataRoute.Sitemap = districts.map((district) => ({
    url: `${BASE}/locations/${district.slug}`,
    lastModified: MONTH_AGO,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // ── Услуги категорий (динамические) ──────────────────────────────────────
  const servicePages: MetadataRoute.Sitemap = [];
  for (const cat of services.categories) {
    const items = (cat as any).items ?? [];
    for (const item of items) {
      // /tuning/chip-tuning/[service]
      if (cat.slug === 'chip-tuning') {
        servicePages.push({
          url: `${BASE}/tuning/chip-tuning/${item.slug}`,
          lastModified: MONTH_AGO,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
        // Legacy /services/chip-tuning/[service]
        servicePages.push({
          url: `${BASE}/services/chip-tuning/${item.slug}`,
          lastModified: MONTH_AGO,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      } else if (cat.slug === 'detailing') {
        servicePages.push({
          url: `${BASE}/detailing/${item.slug}`,
          lastModified: MONTH_AGO,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
        servicePages.push({
          url: `${BASE}/services/detailing/${item.slug}`,
          lastModified: MONTH_AGO,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      } else if (cat.slug === 'service') {
        servicePages.push({
          url: `${BASE}/services/service/${item.slug}`,
          lastModified: MONTH_AGO,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return [
    ...staticPages,
    ...brandPages,
    ...districtPages,
    ...servicePages,
  ];
}
