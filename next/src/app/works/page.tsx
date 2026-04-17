import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingButton } from '@/components/ui/BookingButton';
import { Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Наши работы — портфолио тюнинга и детейлинга | HP Тюнинг СПб',
  description: 'Реальные кейсы чип-тюнинга Stage 1/2/3, керамики и PPF от HP Тюнинг. BMW M3, Mercedes AMG, Porsche, Audi RS. Замеры до и после.',
  alternates: { canonical: 'https://hptuning.ru/works' },
};

// Демо-кейсы (замените на реальные данные позже)
const WORKS = [
  { id: 1, brand: 'BMW', model: 'M3 F80', service: 'Stage 2', hp_before: 431, hp_after: 510, nm_before: 550, nm_after: 680, tags: ['Чип-тюнинг', 'Stage 2'], color: '#1c69d4' },
  { id: 2, brand: 'Mercedes', model: 'C63 AMG W205', service: 'Stage 1', hp_before: 476, hp_after: 530, nm_before: 650, nm_after: 750, tags: ['Чип-тюнинг', 'Stage 1'], color: '#2d3748' },
  { id: 3, brand: 'Porsche', model: 'Cayenne 3.0T', service: 'Stage 1 + DPF-off', hp_before: 340, hp_after: 395, nm_before: 450, nm_after: 540, tags: ['Чип-тюнинг', 'DPF-off'], color: '#718096' },
  { id: 4, brand: 'Audi', model: 'RS6 C8', service: 'Stage 1', hp_before: 600, hp_after: 680, nm_before: 800, nm_after: 920, tags: ['Чип-тюнинг', 'Stage 1'], color: '#e53e3e' },
  { id: 5, brand: 'BMW', model: '5er G30 530i', service: 'Ceramic 9H', hp_before: 0, hp_after: 0, nm_before: 0, nm_after: 0, tags: ['Детейлинг', 'Керамика 9H'], color: '#1c69d4' },
  { id: 6, brand: 'Volvo', model: 'XC90 2.0T', service: 'Stage 1', hp_before: 249, hp_after: 295, nm_before: 350, nm_after: 430, tags: ['Чип-тюнинг', 'Stage 1'], color: '#003057' },
  { id: 7, brand: 'Land Rover', model: 'Defender 3.0D', service: 'Stage 1 + EGR-off', hp_before: 300, hp_after: 360, nm_before: 650, nm_after: 780, tags: ['Чип-тюнинг', 'EGR-off'], color: '#2f4f4f' },
  { id: 8, brand: 'Mercedes', model: 'GLE 400d', service: 'PPF капот + крылья', hp_before: 0, hp_after: 0, nm_before: 0, nm_after: 0, tags: ['Детейлинг', 'PPF'], color: '#2d3748' },
  { id: 9, brand: 'BMW', model: 'X5M F95', service: 'Stage 2', hp_before: 625, hp_after: 720, nm_before: 750, nm_after: 900, tags: ['Чип-тюнинг', 'Stage 2'], color: '#1c69d4' },
];

export default function WorksPage() {
  return (
    <div className="section container">
      <nav className="text-sm text-text-subtle mb-8">
        <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
        <span className="mx-2">→</span>
        <span className="text-text-muted">Наши работы</span>
      </nav>

      <span className="badge mb-4">Реальные результаты</span>
      <h1 className="section-title mb-4">НАШИ РАБОТЫ</h1>
      <p className="section-subtitle mb-14">
        Чип-тюнинг и детейлинг реальных автомобилей наших клиентов.
        Все замеры подтверждены на мотодинамометре.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {WORKS.map((w) => (
          <article key={w.id} className="card group hover:border-accent-dim">
            {/* Шапка */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-display font-bold"
                style={{ backgroundColor: `${w.color}20`, color: w.color }}>
                {w.brand.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-text font-semibold group-hover:text-accent transition-colors">
                  {w.brand} {w.model}
                </div>
                <div className="text-text-subtle text-xs">{w.service}</div>
              </div>
            </div>

            {/* Теги */}
            <div className="flex flex-wrap gap-2 mb-4">
              {w.tags.map((t) => (
                <span key={t} className="badge text-xs">{t}</span>
              ))}
            </div>

            {/* Результаты (только для тюнинга) */}
            {w.hp_after > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div>
                  <div className="text-text-subtle text-xs mb-1">Мощность</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-text-muted text-sm">{w.hp_before}</span>
                    <span className="text-text-subtle text-xs">→</span>
                    <span className="text-accent font-bold">{w.hp_after}</span>
                    <span className="text-text-subtle text-xs">л.с.</span>
                  </div>
                </div>
                <div>
                  <div className="text-text-subtle text-xs mb-1">Тяга</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-text-muted text-sm">{w.nm_before}</span>
                    <span className="text-text-subtle text-xs">→</span>
                    <span className="text-accent font-bold">{w.nm_after}</span>
                    <span className="text-text-subtle text-xs">Нм</span>
                  </div>
                </div>
              </div>
            )}

            {/* Детейлинг — описание вместо замеров */}
            {w.hp_after === 0 && (
              <div className="pt-4 border-t border-border text-text-subtle text-sm">
                Профессиональная обработка, фото до/после по запросу
              </div>
            )}
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="card border-accent-dim text-center p-10 glow-box">
        <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">
          ХОЧУ РЕЗУЛЬТАТ КАК У НИХ
        </h2>
        <p className="text-text-muted mb-6">Запишитесь — подберём оптимальный вариант именно для вашего авто.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
          <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
            <Phone className="size-4" /> +7 (981) 842-81-51
          </a>
        </div>
      </div>
    </div>
  );
}
