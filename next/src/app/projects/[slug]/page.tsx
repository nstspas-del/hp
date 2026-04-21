/**
 * /projects/[slug] — HP Тюнинг
 * Layer D: Проекты / Кейсы
 *
 * Шаблон страницы проекта. Данные подтягиваются из projects.json.
 * Включает: модель, проблема/цель, диагностика, выполненные работы,
 * результат, фотогалерея, видео (Rutube + YouTube), FAQ, внутренние ссылки.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle, Clock, Wrench, Zap, ChevronRight, Camera } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { VideoModule } from '@/components/ui/VideoModule';

// ── Типы данных проекта ────────────────────────────────────────────────────────
export interface Project {
  slug: string;
  brandSlug: string;
  brandName: string;
  model: string;
  generation: string;
  engine: string;
  year?: number;

  /** Краткий заголовок */
  title: string;
  /** Метаописание для <title> и og:description */
  metaDescription?: string;

  /** Исходная задача или проблема клиента */
  problemStatement: string;
  /** Что выяснила диагностика */
  diagnosticsResult?: string;
  /** Список выполненных работ */
  worksDone: string[];
  /** Итоговый результат */
  result: string;

  /** Параметры до / после (опционально) */
  specs?: {
    label: string;
    before: string;
    after: string;
  }[];

  /** Ссылки на фото (пути из /public/) */
  gallery?: string[];
  coverImage?: string;

  /** Видео */
  youtubeId?: string;
  rutubeId?: string;

  /** Блок FAQ */
  faq?: { q: string; a: string }[];

  /** Категории / теги */
  services?: string[];

  createdAt?: string;
}

// ── Данные проектов (статические) ─────────────────────────────────────────────
// В продакшне заменяется импортом из projects.json или CMS
const PROJECTS: Project[] = [
  {
    slug: 'bmw-x5-g05-chiptuning-stage2',
    brandSlug: 'bmw',
    brandName: 'BMW',
    model: 'X5',
    generation: 'G05',
    engine: 'B58B30 3.0 л 340 л.с.',
    year: 2022,
    title: 'BMW X5 G05 — чип-тюнинг Stage 2: 340 → 440 л.с.',
    metaDescription:
      'Кейс: чип-тюнинг BMW X5 G05 B58B30 Stage 2 в СПб. Диагностика ISTA+, результат 440 л.с. и 580 Нм. Время 0–100 с 5.3 до 4.4 с.',
    problemStatement:
      'Владелец BMW X5 G05 обратился за максимальным потенциалом мотора B58B30 без смены агрегатов. '
      + 'Стандартные 340 л.с. стали тесны после поездки на стоке от дилера.',
    diagnosticsResult:
      'ISTA+ диагностика не выявила активных ошибок. '
      + 'Проверка давления наддува, форсунок и масла — в норме. '
      + 'Залита Shell Helix Ultra 5W-40, пробег 18 000 км. '
      + 'Принято решение перейти на Stage 2 с заменой интеркулера.',
    worksDone: [
      'Замена интеркулера на увеличенный (фронтальный)',
      'Установка даунпайпа со спортивным катализатором',
      'Чип-тюнинг Stage 2 через Alientech KESS3 (оригинальный файл сохранён)',
      'Калибровка по boost-давлению на холодном и горячем двигателе',
      'Дорожный тест 30 минут — адаптация после прошивки',
    ],
    result:
      'Мощность 340 → 440 л.с., момент 450 → 580 Нм. '
      + 'Разгон 0–100 км/ч улучшился с 5.3 до 4.4 с. '
      + 'Температура наддувного воздуха снизилась на 18 °C. '
      + 'Гарантия 12 месяцев.',
    specs: [
      { label: 'Мощность', before: '340 л.с.', after: '440 л.с.' },
      { label: 'Момент',   before: '450 Нм',   after: '580 Нм' },
      { label: '0–100',    before: '5.3 с',     after: '4.4 с' },
    ],
    coverImage: '/images/works/10-bmw-x5-neon-workshop.jpg',
    gallery: [
      '/images/works/10-bmw-x5-neon-workshop.jpg',
    ],
    faq: [
      {
        q: 'Нужна ли замена форсунок для Stage 2 на B58?',
        a: 'На стоковых форсунках Stage 2 работает корректно до ~470 л.с. '
           + 'Выше — нужны форсунки HPFP+LPFP. В данном кейсе стоковые форсунки сохранены.',
      },
      {
        q: 'Как влияет чип-тюнинг на ресурс двигателя?',
        a: 'При корректной калибровке с сохранением безопасных margins по детонации и температуре '
           + 'ресурс практически не снижается. Ключевое условие — исправный мотор до прошивки.',
      },
    ],
    services: ['Чип-тюнинг', 'Stage 2', 'BMW'],
    createdAt: '2025-10-12',
  },
];

