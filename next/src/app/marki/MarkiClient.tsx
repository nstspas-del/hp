'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { BrandData } from '@/data/brands-marki';

type Brand = BrandData;

type Props = {
  european: Brand[];
  japanese: Brand[];
  korean: Brand[];
  chinese: Brand[];
};

const TABS = [
  { id: 'all',      label: 'Все' },
  { id: 'european', label: 'Европейские' },
  { id: 'japanese', label: 'Японские' },
  { id: 'korean',   label: 'Корейские' },
  { id: 'chinese',  label: 'Китайские' },
];

function BrandCard({ brand }: { brand: Brand }) {
  const inner = (
    <>
      <div className="w-full h-12 flex items-center justify-center mb-3 rounded-lg bg-white/4 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.logo}
          alt={`${brand.name} — сервис в СПб`}
          width={90}
          height={36}
          loading="lazy"
          decoding="async"
          className="max-h-9 w-auto object-contain"
        />
      </div>
      <h3 className="text-white font-bold text-sm mb-1.5 leading-snug">{brand.name}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{brand.desc}</p>
      {brand.href && (
        <span className="mt-3 inline-flex items-center gap-1 text-xs text-[#39FF14] font-medium">
          Подробнее <ChevronRight className="size-3" />
        </span>
      )}
    </>
  );

  const cls = 'rounded-xl border border-white/8 bg-[#111113] p-4 hover:border-[#39FF14]/30 transition-colors flex flex-col';

  if (!brand.href) return <div className={cls}>{inner}</div>;
  return <Link href={brand.href} prefetch={false} className={cls}>{inner}</Link>;
}

export function MarkiClient({ european, japanese, korean, chinese }: Props) {
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');

  const allBrands = useMemo(
    () => [...european, ...japanese, ...korean, ...chinese],
    [european, japanese, korean, chinese]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = allBrands;
    if (activeTab !== 'all') list = list.filter((b) => b.group === activeTab);
    if (q) list = list.filter((b) => b.name.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q));
    return list;
  }, [allBrands, activeTab, query]);

  const sections = [
    { key: 'european', title: 'Европейские',  sub: 'BMW, Mercedes-Benz, Audi, Porsche, Land Rover — наша глубокая специализация', brands: european },
    { key: 'japanese', title: 'Японские',     sub: 'Toyota и Lexus — ресурс и надёжность, Techstream-диагностика',                  brands: japanese },
    { key: 'korean',   title: 'Корейские',    sub: 'Kia и Hyundai — массовый сегмент, ТО по регламенту',                            brands: korean },
    { key: 'chinese',  title: 'Китайские',    sub: 'Haval, Chery, Geely, Tank, Exeed — актуальный рынок 2025–2026',                 brands: chinese },
  ];

  const showGrouped = activeTab === 'all' && !query;

  return (
    <div className="container py-10 space-y-12">

      {/* ── Поиск + Фильтры ── */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти марку..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#39FF14]/40 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setQuery(''); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeTab === tab.id && !query
                  ? 'bg-[#39FF14] text-[#09090b] border-[#39FF14]'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:border-[#39FF14]/30 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Контент ── */}
      {showGrouped ? (
        /* Сгруппированный вид */
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.key} aria-label={section.title}>
              <div className="mb-5">
                <button
                  onClick={() => setActiveTab(section.key)}
                  className="text-[#39FF14] text-xs font-semibold uppercase tracking-widest mb-1.5 hover:underline"
                >
                  {section.brands.length} {section.brands.length === 1 ? 'марка' : section.brands.length < 5 ? 'марки' : 'марок'}
                </button>
                <h2 className="font-display text-2xl md:text-3xl text-white tracking-tight mb-1">
                  {section.title}
                </h2>
                <p className="text-zinc-500 text-sm max-w-xl">{section.sub}</p>
              </div>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {section.brands.map((b) => <BrandCard key={b.slug} brand={b} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Плоский вид при поиске или фильтре */
        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg mb-2">Ничего не найдено</p>
              <p className="text-sm">Попробуйте другое название или&nbsp;
                <button onClick={() => { setActiveTab('all'); setQuery(''); }} className="text-[#39FF14] hover:underline">
                  сбросить фильтры
                </button>
              </p>
            </div>
          ) : (
            <>
              <p className="text-zinc-500 text-sm mb-6">Найдено: {filtered.length} {filtered.length === 1 ? 'марка' : filtered.length < 5 ? 'марки' : 'марок'}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((b) => <BrandCard key={b.slug} brand={b} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
