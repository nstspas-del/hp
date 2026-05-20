'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Phone, Gauge, Zap, TrendingUp, Search, Plus, Check } from 'lucide-react';
import catalog from '@/data/tuning-catalog.json';
import { openBooking } from '@/lib/autodealer';
import Stage3LeadForm from '@/components/ui/Stage3LeadForm';
import { PriceDisclaimer } from '@/components/ui/PriceDisclaimer';

// ─── Типы (соответствуют schema из _meta) ────────────────────────────────────
type StageArr = [
  number | null, // 0: tuned_hp
  number | null, // 1: tuned_nm
  number | null, // 2: tuned_max_speed
  number | null, // 3: zero_to_100
  number | null, // 4: stage_price_hp ← цена HP, ИСТОЧНИК НЕ ПОКАЗЫВАЕМ
];

type StockArr = [
  number | null, // 0: stock_hp
  number | null, // 1: stock_nm
  number | null, // 2: stock_max_speed
  number | null, // 3: zero_to_100_before
];

interface Engine {
  s: string;            // slug
  n: string;            // name (трим)
  cc?: number | null;   // displacement_cc
  st: StockArr;         // заводские
  s1?: StageArr;        // Stage 1
  s2?: StageArr;        // Stage 2
  s3?: StageArr;        // Stage 3
  o?: number[];         // индексы опций в options[]
}
interface Gen { s: string; n: string; e: Engine[]; }
interface Line { s: string; n: string; g: Gen[]; }
interface Brand { s: string; n: string; l: Line[]; }
interface Option { n: string; p: number | null; }

const DATA = catalog as unknown as {
  brands: Brand[];
  options: Option[];
};

// Natural-sort: «A3» < «A4» < «A11», «3 серия» < «5 серия» < «X5» и т.д.
// numeric:true — числа внутри строк сравниваются по значению, а не лексикографически.
const naturalCompare = (a: string, b: string) =>
  a.localeCompare(b, 'ru', { numeric: true, sensitivity: 'base' });

// Бренды — по алфавиту, плюс сортируем вглубь: линейки → поколения → двигатели.
const BRANDS: Brand[] = [...DATA.brands]
  .map((b) => ({
    ...b,
    l: [...b.l]
      .map((L) => ({
        ...L,
        g: [...L.g]
          .map((G) => ({
            ...G,
            e: [...G.e].sort((x, y) => naturalCompare(x.n, y.n)),
          }))
          .sort((x, y) => naturalCompare(x.n, y.n)),
      }))
      .sort((x, y) => naturalCompare(x.n, y.n)),
  }))
  .sort((a, b) => naturalCompare(a.n, b.n));

const OPTIONS: Option[] = DATA.options;

type StageKey = 's1' | 's2' | 's3';

// ─── Утилиты ──────────────────────────────────────────────────────────────────
function fmt(n: number | null | undefined, unit = ''): string {
  if (n === null || n === undefined) return '—';
  return `${n.toLocaleString('ru-RU')}${unit ? ' ' + unit : ''}`;
}
function fmtPrice(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return `${n.toLocaleString('ru-RU')} ₽`;
}
function diff(stock: number | null | undefined, tuned: number | null | undefined, suffix = ''): string {
  if (stock == null || tuned == null) return '—';
  const d = tuned - stock;
  if (d === 0) return '0';
  const sign = d > 0 ? '+' : '';
  return `${sign}${d.toLocaleString('ru-RU')}${suffix}`;
}
function diffClass(stock: number | null | undefined, tuned: number | null | undefined, invertColors = false): string {
  if (stock == null || tuned == null) return 'text-text-subtle';
  const d = tuned - stock;
  if (d === 0) return 'text-text-subtle';
  // Для разгона: меньше = лучше → invertColors=true
  const better = invertColors ? d < 0 : d > 0;
  return better ? 'text-[#39FF14]' : 'text-red-400';
}

