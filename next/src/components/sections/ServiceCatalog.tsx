'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Filter, X, Clock } from 'lucide-react';
import servicesData from '@/data/services.json';

// ─── Типы ─────────────────────────────────────────────────────────────────────
interface ServiceItem {
  slug: string;
  name: string;
  shortDescription?: string;
  priceFrom?: number;
  duration?: string;
  image?: string;
  marks?: string[];
  yandexCategory?: string;
}

// ─── Категории-группы по yandexCategory + дополнительная классификация ───────
type CatKey = 'engine' | 'transmission' | 'chassis' | 'electrics' | 'exhaust' | 'maintenance' | 'tuning' | 'detailing';

const CATEGORY_LABELS: Record<CatKey, string> = {
  maintenance: 'ТО и расходники',
  engine: 'Двигатель',
  transmission: 'Трансмиссия',
  chassis: 'Ходовая и тормоза',
  electrics: 'Электрика и климат',
  exhaust: 'Выхлоп и катализатор',
  tuning: 'Чип-тюнинг',
  detailing: 'Детейлинг и кузов',
};

// Маппинг slug → категория
const SLUG_TO_CAT: Record<string, CatKey> = {
  // Maintenance / ТО
  'to': 'maintenance',
  'oil-change': 'maintenance',
  'diagnostics': 'maintenance',
  'tyre-service': 'maintenance',
  // Engine
  'engine-repair': 'engine',
  'engine-overhaul': 'engine',
  'cylinder-head-repair': 'engine',
  'timing-belt-replacement': 'engine',
  'decarbonization': 'engine',
  'engine-endoscopy': 'engine',
  'injector-cleaning': 'engine',
  'turbocharger-repair': 'engine',
  'cooling-system-repair': 'engine',
  // Transmission
  'transmission': 'transmission',
  'akpp-repair': 'transmission',
  'dsg-repair': 'transmission',
  'clutch-repair': 'transmission',
  // Chassis
  'brakes': 'chassis',
  'suspension': 'chassis',
  'chassis-repair': 'chassis',
  'wheel-alignment': 'chassis',
  'steering-rack-repair': 'chassis',
  // Electrics
  'auto-electrician': 'electrics',
  'ac-recharge-repair': 'electrics',
  'starter-generator-repair': 'electrics',
  'retrofit': 'electrics',
  // Exhaust
  'catalyst-removal': 'exhaust',
  'exhaust-repair': 'exhaust',
  // Tuning / Detailing
  'chip-tuning': 'tuning',
  'detailing-ceramic': 'detailing',
  'headlight-restoration': 'detailing',
};

// Универсальные марки если у услуги нет marks
const UNIVERSAL_MARKS = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Land Rover', 'Volkswagen', 'Lexus', 'Toyota', 'Volvo', 'Haval', 'Chery'];

const POPULAR_MARKS = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Volkswagen',
  'Land Rover',
  'Lexus',
  'Toyota',
  'Volvo',
  'Mini',
  'Haval',
  'Chery',
];

