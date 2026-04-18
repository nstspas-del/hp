import { NextResponse } from 'next/server';

// ISR кеш — 6 часов
export const revalidate = 21600;

// OID организации HP Тюнинг на Яндексе
const YANDEX_ORG_ID = '99062407907';

// Платный Яндекс.Поиск по организациям (YANDEX_ORG_SEARCH_API_KEY) — УДАЛЁН.
// Клиент не использует платный тариф.
// Рейтинг и количество отзывов берутся из статики (актуализировать вручную при необходимости).
// Реальные тексты отзывов отображаются из src/data/reviews.json.

export async function GET() {
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
