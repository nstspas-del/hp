'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ChevronDown, ArrowRight, Phone, Search, Check,
  TrendingUp, Shield, Clock, Star, Gauge
} from 'lucide-react';
import { openBooking } from '@/lib/autodealer';
import sfData from '@/data/sevenforce-parsed.json';

// ─── Типы ─────────────────────────────────────────────────────────────────────
interface StagePrice { ours: number; competitor: number; our?: number }
interface Variant {
  id: string;
  label: string;
  hp: number;
  our_price: number;
  competitor_price: number;
  stages?: {
    stage1?: { our?: number; ours?: number; competitor: number };
    stage2?: { our?: number; ours?: number; competitor: number };
    stage3?: { our?: number; ours?: number; competitor: number };
  };
}
interface Model { slug: string; name: string; variants: Variant[] }
interface Brand { slug: string; name: string; models: Model[] }

// ─── Данные ───────────────────────────────────────────────────────────────────
const BRANDS = (sfData as { brands: Brand[] }).brands;

const STAGE_INFO = {
  stage1: {
    label: 'Stage 1',
    badge: 'Популярный',
    desc: 'Прошивка ЭБУ через OBD — без разборки двигателя',
    descDetail: 'Оптимизация карт наддува, впрыска и угла зажигания. Прирост +15–25% к мощности и моменту. Механика и гарантия не затрагиваются.',
    power: '+15–25%',
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/40',
    accent: 'text-green-400',
    dot: 'bg-green-500',
  },
  stage2: {
    label: 'Stage 2',
    badge: 'Впуск + выпуск',
    desc: 'Прошивка + доработка впускного и выпускного трактов',
    descDetail: 'Апгрейд интеркулера, даунпайп без катализатора или спортивный катализатор, крупный фильтр холодного впуска. В связке с прошивкой даёт +25–50% к мощности.',
    power: '+25–50%',
    color: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/40',
    accent: 'text-yellow-400',
    dot: 'bg-yellow-500',
  },
  stage3: {
    label: 'Stage 3',
    badge: 'Максимум',
    desc: 'Турбо-кит, форсунки, топливная система + прошивка',
    descDetail: 'Новый турбокит (Big Turbo / Twin Scroll), увеличенные форсунки, насос высокого давления, интеркулер Top Mount. Прирост +50–100%.',
    power: '+50–100%',
    color: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/40',
    accent: 'text-red-400',
    dot: 'bg-red-500',
  },
} as const;

type StageKey = keyof typeof STAGE_INFO;

function getStagePrice(variant: Variant, stage: StageKey): StagePrice | null {
  const sd = variant.stages?.[stage];
  if (sd) {
    return {
      ours: sd.our ?? sd.ours ?? variant.our_price,
      competitor: sd.competitor,
    };
  }
  if (stage === 'stage1') {
    return { ours: variant.our_price, competitor: variant.competitor_price };
  }
  return null;
}

