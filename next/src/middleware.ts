/**
 * middleware.ts — HP Тюнинг (v6 FINAL, без rewrite)
 *
 * Rewrite делает nginx (argument: subdomain → /brands/{slug}).
 * Middleware ТОЛЬКО ставит заголовок x-brand-slug для Server Components.
 *
 * Это обходит баг Next.js 14 с X-Forwarded-Proto, который ломает
 * NextResponse.rewrite() на субдоменах за nginx-прокси.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBrandFromHost, BRAND_SUBDOMAIN_MAP } from '@/lib/brand-host';

export function middleware(request: NextRequest) {
  const rawHost = request.headers.get('host') ?? '';
  const brandSlug = getBrandFromHost(rawHost);

  if (brandSlug) {
    // Только прокидываем header. БЕЗ rewrite.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-brand-slug', brandSlug);
    requestHeaders.set('x-brand-host', rawHost);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
