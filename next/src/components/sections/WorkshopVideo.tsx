/**
 * Видео-визитка мастерской HP Тюнинг (Богородская 3Б, Порошкино).
 *
 * Серверный компонент — никаких сторонних плееров и CDN, видео хостим сами
 * (public/videos/workshop-overview.mp4). Работает в России без VPN.
 *
 * Цель блока — показать клиенту атмосферу бокса: дизайнерский пол, два
 * подъёмника, клиентская зона и фотозона с баннером Hot Wheels Legends UK.
 */

import { PlayCircle, MapPin } from 'lucide-react';

export function WorkshopVideo() {
  return (
    <section
      aria-label="Видео-визитка мастерской HP Тюнинг"
      className="container py-10 md:py-14 border-t border-white/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* Видео */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/40">
            <video
              src="/videos/workshop-overview.mp4"
              poster="/videos/workshop-poster.jpg"
              controls
              preload="metadata"
              playsInline
              className="w-full h-full object-cover"
            >
              Ваш браузер не поддерживает HTML5-видео.
            </video>
          </div>
        </div>

        {/* Текст */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-[#39FF14]/80 uppercase tracking-widest mb-3">
            <PlayCircle className="size-3.5" />
            Видео мастерской
          </span>
          <h2 className="font-display text-2xl md:text-4xl text-text tracking-tight mb-4">
            Наш бокс — посмотрите, <span className="text-accent">куда приедете</span>
          </h2>
          <p className="text-text-muted text-sm md:text-base leading-relaxed mb-4">
            Уютный двухпостовой бокс в Порошкино, ул. Богородская 3Б.
            Дизайнерский пол, два подъёмника, отдельная клиентская зона с диваном и кофе.
            Большой баннер <strong className="text-text">Hot Wheels Legends UK</strong>{' '}
            — фотозона, где снимаем каждый клиентский автомобиль.
          </p>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
              Два подъёмника — работаем параллельно
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
              Клиентская зона с Wi-Fi, кофе и розетками
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
              Фотозона Hot Wheels Legends UK — сохраним кадр после работы
            </li>
          </ul>
          <a
            href="https://yandex.ru/maps/-/CDRLAUmO"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-5 text-sm text-zinc-400 hover:text-accent transition-colors"
          >
            <MapPin className="size-4" />
            СПб, ул. Богородская, 3Б — открыть на Яндекс.Картах
          </a>
        </div>
      </div>
    </section>
  );
}

export default WorkshopVideo;
