/**
 * YandexReviewsWidget — встроенный виджет отзывов с Яндекс.Карт
 *
 * Подтягивает РЕАЛЬНЫЕ отзывы организации с Яндекс.Карт «как есть» —
 * без копирования в нашу базу. Виджет — официальный, обслуживается
 * yandex.ru (родной российский домен), открывается из РФ без VPN.
 *
 * Использование:
 *   <YandexReviewsWidget orgId="99062407907" />
 *   <YandexReviewsWidget orgId="99062407907" compact />  // Только rating-badge
 *
 * Преимущества над собственным списком отзывов:
 *   • Свежие отзывы автоматически (без редеплоя)
 *   • Подлинность для Google E-E-A-T (отзывы видны на родной платформе)
 *   • Меньше «перегрузки страницы» собственным контентом
 *   • Один источник правды — Яндекс.Карты
 */
'use client';

import { useState } from 'react';

interface YandexReviewsWidgetProps {
  /** ID организации в Яндекс.Бизнесе (например 99062407907) */
  orgId: string;
  /** Если true — показываем только rating-badge, без полного списка */
  compact?: boolean;
  /** Высота фрейма со списком отзывов */
  height?: number;
  /** Заголовок секции */
  title?: string;
}

export function YandexReviewsWidget({
  orgId,
  compact = false,
  height = 600,
  title = 'Реальные отзывы клиентов HP Тюнинг',
}: YandexReviewsWidgetProps) {
  const [loaded, setLoaded] = useState(false);

  const reviewsUrl = `https://yandex.ru/maps-reviews-widget/${orgId}?comments`;
  const fallbackUrl = `https://yandex.ru/maps/org/${orgId}/reviews/`;
  const ratingBadgeUrl = `https://yandex.ru/sprav/widget/rating-badge/${orgId}?type=rating&theme=dark`;

  if (compact) {
    return (
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 group"
      >
        <iframe
          src={ratingBadgeUrl}
          width={180}
          height={50}
          style={{ border: 0, borderRadius: 8, overflow: 'hidden' }}
          loading="lazy"
          title="Рейтинг HP Тюнинг на Яндекс.Картах"
        />
        <span className="text-zinc-400 text-sm group-hover:text-accent transition-colors">
          → Открыть все отзывы
        </span>
      </a>
    );
  }

  return (
    <section className="container py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-2" style={{ letterSpacing: '-0.025em' }}>
            {title}
          </h2>
          <p className="text-zinc-400 text-base">
            Отзывы загружаются прямо с Яндекс.Карт — мы их не редактируем.
          </p>
        </div>
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFCC00]/15 border border-[#FFCC00]/40 text-[#FFCC00] hover:bg-[#FFCC00]/25 transition-colors text-sm font-semibold"
        >
          Оставить отзыв на Яндексе →
        </a>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#111113]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm z-10 pointer-events-none">
            <div className="animate-pulse">Загрузка отзывов с Яндекс.Карт…</div>
          </div>
        )}
        <iframe
          src={reviewsUrl}
          width="100%"
          height={height}
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          title={`Отзывы HP Тюнинг на Яндекс.Картах (организация ${orgId})`}
          onLoad={() => setLoaded(true)}
          className="relative z-20"
        />
      </div>

      <p className="text-xs text-zinc-600 mt-3">
        Виджет загружается с домена yandex.ru — доступен без VPN из любой страны.
        Если виджет не отображается — откройте{' '}
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          страницу отзывов на Яндекс.Картах напрямую
        </a>
        .
      </p>
    </section>
  );
}
