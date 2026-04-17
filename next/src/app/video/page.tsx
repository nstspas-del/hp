import type { Metadata } from 'next'
import Link from 'next/link'
import { Play, ExternalLink } from 'lucide-react'
import videosData from '@/data/videos.json'

export const metadata: Metadata = {
  title: 'Видео HP Тюнинг — чип-тюнинг и детейлинг на RuTube | СПб',
  description: 'Видео с реальными работами HP Тюнинг на RuTube: чип-тюнинг BMW M3, Mercedes AMG, Porsche 911, керамика 9H, PPF, полировка кузова. Смотрите результаты в Санкт-Петербурге.',
  keywords: ['видео чип тюнинг спб', 'hp тюнинг rutube', 'тюнинг bmw видео спб', 'детейлинг видео петербург'],
  alternates: { canonical: 'https://hptuning.ru/video' },
  openGraph: {
    title: 'Видео HP Тюнинг — реальные результаты на RuTube',
    description: 'Чип-тюнинг BMW M3, Mercedes AMG, Porsche 911, детейлинг, PPF — смотрите видео реальных работ.',
    url: 'https://hptuning.ru/video',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/video.jpg', width: 1200, height: 630, alt: 'Видео HP Тюнинг' }],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
    { '@type': 'ListItem', position: 2, name: 'Видео', item: 'https://hptuning.ru/video' },
  ],
}

const CATS: Record<string, string> = {
  'chip-tuning': 'Чип-тюнинг',
  detailing: 'Детейлинг',
  service: 'Автосервис',
}

export default function VideoPage() {
  const videos = videosData

  return (
    <main className="pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Breadcrumb */}
      <nav className="bg-bg-elevated border-b border-border">
        <div className="container py-3">
          <ol className="flex items-center gap-2 text-sm text-text-subtle">
            <li><Link href="/" className="hover:text-text transition-colors">Главная</Link></li>
            <li>/</li>
            <li className="text-text">Видео</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="section bg-bg pb-10">
        <div className="container text-center max-w-2xl mx-auto">
          <span className="badge mb-4">
            <Play className="size-3 mr-1" />
            Видео
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-text mb-4">
            НАШ <span className="text-accent">RUTUBE</span>
          </h1>
          <p className="text-text-muted text-lg mb-6">
            Реальные работы, замеры мощности, процесс нанесения керамики и PPF. Всё честно — без монтажных уловок.
          </p>
          <a
            href="https://rutube.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-colors px-5 py-2.5 rounded-full text-sm font-medium"
          >
            <ExternalLink className="size-4" />
            Подписаться на Rutube
          </a>
        </div>
      </section>

      {/* Видео-сетка */}
      <section className="container">
        {videos.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <Play className="size-12 mx-auto mb-4 opacity-30" />
            <p>Видео скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <article key={v.id} className="card group overflow-hidden">
                {/* Превью */}
                <div className="relative aspect-video bg-bg flex items-center justify-center border-b border-border overflow-hidden">
                  {v.rutube_embed ? (
                    <iframe
                      src={v.rutube_embed}
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      title={v.title}
                      loading="lazy"
                    />
                  ) : (
                    /* Placeholder с ссылкой на Rutube */
                    <a
                      href={v.rutube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-elevated group-hover:bg-accent/5 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                        <Play className="size-6 text-accent ml-0.5" />
                      </div>
                      <span className="text-text-subtle text-xs">Смотреть на Rutube</span>
                    </a>
                  )}
                </div>

                {/* Инфо */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full">
                      {CATS[v.category] ?? v.category}
                    </span>
                    <time className="text-text-subtle text-xs ml-auto">
                      {new Date(v.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="text-text font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {v.title}
                  </h2>
                  <p className="text-text-subtle text-xs leading-relaxed line-clamp-2">{v.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {v.tags.map((t) => (
                      <span key={t} className="text-xs text-text-subtle border border-border rounded-full px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Инструкция для владельца */}
        <div className="mt-12 p-6 rounded-2xl border border-dashed border-border bg-bg-elevated/50">
          <h3 className="text-text font-semibold mb-2 flex items-center gap-2">
            <span className="text-accent">📹</span> Как добавить видео?
          </h3>
          <p className="text-text-muted text-sm mb-3">
            Откройте файл <code className="bg-bg text-accent px-1.5 py-0.5 rounded text-xs">src/data/videos.json</code> и добавьте новый объект:
          </p>
          <pre className="bg-bg rounded-xl p-4 text-xs text-text-muted overflow-x-auto border border-border">
{`{
  "id": "уникальный-id",
  "title": "Название видео",
  "description": "Описание работы",
  "rutube_url": "https://rutube.ru/video/ВАШ_ID/",
  "rutube_embed": "https://rutube.ru/play/embed/ВАШ_ID/",
  "thumbnail": "",
  "date": "2024-12-01",
  "category": "chip-tuning",
  "tags": ["BMW", "Stage 1"]
}`}
          </pre>
          <p className="text-text-subtle text-xs mt-2">
            Embed-ссылку найдёте на странице видео в Rutube → «Поделиться» → «Код для встраивания».
          </p>
        </div>
      </section>
    </main>
  )
}