// ── generateMetadata ───────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) return {};
  const canonical = `https://hptuning.ru/projects/${project.slug}/`;
  return {
    title: `${project.title} | HP Тюнинг`,
    description: project.metaDescription ?? project.result,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} | HP Тюнинг`,
      description: project.metaDescription ?? project.result,
      url: canonical,
      type: 'article',
      locale: 'ru_RU',
      siteName: 'HP Тюнинг',
      images: project.coverImage
        ? [{ url: `https://hptuning.ru${project.coverImage}`, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const brandHref = project.brandSlug
    ? `https://${project.brandSlug}.hptuning.ru`
    : '/brands';

  // Schema.org
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://hptuning.ru/projects/${project.slug}/#article`,
    headline: project.title,
    description: project.metaDescription ?? project.result,
    datePublished: project.createdAt,
    publisher: { '@id': 'https://hptuning.ru/#org' },
    ...(project.coverImage && {
      image: `https://hptuning.ru${project.coverImage}`,
    }),
  };

  const faqSchema = project.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: project.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] flex items-end overflow-hidden">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-black/10" />
        <div className="relative container pb-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-zinc-500 mb-3 flex items-center flex-wrap gap-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#39FF14] transition-colors">Главная</Link>
            <ChevronRight className="size-3" />
            <Link href="/projects" className="hover:text-[#39FF14] transition-colors">Проекты</Link>
            <ChevronRight className="size-3" />
            <span className="text-zinc-300 truncate max-w-[200px]">{project.title}</span>
          </nav>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.services?.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
            {project.title}
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            {project.brandName} {project.model} {project.generation} · {project.engine}
            {project.year && ` · ${project.year} г.`}
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Основная колонка */}
          <div className="lg:col-span-2 space-y-10">

            {/* Задача */}
            <section>
              <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-[#39FF14]">01.</span> Задача
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">{project.problemStatement}</p>
            </section>

            {/* Диагностика */}
            {project.diagnosticsResult && (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="text-[#39FF14]">02.</span> Диагностика
                </h2>
                <p className="text-zinc-400 text-base leading-relaxed">{project.diagnosticsResult}</p>
              </section>
            )}

            {/* Выполненные работы */}
            <section>
              <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <Wrench className="size-5 text-[#39FF14]" />
                Выполненные работы
              </h2>
              <ul className="space-y-3">
                {project.worksDone.map((work, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <CheckCircle className="size-4 text-[#39FF14] shrink-0 mt-0.5" />
                    {work}
                  </li>
                ))}
              </ul>
            </section>

            {/* Результат */}
            <section>
              <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <Zap className="size-5 text-[#39FF14]" />
                Результат
              </h2>
              <p className="text-zinc-300 text-base leading-relaxed">{project.result}</p>

              {/* Таблица до / после */}
              {project.specs && project.specs.length > 0 && (
                <div className="mt-5 rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="text-left px-5 py-3 text-zinc-400 font-medium">Параметр</th>
                        <th className="text-right px-4 py-3 text-zinc-400 font-medium">До</th>
                        <th className="text-right px-4 py-3 text-[#39FF14] font-medium">После</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.specs.map((row, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-5 py-3 text-zinc-400">{row.label}</td>
                          <td className="px-4 py-3 text-right text-zinc-300">{row.before}</td>
                          <td className="px-4 py-3 text-right font-bold text-[#39FF14]">{row.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Видео */}
            {(project.youtubeId || project.rutubeId) && (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="text-[#39FF14]">▶</span> Видео о работе
                </h2>
                <VideoModule
                  title={project.title}
                  summary={project.result}
                  youtubeId={project.youtubeId}
                  rutubeId={project.rutubeId}
                  posterSrc={project.coverImage}
                />
              </section>
            )}

            {/* Галерея */}
            {project.gallery && project.gallery.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Camera className="size-5 text-[#39FF14]" />
                  Фотогалерея
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.gallery.map((src, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src={src}
                        alt={`${project.title} — фото ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width:768px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {project.faq && project.faq.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4">
                  Частые вопросы
                </h2>
                <div className="space-y-3">
                  {project.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group bg-[#111113] rounded-xl border border-white/8 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-white/3">
                        <span className="text-white font-medium text-sm">{item.q}</span>
                        <span className="text-zinc-500 group-open:rotate-180 transition-transform shrink-0 text-lg">▾</span>
                      </summary>
                      <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Боковая колонка */}
          <aside className="space-y-5">
            {/* CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-[#39FF14]/10 to-transparent border border-[#39FF14]/20 p-6">
              <h3 className="text-white font-bold text-base mb-2">
                Хотите такой же результат?
              </h3>
              <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                Бесплатная консультация — расскажем, что реально на вашем автомобиле.
                Ответим за 15 минут.
              </p>
              <div className="space-y-2">
                <BookingButton
                  label="Записаться"
                  serviceHint={`${project.brandName} ${project.model}`}
                  className="btn-primary w-full justify-center py-3 text-sm"
                />
                <a
                  href="https://wa.me/79818428151"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Связанные страницы */}
            <div className="rounded-xl border border-white/8 bg-[#111113] p-5">
              <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Связанные разделы</h3>
              <div className="space-y-2">
                <a
                  href={brandHref}
                  className="flex items-center justify-between text-sm text-zinc-300 hover:text-[#39FF14] transition-colors py-1.5 border-b border-white/5"
                >
                  <span>Страница {project.brandName}</span>
                  <ChevronRight className="size-3.5 text-zinc-600" />
                </a>
                <Link
                  href="/tuning/chip-tuning"
                  className="flex items-center justify-between text-sm text-zinc-300 hover:text-[#39FF14] transition-colors py-1.5 border-b border-white/5"
                >
                  <span>Чип-тюнинг</span>
                  <ChevronRight className="size-3.5 text-zinc-600" />
                </Link>
                <Link
                  href="/service/diagnostics"
                  className="flex items-center justify-between text-sm text-zinc-300 hover:text-[#39FF14] transition-colors py-1.5"
                >
                  <span>Диагностика</span>
                  <ChevronRight className="size-3.5 text-zinc-600" />
                </Link>
              </div>
            </div>

            {/* Контакты */}
            <div className="rounded-xl border border-white/8 bg-[#111113] p-5 space-y-2">
              <div className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Контакты</div>
              <a href="tel:+79818428151" className="block text-white font-medium text-sm hover:text-[#39FF14] transition-colors">
                +7 (981) 842-81-51
              </a>
              <div className="text-zinc-500 text-xs">Пн–Вс 10:00–20:00</div>
              <div className="text-zinc-500 text-xs">Богородская, 3Б, СПб</div>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="size-3 text-[#39FF14]" />
                <span className="text-[#39FF14] text-xs font-medium">Ответим за 15 минут</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
