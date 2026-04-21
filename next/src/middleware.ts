/**
 * middleware.ts — HP Тюнинг
 * Host-based brand routing для субдоменов.
 *
 * FIX EPROTO: используем request.nextUrl.clone() + меняем только pathname,
 * не трогая protocol/host → rewrite всегда идёт через http://127.0.0.1:3000.
 *
 * Логика:
 *  bmw.hptuning.ru/    → rewrite → /brands/bmw (URL в браузере не меняется)
 *  hptuning.ru/brands/bmw → 301 → https://bmw.hptuning.ru/
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBrandFromHost, getBrandUrl, BRAND_SUBDOMAIN_MAP } from '@/lib/brand-host';

/** Список slug-ов, для которых есть субдомены */
const SUBDOMAIN_SLUGS = new Set(Object.values(BRAND_SUBDOMAIN_MAP));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  const brandSlug = getBrandFromHost(host);

  // ── 1. Запрос пришёл на субдомен бренда ──────────────────────────────────
  if (brandSlug) {
    // Пробрасываем slug в headers для Server Components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-brand-slug', brandSlug);
    requestHeaders.set('x-brand-host', host);

    // Статика и системные пути — без rewrite, только добавляем headers
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/fonts') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/robots') ||
      pathname.startsWith('/sitemap') ||
      pathname.startsWith('/yandex_')
    ) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // КЛЮЧЕВОЙ FIX: клонируем URL и меняем ТОЛЬКО pathname.
    // Это сохраняет protocol=http и host=localhost → нет TLS-рукопожатия.
    const rewriteUrl = request.nextUrl.clone();

    if (pathname === '/' || pathname === '') {
      // Главная субдомена → страница бренда
      rewriteUrl.pathname = `/brands/${brandSlug}`;
    }
    // Все остальные пути на субдомене — оставляем pathname без изменений,
    // но добавляем headers с информацией о бренде.

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  // ── 2. Основной домен: /brands/:slug → субдомен (301) ─────────────────────
  const brandRedirectMatch = pathname.match(/^\/brands\/([a-z0-9_-]+)\/?$/);
  if (brandRedirectMatch) {
    const slug = brandRedirectMatch[1];
    // Нормализуем алиасы: land-rover → landrover
    const SLUG_ALIAS: Record<string, string> = { 'land-rover': 'landrover' };
    const aliasSlug = SLUG_ALIAS[slug] ?? slug;
    const normalizedSlug = BRAND_SUBDOMAIN_MAP[aliasSlug] ?? aliasSlug;

    if (SUBDOMAIN_SLUGS.has(normalizedSlug)) {
      const subdomainUrl = getBrandUrl(normalizedSlug) + '/';
      return NextResponse.redirect(subdomainUrl, { status: 301 });
    }
  }

  // ── 3. Всё остальное — пропускаем ─────────────────────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Запускаем на всех путях кроме:
     * - _next/static (статика)
     * - _next/image  (оптимизация изображений)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
