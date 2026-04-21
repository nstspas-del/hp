'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const WORKS = [
 {
 src: '/images/works/15-mercedes-cls-orange-lift.jpg',
 brand: 'Mercedes CLS AMG',
 service: 'Автосервис · Диагностика на подъёмнике',
 tag: 'Автосервис',
 color: '#a78bfa',
 href: '/service',
 },
 {
 src: '/images/works/10-bmw-x5-neon-workshop.jpg',
 brand: 'BMW X5',
 service: 'Тюнинг · +60 л.с.',
 tag: 'Чип-тюнинг',
 color: '#39FF14',
 href: '/tuning/chip-tuning',
 },
 {
 src: '/images/works/04-ceramic-coating-application.jpg',
 brand: 'Детейлинг',
 service: 'Керамическое покрытие 9H',
 tag: 'Детейлинг',
 color: '#38bdf8',
 href: '/detailing',
 },
 {
 src: '/images/works/01-porsche-cayman-pink-lift.jpg',
 brand: 'Porsche Cayman',
 service: 'Тюнинг и чип-тюнинг',
 tag: 'Чип-тюнинг',
 color: '#39FF14',
 href: '/tuning/chip-tuning',
 },
 {
 src: '/images/works/16-mercedes-gle63-foam-wash.jpg',
 brand: 'Mercedes GLE 63 AMG',
 service: 'Детейлинг · Химчистка + полировка',
 tag: 'Детейлинг',
 color: '#38bdf8',
 href: '/detailing',
 },
 {
 src: '/images/works/17-subaru-wrx-sti-exhaust.jpg',
 brand: 'Subaru WRX STI',
 service: 'Тюнинг · Выхлоп',
 tag: 'Чип-тюнинг',
 color: '#39FF14',
 href: '/tuning/chip-tuning',
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
 <Link href={w.href} className="block absolute inset-0 z-10" aria-label={w.brand} />
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
