'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ChevronDown, ArrowRight, Phone, Search, Check,
  Settings2, Info, ChevronLeft, Calendar, Gauge, Flame,
  TrendingUp, Clock
} from 'lucide-react';
import { openBooking } from '@/lib/autodealer';
import brandsRaw from '@/data/brands.json';

// ─── Типы ─────────────────────────────────────────────────────────────────────
interface EngineStage {
  hp: number;
  nm?: number;
  time0_100?: number;
}
interface Engine {
  code: string;
  displacement: number;
  type: string;
  hp: number;
  nm?: number;
  time0_100?: number;
  tuning?: {
    stage1?: EngineStage;
    stage2?: EngineStage;
    stage3?: EngineStage;
  };
}
interface Series {
  slug: string;
  name: string;
  years?: string;
  priceFrom?: number;
  engines?: Engine[];
}
interface BrandData {
  slug: string;
  name: string;
  nameRu?: string;
  priceFrom: number;
  series?: Series[];
}

// ─── Дополнительные опции ─────────────────────────────────────────────────────
const EXTRA_OPTIONS = [
  {
    id: 'speed-limit',
    label: 'Снятие ограничения скорости',
    desc: 'Программное снятие ограничителя скорости (обычно 180–250 км/ч). Актуально для европейских авто.',
    price: 3000,
  },
  {
    id: 'rev-limit',
    label: 'Изменение максимальных оборотов',
    desc: 'Перенастройка отсечки оборотов в режиме P/N. Полезно для спортивного вождения.',
    price: 2500,
  },
  {
    id: 'cat-off',
    label: 'Отключение контроля катализаторов',
    desc: 'Программное отключение 2-й лямбды и контроля катализаторов — убирает ошибки при удалении катализаторов.',
    price: 4000,
  },
  {
    id: 'swirl-off',
    label: 'Отключение вихревых заслонок',
    desc: 'Программное отключение вихревых заслонок впуска — устраняет источник масляного нагара и ошибок.',
    price: 3500,
  },
  {
    id: 'error-off',
    label: 'Отключение ошибок',
    desc: 'Отключение одной или нескольких ошибок по номерам OBD. Применяется после снятия оборудования.',
    price: 2000,
  },
  {
    id: 'pops',
    label: 'Прострелы (Pop & Bang)',
    desc: 'Программная реализация прострелов на сбросе газа — спортивный звук выпуска без аппаратных изменений.',
    price: 5000,
  },
  {
    id: 'immo-off',
    label: 'Отключение иммобилайзера',
    desc: 'Программное отключение иммобилайзера ЭБУ — для замены блока или тюнинговых нужд.',
    price: 5000,
  },
  {
    id: 'cat-heat',
    label: 'Отключение прогрева катализатора',
    desc: 'Деактивация режима прогрева катализатора при холодном старте — убирает обогащение смеси и дёрганье.',
    price: 2500,
  },
  {
    id: 'startstop',
    label: 'Отключение Start/Stop навсегда',
    desc: 'Постоянная деактивация системы Start/Stop без нажатия кнопки при каждом запуске.',
    price: 3000,
  },
];

type StageKey = 'stage1' | 'stage2' | 'stage3';

// Шаги калькулятора
type Step = 1 | 2 | 3 | 4 | 5;
// 1 = Выбор марки, 2 = Модель, 3 = Год + двигатель, 4 = Стадии, 5 = Итог

const STAGE_INFO: Record<
  StageKey,
  {
    label: string;
    badge: string;
    desc: string;
    descDetail: string;
    power: string;
    multiplierHp: number;
    multiplierNm: number;
    color: string;
    border: string;
    accent: string;
    dot: string;
  }
