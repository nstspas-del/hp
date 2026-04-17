import { NextResponse } from 'next/server';

// ISR кеш — 6 часов
export const revalidate = 21600;

// OID организации на Яндексе
const YANDEX_ORG_ID = '99062407907';

export async function GET() {
  try {
    const apiKey = process.env.YANDEX_ORG_SEARCH_API_KEY;

    if (!apiKey) {
      // Нет ключа — возвращаем статичные данные
      return NextResponse.json(
        {
          rating: 4.9,
          reviewsCount: 200,
          yandexUrl: `https://yandex.ru/maps/org/${YANDEX_ORG_ID}/reviews/`,
          lastUpdated: new Date().toISOString(),
          source: 'static',
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
          },
        }
      );
    }

    // Яндекс API — получаем рейтинг и количество отзывов
    // Яндекс не отдаёт тексты отзывов через публичный API —
    // только агрегированный рейтинг через Business API
    const url = `https://api.business.yandex.net/v1/companies/${YANDEX_ORG_ID}?api_key=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 21600 },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Yandex API error: ${res.status}`);
    }

    const data = await res.json();
    const rating = data?.rating?.score ?? 4.9;
    const reviewsCount = data?.rating?.count ?? 200;

    return NextResponse.json(
      {
        rating: Math.round(rating * 10) / 10,
        reviewsCount,
        yandexUrl: `https://yandex.ru/maps/org/${YANDEX_ORG_ID}/reviews/`,
        lastUpdated: new Date().toISOString(),
        source: 'yandex',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
        },
      }
    );
  } catch (err) {
    // Fallback — статичные данные при ошибке
    console.error('[/api/reviews] Error:', err);
    return NextResponse.json(
      {
        rating: 4.9,
        reviewsCount: 200,
        yandexUrl: `https://yandex.ru/maps/org/${YANDEX_ORG_ID}/reviews/`,
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=900',
        },
      }
    );
  }
}
