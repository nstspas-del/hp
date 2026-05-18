import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageCircle, Calendar, Clock, Wrench, Sparkles, Zap, ArrowRight } from 'lucide-react';

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  type: 'work' | 'project' | 'article';
  brand: string;
  model?: string;
  services: string[];
  date: string;
  datePublished: string;
  heroImage: string;
  heroImageAlt: string;
  excerpt: string;
  intro: string;
  specs?: Record<string, string>;
  sections?: Array<{ heading: string; content: string[] }>;
  gallery?: Array<{ src: string; alt: string; caption?: string }>;
  testimonial?: { text: string; author: string };
  faq?: Array<{ q: string; a: string }>;
  relatedServices?: Array<{ label: string; href: string }>;
  tags?: string[];
};

const TYPE_META: Record<BlogPost['type'], { label: string; icon: typeof Wrench; color: string; bg: string }> = {
  work: { label: 'Работа', icon: Wrench, color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/40' },
  project: { label: 'Проект', icon: Sparkles, color: 'text-[#39FF14]', bg: 'bg-[#39FF14]/10 border-[#39FF14]/40' },
  article: { label: 'Статья', icon: Zap, color: 'text-orange-300', bg: 'bg-orange-500/10 border-orange-500/40' },
};

/**
 * Универсальный рендер тела поста блога.
 * Структура: Hero → Specs → Intro → Sections → Gallery → Testimonial → FAQ → Related → CTA
 */
export function BlogPostBody({ post }: { post: BlogPost }) {
  const typeMeta = TYPE_META[post.type];
  const TypeIcon = typeMeta.icon;
  const dateLabel = new Date(post.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Убираем TODO_PLACEHOLDER из текста для рендера, чтобы на проде не светились
  const cleanText = (text: string) => text.replace(/^TODO_PLACEHOLDER[^—]*—\s*/i, '').replace(/^TODO:\s*/i, '');

  return (
    <article className="container py-8 md:py-12">
      {/* Type badge + date + brand */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${typeMeta.bg} ${typeMeta.color}`}>
          <TypeIcon className="size-3.5" />
          {typeMeta.label}
        </span>
        {post.brand && (
          <span className="text-sm font-bold uppercase tracking-wider text-[#39FF14]">
            {post.brand}
          </span>
        )}
        <span className="text-zinc-500 text-sm flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {dateLabel}
        </span>
      </div>

      {/* H1 */}
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight mb-4">
        {post.title}
      </h1>

      {/* Excerpt / lead */}
      <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl">
        {cleanText(post.excerpt)}
      </p>

      {/* Hero image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-[#111113] border border-white/8">
        <Image
          src={post.heroImage}
          alt={post.heroImageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-cover"
          style={{ objectPosition: '50% 55%' }}
        />
      </div>

      {/* Specs table */}
      {post.specs && Object.keys(post.specs).length > 0 && (
        <div className="bg-[#111113] rounded-2xl border border-white/8 p-5 md:p-7 mb-10">
          <h2 className="font-display text-xl text-white uppercase tracking-wide mb-4">
            Характеристики работы
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(post.specs).map(([key, value]) => {
              const isLink = typeof value === 'string' && value.startsWith('/');
              return (
                <div key={key} className="flex items-baseline gap-3 border-b border-white/5 pb-2">
                  <dt className="text-zinc-500 text-sm shrink-0 min-w-[120px]">{key}:</dt>
                  <dd className="text-zinc-200 text-sm font-medium">
                    {isLink ? (
                      <Link href={value} className="text-[#39FF14] hover:underline inline-flex items-center gap-1">
                        Открыть <ArrowRight className="size-3" />
                      </Link>
                    ) : (
                      cleanText(value)
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}

      {/* Intro paragraph */}
      {post.intro && (
        <div className="prose prose-invert max-w-3xl mb-10">
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
            {cleanText(post.intro)}
          </p>
        </div>
      )}

      {/* Sections */}
      {post.sections && post.sections.length > 0 && (
        <div className="space-y-10 mb-10 max-w-3xl">
          {post.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-4">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.content.map((para, j) => (
                  <p key={j} className="text-zinc-300 text-base leading-relaxed">
                    {cleanText(para)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Gallery */}
      {post.gallery && post.gallery.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4">
            Фотоотчёт
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.gallery.map((photo, i) => (
              <figure key={i} className="rounded-xl overflow-hidden bg-[#111113] border border-white/8">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {photo.caption && (
                  <figcaption className="px-4 py-2 text-zinc-500 text-xs">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial */}
      {post.testimonial && (
        <blockquote className="border-l-4 border-[#39FF14] pl-5 py-3 my-10 max-w-3xl">
          <p className="text-zinc-200 text-lg italic mb-2 leading-relaxed">
            «{post.testimonial.text}»
          </p>
          <cite className="text-zinc-500 text-sm not-italic">— {post.testimonial.author}</cite>
        </blockquote>
      )}

      {/* FAQ */}
      {post.faq && post.faq.length > 0 && (
        <div className="mb-10 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-5">
            Частые вопросы
          </h2>
          <div className="space-y-3">
            {post.faq.map((item, i) => (
              <details
                key={i}
                className="group bg-[#111113] rounded-xl border border-white/8 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-white/3 transition-colors">
                  <span className="text-white font-medium text-sm md:text-base">{item.q}</span>
                  <span className="text-zinc-500 group-open:rotate-180 transition-transform shrink-0 text-lg">▾</span>
                </summary>
                <div className="px-5 pb-5 text-zinc-400 text-sm md:text-base leading-relaxed border-t border-white/5 pt-4">
                  {cleanText(item.a)}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* CTA + Related services */}
      <div className="rounded-2xl bg-gradient-to-br from-[#39FF14]/10 via-transparent to-purple-500/5 border border-[#39FF14]/20 p-6 md:p-8 mb-10">
        <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-3">
          Хотите так же на свой {post.brand}?
        </h3>
        <p className="text-zinc-400 text-base mb-5 leading-relaxed max-w-2xl">
          Бесплатная консультация по телефону или Telegram — расскажите задачу, ответим в течение 15 минут в рабочее время.
        </p>
        <div className="flex flex-wrap gap-3 mb-6">
          <a
            href="tel:+79818428151"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#39FF14] text-black text-sm font-bold hover:bg-[#39FF14]/90 transition-colors"
          >
            <Phone className="size-4" />
            +7 (981) 842-81-51
          </a>
          <a
            href="https://t.me/hptuningspb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#2AABEE]/30 bg-[#2AABEE]/10 text-[#2AABEE] text-sm font-medium hover:bg-[#2AABEE]/20 transition-colors"
          >
            <MessageCircle className="size-4" />
            Telegram
          </a>
        </div>

        {post.relatedServices && post.relatedServices.length > 0 && (
          <div className="pt-5 border-t border-white/8">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Перейти к услуге:</p>
            <div className="flex flex-wrap gap-2">
              {post.relatedServices.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-200 text-sm hover:border-[#39FF14]/40 hover:text-[#39FF14] transition-colors"
                >
                  {s.label}
                  <ArrowRight className="size-3" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-8 border-b border-white/8 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs uppercase tracking-wide bg-[#111113] text-zinc-500 border border-white/8"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Back to blog */}
      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#39FF14] transition-colors text-sm"
        >
          ← Все записи в блоге
        </Link>
      </div>
    </article>
  );
}
