'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import brandsData from '@/data/brands.json';

/* Цвета марок для подсветки кнопок */
const BRAND_COLORS: Record<string, string> = {
  bmw:         '#1c69d4',
  mercedes:    '#888888',
  audi:        '#cc0000',
  porsche:     '#c0941f',
  volkswagen:  '#0063b2',
  land_rover:  '#006a4e',
  volvo:       '#003057',
  lexus:       '#1a1a1a',
  jaguar:      '#1a3a5c',
  toyota:      '#eb0a1e',
  kia:         '#05141f',
  nissan:      '#c3002f',
  genesis:     '#8a7560',
};

export function BrandsSection() {
  return (
    <section className="py-16 md:py-20 bg-[#09090b]">
      <div className="container">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge mb-3">13 марок</span>
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white">
            Наши марки
          </h2>
          <p className="text-zinc-500 text-base mt-3 max-w-lg">
            Для каждой марки — специализированное дилерское ПО и отдельная прошивка
          </p>
        </motion.div>

        {/* Кнопки марок — с цветной подсветкой при ховере */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {brandsData.map((brand, i) => {
            const color = BRAND_COLORS[brand.slug] ?? '#39FF14';
            return (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  href={`/brands/${brand.slug}`}
                  className="brand-btn group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/10 bg-[#111113] text-zinc-300 font-semibold text-sm transition-all duration-200 hover:text-white hover:border-transparent hover:shadow-lg"
                  style={{
                    '--brand-color': color,
                  } as React.CSSProperties}
                >
                  {/* Цветной левый штрих */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-all duration-200 group-hover:scale-125 group-hover:shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: color, color }}
                  />
                  {brand.name}
                  {/* Подсветка при ховере */}
                  <span
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                      border: `1px solid ${color}40`,
                    }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Ссылка на все бренды */}
        <Link
          href="/brands"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#39FF14] transition-colors"
        >
          Открыть полный каталог по маркам
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