// ─── Компонент ────────────────────────────────────────────────────────────────
export function ChipTuningCalculator() {
  const [brandQuery, setBrandQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<StageKey>('stage1');
  const [brandOpen, setBrandOpen] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);

  const filteredBrands = useMemo(() => {
    if (!brandQuery) return BRANDS;
    const q = brandQuery.toLowerCase();
    return BRANDS.filter(b => b.name.toLowerCase().includes(q));
  }, [brandQuery]);

  const currentBrand = useMemo(() =>
    BRANDS.find(b => b.slug === selectedBrand) ?? null, [selectedBrand]);
  const currentModel = useMemo(() =>
    currentBrand?.models.find(m => m.slug === selectedModel) ?? null, [currentBrand, selectedModel]);
  const currentVariant = useMemo(() =>
    currentModel?.variants.find(v => v.id === selectedVariant) ?? null, [currentModel, selectedVariant]);

  // Закрытие dropdown при клике снаружи
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function selectBrand(slug: string, name: string) {
    setSelectedBrand(slug);
    setBrandQuery(name);
    setBrandOpen(false);
    setSelectedModel('');
    setSelectedVariant('');
  }

  function handleBrandInput(v: string) {
    setBrandQuery(v);
    setBrandOpen(true);
    if (!v) { setSelectedBrand(''); setSelectedModel(''); setSelectedVariant(''); }
  }

  const stagePrice = useMemo(() => {
    if (!currentVariant) return null;
    return getStagePrice(currentVariant, selectedStage);
  }, [currentVariant, selectedStage]);

  const savings = stagePrice && stagePrice.competitor > 0
    ? stagePrice.competitor - stagePrice.ours
    : 0;

  // Реальные мультипликаторы по стадиям:
  // Stage 1: +22% (только прошивка, без железа)
  // Stage 2: +40% (прошивка + даунпайп + интеркулер + впуск)
  // Stage 3: +70% (турбо-кит + форсунки + ТНВД + прошивка)
  const hpAfter = currentVariant
    ? Math.round(currentVariant.hp * (
        selectedStage === 'stage1' ? 1.22 :
        selectedStage === 'stage2' ? 1.40 : 1.70
      ))
    : 0;

  const progress = [selectedBrand, selectedModel, selectedVariant].filter(Boolean).length;

  const totalModels = useMemo(() =>
    BRANDS.reduce((a, b) => a + b.models.length, 0), []);
  const totalVariants = useMemo(() =>
    BRANDS.reduce((a, b) => a + b.models.reduce((c, m) => c + m.variants.length, 0), 0), []);

  return (
    <section className="section relative overflow-hidden" id="chip-calculator">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="container relative">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-5">
            <Zap className="size-3.5" />
            Калькулятор чип-тюнинга
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
            УЗНАЙ ЦЕНУ <span className="text-accent">ЗА 30 СЕКУНД</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            {BRANDS.length} марок · {totalModels} моделей · {totalVariants} двигателей.
            Выбери — получи точную цену.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Левая панель — выбор */}
          <div className="lg:col-span-3 space-y-5">

            {/* Прогресс */}
            <div className="flex items-center gap-2 mb-6">
              {['Марка', 'Модель', 'Двигатель'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all
                    ${i < progress ? 'bg-accent text-bg' : i === progress ? 'bg-accent/20 text-accent border border-accent/40' : 'bg-bg-elevated text-text-subtle border border-border'}`}>
                    {i < progress ? <Check className="size-3.5" /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${i <= progress ? 'text-text-muted' : 'text-text-subtle'}`}>{step}</span>
                  {i < 2 && <div className={`flex-1 h-px min-w-[20px] ${i < progress - 1 ? 'bg-accent/40' : 'bg-border'}`} />}
                </div>
              ))}
            </div>

            {/* 1 — Марка */}
            <div>
              <label className="block text-text-muted text-sm font-medium mb-2">
                <span className="text-accent font-bold mr-1">1.</span> Марка автомобиля
              </label>
              <div className="relative" ref={brandRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
                  <input
                    type="text"
                    placeholder="BMW, Mercedes, Audi, Land Rover..."
                    value={brandQuery}
                    onChange={e => handleBrandInput(e.target.value)}
                    onFocus={() => setBrandOpen(true)}
                    className="w-full bg-bg-elevated border border-border text-text rounded-xl pl-10 pr-10 py-3.5 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-subtle"
                  />
                  {selectedBrand && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-accent" />
                  )}
                </div>
                <AnimatePresence>
                  {brandOpen && filteredBrands.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute z-50 top-full mt-1 w-full bg-bg-elevated border border-border rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="max-h-64 overflow-y-auto divide-y divide-border/50">
                        {filteredBrands.map(b => (
                          <button
                            key={b.slug}
                            onClick={() => selectBrand(b.slug, b.name)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors flex items-center justify-between
                              ${selectedBrand === b.slug ? 'text-accent bg-accent/5' : 'text-text-muted'}`}
                          >
                            <span>{b.name}</span>
                            <span className="text-text-subtle text-xs">{b.models.length} мод.</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2 — Модель */}
            <div>
              <label className="block text-text-muted text-sm font-medium mb-2">
                <span className="text-accent font-bold mr-1">2.</span> Модель
              </label>
              <div className="relative">
                <select
                  className="w-full bg-bg-elevated border border-border text-text rounded-xl px-4 py-3.5 pr-10 appearance-none focus:border-accent focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  value={selectedModel}
                  onChange={e => { setSelectedModel(e.target.value); setSelectedVariant(''); }}
                  disabled={!currentBrand}
                >
                  <option value="">— Выберите модель —</option>
                  {currentBrand?.models.map(m => (
                    <option key={m.slug} value={m.slug}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
              </div>
            </div>

            {/* 3 — Двигатель */}
            <div>
              <label className="block text-text-muted text-sm font-medium mb-2">
                <span className="text-accent font-bold mr-1">3.</span> Двигатель / поколение
              </label>
              <div className="relative">
                <select
                  className="w-full bg-bg-elevated border border-border text-text rounded-xl px-4 py-3.5 pr-10 appearance-none focus:border-accent focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  value={selectedVariant}
                  onChange={e => setSelectedVariant(e.target.value)}
                  disabled={!currentModel}
                >
                  <option value="">— Выберите двигатель —</option>
                  {currentModel?.variants.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
              </div>
            </div>

            {/* 4 — Stage */}
            <AnimatePresence>
              {currentVariant && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-text-muted text-sm font-medium mb-3">
                    <span className="text-accent font-bold mr-1">4.</span> Уровень тюнинга
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.entries(STAGE_INFO) as [StageKey, typeof STAGE_INFO[StageKey]][]).map(([key, info]) => {
                      const sp = getStagePrice(currentVariant, key);
                      const available = !!(sp && sp.ours > 0);
                      return (
                        <button
                          key={key}
                          onClick={() => available && setSelectedStage(key)}
                          disabled={!available}
                          className={`relative p-3 rounded-xl border-2 text-left transition-all
                            ${selectedStage === key
                              ? `bg-gradient-to-b ${info.color} ${info.border} scale-[1.02]`
                              : 'border-border bg-bg-elevated hover:border-border-hover'}
                            ${!available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {selectedStage === key && (
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${info.dot}`} />
                          )}
                          <div className={`text-xs font-bold mb-0.5 ${selectedStage === key ? info.accent : 'text-text-subtle'}`}>
                            {info.badge}
                          </div>
                          <div className="font-display font-bold text-text text-sm">{info.label}</div>
                          <div className={`text-xs font-semibold mt-1 ${selectedStage === key ? info.accent : 'text-text-subtle'}`}>
                            {info.power}
                          </div>
                          {available && sp && (
                            <div className="text-xs text-text-subtle mt-1">
                              от {sp.ours.toLocaleString('ru-RU')} ₽
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Мобильный результат */}
            <div className="lg:hidden">
              {currentVariant && stagePrice && (
                <ResultCard
                  currentBrand={currentBrand}
                  currentModel={currentModel}
                  currentVariant={currentVariant}
                  stagePrice={stagePrice}
                  selectedStage={selectedStage}
                  hpAfter={hpAfter}
                  savings={savings}
                />
              )}
            </div>
          </div>

          {/* Правая панель — результат */}
          <div className="lg:col-span-2 hidden lg:block">
            <AnimatePresence mode="wait">
              {currentVariant && stagePrice ? (
                <motion.div
                  key={`${selectedVariant}-${selectedStage}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                >
                  <ResultCard
                    currentBrand={currentBrand}
                    currentModel={currentModel}
                    currentVariant={currentVariant}
                    stagePrice={stagePrice}
                    selectedStage={selectedStage}
                    hpAfter={hpAfter}
                    savings={savings}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border bg-bg-elevated/50"
                >
                  <Zap className="size-12 text-accent/20 mb-4" />
                  <p className="text-text-subtle text-sm">Выберите марку, модель и двигатель — здесь появится точная цена</p>
                  <div className="mt-6 space-y-2 text-left w-full">
                    {['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Land Rover'].map(b => (
                      <div key={b} className="flex items-center gap-2 text-xs text-text-subtle">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                        {b}
                      </div>
                    ))}
                    <div className="text-xs text-text-subtle pl-3">и ещё {BRANDS.length - 5} марок...</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Доверительные метрики — без упоминания конкурентов */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {[
            { icon: TrendingUp, label: `${BRANDS.length} марок`, desc: `${totalVariants}+ двигателей` },
            { icon: Shield,     label: 'Откат к стоку',          desc: 'бесплатно, в любой момент' },
            { icon: Clock,      label: 'от 1–2 часов',           desc: 'время работы' },
            { icon: Star,       label: '4.9 рейтинг',            desc: 'Яндекс Карты' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-bg-elevated border border-border">
              <Icon className="size-5 text-accent shrink-0" />
              <div>
                <div className="text-sm font-semibold text-text">{label}</div>
                <div className="text-xs text-text-subtle">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Карточка результата ──────────────────────────────────────────────────────
function ResultCard({
  currentBrand, currentModel, currentVariant, stagePrice, selectedStage, hpAfter, savings
}: {
  currentBrand: Brand | null;
  currentModel: Model | null;
  currentVariant: Variant;
  stagePrice: StagePrice;
  selectedStage: StageKey;
  hpAfter: number;
  savings: number;
}) {
  const info = STAGE_INFO[selectedStage];

  return (
    <div className={`rounded-2xl border-2 bg-gradient-to-br ${info.color} ${info.border} p-6 space-y-5`}>
      {/* Заголовок */}
      <div>
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-bg-elevated/60 ${info.accent} mb-2`}>
          <div className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
          {info.label} — {info.badge}
        </div>
        <div className="text-text-muted text-sm">{currentBrand?.name} {currentModel?.name}</div>
        <div className="text-text-subtle text-xs mt-0.5">{currentVariant.label}</div>
      </div>

      {/* Цена */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-text-subtle text-xs uppercase tracking-wider mb-1">Наша цена</div>
          <div className="flex items-baseline gap-1">
            <span className={`font-display text-5xl font-bold ${info.accent}`}>
              {stagePrice.ours.toLocaleString('ru-RU')}
            </span>
            <span className="text-text-muted text-xl">₽</span>
          </div>
        </div>
        {savings > 0 && stagePrice.competitor > 0 && (
          <div className="text-right">
            <div className="text-text-subtle text-xs mb-1">Рыночная цена</div>
            <div className="text-text-subtle text-lg line-through">{stagePrice.competitor.toLocaleString('ru-RU')} ₽</div>
            <div className={`text-sm font-bold ${info.accent}`}>−{savings.toLocaleString('ru-RU')} ₽</div>
          </div>
        )}
      </div>

      {/* Мощность до/после */}
      {currentVariant.hp > 0 && (
        <div className="bg-bg/40 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-xs text-text-subtle mb-1">Сейчас</div>
              <div className="font-display text-2xl font-bold text-text">{currentVariant.hp}</div>
              <div className="text-xs text-text-subtle">л.с.</div>
            </div>
            <div className="flex items-center gap-1 px-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-1 rounded-full ${i < 3 ? info.dot : 'bg-border'}`}
                    style={{ height: `${8 + i * 4}px` }} />
                ))}
              </div>
              <ArrowRight className={`size-4 ${info.accent}`} />
            </div>
            <div className="text-center">
              <div className="text-xs text-text-subtle mb-1">После</div>
              <div className={`font-display text-2xl font-bold ${info.accent}`}>~{hpAfter}</div>
              <div className="text-xs text-text-subtle">л.с.</div>
            </div>
          </div>
          <div className={`text-xs text-center mt-2 font-semibold ${info.accent}`}>
            {info.power} мощности
          </div>
        </div>
      )}

      {/* Что входит в стадию */}
      <div className="bg-bg/30 rounded-xl p-3">
        <div className={`text-xs font-bold ${info.accent} mb-1.5`}>{info.label}: {info.badge}</div>
        <div className="text-xs text-text-muted leading-relaxed">{info.descDetail}</div>
      </div>

      {/* Включено */}
      <div className="space-y-1.5">
        {['Официальное ПО Alientech KESS3', 'Сохранение оригинального файла', 'Откат к стоку — бесплатно'].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-text-muted">
            <Check className={`size-3.5 shrink-0 ${info.accent}`} />
            {item}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="space-y-2">
        <button
          onClick={() => openBooking(`${currentBrand?.name} ${currentModel?.name} ${info.label}`)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-bg font-bold text-sm hover:bg-accent/90 transition-colors"
        >
          Записаться по этой цене
          <ArrowRight className="size-4" />
        </button>
        <a
          href="tel:+79818428151"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-bg/40 text-text-muted text-sm hover:border-accent/40 transition-colors"
        >
          <Phone className="size-4" />
          Позвонить и уточнить
        </a>
      </div>

      <p className="text-text-subtle text-xs text-center">
        * Цена финальная, без скрытых доплат. Подтверждается при записи.
      </p>
    </div>
  );
}
