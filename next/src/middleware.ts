/**
 * middleware.ts — HP Тюнинг
 * Host-based brand routing для субдоменов.
 *
 * Логика:
 *  bmw.hptuning.ru/          → рендерит /brands/bmw (rewrite, URL не меняется)
 *  bmw.hptuning.ru/*         → добавляет X-Brand-Slug header для Server Components
 *  hptuning.ru/brands/bmw   → 301 → https://bmw.hptuning.ru/
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBrandFromHost, getBrandUrl, BRAND_SUBDOMAIN_MAP } from '@/lib/brand-host';

export function middleware(request: NextRequest) {
  const { pathname, host: hostHeader } = request.nextUrl;
  // next/headers host может включать порт
  const host = request.headers.get('host') ?? hostHeader;

  const brandSlug = getBrandFromHost(host);

  // ── 1. Запрос пришёл на субдомен бренда ────────────────────────────────────
  if (brandSlug) {
    // Пробрасываем slug в headers для Server Components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-brand-slug', brandSlug);
    requestHeaders.set('x-brand-host', host);

    // Rewrite: / → /brands/{slug}  (URL в браузере остаётся bmw.hptuning.ru/)
    // Для остальных путей — просто добавляем заголовки и пропускаем
    let rewriteUrl: URL;

    if (pathname === '/' || pathname === '') {
      // Главная субдомена → brand page
      rewriteUrl = new URL(`/brands/${brandSlug}`, request.url);
    } else if (pathname.startsWith('/_next') || pathname.startsWith('/images') ||
               pathname.startsWith('/fonts') || pathname.startsWith('/favicon') ||
               pathname.startsWith('/robots') || pathname.startsWith('/sitemap') ||
               pathname.startsWith('/yandex_')) {
      // Статика и системные файлы — без rewrite
      return NextResponse.next({ request: { headers: requestHeaders } });
    } else {
      // Любой другой путь на субдомене — добавляем заголовки
      rewriteUrl = new URL(pathname + request.nextUrl.search, request.url);
    }

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  // ── 2. Запрос на основном домене: /brands/:slug → субдомен (301) ───────────
  // Только для точного пути /brands/bmw (без trailing slash и без subpath)
  const brandRedirectMatch = pathname.match(/^\/brands\/([a-z0-9_-]+)\/?$/);
  if (brandRedirectMatch) {
    const slug = brandRedirectMatch[1];
    // Проверяем что это реальный субдоменный бренд (по BRAND_SUBDOMAIN_MAP)
    const isSubdomainBrand = Object.values(BRAND_SUBDOMAIN_MAP).includes(slug) ||
                              Object.keys(BRAND_SUBDOMAIN_MAP).includes(slug);
    if (isSubdomainBrand) {
      // Нормализуем slug (landrover вместо land-rover)
      const normalizedSlug = Object.values(BRAND_SUBDOMAIN_MAP).includes(slug) ? slug :
                              BRAND_SUBDOMAIN_MAP[slug] ?? slug;
      const subdomainUrl = getBrandUrl(normalizedSlug) + '/';
      return NextResponse.redirect(subdomainUrl, { status: 301 });
    }
  }

  // ── 3. Остальные запросы на основном домене — пропускаем ──────────────────
  return NextResponse.next();
}

export const config = {
  // Запускаем middleware на всех путях кроме исключений
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
