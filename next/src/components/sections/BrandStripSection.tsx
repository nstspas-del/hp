/**
 * BrandStripSection — HP Тюнинг
 * Компактная строка брендов на главной странице со ссылкой на /marki/
 */
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STRIP_BRANDS = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Volkswagen',
  'Toyota', 'Lexus', 'Land Rover', 'Haval', 'Chery',
  'Tank', 'Geely', 'Changan', 'Kia', 'Hyundai',
];

export function BrandStripSection() {
  return (
    <section className="py-6 border-y border-white/5 bg-[#0d0d0f]" aria-label="Поддерживаемые марки">
      <div className="container">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-zinc-500">
          {STRIP_BRANDS.map((brand, i) => (
            <span key={brand} className="flex items-center gap-2">
              <span className="hover:text-zinc-300 transition-colors">{brand}</span>
              {i < STRIP_BRANDS.length - 1 && (
                <span className="text-zinc-700 select-none">·</span>
              )}
            </span>
          ))}
          <span className="text-zinc-700 select-none mx-1">—</span>
          <Link
            href="/marki/"
            className="inline-flex items-center gap-1 text-[#39FF14] font-medium hover:underline underline-offset-2 transition-colors"
            prefetch={false}
          >
            смотреть все марки
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
