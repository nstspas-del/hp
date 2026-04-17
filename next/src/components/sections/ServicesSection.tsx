'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Wrench, ArrowRight } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';
import servicesData from '@/data/services.json';

const ICONS: Record<string, React.ReactNode> = {
  zap: <Zap className="size-7 text-accent" />,
  sparkles: <Sparkles className="size-7 text-accent" />,
  wrench: <Wrench className="size-7 text-accent" />,
};

export function ServicesSection() {
  return (
    <section className="section bg-bg-elevated">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge mb-4">Что мы делаем</span>
          <h2 className="section-title">НАШИ УСЛУГИ</h2>
          <p className="section-subtitle mx-auto">
            Три направления — чип-тюнинг, детейлинг и автосервис. Всё для вашего премиального автомобиля.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesData.categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              className="card flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {ICONS[cat.icon] ?? <Zap className="size-7 text-accent" />}
                <h3 className="font-display text-2xl text-text tracking-wider">{cat.name}</h3>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                {cat.shortDescription}
              </p>
              <div className="text-accent text-sm font-semibold mb-5">
                от {cat.priceFrom.toLocaleString('ru-RU')} ₽
              </div>
              <div className="flex flex-col gap-2 mb-6">
                {cat.items.slice(0, 3).map((item) => (
                  <Link key={item.slug} href={`/services/${cat.slug}/${item.slug}`}
                    className="flex items-center justify-between text-sm text-text-muted hover:text-accent transition-colors group">
                    <span>{item.name}</span>
                    <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <Link href={`/services/${cat.slug}`} className="btn-secondary text-xs flex-1 justify-center">
                  Подробнее
                </Link>
                <button onClick={() => openBooking(cat.name)} className="btn-primary text-xs flex-1 justify-center">
                  Записаться
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
