'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/* ВАЖНО: для самих бренд-кнопок используем обычный <a>, а не <Link>.
 * Причина: next/link навешивает onClick, который перехватывает событие
 * для client-side navigation. Если пользователь кликает ДО того, как
 * React успел гидратироваться (бывает на медленном 3G/мобиле), onClick
 * срабатывает и делает preventDefault — клик «съедается», навигация
 * не происходит. С обычным <a> такого не бывает: даже без JS ссылка
 * работает. Prefetch нам тут не нужен — все эти страницы открываются
 * редко по сравнению с самой главной. */

/* ─────────────────────────────────────────────────────────────────────────
 *  Главная — секция «Наши марки»
 *  
 *  Показываем только 14 ключевых марок, с которыми реально работаем
 *  ежедневно (Европа / Япония / Корея / Китай). Без 38-марочной простыни.
 *
 *  ВАЖНО (BMW-bug fix): кнопки бренда ВСЕГДА ведут на внутренний роут
 *  /brands/{slug}. Раньше для BMW/Mercedes/… генерировался субдоменный URL
 *  (https://bmw.hptuning.ru), который в сэндбоксе/dev ломал навигацию.
 *  Субдомены поднимаются на уровне nginx — для клиентских ссылок они
 *  не нужны.
 * ─────────────────────────────────────────────────────────────────────────
 */

type BrandItem = {
  slug: string;
  name: string;
  color: string;
  group: 'eu' | 'jp' | 'kr' | 'cn';
};

const BRANDS: BrandItem[] = [
  // Европейские
  { slug: 'bmw',          name: 'BMW',           color: '#1c69d4', group: 'eu' },
  { slug: 'mercedes',     name: 'Mercedes-Benz', color: '#888888', group: 'eu' },
  { slug: 'audi',         name: 'Audi',          color: '#cc0000', group: 'eu' },
  { slug: 'porsche',      name: 'Porsche',       color: '#c0941f', group: 'eu' },
  { slug: 'landrover',    name: 'Land Rover',    color: '#006a4e', group: 'eu' },
  // Японские
  { slug: 'toyota',       name: 'Toyota',        color: '#eb0a1e', group: 'jp' },
  { slug: 'lexus',        name: 'Lexus',         color: '#7a7a7a', group: 'jp' },
  // Корейские
  { slug: 'kia',          name: 'Kia',           color: '#bb0a30', group: 'kr' },
  { slug: 'hyundai',      name: 'Hyundai',       color: '#002c5f', group: 'kr' },
  // Китайские
  { slug: 'haval',        name: 'Haval',         color: '#e60012', group: 'cn' },
  { slug: 'chery',        name: 'Chery',         color: '#d22128', group: 'cn' },
  { slug: 'geely',        name: 'Geely',         color: '#1a4fa0', group: 'cn' },
  { slug: 'tank',         name: 'Tank',          color: '#3a3a3a', group: 'cn' },
  { slug: 'exeed',        name: 'Exeed',         color: '#a07a3a', group: 'cn' },
];

const GROUP_LABELS: Record<BrandItem['group'], string> = {
  eu: 'Европейские',
  jp: 'Японские',
  kr: 'Корейские',
  cn: 'Китайские',
};

export function BrandsSection() {
  return (
    <section className="py-10 md:py-14 bg-[#09090b] border-t border-white/5">
      <div className="container">
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge mb-2">{BRANDS.length} ключевых марок</span>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-white">
            Наши марки
          </h2>
          <p className="text-zinc-500 text-sm md:text-base mt-2 max-w-xl">
            С этими марками работаем каждый день: Европа, Япония, Корея, Китай.
            Дилерское оборудование и оригинальные процедуры — для каждой.
          </p>
        </motion.div>

        {/* Сетка кнопок по 4 группам */}
        <div className="space-y-5 md:space-y-6 mb-6 md:mb-8">
          {(['eu', 'jp', 'kr', 'cn'] as const).map((g) => {
            const items = BRANDS.filter((b) => b.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <p className="text-[10px] md:text-xs font-semibold text-[#39FF14]/80 uppercase tracking-widest mb-2.5">
                  {GROUP_LABELS[g]}
                </p>
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                  {items.map((brand, i) => (
                    <motion.div
                      key={brand.slug}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                      <a
                        href={`/brands/${brand.slug}`}
                        className="brand-btn group relative inline-flex items-center gap-2 md:gap-2.5 px-3.5 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-white/10 bg-[#111113] text-zinc-300 font-semibold text-xs md:text-sm transition-all duration-200 hover:text-white hover:border-transparent hover:shadow-lg"
                        style={{ '--brand-color': brand.color } as React.CSSProperties}
                        aria-label={`${brand.name} — сервис в СПб`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0 transition-all duration-200 group-hover:scale-125 group-hover:shadow-[0_0_8px_currentColor]"
                          style={{ backgroundColor: brand.color, color: brand.color }}
                        />
                        {brand.name}
                        <span
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                          style={{
                            background: `linear-gradient(135deg, ${brand.color}15 0%, ${brand.color}05 100%)`,
                            border: `1px solid ${brand.color}40`,
                          }}
                        />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/marki"
          prefetch={false}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#39FF14] transition-colors"
        >
          Открыть страницу марок
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
