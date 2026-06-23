'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Send } from 'lucide-react';

export function VideoSection() {
 return (
 <section className="section" id="videos">
 <div className="container">
 <motion.div
 className="rounded-2xl border border-border bg-bg-elevated overflow-hidden"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
 {/* Левая часть — текст */}
 <div className="p-8 md:p-12 flex flex-col justify-center">
 <span className="badge mb-4">Скоро</span>
 <h2 className="font-display text-3xl md:text-4xl uppercase text-text mb-4">
 Снимаем{' '}
 <span className="text-[#39FF14]" style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}>
 каждую работу
 </span>
 </h2>
 <p className="text-text-muted text-base leading-relaxed mb-8">
 Запускаем канал на RuTube — процессы чип-тюнинга, детейлинга и ремонта.
 Пока канал не вышел, подписывайтесь в Telegram — там уже есть фото и видео работ.
 </p>
 <div className="flex flex-col sm:flex-row gap-3">
 <a
 href="https://t.me/hptuningspb"
 target="_blank"
 rel="noopener noreferrer"
 className="btn-primary flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold"
 >
 <Send className="size-4" />
 Telegram-канал
 </a>
 <Link
 href="/works"
 className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-border text-text-muted hover:text-text hover:border-white/30 transition-colors text-sm font-medium"
 >
 Смотреть работы
 </Link>
 </div>
 </div>

 {/* Правая часть — декоративная заглушка */}
 <div className="relative min-h-[280px] bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.06)_0%,transparent_70%)]" />
 <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
 <div
 className="w-20 h-20 rounded-full border-2 border-[#39FF14]/30 flex items-center justify-center bg-[#39FF14]/8"
 style={{ boxShadow: '0 0 40px rgba(57,255,20,0.15)' }}
 >
 <Play className="size-9 text-[#39FF14] ml-1" />
 </div>
 <div>
 <div className="text-white font-semibold text-lg mb-1">Канал скоро запустим</div>
 <div className="text-zinc-500 text-sm">RuTube · Видео каждую неделю</div>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}