> = {
  stage1: {
    label: 'Stage 1',
    badge: 'Популярный',
    desc: 'Прошивка ЭБУ через OBD — без разборки двигателя',
    descDetail:
      'Оптимизация карт наддува, впрыска и угла зажигания. Прирост +15–25% к мощности и моменту. Механика и гарантия не затрагиваются.',
    power: '+15–25%',
    multiplierHp: 1.22,
    multiplierNm: 1.20,
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/40',
    accent: 'text-green-400',
    dot: 'bg-green-500',
  },
  stage2: {
    label: 'Stage 2',
    badge: 'Впуск + Выпуск',
    desc: 'Прошивка + доработка впускного и выпускного трактов',
    descDetail:
      'Апгрейд интеркулера, даунпайп без катализатора или спортивный катализатор, крупный фильтр холодного впуска. В связке с прошивкой даёт +25–50% к мощности.',
    power: '+25–50%',
    multiplierHp: 1.40,
    multiplierNm: 1.35,
    color: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/40',
    accent: 'text-yellow-400',
    dot: 'bg-yellow-500',
  },
  stage3: {
    label: 'Stage 3',
    badge: 'Максимум',
    desc: 'Турбо-кит, форсунки, топливная система + прошивка',
    descDetail:
      'Новый турбокит (Big Turbo / Twin Scroll), увеличенные форсунки, насос высокого давления, интеркулер Top Mount. Прирост +50–100%.',
    power: '+50–100%',
    multiplierHp: 1.70,
    multiplierNm: 1.55,
    color: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/40',
    accent: 'text-red-400',
    dot: 'bg-red-500',
  },
};

// Fallback price multipliers when real data missing
const STAGE_PRICE_MULT: Record<StageKey, number> = {
  stage1: 1.0,
  stage2: 1.4,
  stage3: 2.0,
};

// ─── Данные брендов ───────────────────────────────────────────────────────────
const BRANDS: BrandData[] = (brandsRaw as BrandData[]).filter(
  (b) => b.series && b.series.some((s) => s.engines && s.engines.length > 0)
);

// Генерация диапазонов лет из строки "2005-2012" или "2021+"
function parseYearRange(years?: string): number[] {
  if (!years) return [];
  const current = new Date().getFullYear();
  const plusMatch = years.match(/^(\d{4})\+/);
  if (plusMatch) {
    const start = parseInt(plusMatch[1]);
    return Array.from({ length: current - start + 1 }, (_, i) => start + i).reverse();
  }
  const rangeMatch = years.match(/^(\d{4})[–\-](\d{4})/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2]);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).reverse();
  }
  return [];
}