// ─── Главный компонент ───────────────────────────────────────────────────────
export function SevenForceCalculator({ defaultBrandSlug }: { defaultBrandSlug?: string } = {}) {
  // Состояние селекторов
  const [brandSlug, setBrandSlug] = useState<string>('');
  const [lineSlug, setLineSlug] = useState<string>('');
  const [genSlug, setGenSlug] = useState<string>('');
  const [engineSlug, setEngineSlug] = useState<string>('');
  const [stage, setStage] = useState<StageKey>('s1');
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [checkedExtras, setCheckedExtras] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');

  // Если задан defaultBrandSlug — выбрать его при монтировании
  useEffect(() => {
    if (defaultBrandSlug && BRANDS.some((b) => b.s === defaultBrandSlug)) {
      setBrandSlug(defaultBrandSlug);
    }
  }, [defaultBrandSlug]);

  // Производные данные
  const brand = useMemo(() => BRANDS.find((b) => b.s === brandSlug), [brandSlug]);
  const line = useMemo(() => brand?.l.find((L) => L.s === lineSlug), [brand, lineSlug]);
  const gen = useMemo(() => line?.g.find((G) => G.s === genSlug), [line, genSlug]);
  const engine = useMemo(() => gen?.e.find((E) => E.s === engineSlug), [gen, engineSlug]);

  // Фильтр брендов по поиску
  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BRANDS;
    return BRANDS.filter((b) => b.n.toLowerCase().includes(q));
  }, [search]);

  // Сброс зависимых селекторов при смене выше
  function pickBrand(slug: string) {
    setBrandSlug(slug);
    setLineSlug('');
    setGenSlug('');
    setEngineSlug('');
    setStage('s1');
    setCheckedExtras(new Set());
  }
  function pickLine(slug: string) {
    setLineSlug(slug);
    setGenSlug('');
    setEngineSlug('');
    setCheckedExtras(new Set());
  }
  function pickGen(slug: string) {
    setGenSlug(slug);
    setEngineSlug('');
    setCheckedExtras(new Set());
  }
  function pickEngine(slug: string) {
    setEngineSlug(slug);
    setCheckedExtras(new Set());
  }
  function toggleExtra(idx: number) {
    setCheckedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  // Текущий stage-объект
  const currentStage: StageArr | undefined = engine?.[stage];
  // ВАЖНО: для Stage 3 характеристики и цена НЕ показываем — всегда «по запросу»
  const isStage3 = stage === 's3';
  const stagePrice = isStage3 ? null : (currentStage?.[4] ?? null);

  // Доступные опции для двигателя — индексы в OPTIONS[]
  const engineOptionIds = engine?.o ?? [];

  // Итоговая цена с опциями (для Stage 3 — null → «по запросу»)
  const totalPrice = useMemo(() => {
    if (isStage3) return null;
    if (stagePrice == null) return null;
    let sum = stagePrice;
    checkedExtras.forEach((idx) => {
      const opt = OPTIONS[idx];
      if (opt?.p) sum += opt.p;
    });
    return sum;
  }, [isStage3, stagePrice, checkedExtras]);

  // Какие stage доступны для текущего двигателя.
  // Stage 3 теперь считаем доступным всегда, если в данных есть ЛЮБОЕ значение,
  // даже без цены (s3 присутствует) — раз показываем «по запросу», цена не обязательна.
  const availableStages: StageKey[] = useMemo(() => {
    if (!engine) return ['s1', 's2', 's3'];
    return (['s1', 's2', 's3'] as StageKey[]).filter((s) => {
      const arr = engine[s];
      if (!arr) return false;
      if (s === 's3') {
        // Stage 3 доступен, если есть хоть какие-то данные (хотя мы их и не покажем)
        return arr.some((v) => v != null);
      }
      return arr[4] != null;
    });
  }, [engine]);

  // Если выбранный stage недоступен для двигателя — переключаемся
  useEffect(() => {
    if (engine && availableStages.length > 0 && !availableStages.includes(stage)) {
      setStage(availableStages[0]);
    }
  }, [engine, availableStages, stage]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* ── Селекторы (4 уровня) ── */}
      <div className="card p-6 md:p-8 mb-6">
        {/* Шаг 1: Бренд */}
        <div className="mb-6">
          <Label step={1} title="Выберите марку" />
          {!brandSlug && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по марке..."
                className="w-full bg-[#111113] border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-subtle focus:border-accent-dim focus:outline-none transition-colors"
              />
            </div>
          )}
          {brandSlug ? (
            <PickedRow
              label={brand?.n ?? ''}
              onReset={() => pickBrand('')}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filteredBrands.map((b) => (
                <button
                  key={b.s}
                  onClick={() => pickBrand(b.s)}
                  className="px-3 py-2.5 rounded-xl border border-border bg-[#0a0a0c] text-text text-sm hover:border-accent-dim hover:text-accent transition-all"
                >
                  {b.n}
                </button>
              ))}
              {filteredBrands.length === 0 && (
                <div className="col-span-full text-text-subtle text-sm py-4 text-center">
                  Марка не найдена
                </div>
              )}
            </div>
          )}
        </div>

        {/* Шаг 2: Линейка */}
        {brand && (
          <div className="mb-6">
            <Label step={2} title="Модель / линейка" />
            {lineSlug ? (
              <PickedRow
                label={line?.n ?? ''}
                onReset={() => pickLine('')}
              />
            ) : (
              <Dropdown
                placeholder="— выберите модель —"
                items={brand.l.map((L) => ({ value: L.s, label: L.n, sub: `${L.g.length} поколений` }))}
                onPick={pickLine}
              />
            )}
          </div>
        )}

        {/* Шаг 3: Поколение / кузов / годы */}
        {line && (
          <div className="mb-6">
            <Label step={3} title="Поколение / кузов / годы" />
            {genSlug ? (
              <PickedRow
                label={gen?.n ?? ''}
                onReset={() => pickGen('')}
              />
            ) : (
              <Dropdown
                placeholder="— выберите кузов и годы —"
                items={line.g.map((G) => ({ value: G.s, label: G.n, sub: `${G.e.length} двигателей` }))}
                onPick={pickGen}
              />
            )}
          </div>
        )}

        {/* Шаг 4: Двигатель / комплектация */}
        {gen && (
          <div>
            <Label step={4} title="Двигатель / комплектация" />
            {engineSlug ? (
              <PickedRow
                label={engine?.n ?? ''}
                onReset={() => pickEngine('')}
              />
            ) : (
              <Dropdown
                placeholder="— выберите мотор —"
                items={gen.e.map((E) => ({
                  value: E.s,
                  label: E.n,
                  sub: `${E.st[0] ?? '?'} л.с. · ${E.st[1] ?? '?'} Н·м${E.cc ? ` · ${E.cc} см³` : ''}`,
                }))}
                onPick={pickEngine}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Результат: табы + таблица + цена + опции ── */}
      {engine && availableStages.length > 0 && (
        <div className="card p-0 overflow-hidden">
          {/* Табы Stage 1/2/3 */}
          <div className="flex border-b border-border bg-[#111113]">
            {(['s1', 's2', 's3'] as StageKey[]).map((s) => {
              const available = availableStages.includes(s);
              const active = stage === s;
              const label = s === 's1' ? 'Stage 1' : s === 's2' ? 'Stage 2' : 'Stage 3';
              return (
                <button
                  key={s}
                  onClick={() => available && setStage(s)}
                  disabled={!available}
                  className={[
                    'flex-1 px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-all border-b-2',
                    active
                      ? 'text-accent border-accent bg-bg-card'
                      : available
                      ? 'text-text-muted border-transparent hover:text-text hover:bg-bg-card/50'
                      : 'text-text-subtle/40 border-transparent cursor-not-allowed',
                  ].join(' ')}
                >
                  {label}
                  {!available && <span className="block text-[10px] normal-case mt-0.5 opacity-60">недоступно</span>}
                </button>
              );
            })}
          </div>

          {/* Таблица параметров */}
          <div className="p-6 md:p-8">
            <h3 className="font-display text-xl md:text-2xl text-text uppercase tracking-wider mb-1">
              {brand?.n} {line?.n} {engine.n}
            </h3>
            <p className="text-text-subtle text-sm mb-6">{gen?.n}</p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-text-subtle font-semibold">Параметр</th>
                    <th className="text-center py-3 px-2 text-xs uppercase tracking-wider text-text-subtle font-semibold">Заводские</th>
                    <th className="text-center py-3 px-2 text-xs uppercase tracking-wider text-accent font-semibold">После тюнинга</th>
                    <th className="text-right py-3 px-2 text-xs uppercase tracking-wider text-text-subtle font-semibold">Разница</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 text-text-muted">Мощность, л.с.</td>
                    <td className="text-center py-3 px-2 text-text">{fmt(engine.st[0])}</td>
                    <td className="text-center py-3 px-2 text-text font-semibold">
                      {isStage3 ? <span className="text-text-subtle italic">по запросу</span> : fmt(currentStage?.[0])}
                    </td>
                    <td className={`text-right py-3 px-2 font-semibold ${isStage3 ? 'text-text-subtle' : diffClass(engine.st[0], currentStage?.[0])}`}>
                      {isStage3 ? <span className="italic">по запросу</span> : diff(engine.st[0], currentStage?.[0], ' л.с.')}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 text-text-muted">Крутящий момент, Н·м</td>
                    <td className="text-center py-3 px-2 text-text">{fmt(engine.st[1])}</td>
                    <td className="text-center py-3 px-2 text-text font-semibold">
                      {isStage3 ? <span className="text-text-subtle italic">по запросу</span> : fmt(currentStage?.[1])}
                    </td>
                    <td className={`text-right py-3 px-2 font-semibold ${isStage3 ? 'text-text-subtle' : diffClass(engine.st[1], currentStage?.[1])}`}>
                      {isStage3 ? <span className="italic">по запросу</span> : diff(engine.st[1], currentStage?.[1], ' Н·м')}
                    </td>
                  </tr>
                  {(engine.st[2] != null || (!isStage3 && currentStage?.[2] != null)) && (
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-text-muted">Макс. скорость, км/ч</td>
                      <td className="text-center py-3 px-2 text-text">{fmt(engine.st[2])}</td>
                      <td className="text-center py-3 px-2 text-text font-semibold">
                        {isStage3 ? <span className="text-text-subtle italic">по запросу</span> : fmt(currentStage?.[2])}
                      </td>
                      <td className={`text-right py-3 px-2 font-semibold ${isStage3 ? 'text-text-subtle' : diffClass(engine.st[2], currentStage?.[2])}`}>
                        {isStage3 ? <span className="italic">по запросу</span> : diff(engine.st[2], currentStage?.[2], ' км/ч')}
                      </td>
                    </tr>
                  )}
                  {(engine.st[3] != null || (!isStage3 && currentStage?.[3] != null)) && (
                    <tr>
                      <td className="py-3 px-2 text-text-muted">Разгон 0–100 км/ч, сек</td>
                      <td className="text-center py-3 px-2 text-text">{fmt(engine.st[3])}</td>
                      <td className="text-center py-3 px-2 text-text font-semibold">
                        {isStage3 ? <span className="text-text-subtle italic">по запросу</span> : fmt(currentStage?.[3])}
                      </td>
                      <td className={`text-right py-3 px-2 font-semibold ${isStage3 ? 'text-text-subtle' : diffClass(engine.st[3], currentStage?.[3], true)}`}>
                        {isStage3
                          ? <span className="italic">по запросу</span>
                          : currentStage?.[3] != null && engine.st[3] != null
                          ? `${currentStage[3]! - engine.st[3]! > 0 ? '+' : ''}${(currentStage[3]! - engine.st[3]!).toFixed(1)} сек`
                          : '—'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Красный блок с ценой и CTA */}
          <div className="bg-gradient-to-r from-red-600/95 to-red-700/95 px-6 md:px-8 py-6 md:py-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-white/80 text-xs uppercase tracking-wider mb-1">
                  Стоимость {stage === 's1' ? 'Stage 1' : stage === 's2' ? 'Stage 2' : 'Stage 3'}
                  {!isStage3 && checkedExtras.size > 0 && ` + ${checkedExtras.size} опц.`}
                </div>
                <div className="font-display text-3xl md:text-4xl text-white font-bold tracking-tight">
                  {isStage3 || totalPrice == null ? 'По запросу' : fmtPrice(totalPrice)}
                </div>
                <div className="text-white/70 text-xs mt-1">
                  {isStage3
                    ? 'Stage 3 — индивидуальная сборка, цена и характеристики после диагностики'
                    : 'Гарантия 12 мес · Откат к стоку бесплатно · Alientech KESS3'}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => openBooking(`Чип-тюнинг ${brand?.n ?? ''} ${engine.n} (${stage === 's1' ? 'Stage 1' : stage === 's2' ? 'Stage 2' : 'Stage 3'})`.trim())}
                  className="bg-white text-red-700 hover:bg-white/90 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  Записаться
                </button>
                <a
                  href="tel:+79818428151"
                  className="border border-white/40 hover:bg-white/10 text-white rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2 justify-center"
                >
                  <Phone className="size-4" />
                  Позвонить
                </a>
              </div>
            </div>

            {/* Stage 3 — inline-форма заявки, чтобы клиент не уходил из контекста */}
            {isStage3 && (
              <Stage3LeadForm
                context={{
                  brand: brand?.n,
                  line: line?.n,
                  generation: gen?.n,
                  engine: engine.n,
                  stage: 'Stage 3',
                }}
              />
            )}

            {/* Юр-дисклеймер: цены ориентировочные, не оферта (ст. 437 ГК РФ).
                Делаем поверх красного фона — цвет белый/полупрозрачный. */}
            <div className="mt-4 pt-3 border-t border-white/15">
              <div className="flex items-start gap-2 text-white/70 text-[11px] leading-snug">
                <svg
                  className="size-3.5 shrink-0 mt-px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>
                  Расчёт ориентировочный. Точная стоимость работ определяется после
                  диагностики автомобиля и не является публичной офертой (ст.&nbsp;437 ГК&nbsp;РФ).
                </span>
              </div>
            </div>
          </div>

          {/* Дополнительные опции — на Stage 3 не показываем (всё по запросу) */}
          {!isStage3 && engineOptionIds.length > 0 && (
            <div className="border-t border-border">
              <button
                onClick={() => setExtrasOpen((v) => !v)}
                className="w-full px-6 md:px-8 py-4 flex items-center justify-between text-left hover:bg-bg-card/50 transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold text-text">
                  <Plus className="size-4 text-accent" />
                  Дополнительные опции
                  {checkedExtras.size > 0 && (
                    <span className="bg-accent text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      {checkedExtras.size}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={`size-5 text-text-subtle transition-transform ${extrasOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {extrasOpen && (
                <div className="px-6 md:px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {engineOptionIds.map((idx) => {
                    const opt = OPTIONS[idx];
                    if (!opt) return null;
                    const checked = checkedExtras.has(idx);
                    return (
                      <label
                        key={idx}
                        className={[
                          'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                          checked
                            ? 'border-accent-dim bg-accent/5'
                            : 'border-border hover:border-accent-dim/60 hover:bg-bg-card/50',
                        ].join(' ')}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleExtra(idx)}
                          className="sr-only"
                        />
                        <span
                          className={[
                            'size-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                            checked
                              ? 'bg-accent border-accent'
                              : 'border-border bg-[#0a0a0c]',
                          ].join(' ')}
                        >
                          {checked && <Check className="size-3.5 text-black" strokeWidth={3} />}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm text-text font-medium">{opt.n}</span>
                          <span className="block text-xs text-accent font-semibold mt-0.5">
                            {opt.p != null ? `+ ${fmtPrice(opt.p)}` : 'По запросу'}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Подсказка если двигатель выбран, но stage недоступны */}
      {engine && availableStages.length === 0 && (
        <div className="card text-center py-10">
          <Gauge className="size-10 text-text-subtle mx-auto mb-3" />
          <p className="text-text-muted mb-4">
            Цена для этого двигателя рассчитывается индивидуально.<br />
            Позвоните нам или оставьте заявку — ответим за 15 минут.
          </p>
          <a
            href="tel:+79818428151"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Phone className="size-4" />
            +7 (981) 842-81-51
          </a>
        </div>
      )}

      {/* Пустое состояние: ничего не выбрано */}
      {!brand && (
        <div className="card text-center py-10 text-text-subtle">
          <Zap className="size-10 text-accent/40 mx-auto mb-3" />
          <p className="text-sm">Выберите марку, чтобы увидеть прирост мощности и стоимость</p>
          <p className="text-xs mt-2 text-text-subtle/70">
            В каталоге <span className="text-accent font-semibold">{BRANDS.length}</span> марок ·{' '}
            <span className="text-accent font-semibold">2 993</span> двигателя
          </p>
        </div>
      )}

      <PriceDisclaimer className="mt-6" />
    </div>
  );
}

// ─── Вспомогательные UI ───────────────────────────────────────────────────────

function Label({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="size-6 rounded-full bg-accent/15 border border-accent-dim text-accent text-xs font-bold flex items-center justify-center">
        {step}
      </span>
      <span className="text-text font-semibold text-sm uppercase tracking-wider">{title}</span>
    </div>
  );
}

function PickedRow({ label, onReset }: { label: string; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-accent/5 border border-accent-dim">
      <div className="flex items-center gap-2 min-w-0">
        <Check className="size-4 text-accent shrink-0" />
        <span className="text-text font-medium text-sm truncate">{label}</span>
      </div>
      <button
        onClick={onReset}
        className="text-accent/70 hover:text-accent text-xs uppercase tracking-wider transition-colors shrink-0 ml-3"
      >
        Изменить
      </button>
    </div>
  );
}

function Dropdown({
  placeholder,
  items,
  onPick,
}: {
  placeholder: string;
  items: { value: string; label: string; sub?: string }[];
  onPick: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.label.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#0a0a0c] border border-border hover:border-accent-dim text-left transition-colors"
      >
        <span className="text-text-subtle text-sm">{placeholder}</span>
        <ChevronDown className={`size-4 text-text-subtle transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-[#111113] border border-border rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-subtle" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск..."
                autoFocus
                className="w-full bg-[#0a0a0c] border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent-dim focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.map((it) => (
              <button
                key={it.value}
                onClick={() => {
                  onPick(it.value);
                  setOpen(false);
                  setQuery('');
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-accent/5 border-b border-border/50 last:border-b-0 transition-colors"
              >
                <div className="text-text text-sm">{it.label}</div>
                {it.sub && <div className="text-text-subtle text-xs mt-0.5">{it.sub}</div>}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-text-subtle text-sm">Ничего не найдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SevenForceCalculator;
