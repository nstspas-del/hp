'use client';

/**
 * VideoModule — HP Тюнинг
 *
 * Стратегия видео:
 * - YouTube: широкая аудитория и SEO
 * - Rutube: российская аудитория без VPN
 * - До клика показывает локальный постер + текстовый анонс (нет зависимости от внешних CDN)
 * - Iframe загружается только после клика (экономия LCP и устранение блокировок)
 */

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoModuleProps {
  /** Заголовок видео */
  title: string;
  /** Краткое описание (показывается до клика) */
  summary: string;
  /** YouTube video ID (e.g. "dQw4w9WgXcQ") — опционально */
  youtubeId?: string;
  /** Rutube video ID — опционально */
  rutubeId?: string;
  /** Путь к локальному постеру (из /public/) */
  posterSrc?: string;
  /** alt для постера */
  posterAlt?: string;
  /** Дополнительные CSS классы */
  className?: string;
}

type Platform = 'youtube' | 'rutube';

export function VideoModule({
  title,
  summary,
  youtubeId,
  rutubeId,
  posterSrc,
  posterAlt,
  className = '',
}: VideoModuleProps) {
  const [active, setActive] = useState<Platform | null>(null);

  const hasBoth = !!(youtubeId && rutubeId);
  const defaultPlatform: Platform = rutubeId ? 'rutube' : 'youtube';

  const embedSrc: Record<Platform, string | null> = {
    youtube: youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` : null,
    rutube:  rutubeId  ? `https://rutube.ru/play/embed/${rutubeId}/?autoplay=1`        : null,
  };

  const handlePlay = (platform: Platform) => setActive(platform);

  return (
    <div className={`rounded-2xl overflow-hidden border border-white/10 bg-[#111113] ${className}`}>
      {/* Превью / плеер */}
      <div className="relative aspect-video bg-black">
        {active ? (
          <iframe
            src={embedSrc[active]!}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
          />
        ) : (
          <>
            {/* Постер — локальный файл, нет внешних зависимостей */}
            {posterSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterSrc}
                alt={posterAlt ?? title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
            )}

            {/* Затемнение поверх постера */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Кнопка Play */}
            <button
              onClick={() => handlePlay(defaultPlatform)}
              aria-label={`Смотреть: ${title}`}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 border-2 border-[#39FF14]/60 flex items-center justify-center
                              group-hover:bg-[#39FF14]/30 group-hover:scale-110 transition-all duration-200">
                <Play className="size-7 text-[#39FF14] fill-[#39FF14] ml-1" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Текстовый блок — виден всегда, включая без JS */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-base leading-snug mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">{summary}</p>

        {/* Выбор платформы */}
        {(youtubeId || rutubeId) && (
          <div className="flex flex-wrap gap-2">
            {youtubeId && (
              <button
                onClick={() => handlePlay('youtube')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${active === 'youtube'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-600/15 text-red-400 border border-red-600/25 hover:bg-red-600/25'}`}
              >
                {/* YT icon */}
                <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </button>
            )}
            {rutubeId && (
              <button
                onClick={() => handlePlay('rutube')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${active === 'rutube'
                    ? 'bg-[#FF5C00] text-white'
                    : 'bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/25 hover:bg-[#FF5C00]/25'}`}
              >
                {/* Rutube icon — simple "R" mark */}
                <span className="font-bold leading-none">R</span>
                Rutube
              </button>
            )}
            {hasBoth && !active && (
              <span className="text-zinc-600 text-xs self-center ml-1">
                — работает без VPN
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
