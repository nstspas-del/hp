'use client';
import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';
import seoData from '@/data/seo.json';

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');
  // Цвет по первой букве имени
  const colors = [
    'bg-violet-600','bg-blue-600','bg-green-600','bg-orange-600',
    'bg-pink-600','bg-teal-600','bg-red-600','bg-indigo-600',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${colors[idx]}`}
    >
      {initials}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? 'fill-[#39FF14] text-[#39FF14]' : 'text-zinc-700'}`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const reviews = seoData.reviews;

  return (
    <section className="section bg-bg-elevated" id="reviews">
      <div className="container">
        {/* Заголовок */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="badge mb-3">Отзывы клиентов</span>
            <h2 className="section-title mb-2">НАС РЕКОМЕНДУЮТ</h2>
            <p className="text-text-muted text-sm">
              Реальные отзывы с Яндекс.Карт. Более 100 оценок — средний рейтинг 5.0 ★
            </p>
          </div>
          <a
            href="https://yandex.ru/maps/org/99062407907/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Все отзывы на Яндексе
            <ExternalLink className="size-4" />
          </a>
        </motion.div>

        {/* Сетка отзывов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <motion.article
              key={review.id}
              className="card flex flex-col gap-4 hover:border-accent/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* Шапка */}
              <div className="flex items-start gap-3">
                <Avatar name={review.name} />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold text-text truncate"
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <span itemProp="name">{review.name}</span>
                  </div>
                  <div className="text-xs text-text-subtle mt-0.5">
                    {review.car} · {review.service}
                  </div>
                </div>
              </div>

              {/* Звёзды и дата */}
              <div className="flex items-center justify-between">
                <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <meta itemProp="ratingValue" content={String(review.rating)} />
                  <meta itemProp="bestRating" content="5" />
                  <Stars rating={review.rating} />
                </div>
                <time
                  className="text-xs text-text-subtle"
                  dateTime={review.date}
                  itemProp="datePublished"
                >
                  {new Date(review.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>

              {/* Текст */}
              <p
                className="text-text-muted text-sm leading-relaxed flex-1"
                itemProp="reviewBody"
              >
                {review.text}
              </p>

              {/* Ссылка */}
              <a
                href={review.yandexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-text-subtle hover:text-accent transition-colors mt-auto"
              >
                <span className="text-[#fc0]">Я</span>
                Яндекс.Карты
                <ExternalLink className="size-3" />
              </a>
            </motion.article>
          ))}
        </div>

        {/* CTA к отзывам */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://yandex.ru/maps/org/99062407907/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Оставить отзыв на Яндексе
            <ExternalLink className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