// ─── Каталог ─────────────────────────────────────────────────────────────────
export function ServiceCatalog() {
  // Берём service-категорию из общего JSON
  const services: ServiceItem[] = useMemo(() => {
    const cat = (servicesData as any).categories.find((c: any) => c.slug === 'service');
    return (cat?.items ?? []) as ServiceItem[];
  }, []);

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<CatKey | 'all'>('all');
  const [activeMark, setActiveMark] = useState<string | 'all'>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Подсчёт услуг по категориям (для бейджей)
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: services.length };
    for (const s of services) {
      const c = SLUG_TO_CAT[s.slug] ?? 'maintenance';
      counts[c] = (counts[c] ?? 0) + 1;
    }
    return counts;
  }, [services]);

  // Фильтрованный список
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      // Поиск по имени и описанию
      if (q && !`${s.name} ${s.shortDescription ?? ''}`.toLowerCase().includes(q)) return false;
      // Фильтр по категории
      if (activeCat !== 'all') {
        const c = SLUG_TO_CAT[s.slug] ?? 'maintenance';
        if (c !== activeCat) return false;
      }
      // Фильтр по марке (если у услуги нет marks — считаем универсальной)
      if (activeMark !== 'all') {
        const marks = s.marks && s.marks.length > 0 ? s.marks : UNIVERSAL_MARKS;
        if (!marks.some((m) => m.toLowerCase() === activeMark.toLowerCase())) return false;
      }
      return true;
    });
  }, [services, query, activeCat, activeMark]);

  const reset = () => {
    setQuery('');
    setActiveCat('all');
    setActiveMark('all');
  };

  const hasFilters = query !== '' || activeCat !== 'all' || activeMark !== 'all';

  return (
    <section className="py-16 container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-wider mb-2">
            ПОЛНЫЙ КАТАЛОГ УСЛУГ
          </h2>
          <p className="text-text-muted">
            {services.length} услуг для премиум-авто · цены от рынка СПб
          </p>
        </div>
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text text-sm hover:border-accent-dim transition-colors self-start"
        >
          <Filter className="size-4" />
          Фильтры{hasFilters ? ` · ${[query !== '' ? 1 : 0, activeCat !== 'all' ? 1 : 0, activeMark !== 'all' ? 1 : 0].filter(Boolean).reduce((a, b) => a + b, 0)}` : ''}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-8">
        {/* Сайдбар-фильтры */}
        <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
          <div className="card p-4 md:sticky md:top-24">
            {/* Поиск */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск услуги..."
                className="w-full bg-[#0a0a0c] border border-border rounded-xl pl-10 pr-9 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent-dim focus:outline-none transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text"
                  aria-label="Очистить поиск"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Категории */}
            <div className="mb-5">
              <div className="text-text font-semibold text-xs uppercase tracking-wider mb-3">Категория</div>
              <div className="flex flex-col gap-1">
                <CatBtn
                  active={activeCat === 'all'}
                  onClick={() => setActiveCat('all')}
                  label="Все услуги"
                  count={catCounts.all}
                />
                {(Object.keys(CATEGORY_LABELS) as CatKey[]).map((c) => (
                  <CatBtn
                    key={c}
                    active={activeCat === c}
                    onClick={() => setActiveCat(c)}
                    label={CATEGORY_LABELS[c]}
                    count={catCounts[c] ?? 0}
                  />
                ))}
              </div>
            </div>

            {/* Марки */}
            <div className="mb-3">
              <div className="text-text font-semibold text-xs uppercase tracking-wider mb-3">Марка авто</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveMark('all')}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs transition-colors border',
                    activeMark === 'all'
                      ? 'bg-accent text-black border-accent font-semibold'
                      : 'bg-transparent text-text-muted border-border hover:border-accent-dim hover:text-text',
                  ].join(' ')}
                >
                  Все марки
                </button>
                {POPULAR_MARKS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMark(m)}
                    className={[
                      'px-3 py-1.5 rounded-full text-xs transition-colors border',
                      activeMark === m
                        ? 'bg-accent text-black border-accent font-semibold'
                        : 'bg-transparent text-text-muted border-border hover:border-accent-dim hover:text-text',
                    ].join(' ')}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={reset}
                className="w-full mt-2 px-4 py-2 rounded-xl border border-border hover:border-accent-dim text-text-muted hover:text-accent text-sm transition-colors flex items-center justify-center gap-2"
              >
                <X className="size-3.5" />
                Сбросить фильтры
              </button>
            )}
          </div>
        </aside>

        {/* Сетка карточек */}
        <div>
          {filtered.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-text-muted mb-4">Под ваши фильтры ничего не нашлось</p>
              <button onClick={reset} className="btn-secondary text-sm">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="text-text-subtle text-sm mb-4">
                Найдено: <span className="text-text font-semibold">{filtered.length}</span> услуг
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((s) => {
                  const catKey = SLUG_TO_CAT[s.slug] ?? 'maintenance';
                  return (
                    <Link
                      key={s.slug}
                      href={`/service/${s.slug}`}
                      className="card p-0 overflow-hidden group hover:border-accent-dim transition-all hover:-translate-y-0.5 flex flex-col"
                    >
                      {/* Фото */}
                      {s.image ? (
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0c]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/70 backdrop-blur text-white text-[10px] uppercase tracking-wider font-semibold">
                            {CATEGORY_LABELS[catKey]}
                          </span>
                        </div>
                      ) : (
                        <div className="aspect-[16/10] bg-gradient-to-br from-accent/5 to-transparent flex items-center justify-center">
                          <span className="text-accent/30 text-4xl font-display">HP</span>
                        </div>
                      )}

                      {/* Контент */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-semibold text-text group-hover:text-accent transition-colors mb-2 leading-snug">
                          {s.name}
                        </h3>
                        {s.shortDescription && (
                          <p className="text-text-subtle text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                            {s.shortDescription}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                          <div>
                            <div className="text-accent font-bold text-base">
                              {s.priceFrom != null ? `от ${s.priceFrom.toLocaleString('ru-RU')} ₽` : 'По запросу'}
                            </div>
                            {s.duration && (
                              <div className="flex items-center gap-1 text-text-subtle text-[11px] mt-0.5">
                                <Clock className="size-3" />
                                {s.duration}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="size-5 text-text-subtle group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function CatBtn({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
        active ? 'bg-accent/10 text-accent font-semibold' : 'text-text-muted hover:bg-bg-card/60 hover:text-text',
      ].join(' ')}
    >
      <span>{label}</span>
      <span className={`text-xs ${active ? 'text-accent' : 'text-text-subtle'}`}>{count}</span>
    </button>
  );
}

export default ServiceCatalog;
