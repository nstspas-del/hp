'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const WORKS = [
  {
    src: '/images/works/11-mercedes-s-class-black-front.jpg',
    brand: 'Mercedes S-Class',
    service: 'Детейлинг · Керамика 9H',
    tag: 'Детейлинг',
    color: '#38bdf8',
  },
  {
    src: '/images/works/mercedes-gle63-foam-wash.jpg',
    brand: 'Mercedes GLE 63 AMG',
    service: 'Детейлинг · Химчистка',
    tag: 'Детейлинг',
    color: '#38bdf8',
  },
  {
    src: '/images/works/01-porsche-cayman-pink-lift.jpg',
    brand: 'Porsche Cayman',
    service: 'Чип-тюнинг Stage 2',
    tag: 'Чип-тюнинг',
    color: '#39FF14',
  },
  {
    src: '/images/works/mercedes-amg-orange-lift.jpg',
    brand: 'Mercedes AMG GT',
    service: 'Автосервис · Диагностика',
    tag: 'Автосервис',
    color: '#a78bfa',
  },
  {
    src: '/images/works/ppf-tinting-install.jpg',
    brand: 'Тонировка',
    service: 'Детейлинг · PPF-плёнка',
    tag: 'Детейлинг',
    color: '#38bdf8',
  },
  {
    src: '/images/works/subaru-wrx-lift.jpg',
    brand: 'Subaru WRX STI',
    service: 'Чип-тюнинг Stage 3',
    tag: 'Чип-тюнинг',
    color: '#39FF14',
  },
];

export function WorksPreview() {
  return (
    <section className="py-16 md:py-24 bg-[#0c0c0e]">
      <div className="container">
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="badge mb-3">Наши работы</span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white">
              Портфолио
            </h2>
          </div>
          <Link
            href="/works"
            className="hidden sm:flex items-center gap-2 text-sm text-zinc-500 hover:text-[#39FF14] transition-colors"
          >
            Все работы
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {WORKS.map((w, i) => (
            <motion.div
              key={i}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-[#111113]"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Image
                src={w.src}
                alt={`${w.brand} — ${w.service} в HP Тюнинг`}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Оверлей */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${w.color}20`, color: w.color }}
                >
                  {w.tag}
                </span>
                <div className="text-white text-sm font-semibold mt-1">{w.brand}</div>
                <div className="text-zinc-400 text-xs">{w.service}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/15 text-zinc-400 hover:border-[#39FF14]/40 hover:text-[#39FF14] transition-colors text-sm font-medium"
          >
            Смотреть все работы
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
