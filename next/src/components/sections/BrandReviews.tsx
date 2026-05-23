/**
 * BrandReviews — отзывы по конкретному бренду.
 *
 * Подтягивает реальные отзывы из seo.json (yandex-источник) и фильтрует
 * по строке `car` совпадая с brandName или brandSlug. Если совпадений нет —
 * блок не рендерится (а не «всё подряд»).
 *
 * Используется на /brands/[brand] и брендовых субдоменах (mercedes.hptuning.ru и т.д.).
 */
import { ExternalLink, Star } from 'lucide-react';
import seoData from '@/data/seo.json';

interface Review {
  id: number;
  name: string;
  car: string;
  service: string;
  rating: number;
  date: string;
  text: string;
  yandexUrl: string;
  avatar: string | null;
}

interface BrandReviewsProps {
  brandSlug: string;
  brandName: string;
}

/** Цвет аватара по первой букве имени — детерминированно */
function avatarColor(name: string) {
  const colors = [
    'bg-violet-600','bg-blue-600','bg-green-600','bg-orange-600',
    'bg-pink-600','bg-teal-600','bg-red-600','bg-indigo-600',
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((n) => n[0]).join('');
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${avatarColor(name)}`}
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

/**
 * Сопоставление brandSlug → набор подстрок, которые могут встретиться в поле review.car.
 * Покрывает синонимы (landrover/Land Rover, vw/Volkswagen).
 */
const BRAND_MATCH: Record<string, string[]> = {
  bmw:        ['BMW'],
  mercedes:   ['Mercedes', 'Mercedes-Benz', 'AMG'],
  audi:       ['Audi'],
  porsche:    ['Porsche'],
  volkswagen: ['VW', 'Volkswagen'],
  vw:         ['VW', 'Volkswagen'],
  landrover:  ['Land Rover', 'Range Rover', 'Discovery'],
  land_rover: ['Land Rover', 'Range Rover', 'Discovery'],
  toyota:     ['Toyota'],
  lexus:      ['Lexus'],
  haval:      ['Haval'],
  chery:      ['Chery'],
  geely:      ['Geely'],
  skoda:      ['Skoda', 'Škoda'],
  dodge:      ['Dodge'],
  jaguar:     ['Jaguar'],
  volvo:      ['Volvo'],
  kia:        ['Kia'],
  nissan:     ['Nissan'],
  genesis:    ['Genesis'],
};

export function BrandReviews({ brandSlug, brandName }: BrandReviewsProps) {
  const reviews: Review[] = seoData.reviews ?? [];

  // Какие подстроки ищем в поле car
  const matchKeys = BRAND_MATCH[brandSlug] ?? [brandName];

  const filtered = reviews.filter((r) =>
    matchKeys.some((key) => r.car.toLowerCase().includes(key.toLowerCase()))
  );

  // Если по бренду нет отзывов — не рендерим вообще
  if (filtered.length === 0) return null;

  return (
    <div className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-white mb-2">
            Отзывы клиентов — {brandName}
          </h2>
          <p className="text-zinc-500 text-sm">
            Реальные отзывы с Яндекс.Карт о работе HP Тюнинг с {brandName}.
          </p>
        </div>
        <a
          href="https://yandex.ru/maps/org/99062407907/reviews/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#39FF14] hover:text-[#39FF14]/80 transition-colors text-sm font-medium whitespace-nowrap"
        >
          Все отзывы на Яндексе
          <ExternalLink className="size-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((review) => (
          <article
            key={review.id}
            className="bg-[#111113] rounded-2xl border border-white/8 p-5 flex flex-col gap-3 hover:border-[#39FF14]/30 transition-colors"
            itemScope
            itemType="https://schema.org/Review"
          >
            <div className="flex items-start gap-3">
              <Avatar name={review.name} />
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold text-white truncate"
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <span itemProp="name">{review.name}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {review.car} · {review.service}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={String(review.rating)} />
                <meta itemProp="bestRating" content="5" />
                <Stars rating={review.rating} />
              </div>
              <time
                className="text-xs text-zinc-500"
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

            <p
              className="text-zinc-300 text-sm leading-relaxed flex-1"
              itemProp="reviewBody"
            >
              {review.text}
            </p>

            <a
              href={review.yandexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#39FF14] transition-colors mt-auto"
            >
              <span className="text-[#fc0]">Я</span>
              Яндекс.Карты
              <ExternalLink className="size-3" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
