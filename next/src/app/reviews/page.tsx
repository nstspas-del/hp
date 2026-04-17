import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, CheckCircle } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Отзывы клиентов HP Тюнинг СПб — реальные оценки',
  description: 'Отзывы реальных клиентов о чип-тюнинге и детейлинге в HP Тюнинг. BMW, Mercedes, Porsche. Яндекс.Карты, 2ГИС. Средняя оценка 4.9/5.',
  alternates: { canonical: 'https://hptuning.ru/reviews' },
};

const REVIEWS = [
  { id: 1, name: 'Алексей К.', car: 'BMW 540i G30', service: 'Stage 1', rating: 5, date: '2025-12', text: 'Приехал с F30, теперь G30 — и оба раза к этим ребятам. Stage 1 на 540i дал ощутимый прирост. Главное — честно сказали что реально, а что нет. Никакого развода.' },
  { id: 2, name: 'Михаил Д.', car: 'Mercedes C300d W206', service: 'Stage 1 + EGR-off', rating: 5, date: '2025-11', text: 'EGR давал ошибки три года, два сервиса не могли решить. Здесь — за один день и никаких вопросов. Stage 1 ещё добавили — дизель ожил.' },
  { id: 3, name: 'Сергей Ф.', car: 'Porsche Cayenne 958 3.0T', service: 'Stage 1', rating: 5, date: '2025-11', text: 'Рекомендовали друзья. Не разочаровался. Всё чётко, без воды. Прирост в тяге очень ощутим, особенно на трассе. Буду делать Stage 2 следующей весной.' },
  { id: 4, name: 'Анна Р.', car: 'BMW X5 G05 40i', service: 'Ceramic 9H', rating: 5, date: '2025-10', text: 'Делала керамику 9H. Сделали всё аккуратно, без спешки. Три месяца езды — доволен. Мойка становится удовольствием, а не каторгой.' },
  { id: 5, name: 'Дмитрий В.', car: 'Audi RS6 C8', service: 'Stage 1', rating: 5, date: '2025-10', text: 'RS6 и так быстрый, но Stage 1 добавил совсем другое ощущение тяги. Ребята понимают свою работу. Рекомендую без оговорок.' },
  { id: 6, name: 'Игорь С.', car: 'Volvo XC90 2.0T', service: 'Stage 1 + Start/Stop off', rating: 5, date: '2025-09', text: 'Stage 1 + отключение Start/Stop. Start/Stop бесило с первого дня покупки. Теперь всё идеально. Тяга выросла ощутимо.' },
  { id: 7, name: 'Павел О.', car: 'Land Rover Defender D300', service: 'Stage 1', rating: 5, date: '2025-09', text: 'Дефендер дизель — тяга была неплохая, но хотелось большего. После Stage 1 очень доволен. Работали профессионально, объяснили каждый шаг.' },
  { id: 8, name: 'Марина К.', car: 'Mercedes GLE 300d', service: 'PPF капот + бампер', rating: 5, date: '2025-08', text: 'PPF плёнка на капот и передний бампер. Клеили аккуратно, без пузырей. Прошло 4 месяца — всё отлично. Буду делать полный кузов.' },
];

const schemaReviews = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'HP Тюнинг',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    ratingCount: REVIEWS.length.toString(),
  },
  review: REVIEWS.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.name },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating },
    reviewBody: r.text,
  })),
};

export default function ReviewsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaReviews) }} />

      <div className="section container">
        <nav className="text-sm text-text-subtle mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
          <span className="mx-2">→</span>
          <span className="text-text-muted">Отзывы</span>
        </nav>

        <span className="badge mb-4">4.9 / 5 — средняя оценка</span>
        <h1 className="section-title mb-4">ОТЗЫВЫ КЛИЕНТОВ</h1>
        <p className="section-subtitle mb-6">
          Реальные отзывы от реальных людей. Не покупаем оценки — просим клиентов оставить
          честный отзыв после работы.
        </p>

        {/* Рейтинги */}
        <div className="flex flex-wrap gap-4 mb-14">
          {[
            { label: 'Яндекс.Карты', rating: '4.9', count: '47+' },
            { label: '2ГИС', rating: '4.8', count: '23+' },
            { label: 'Общий', rating: '4.9', count: '70+' },
          ].map((r) => (
            <div key={r.label} className="card flex items-center gap-4 flex-1 min-w-[180px]">
              <div className="text-center">
                <div className="font-display text-3xl text-accent">{r.rating}</div>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="size-3 fill-accent text-accent" />)}
                </div>
              </div>
              <div>
                <div className="text-text font-medium text-sm">{r.label}</div>
                <div className="text-text-subtle text-xs">{r.count} отзывов</div>
              </div>
            </div>
          ))}
        </div>

        {/* Отзывы */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {REVIEWS.map((r) => (
            <article key={r.id} className="card flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-text font-semibold text-sm">{r.name}</div>
                  <div className="text-text-subtle text-xs mt-0.5">{r.car}</div>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`size-3 ${s <= r.rating ? 'fill-accent text-accent' : 'text-border'}`} />
                  ))}
                </div>
              </div>
              <p className="text-text-muted text-sm leading-relaxed flex-1">{r.text}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="badge text-xs">{r.service}</span>
                <span className="text-text-subtle text-xs">{r.date}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Призыв оставить отзыв */}
        <div className="card border-accent-dim p-8 mb-14">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1">
              <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-2">БЫЛ У НАС?</h2>
              <p className="text-text-muted text-sm">Оставьте отзыв на Яндекс.Картах — это помогает нам и помогает другим выбрать надёжный сервис.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a href="https://yandex.ru/maps/org/hp_tyuning" target="_blank" rel="noopener noreferrer"
                className="btn-primary text-sm px-6 py-2.5">
                Яндекс.Карты
              </a>
              <a href="https://2gis.ru" target="_blank" rel="noopener noreferrer"
                className="btn-secondary text-sm px-6 py-2.5">
                2ГИС
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card border-accent-dim text-center p-10 glow-box">
          <CheckCircle className="size-10 text-accent mx-auto mb-4" />
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">СТАНЬТЕ СЛЕДУЮЩИМ</h2>
          <p className="text-text-muted mb-6">Запишитесь и через неделю напишете свой отзыв.</p>
          <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
        </div>
      </div>
    </>
  );
}
