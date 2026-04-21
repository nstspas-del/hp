/**
 * brand-host.ts — HP Тюнинг
 * Центральный резолвер: hostname ↔ brand slug
 *
 * Источник истины для всего host-based routing.
 * Используется в: middleware.ts, generateMetadata, canonical builders,
 * link builders, sitemap, breadcrumbs.
 */

export const MAIN_DOMAIN = 'hptuning.ru';

/** Все субдомены которые являются брендовыми сайтами */
export const BRAND_SUBDOMAIN_MAP: Record<string, string> = {
  bmw:        'bmw',
  mercedes:   'mercedes',
  audi:       'audi',
  porsche:    'porsche',
  volkswagen: 'volkswagen',
  toyota:     'toyota',
  lexus:      'lexus',
  landrover:  'landrover',
};

/**
 * Извлечь slug бренда из hostname.
 * 'bmw.hptuning.ru'  → 'bmw'
 * 'hptuning.ru'      → null
 * 'localhost'        → null (dev)
 */
export function getBrandFromHost(host: string | null | undefined): string | null {
  if (!host) return null;
  // Убираем порт если есть (localhost:3000)
  const hostname = host.split(':')[0].toLowerCase();

  // localhost или IP — не субдомен
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null;

  // Парсим субдомен: bmw.hptuning.ru → ['bmw','hptuning','ru']
  const parts = hostname.split('.');
  if (parts.length < 3) return null;   // hptuning.ru — основной домен
  if (parts.length === 3 && parts[1] + '.' + parts[2] !== MAIN_DOMAIN) return null;

  const sub = parts[0];
  return BRAND_SUBDOMAIN_MAP[sub] ?? null;
}

/**
 * Обратно: slug бренда → полный URL субдомена
 * 'bmw' → 'https://bmw.hptuning.ru'
 */
export function getBrandUrl(brandSlug: string): string {
  return `https://${brandSlug}.${MAIN_DOMAIN}`;
}

/**
 * Canonical URL страницы на субдомене бренда
 * getBrandCanonical('bmw', '/') → 'https://bmw.hptuning.ru/'
 * getBrandCanonical('bmw', '/chip-tuning') → 'https://bmw.hptuning.ru/chip-tuning'
 */
export function getBrandCanonical(brandSlug: string, path = '/'): string {
  const base = getBrandUrl(brandSlug);
  return base + (path.startsWith('/') ? path : '/' + path);
}

/**
 * Legacy path на основном домене
 * 'bmw' → '/brands/bmw'
 */
export function getBrandLegacyPath(brandSlug: string): string {
  return `/brands/${brandSlug}`;
}

/** Список всех брендовых slugов которые имеют субдомены */
export const BRAND_SLUGS = Object.values(BRAND_SUBDOMAIN_MAP);

/** Проверить — это субдоменный бренд или нет */
export function isBrandSubdomain(host: string | null | undefined): boolean {
  return getBrandFromHost(host) !== null;
}

/**
 * Для Server Components: получить brand из headers (X-Brand-Slug)
 * который устанавливает middleware.
 * Использовать в page.tsx через: import { headers } from 'next/headers'
 */
export function getBrandFromHeaders(headersList: Headers): string | null {
  return headersList.get('x-brand-slug');
}
