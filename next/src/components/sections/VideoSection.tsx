'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, Eye, Wifi, Coffee } from 'lucide-react';

export function VideoSection() {
 return (
 <section className="section border-t border-white/5" id="videos">
 <div className="container">
 <motion.div
 className="rounded-2xl border border-border bg-bg-elevated overflow-hidden"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
 {/* Левая часть — текст про мастерскую */}
 <div className="p-8 md:p-12 flex flex-col justify-center">
 <span className="badge mb-4">Клиентская зона</span>
 <h2 className="font-display text-3xl md:text-4xl uppercase text-text mb-4">
 Видите{' '}
 <span className="text-[#39FF14]" style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}>
 каждый шаг
 </span>
 </h2>
 <p className="text-text-muted text-base leading-relaxed mb-6">
 Светлый бокс, LED-освещение, два подъёмника N4121H-4T. Из клиентской зоны
 видно всё, что мы делаем с автомобилем — без скрытых работ
 и «давай поверь нам на слово».
 </p>

 {/* Преимущества клиентской зоны */}
 <ul className="flex flex-col gap-2.5 mb-8 text-sm">
 <li className="flex items-center gap-2.5 text-text-muted">
 <Eye className="size-4 text-[#39FF14] shrink-0" />
 Полный обзор бокса — никаких закрытых дверей
 </li>
 <li className="flex items-center gap-2.5 text-text-muted">
 <Coffee className="size-4 text-[#39FF14] shrink-0" />
 Кофе, чай и комфортная зона для ожидания
 </li>
 <li className="flex items-center gap-2.5 text-text-muted">
 <Wifi className="size-4 text-[#39FF14] shrink-0" />
 Бесплатный Wi-Fi и тихо для звонков
 </li>
 </ul>

 <div className="flex flex-col sm:flex-row gap-3">
 <a
 href="https://t.me/hptunspb"
 target="_blank"
 rel="noopener noreferrer"
 className="btn-primary flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold"
 >
 <Send className="size-4" />
 Канал новостей
 </a>
 <Link
 href="/blog?cat=works"
 className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-border text-text-muted hover:text-text hover:border-white/30 transition-colors text-sm font-medium"
 >
 Смотреть работы
 </Link>
 </div>
 </div>

 {/* Правая часть — реальное видео мастерской */}
 <div className="relative min-h-[320px] md:min-h-[480px] bg-zinc-950 overflow-hidden">
 <video
 src="/videos/workshop-overview.mp4"
 poster="/videos/workshop-poster.jpg"
 autoPlay
 muted
 loop
 playsInline
 preload="metadata"
 className="absolute inset-0 w-full h-full object-cover"
 aria-label="Обзор мастерской HP Тюнинг в СПб — клиентская зона, подъёмники, освещение"
 />
 {/* Лёгкий градиент для читабельности подписи */}
 <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated/70 via-transparent to-transparent pointer-events-none" />
 <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3">
 <span className="text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
 Мастерская HP Тюнинг · Богородская 3Б
 </span>
 <span
 className="inline-flex items-center gap-1.5 text-[#39FF14] text-xs font-semibold bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full"
 style={{ textShadow: '0 0 8px rgba(57,255,20,0.5)' }}
 >
 <span className="size-1.5 rounded-full bg-[#39FF14] animate-pulse" />
 LIVE
 </span>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}
