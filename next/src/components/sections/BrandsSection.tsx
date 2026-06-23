'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import brandsData from '@/data/brands.json';
import { getBrandUrl, BRAND_SUBDOMAIN_MAP } from '@/lib/brand-host';

/* Цвета марок для подсветки кнопок */
const BRAND_COLORS: Record<string, string> = {
 bmw: '#1c69d4',
 mercedes: '#888888',
 audi: '#cc0000',
 porsche: '#c0941f',
 volkswagen: '#0063b2',
 'land-rover': '#006a4e',
 landrover: '#006a4e',
 volvo: '#003057',
 lexus: '#1a1a1a',
 jaguar: '#1a3a5c',
 toyota: '#eb0a1e',
 kia: '#bb0a30',
 nissan: '#c3002f',
 genesis: '#8a7560',
 hyundai: '#002c5f',
 subaru: '#003399',
 mini: '#1c69d4',
 skoda: '#4ba82e',
 mitsubishi: '#cc0000',
 mazda: '#910a00',
 infiniti: '#1a1a1a',
 ford: '#003478',
 jeep: '#333333',
 opel: '#a09f00',
 renault: '#c0a800',
 seat: '#e2001a',
 'alfa-romeo': '#cc0000',
 bentley: '#004d40',
 maserati: '#1a1a8c',
 ferrari: '#cc0000',
 lamborghini: '#f0a800',
 cadillac: '#333333',
 mclaren: '#e8720d',
};

/** Возвращает правильный href для кнопки бренда:
 *  - субдоменный бренд → https://bmw.hptuning.ru
 *  - остальные → /brands/slug (остаются на основном сайте)
 */
function getBrandHref(slug: string): string {
  // Нормализация: land-rover → landrover
  const normalized = slug.replace('-', '');
  if (BRAND_SUBDOMAIN_MAP[normalized] || BRAND_SUBDOMAIN_MAP[slug]) {
    return getBrandUrl(BRAND_SUBDOMAIN_MAP[normalized] ?? BRAND_SUBDOMAIN_MAP[slug] ?? slug);
  }
  return `/brands/${slug}`;
}

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
 <span className="badge mb-3">{brandsData.length} марок</span>
 <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white">
 Наши марки
 </h2>
 <p className="text-zinc-500 text-base mt-3 max-w-lg">
 Весь премиальный и средний сегмент — от Ferrari до Renault. Специализированное ПО для каждой марки.
 </p>
 </motion.div>

 {/* Кнопки марок — с цветной подсветкой при ховере */}
 <div className="flex flex-wrap gap-2.5 mb-10">
 {brandsData.map((brand, i) => {
 const color = BRAND_COLORS[brand.slug] ?? '#39FF14';
 const href = getBrandHref(brand.slug);
 const isExternal = href.startsWith('http');
 return (
 <motion.div
 key={brand.slug}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.3, delay: i * 0.04 }}
 >
 <a
 href={href}
 {...(isExternal ? {} : {})}
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
 </a>
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
