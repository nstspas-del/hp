'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag, Sparkles, Wrench, BookOpen, Filter } from 'lucide-react';

type BlogEntry = {
  type: 'project' | 'work' | 'article';
  slug: string;
  title: string;
  excerpt: string;
  brand?: string;
  model?: string;
  services?: string[];
  tags?: string[];
  coverImage?: string;
  date: string;
  href: string;
  readTime?: string;
  specs?: { hp?: string; nm?: string };
};

type Props = {
  entries: BlogEntry[];
  initialCat?: 'all' | 'project' | 'work' | 'article';
  initialBrand?: string;
};

const CAT_META: Record<string, { label: string; icon: typeof Sparkles; color: string; bg: string; border: string }> = {
  all: { label: 'Все', icon: Filter, color: 'text-text', bg: 'bg-accent/10', border: 'border-accent' },
  project: { label: 'Проекты', icon: Sparkles, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent' },
  work: { label: 'Работы', icon: Wrench, color: 'text-purple-300', bg: 'bg-purple-500/10', border: 'border-purple-500/50' },
  article: { label: 'Статьи', icon: BookOpen, color: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/50' },
};

function TypeBadge({ type }: { type: BlogEntry['type'] }) {
  const meta = CAT_META[type];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${meta.bg} ${meta.border} ${meta.color}`}>
      <Icon className="size-3" />
      {meta.label.replace(/ы$/, '')}
    </span>
  );
}

function EntryCard({ entry, large = false }: { entry: BlogEntry; large?: boolean }) {
  const dateLabel = new Date(entry.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: large ? 'long' : 'short',
    year: large ? 'numeric' : undefined,
  });

  return (
    <Link
      href={entry.href}
      className={`card hover:border-accent-dim group flex flex-col overflow-hidden p-0 ${large ? 'lg:flex-row lg:gap-0' : ''}`}
    >
      {/* Image */}
      <div className={`relative bg-gradient-to-br from-bg-elevated to-bg-card ${
        large
          ? 'lg:w-2/5 aspect-[16/10] lg:aspect-auto lg:min-h-[320px]'
          : 'aspect-[16/10]'
      }`}>
        {entry.coverImage ? (
          <Image
            src={entry.coverImage}
            alt={entry.title}
            fill
            sizes={large ? '(max-width: 1024px) 100vw, 40vw' : '(max-width: 640px) 100vw, 33vw'}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: '50% 55%' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-display text-6xl text-accent/20 uppercase">
              {entry.brand || 'HP'}
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <TypeBadge type={entry.type} />
        </div>
        {entry.specs?.hp && (
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-bg-base/85 backdrop-blur border border-accent/40 text-accent font-mono text-xs font-bold">
            {entry.specs.hp} л.с.
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`flex-1 p-5 flex flex-col ${large ? 'lg:p-7' : ''}`}>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {entry.brand && (
            <span className="text-xs font-bold uppercase tracking-wider text-accent">{entry.brand}</span>
          )}
          <span className="text-text-subtle text-xs flex items-center gap-1">
            <Calendar className="size-3" />
            {dateLabel}
          </span>
          {entry.readTime && (
            <span className="text-text-subtle text-xs flex items-center gap-1">
              <Clock className="size-3" />
              {entry.readTime}
            </span>
          )}
        </div>
        <h2 className={`font-semibold text-text group-hover:text-accent transition-colors leading-snug mb-3 ${
          large ? 'font-display text-xl md:text-2xl lg:text-3xl uppercase tracking-wider' : 'text-base'
        }`}>
          {entry.title}
        </h2>
        <p className={`text-text-muted leading-relaxed mb-4 flex-1 ${large ? 'text-base line-clamp-3' : 'text-sm line-clamp-3'}`}>
          {entry.excerpt}
        </p>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-border">
            {entry.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wide bg-bg-elevated text-text-subtle border border-border">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function BlogFilter({ entries, initialCat = 'all', initialBrand = '' }: Props) {
  const [cat, setCat] = useState<'all' | 'project' | 'work' | 'article'>(initialCat);
  const [brand, setBrand] = useState<string>(initialBrand);

  // Brand list (from entries that have brand)
  const brands = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.brand && set.add(e.brand));
    return Array.from(set).sort();
  }, [entries]);

  // Counters per category
  const counts = useMemo(() => {
    const filteredByBrand = brand ? entries.filter((e) => e.brand === brand) : entries;
    return {
      all: filteredByBrand.length,
      project: filteredByBrand.filter((e) => e.type === 'project').length,
      work: filteredByBrand.filter((e) => e.type === 'work').length,
      article: filteredByBrand.filter((e) => e.type === 'article').length,
    };
  }, [entries, brand]);

  // Final filtered entries
  const filtered = useMemo(() => {
    let list = entries;
    if (cat !== 'all') list = list.filter((e) => e.type === cat);
    if (brand) list = list.filter((e) => e.brand === brand);
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries, cat, brand]);

  const handleCatClick = (next: typeof cat) => {
    setCat(next);
    // Yandex.Metrika goal tracking
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(108614238, 'reachGoal', `blog_filter_${next}`);
    }
  };

  return (
    <>
      {/* Category filter — chips */}
      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Категории блога">
        {(['all', 'project', 'work', 'article'] as const).map((key) => {
          const meta = CAT_META[key];
          const Icon = meta.icon;
          const active = cat === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleCatClick(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                active
                  ? `${meta.bg} ${meta.border} ${meta.color}`
                  : 'border-border text-text-subtle hover:border-accent-dim hover:text-text'
              }`}
            >
              <Icon className="size-3.5" />
              {meta.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-bg-base/30' : 'bg-bg-elevated'}`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Brand filter */}
      {brands.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 items-center">
          <span className="text-text-subtle text-xs uppercase tracking-wider mr-1 flex items-center gap-1">
            <Tag className="size-3" />
            Марка:
          </span>
          <button
            type="button"
            onClick={() => setBrand('')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              brand === ''
                ? 'border-accent text-accent bg-accent/10'
                : 'border-border text-text-subtle hover:border-accent-dim hover:text-text'
            }`}
          >
            Все марки
          </button>
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrand(b)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                brand === b
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-text-subtle hover:border-accent-dim hover:text-text'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-text-muted mb-2">По выбранным фильтрам ничего не найдено.</p>
          <button
            type="button"
            onClick={() => {
              setCat('all');
              setBrand('');
            }}
            className="text-accent hover:underline text-sm"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          {/* Featured (first one) — only on "all" */}
          {cat === 'all' && !brand && filtered[0] && (
            <div className="mb-6">
              <EntryCard entry={filtered[0]} large />
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {(cat === 'all' && !brand ? filtered.slice(1) : filtered).map((entry) => (
              <EntryCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
