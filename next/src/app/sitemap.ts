import { MetadataRoute } from 'next';
import brands from '@/data/brands.json';
import districts from '@/data/districts.json';
import services from '@/data/services.json';
import { BRAND_SUBDOMAIN_MAP, getBrandUrl } from '@/lib/brand-host';

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
 { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
 { url: `${BASE}/blog?cat=projects`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
 { url: `${BASE}/blog?cat=works`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
 { url: `${BASE}/blog?cat=articles`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
 { url: `${BASE}/video`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.6 },
 { url: `${BASE}/calculator`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.8 },
 { url: `${BASE}/brands`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.9 },
 { url: `${BASE}/locations`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.7 },

 // Основные категории услуг
 { url: `${BASE}/tuning`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.9 },
 { url: `${BASE}/tuning/chip-tuning`, lastModified: NOW, changeFrequency: 'weekly', priority: 1.0 },
 { url: `${BASE}/detailing`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.9 },
 { url: `${BASE}/service`, lastModified: MONTH_AGO, changeFrequency: 'monthly', priority: 0.8 },

 // Маркетинг-страницы Яндекс.Бизнес (приоритетные услуги — единые с карточкой)
 { url: `${BASE}/yandex-services.yml`, lastModified: NOW, changeFrequency: 'daily', priority: 0.3 },

 // Юридические
 { url: `${BASE}/privacy`, lastModified: MONTH_AGO, changeFrequency: 'yearly', priority: 0.2 },
 { url: `${BASE}/cookies`, lastModified: MONTH_AGO, changeFrequency: 'yearly', priority: 0.1 },
 ];

 // ── Бренды (динамические) ─────────────────────────────────────────────────
 // Субдоменные бренды → URL субдомена. Остальные → /brands/:slug
 // Алиасы: land-rover → landrover (субдомен landrover.hptuning.ru)
 const SLUG_ALIAS: Record<string, string> = { 'land-rover': 'landrover' };
 const subdomainSlugs = new Set(Object.values(BRAND_SUBDOMAIN_MAP));

 const seenSubdomains = new Set<string>(); // дедупликация ланд ровера
 const brandPages: MetadataRoute.Sitemap = brands
   .filter((brand) => {
     // Пропускаем landrover-alias (дубликат land-rover в данных)
     if (brand.slug === 'landrover') return false;
     return true;
   })
   .map((brand) => {
     // Нормализуем slug: land-rover → landrover для проверки субдомена
     const resolvedSlug = SLUG_ALIAS[brand.slug] ?? brand.slug;
     const isSubdomain = subdomainSlugs.has(resolvedSlug);
     if (isSubdomain) seenSubdomains.add(resolvedSlug);
     return {
       url: isSubdomain
         ? `${getBrandUrl(resolvedSlug)}/`
         : `${BASE}/brands/${brand.slug}`,
       lastModified: MONTH_AGO,
       changeFrequency: 'monthly' as const,
       priority: brand.featured ? 0.9 : 0.7,
     };
   });

 // ── Районы (динамические) ─────────────────────────────────────────────────
 const districtPages: MetadataRoute.Sitemap = districts.map((district) => ({
 url: `${BASE}/locations/${district.slug}`,
 lastModified: MONTH_AGO,
 changeFrequency: 'monthly' as const,
 priority: 0.6,
 }));

 // ── Услуги категорий (динамические) ──────────────────────────────────────
 // Только новые пути. Старые /services/* не включаем — на них 301-редирект,
 // в sitemap они дают «грязный» crawl-граф для Яндекса.
 const servicePages: MetadataRoute.Sitemap = [];
 for (const cat of services.categories) {
 const items = (cat as any).items ?? [];
 for (const item of items) {
 let url: string | null = null;
 if (cat.slug === 'chip-tuning') {
 url = `${BASE}/tuning/chip-tuning/${item.slug}`;
 } else if (cat.slug === 'detailing') {
 url = `${BASE}/detailing/${item.slug}`;
 } else if (cat.slug === 'service') {
 url = `${BASE}/service/${item.slug}`;
 }
 if (url) {
 servicePages.push({
 url,
 lastModified: MONTH_AGO,
 changeFrequency: 'monthly',
 priority: 0.8,
 });
 }
 }
 }

 // ── Проекты / кейсы (детальные страницы остаются на /projects/[slug]) ──
 // /projects listing редиректит на /blog?cat=projects → не включаем
 // При росте проектов синхронизировать с blog-entries.json
 const projectSlugs: { slug: string; date: string }[] = [
 { slug: 'dodge-challenger-ta-hemi',       date: '2025-11-20' },
 { slug: 'bmw-x5-g05-chiptuning-stage2',   date: '2025-10-12' },
 ];
 const projectPages: MetadataRoute.Sitemap = projectSlugs.map((p) => ({
 url: `${BASE}/projects/${p.slug}`,
 lastModified: p.date,
 changeFrequency: 'monthly' as const,
 priority: 0.8,
 }));

 return [
 ...staticPages,
 ...brandPages,
 ...districtPages,
 ...servicePages,
 ...projectPages,
 ];
}
