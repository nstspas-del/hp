'use client';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

// Список видео — добавляй RuTube ID из своего канала на rutube.ru
// Пример: https://rutube.ru/video/abc123def456/ → rutube_id: 'abc123def456'
// ⚠️ YouTube в России заблокирован — используем только RuTube
const videos = [
 {
 id: 'v-1',
 rutube_id: null, // TODO: вставить реальный ID с rutube.ru
 title: 'Чип-тюнинг BMW 340i — Stage 1: +58 л.с. и +85 Нм',
 description: 'Полный процесс чип-тюнинга BMW 340i F30 в Stage 1. До и после на стенде.',
 thumbnail: '/images/works/bmw-chip.jpg',
 tag: 'Чип-тюнинг',
 },
 {
 id: 'v-2',
 rutube_id: null,
 title: 'Керамика 9H на Porsche Cayenne — детейлинг от HP Тюнинг',
 description: 'Нанесение керамического покрытия в 2 слоя. Полный процесс детейлинга.',
 thumbnail: '/images/works/porsche-detailing.jpg',
 tag: 'Детейлинг',
 },
 {
 id: 'v-3',
 rutube_id: null,
 title: 'PPF плёнка на Land Rover Discovery — установка полного переда',
 description: 'Монтаж антигравийной PPF плёнки на капот, крылья, бампер, фары.',
 thumbnail: '/images/works/ppf-lr.jpg',
 tag: 'PPF',
 },
];

function VideoCard({ video }: { video: typeof videos[0] }) {
 // Только RuTube — YouTube заблокирован в России
 const embedUrl = video.rutube_id
 ? `https://rutube.ru/play/embed/${video.rutube_id}/`
 : null;

 return (
 <div className="card overflow-hidden p-0 group">
 {/* Превью / Embed */}
 {embedUrl ? (
 <div className="relative aspect-video">
 <iframe
 src={embedUrl}
 title={video.title}
 allow="clipboard-write; autoplay"
 allowFullScreen
 className="absolute inset-0 w-full h-full"
 loading="lazy"
 />
 </div>
 ) : (
 <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
 {/* Заглушка с иконкой Play, пока нет ссылки на видео */}
 <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
 <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
 <div className="w-16 h-16 rounded-full border-2 border-[#39FF14]/40 flex items-center justify-center bg-[#39FF14]/10">
 <Play className="size-7 text-[#39FF14] ml-1" />
 </div>
 <span className="text-zinc-500 text-xs">Видео скоро появится</span>
 </div>
 </div>
 )}

 {/* Инфо */}
 <div className="p-5">
 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 mb-3">
 <span className="text-[#39FF14] text-xs font-bold">{video.tag}</span>
 </div>
 <h3 className="font-semibold text-text text-base leading-snug mb-2">
 {video.title}
 </h3>
 <p className="text-text-muted text-sm leading-relaxed">{video.description}</p>
 </div>
 </div>
 );
}

export function VideoSection() {
 return (
 <section className="section" id="videos">
 <div className="container">
 {/* Заголовок */}
 <motion.div
 className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <div>
 <span className="badge mb-3">Видео</span>
 <h2 className="section-title mb-2">НАШИ РАБОТЫ В ВИДЕО</h2>
 <p className="text-text-muted text-sm max-w-lg">
 Процесс чип-тюнинга, детейлинга и защитных покрытий — снимаем каждую работу
 </p>
 </div>
 <a
 href="https://rutube.ru/"
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-medium whitespace-nowrap"
 >
 Канал на RuTube
 <ExternalLink className="size-4" />
 </a>
 </motion.div>

 {/* Сетка видео */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {videos.map((video, i) => (
 <motion.div
 key={video.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.1 }}
 >
 <VideoCard video={video} />
 </motion.div>
 ))}
 </div>

 {/* Баннер RuTube */}
 <motion.div
 className="mt-10 rounded-2xl border border-border bg-bg-elevated p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 >
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 flex items-center justify-center shrink-0">
 <Play className="size-6 text-[#39FF14]" />
 </div>
 <div>
 <div className="font-semibold text-text">Подписывайтесь на RuTube</div>
 <div className="text-text-muted text-sm">
 Новые видео каждую неделю — процессы, результаты, сравнения
 </div>
 </div>
 </div>
 <a
 href="https://rutube.ru/"
 target="_blank"
 rel="noopener noreferrer"
 className="btn-primary shrink-0 text-sm px-6 py-2.5"
 >
 Смотреть на RuTube
 </a>
 </motion.div>
 </div>
 </section>
 );
}