// ─── Компонент ────────────────────────────────────────────────────────────────
export function ChipTuningCalculator({ defaultBrandSlug }: { defaultBrandSlug?: string } = {}) {
  // Состояние шагов — если бренд передан, сразу переходим на шаг 2
  const [step, setStep] = useState<Step>(defaultBrandSlug ? 2 : 1);

  // Выборы
  const [brandSlug, setBrandSlug] = useState(defaultBrandSlug ?? '');
  const [seriesSlug, setSeriesSlug] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [engineCode, setEngineCode] = useState('');
  const [stage, setStage] = useState<StageKey>('stage1');

  // UI
  const [brandQuery, setBrandQuery] = useState('');
  const [brandOpen, setBrandOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const brandRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredBrands = useMemo(
    () =>
      brandQuery.trim()
        ? BRANDS.filter(
            (b) =>
              b.name.toLowerCase().includes(brandQuery.toLowerCase()) ||
              (b.nameRu ?? '').toLowerCase().includes(brandQuery.toLowerCase())
          )
        : BRANDS,
    [brandQuery]
  );

  const currentBrand = BRANDS.find((b) => b.slug === brandSlug);
  const seriesList =
    currentBrand?.series?.filter((s) => s.engines && s.engines.length > 0) ?? [];
  const currentSeries = seriesList.find((s) => s.slug === seriesSlug);
  const yearList = parseYearRange(currentSeries?.years);
  const engineList = currentSeries?.engines ?? [];
  const currentEngine = engineList.find((e) => e.code === engineCode);

  // Stage данные
  const stageData = currentEngine?.tuning?.[stage];
  const stageAvailable = !!stageData;
  const hasStage2Data = !!currentEngine?.tuning?.stage2;

  // Базовая цена
  const basePrice = currentSeries?.priceFrom ?? currentBrand?.priceFrom ?? 25000;
  const stagePrice = Math.round(basePrice * STAGE_PRICE_MULT[stage]);

  // Если нет данных по стадии — применяем скидку -25%
  const priceHasDiscount = !stageAvailable && stage !== 'stage1';
  const displayPrice = priceHasDiscount
    ? Math.round(stagePrice * 0.75)
    : stagePrice;

  // HP/NM/время расчёты
  const hpAfter =
    stageData?.hp ??
    (currentEngine
      ? Math.round(currentEngine.hp * STAGE_INFO[stage].multiplierHp)
      : 0);
  const hpGain = currentEngine ? hpAfter - currentEngine.hp : 0;

  const nmBefore = currentEngine?.nm;
  const nmAfter =
    stageData?.nm ??
    (nmBefore
      ? Math.round(nmBefore * STAGE_INFO[stage].multiplierNm)
      : undefined);
  const nmGain = nmAfter && nmBefore ? nmAfter - nmBefore : undefined;

  const time0Before = currentEngine?.time0_100;
  const time0After = stageData?.time0_100;

  // Options total
  const optionsTotal = Array.from(selectedOptions).reduce((sum, id) => {
    const opt = EXTRA_OPTIONS.find((o) => o.id === id);
    return sum + (opt?.price ?? 0);
  }, 0);

  const grandTotal = displayPrice + optionsTotal;

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const info = STAGE_INFO[stage];

  // Reset downstream when parent changes
  const onBrandSelect = (slug: string) => {
    setBrandSlug(slug);
    setSeriesSlug('');
    setSelectedYear(null);
    setEngineCode('');
    setBrandOpen(false);
    setBrandQuery('');
    setStep(2);
  };
  const onSeriesSelect = (slug: string) => {
    setSeriesSlug(slug);
    setSelectedYear(null);
    setEngineCode('');
    setStep(3);
  };
  const onEngineSelect = (code: string) => {
    setEngineCode(code);
    setStep(4);
  };

  // Минимальный шаг навигации: если бренд предустановлен, нельзя уйти на шаг 1
  const minStep: Step = defaultBrandSlug ? 2 : 1;

  // Шаги прогресса
  const STEPS = [
    { label: 'Марка', done: !!brandSlug },
    { label: 'Модель', done: !!seriesSlug },
    { label: 'Двигатель', done: !!engineCode },
    { label: 'Стадия', done: !!engineCode },
    { label: 'Итог', done: false },
  ];

  const progressIdx = step - 1;

  return (
    <section className="section relative overflow-hidden" id="chip-calculator">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="container relative">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-5">
            <Zap className="size-3.5" />
            Калькулятор чип-тюнинга
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-3">
            УЗНАЙ ЦЕНУ <span className="text-accent">ЗА 30 СЕКУНД</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm">
            {defaultBrandSlug
              ? `${currentBrand?.name ?? ''} — выберите модель и двигатель`
              : `${BRANDS.length} марок · реальные данные по двигателям · конкретные цифры HP до и после`}
          </p>
        </div>

        {/* Прогресс-бар */}
        <div className="flex items-center justify-center gap-0 mb-8 max-w-2xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => {
                  if (i + 1 >= minStep && (i < progressIdx || s.done)) {
                    setStep((i + 1) as Step);
                  }
                }}
                className={`flex flex-col items-center gap-1 group transition-all ${
                  i <= progressIdx ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${
                      i < progressIdx
                        ? 'bg-accent text-bg'
                        : i === progressIdx
                        ? 'bg-accent/20 border-2 border-accent text-accent'
                        : 'bg-bg-elevated border border-border text-text-subtle'
                    }`}
                >
                  {i < progressIdx ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block transition-colors ${
                    i === progressIdx
                      ? 'text-accent font-medium'
                      : i < progressIdx
                      ? 'text-text-muted'
                      : 'text-text-subtle'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px w-8 sm:w-12 mx-1 transition-colors ${
                    i < progressIdx ? 'bg-accent' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── ШАГИ ── */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── Шаг 1: Выбор марки ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <StepHeader
                  icon={<Search className="size-4" />}
                  title="Выберите марку автомобиля"
                  subtitle={`Доступно ${BRANDS.length} марок с реальными данными по двигателям`}
                />
                <div className="relative" ref={brandRef}>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-bg-elevated focus-within:border-accent/50 transition-colors">
                    <Search className="size-4 text-text-subtle shrink-0" />
                    <input
                      value={brandQuery}
                      onChange={(e) => setBrandQuery(e.target.value)}
                      onFocus={() => setBrandOpen(true)}
                      placeholder="Например: BMW, Mercedes, Toyota..."
                      className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
                    />
                  </div>
                  {/* Бренды список */}
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {filteredBrands.map((b) => (
                      <button
                        key={b.slug}
                        onClick={() => onBrandSelect(b.slug)}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left
                          ${
                            brandSlug === b.slug
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border bg-bg-elevated text-text-muted hover:border-accent/40 hover:bg-accent/5'
                          }`}
                      >
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-xs text-text-subtle mt-0.5 font-normal">
                          от {(b.priceFrom ?? 25000).toLocaleString('ru-RU')} ₽
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Шаг 2: Выбор модели ── */}
            {step === 2 && brandSlug && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <StepHeader
                  icon={<Gauge className="size-4" />}
                  title={`Модель ${currentBrand?.name}`}
                  subtitle="Выберите кузов или поколение"
                  onBack={defaultBrandSlug ? undefined : () => setStep(1)}
                  backLabel={defaultBrandSlug ? undefined : currentBrand?.name}
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  {seriesList.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => onSeriesSelect(s.slug)}
                      className={`text-left px-5 py-4 rounded-xl border transition-all
                        ${
                          seriesSlug === s.slug
                            ? 'border-accent/60 bg-accent/8 text-accent'
                            : 'border-border bg-bg-elevated hover:border-accent/30 hover:bg-bg-elevated/80'
                        }`}
                    >
                      <div className="font-semibold text-sm">{s.name}</div>
                      <div className="flex items-center gap-3 mt-1.5">
                        {s.years && (
                          <span className="text-xs text-text-subtle flex items-center gap-1">
                            <Calendar className="size-3" />
                            {s.years}
                          </span>
                        )}
                        <span className="text-xs text-text-subtle">
                          {s.engines?.length ?? 0} двигател{(s.engines?.length ?? 0) === 1 ? 'ь' : 'я'}
                        </span>
                        {s.priceFrom && (
                          <span className="text-xs text-accent font-medium">
                            от {s.priceFrom.toLocaleString('ru-RU')} ₽
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Шаг 3: Год + Двигатель ── */}
            {step === 3 && seriesSlug && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <StepHeader
                  icon={<Calendar className="size-4" />}
                  title="Год и двигатель"
                  subtitle={currentSeries?.name}
                  onBack={() => setStep(2)}
                  backLabel="Модель"
                />

                {/* Год */}
                {yearList.length > 0 && (
                  <div>
                    <label className="text-xs text-text-subtle uppercase tracking-wider mb-2 block">
                      Год выпуска
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {yearList.map((y) => (
                        <button
                          key={y}
                          onClick={() => setSelectedYear(y)}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-all
                            ${
                              selectedYear === y
                                ? 'border-accent bg-accent/10 text-accent font-medium'
                                : 'border-border bg-bg-elevated text-text-muted hover:border-accent/30'
                            }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Двигатель */}
                <div>
                  <label className="text-xs text-text-subtle uppercase tracking-wider mb-2 block">
                    Двигатель
                  </label>
                  <div className="space-y-2">
                    {engineList.map((e) => (
                      <button
                        key={e.code}
                        onClick={() => onEngineSelect(e.code)}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all
                          ${
                            engineCode === e.code
                              ? 'border-accent/60 bg-accent/8'
                              : 'border-border bg-bg-elevated hover:border-accent/30'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div
                              className={`text-sm font-bold ${
                                engineCode === e.code ? 'text-accent' : 'text-text'
                              }`}
                            >
                              {e.code}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5">
                              <span className="text-xs text-text-subtle">
                                {Math.round(e.displacement * 1000)} cm³
                              </span>
                              <span className="text-xs font-bold text-text-muted">
                                {e.hp} л.с.
                              </span>
                              {e.nm && (
                                <span className="text-xs text-text-subtle">
                                  {e.nm} Нм
                                </span>
                              )}
                              {e.time0_100 && (
                                <span className="text-xs text-text-subtle flex items-center gap-0.5">
                                  <Clock className="size-3" />
                                  {e.time0_100}с
                                </span>
                              )}
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                  e.type === 'diesel'
                                    ? 'bg-amber-500/15 text-amber-400'
                                    : e.type === 'hybrid'
                                    ? 'bg-green-500/15 text-green-400'
                                    : 'bg-blue-500/15 text-blue-400'
                                }`}
                              >
                                {e.type === 'diesel'
                                  ? 'Дизель'
                                  : e.type === 'hybrid'
                                  ? 'Гибрид'
                                  : 'Бензин'}
                              </span>
                            </div>
                          </div>
                          {e.tuning?.stage1 && (
                            <div className="shrink-0 text-right">
                              <div className="text-xs text-text-subtle">Stage 1</div>
                              <div className="text-sm font-bold text-green-400">
                                +{e.tuning.stage1.hp - e.hp} л.с.
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Шаг 4: Сравнение Stage 1 vs Stage 2 ── */}
            {step === 4 && engineCode && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <StepHeader
                  icon={<Flame className="size-4" />}
                  title="Выберите стадию тюнинга"
                  subtitle={`${currentBrand?.name} ${currentSeries?.name} — ${currentEngine?.code}`}
                  onBack={() => setStep(3)}
                  backLabel="Двигатель"
                />

                {/* Stage 1 */}
                <StageCard
                  stageKey="stage1"
                  info={STAGE_INFO.stage1}
                  engine={currentEngine!}
                  selected={stage === 'stage1'}
                  onSelect={() => {
                    setStage('stage1');
                    setStep(5);
                  }}
                  hpAfter={currentEngine?.tuning?.stage1?.hp ?? Math.round(currentEngine!.hp * STAGE_INFO.stage1.multiplierHp)}
                  nmAfter={currentEngine?.tuning?.stage1?.nm ?? (currentEngine?.nm ? Math.round(currentEngine.nm * STAGE_INFO.stage1.multiplierNm) : undefined)}
                  time0After={currentEngine?.tuning?.stage1?.time0_100}
                  hasRealData={!!currentEngine?.tuning?.stage1}
                />

                {/* Stage 2 */}
                <StageCard
                  stageKey="stage2"
                  info={STAGE_INFO.stage2}
                  engine={currentEngine!}
                  selected={stage === 'stage2'}
                  onSelect={() => {
                    setStage('stage2');
                    setStep(5);
                  }}
                  hpAfter={currentEngine?.tuning?.stage2?.hp ?? Math.round(currentEngine!.hp * STAGE_INFO.stage2.multiplierHp)}
                  nmAfter={currentEngine?.tuning?.stage2?.nm ?? (currentEngine?.nm ? Math.round(currentEngine.nm * STAGE_INFO.stage2.multiplierNm) : undefined)}
                  time0After={currentEngine?.tuning?.stage2?.time0_100}
                  hasRealData={hasStage2Data}
                  withDiscount={!hasStage2Data}
                  basePrice={basePrice}
                />

                {/* Stage 3 */}
                <StageCard
                  stageKey="stage3"
                  info={STAGE_INFO.stage3}
                  engine={currentEngine!}
                  selected={stage === 'stage3'}
                  onSelect={() => {
                    setStage('stage3');
                    setStep(5);
                  }}
                  hpAfter={Math.round(currentEngine!.hp * STAGE_INFO.stage3.multiplierHp)}
                  nmAfter={currentEngine?.nm ? Math.round(currentEngine.nm * STAGE_INFO.stage3.multiplierNm) : undefined}
                  time0After={undefined}
                  hasRealData={false}
                  withDiscount={true}
                  basePrice={basePrice}
                />
              </motion.div>
            )}

            {/* ── Шаг 5: Итог + Опции ── */}
            {step === 5 && engineCode && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepHeader
                  icon={<TrendingUp className="size-4" />}
                  title="Итоговый расчёт"
                  subtitle={`${info.label} — ${currentBrand?.name} ${currentSeries?.name}`}
                  onBack={() => setStep(4)}
                  backLabel="Стадия"
                />

                <div className="grid lg:grid-cols-5 gap-5 mt-5">
                  {/* Левая: параметры + опции */}
                  <div className="lg:col-span-3 space-y-4">
                    {/* Таблица параметров */}
                    <div
                      className={`rounded-2xl border-2 bg-gradient-to-br ${info.color} ${info.border} overflow-hidden`}
                    >
                      <div className="px-5 py-3 border-b border-white/10">
                        <div
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-bg/40 ${info.accent}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
                          {info.label} — {info.badge}
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {currentEngine?.code} · {Math.round((currentEngine?.displacement ?? 0) * 1000)} cm³
                          {selectedYear && ` · ${selectedYear} г.в.`}
                        </div>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/8">
                            <th className="text-left px-5 py-2.5 text-xs text-text-subtle font-medium">
                              Параметр
                            </th>
                            <th className="text-right px-4 py-2.5 text-xs text-text-subtle font-medium">
                              Заводские
                            </th>
                            <th className="text-right px-4 py-2.5 text-xs text-text-subtle font-medium">
                              После
                            </th>
                            <th className="text-right px-4 py-2.5 text-xs text-text-subtle font-medium">
                              Δ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Объём */}
                          <tr className="border-b border-white/5">
                            <td className="px-5 py-2.5 text-text-muted">Объём</td>
                            <td className="px-4 py-2.5 text-right text-text">
                              {Math.round(currentEngine!.displacement * 1000)} cm³
                            </td>
                            <td className="px-4 py-2.5 text-right text-text">
                              {Math.round(currentEngine!.displacement * 1000)} cm³
                            </td>
                            <td className="px-4 py-2.5 text-right text-text-subtle">—</td>
                          </tr>
                          {/* Мощность */}
                          <tr className="border-b border-white/5">
                            <td className="px-5 py-2.5 text-text-muted">Мощность</td>
                            <td className="px-4 py-2.5 text-right text-text font-medium">
                              {currentEngine!.hp} л.с.
                            </td>
                            <td className={`px-4 py-2.5 text-right font-bold ${info.accent}`}>
                              {hpAfter} л.с.
                              {!stageAvailable && (
                                <span className="text-xs font-normal opacity-70">*</span>
                              )}
                            </td>
                            <td className={`px-4 py-2.5 text-right text-xs font-bold ${info.accent}`}>
                              +{hpGain} л.с.
                            </td>
                          </tr>
                          {/* Момент */}
                          {nmBefore && (
                            <tr className="border-b border-white/5">
                              <td className="px-5 py-2.5 text-text-muted">Момент</td>
                              <td className="px-4 py-2.5 text-right text-text font-medium">
                                {nmBefore} Нм
                              </td>
                              <td className={`px-4 py-2.5 text-right font-bold ${info.accent}`}>
                                {nmAfter ?? '—'} Нм
                                {!stageData?.nm && nmAfter && (
                                  <span className="text-xs font-normal opacity-70">*</span>
                                )}
                              </td>
                              <td className={`px-4 py-2.5 text-right text-xs font-bold ${info.accent}`}>
                                {nmGain ? `+${nmGain} Нм` : '—'}
                              </td>
                            </tr>
                          )}
                          {/* 0-100 */}
                          {time0Before && (
                            <tr>
                              <td className="px-5 py-2.5 text-text-muted">0–100 км/ч</td>
                              <td className="px-4 py-2.5 text-right text-text font-medium">
                                {time0Before} сек
                              </td>
                              <td className={`px-4 py-2.5 text-right font-bold ${info.accent}`}>
                                {time0After ? `${time0After} сек` : '—'}
                              </td>
                              <td className={`px-4 py-2.5 text-right text-xs font-bold ${info.accent}`}>
                                {time0After
                                  ? `−${(time0Before - time0After).toFixed(1)} сек`
                                  : '—'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {!stageAvailable && (
                        <div className="px-5 py-2 bg-bg/30 text-xs text-text-subtle flex items-center gap-1.5">
                          <Info className="size-3 shrink-0" />
                          * Данные расчётные — уточним при записи под ваш конкретный автомобиль
                        </div>
                      )}
                    </div>

                    {/* Дополнительные опции */}
                    <div className="rounded-xl border border-border bg-bg-elevated overflow-hidden">
                      <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="w-full flex items-center justify-between gap-2 px-5 py-4 hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Settings2 className="size-4 text-text-subtle" />
                          <span className="text-sm font-medium text-text-muted">
                            Дополнительные опции
                          </span>
                          {selectedOptions.size > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-bold">
                              {selectedOptions.size}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`size-4 text-text-subtle transition-transform ${
                            showOptions ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {showOptions && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2 border-t border-border">
                              {EXTRA_OPTIONS.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => toggleOption(opt.id)}
                                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors
                                    ${
                                      selectedOptions.has(opt.id)
                                        ? 'border-accent/50 bg-accent/5'
                                        : 'border-border bg-bg hover:border-accent/20'
                                    }`}
                                >
                                  <div
                                    className={`mt-0.5 w-4 h-4 rounded shrink-0 border flex items-center justify-center
                                      ${
                                        selectedOptions.has(opt.id)
                                          ? 'bg-accent border-accent'
                                          : 'border-border'
                                      }`}
                                  >
                                    {selectedOptions.has(opt.id) && (
                                      <Check className="size-2.5 text-bg" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div
                                      className={`text-xs font-semibold ${
                                        selectedOptions.has(opt.id)
                                          ? 'text-accent'
                                          : 'text-text-muted'
                                      }`}
                                    >
                                      {opt.label}
                                    </div>
                                    <div className="text-xs text-text-subtle mt-0.5 leading-relaxed">
                                      {opt.desc}
                                    </div>
                                  </div>
                                  <div
                                    className={`text-xs font-bold shrink-0 ${
                                      selectedOptions.has(opt.id)
                                        ? 'text-accent'
                                        : 'text-text-subtle'
                                    }`}
                                  >
                                    +{opt.price.toLocaleString('ru-RU')} ₽
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Правая: ценовая карточка */}
                  <div className="lg:col-span-2">
                    <div className={`rounded-2xl border-2 bg-gradient-to-br ${info.color} ${info.border} p-5 space-y-4 sticky top-6`}>
                      {/* Цена */}
                      <div>
                        <div className="text-text-subtle text-xs uppercase tracking-wider mb-1">
                          Стоимость {info.label}
                        </div>
                        {priceHasDiscount && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-text-subtle text-sm line-through">
                              {stagePrice.toLocaleString('ru-RU')} ₽
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold">
                              −25%
                            </span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className={`font-display text-4xl font-bold ${info.accent}`}>
                            {displayPrice.toLocaleString('ru-RU')}
                          </span>
                          <span className="text-text-muted text-xl">₽</span>
                        </div>
                        {priceHasDiscount && (
                          <div className="text-xs text-text-subtle mt-1">
                            Скидка за предварительный расчёт
                          </div>
                        )}
                      </div>

                      {selectedOptions.size > 0 && (
                        <div className="rounded-lg bg-bg/40 p-3">
                          <div className="text-xs text-text-subtle mb-1">Итог со всеми опциями</div>
                          <div className={`text-xl font-bold ${info.accent}`}>
                            {grandTotal.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      )}

                      <div className={`text-xs ${info.accent} opacity-80`}>{info.descDetail}</div>

                      {/* Включено */}
                      <div className="space-y-1.5">
                        {[
                          'Официальное ПО Alientech KESS3',
                          'Сохранение оригинального файла',
                          'Откат к стоку — бесплатно',
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-text-muted">
                            <Check className={`size-3 shrink-0 ${info.accent}`} />
                            {item}
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() =>
                            openBooking(
                              `${currentBrand?.name} ${currentSeries?.name} ${currentEngine?.code} ${info.label}`
                            )
                          }
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-bg font-bold text-sm hover:bg-accent/90 transition-colors"
                        >
                          Записаться по этой цене
                          <ArrowRight className="size-4" />
                        </button>
                        <a
                          href="tel:+79818428151"
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border/60 bg-bg/40 text-text-muted text-sm hover:border-accent/40 transition-colors"
                        >
                          <Phone className="size-4" />
                          +7 (981) 842-81-51
                        </a>
                      </div>

                      <p className="text-text-subtle text-xs text-center">
                        Цена фиксируется при записи. Без скрытых доплат.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── Вспомогательные компоненты ───────────────────────────────────────────────

function StepHeader({
  icon,
  title,
  subtitle,
  onBack,
  backLabel,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-2">
      {onBack && (
        <button
          onClick={onBack}
          className="mt-0.5 flex items-center gap-1 text-xs text-text-subtle hover:text-accent transition-colors shrink-0"
        >
          <ChevronLeft className="size-3.5" />
          {backLabel}
        </button>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-accent">{icon}</span>
          <h3 className="text-lg font-bold text-text">{title}</h3>
        </div>
        {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function StageCard({
  stageKey,
  info,
  engine,
  selected,
  onSelect,
  hpAfter,
  nmAfter,
  time0After,
  hasRealData,
  withDiscount = false,
  basePrice,
}: {
  stageKey: StageKey;
  info: (typeof STAGE_INFO)[StageKey];
  engine: Engine;
  selected: boolean;
  onSelect: () => void;
  hpAfter: number;
  nmAfter?: number;
  time0After?: number;
  hasRealData: boolean;
  withDiscount?: boolean;
  basePrice?: number;
}) {
  const STAGE_PRICE_MULT_LOCAL: Record<StageKey, number> = {
    stage1: 1.0,
    stage2: 1.4,
    stage3: 2.0,
  };
  const bp = basePrice ?? 25000;
  const rawPrice = Math.round(bp * STAGE_PRICE_MULT_LOCAL[stageKey]);
  const price = withDiscount ? Math.round(rawPrice * 0.75) : rawPrice;
  const hpGain = hpAfter - engine.hp;
  const nmGain = nmAfter && engine.nm ? nmAfter - engine.nm : undefined;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
        selected
          ? `border-2 ${info.border} bg-gradient-to-br ${info.color}`
          : 'border-border bg-bg-elevated hover:border-accent/30'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${info.dot}`} />
            <span className={`font-bold text-sm ${info.accent}`}>{info.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full bg-bg/60 ${info.accent}`}>
              {info.badge}
            </span>
            {!hasRealData && stageKey !== 'stage1' && (
              <span className="text-xs text-text-subtle opacity-60">~оценка</span>
            )}
          </div>
          <div className="text-xs text-text-muted mb-3">{info.desc}</div>
          <div className="flex flex-wrap gap-4">
            <div>
              <div className="text-xs text-text-subtle">Мощность</div>
              <div className={`text-sm font-bold ${info.accent}`}>
                {engine.hp} → {hpAfter} л.с.
                <span className="ml-1 text-xs font-normal opacity-80">+{hpGain}</span>
              </div>
            </div>
            {engine.nm && nmAfter && (
              <div>
                <div className="text-xs text-text-subtle">Момент</div>
                <div className={`text-sm font-bold ${info.accent}`}>
                  {engine.nm} → {nmAfter} Нм
                  {nmGain && (
                    <span className="ml-1 text-xs font-normal opacity-80">+{nmGain}</span>
                  )}
                </div>
              </div>
            )}
            {engine.time0_100 && time0After && (
              <div>
                <div className="text-xs text-text-subtle">0–100</div>
                <div className={`text-sm font-bold ${info.accent}`}>
                  {engine.time0_100} → {time0After} с
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          {withDiscount && (
            <div className="text-xs text-text-subtle line-through mb-0.5">
              {rawPrice.toLocaleString('ru-RU')} ₽
            </div>
          )}
          <div className={`text-xl font-bold ${info.accent}`}>
            {price.toLocaleString('ru-RU')} ₽
          </div>
          {withDiscount && (
            <div className="text-xs px-1.5 py-0.5 rounded bg-accent/15 text-accent font-bold mt-0.5">
              −25%
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
