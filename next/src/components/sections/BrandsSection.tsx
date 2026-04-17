'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';
import brands from '@/data/brands.json';

export function BrandsSection() {
  const featured = brands.filter((b) => b.featured);
  const rest = brands.filter((b) => !b.featured);

  return (
    <section className="section">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge mb-4">13 брендов</span>
          <h2 className="section-title">ТЮНИНГ ПО МАРКАМ</h2>
          <p className="section-subtitle mx-auto">
            Специализируемся на премиальных автомобилях. Дилерское диагностическое оборудование для каждой марки.
          </p>
        </motion.div>

        {/* Featured brands */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {featured.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/brands/${brand.slug}`}
                className="card flex flex-col items-start gap-3 hover:border-accent-dim group h-full">
                {/* Brand logo placeholder */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-display font-bold"
                  style={{ backgroundColor: `${brand.color}20`, color: brand.color }}>
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl text-text tracking-wider group-hover:text-accent transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-text-subtle text-xs mt-1">{brand.tagline ?? brand.description}</p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-accent text-sm font-semibold">
                    от {brand.priceFrom.toLocaleString('ru-RU')} ₽
                  </span>
                  <ArrowRight className="size-4 text-text-subtle group-hover:text-accent transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Rest brands */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {rest.map((brand) => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`}
              className="card p-3 flex flex-col items-center gap-2 text-center hover:border-accent-dim group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-display font-bold"
                style={{ backgroundColor: `${brand.color ?? '#39FF14'}20`, color: brand.color ?? '#39FF14' }}>
                {brand.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-text-muted text-xs group-hover:text-accent transition-colors leading-tight">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/brands" className="btn-secondary justify-center">
            Все бренды и модели
          </Link>
          <button onClick={() => openBooking()} className="btn-primary justify-center">
            Записаться онлайн
          </button>
        </div>
      </div>
    </section>
  );
}
