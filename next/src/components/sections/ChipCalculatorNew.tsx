'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Check,
  Search, Phone, Gauge,
  TrendingUp, RotateCcw, Star, BadgePercent, ChevronDown
} from 'lucide-react';
// Данные взяты из публичного источника прайсов, названия источника не публикуем
import sfData from '@/data/sevenforce-parsed.json';
import { openBooking } from '@/lib/autodealer';

// ─── Типы ─────────────────────────────────────────────────────────────────────

interface SFVariant {
  id: string;
  label: string;
  hp: number;
  our_price: number;
  competitor_price: number;
  sevenforce_url?: string;
  stages?: {
    stage1?: { our?: number; ours?: number; competitor: number };
    stage2?: { our?: number; ours?: number; competitor: number };
    stage3?: { our?: number; ours?: number; competitor: number };
  };
}

interface SFModel {
  slug: string;
  name: string;
  variants: SFVariant[];
}

interface SFBrand {
  name: string;
  slug: string;
  models: SFModel[];
}

type StageKey = 'stage1' | 'stage2' | 'stage3';

// ─── Данные ───────────────────────────────────────────────────────────────────

const ALL_BRANDS = (sfData as { brands: SFBrand[] }).brands;

// Иконки брендов (emoji как fallback)
const BRAND_ICONS: Record<string, string> = {
  bmw: '🔵',
  mercedes: '⭐',
  audi: '🔴',
  porsche: '🏎',
  'land-rover': '🦁',
  volkswagen: '🟢',
  volvo: '🇸🇪',
  toyota: '🔺',
  lexus: '🔷',
  kia: '🟡',
  hyundai: '🔶',
  nissan: '⚫',
  mini: '🏁',
  skoda: '✈️',
  jaguar: '🐆',
  mitsubishi: '💎',
  mazda: '🔘',
  subaru: '⚡',
  infiniti: '∞',
  ford: '🔵',
  jeep: '🏔',
  bentley: '👑',
  maserati: '🔱',
  seat: '🟠',
  'alfa-romeo': '🍀',
  ferrari: '🐴',
  lamborghini: '🐂',
  opel: '⚡',
  renault: '💠',
  genesis: '🌟',
  cadillac: '🦅',
  saab: '✈️',
  mclaren: '🧡',
};

const STAGE_COLORS: Record<StageKey, string> = {
  stage1: '#39FF14',
  stage2: '#00BFFF',
  stage3: '#FF6B35',
};

const STAGE_LABELS: Record<StageKey, string> = {
  stage1: 'Stage 1',
  stage2: 'Stage 2',
  stage3: 'Stage 3',
};

const STAGE_DESC: Record<StageKey, string> = {
  stage1: 'Программная прошивка ЭБУ без замены деталей. Прирост мощности +15–30%.',
  stage2: 'Прошивка + доработка впуска/выпуска. Прирост мощности +25–50%.',
  stage3: 'Глубокий тюнинг с заменой турбины и форсунок. Прирост мощности +50–100%.',
};

const fmt = (n: number) =>
  n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

// ─── Вспомогательные компоненты ───────────────────────────────────────────────

function SearchInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#39FF14]/60 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          ×
        </button>
      )}
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
};

// ─── Главный компонент ────────────────────────────────────────────────────────

export function ChipCalculatorNew() {
  // Состояния выбора
  const [selectedBrand, setSelectedBrand] = useState<SFBrand | null>(null);
  const [selectedModel, setSelectedModel] = useState<SFModel | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<SFVariant | null>(null);
  const [selectedStage, setSelectedStage] = useState<StageKey>('stage1');

  // Поиск
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [variantSearch, setVariantSearch] = useState('');

  // UI состояние
  const [showResult, setShowResult] = useState(false);
  const [openSection, setOpenSection] = useState<'brand' | 'model' | 'variant' | 'stage'>('brand');

  // Фильтрованные списки
  const filteredBrands = useMemo(() =>
    ALL_BRANDS.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase())),
    [brandSearch]
  );

  const filteredModels = useMemo(() => {
    if (!selectedBrand) return [];
    return selectedBrand.models.filter(m =>
      m.name.toLowerCase().includes(modelSearch.toLowerCase())
    );
  }, [selectedBrand, modelSearch]);

  const filteredVariants = useMemo(() => {
    if (!selectedModel) return [];
    return selectedModel.variants.filter(v =>
      v.label.toLowerCase().includes(variantSearch.toLowerCase())
    );
  }, [selectedModel, variantSearch]);

  // Текущая цена в зависимости от стейджа
  const currentPrice = useMemo(() => {
    if (!selectedVariant) return null;
    const stages = selectedVariant.stages;
    if (stages && stages[selectedStage]) {
      return {
        our: stages[selectedStage]!.our ?? stages[selectedStage]!.ours ?? selectedVariant.our_price,
        competitor: stages[selectedStage]!.competitor,
      };
    }
    return {
      our: selectedVariant.our_price,
      competitor: selectedVariant.competitor_price,
    };
  }, [selectedVariant, selectedStage]);

  const savings = currentPrice 
    ? currentPrice.competitor - currentPrice.our 
    : 0;

  const handleBrandSelect = (brand: SFBrand) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setSelectedVariant(null);
    setShowResult(false);
    setModelSearch('');
    setVariantSearch('');
    setOpenSection('model');
  };

  const handleModelSelect = (model: SFModel) => {
    setSelectedModel(model);
    setSelectedVariant(null);
    setShowResult(false);
    setVariantSearch('');
    setOpenSection('variant');
  };

  const handleVariantSelect = (variant: SFVariant) => {
    setSelectedVariant(variant);
    setShowResult(true);
    setOpenSection('stage');
  };

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedVariant(null);
    setSelectedStage('stage1');
    setShowResult(false);
    setBrandSearch('');
    setModelSearch('');
    setVariantSearch('');
    setOpenSection('brand');
  };

  const handleBooking = useCallback(() => {
    if (selectedVariant && currentPrice) {
      openBooking(
        `Чип-тюнинг ${STAGE_LABELS[selectedStage]}: ${selectedBrand?.name} ${selectedModel?.name} ${selectedVariant.label}`
      );
    } else {
      openBooking('Чип-тюнинг');
    }
  }, [selectedVariant, currentPrice, selectedStage, selectedBrand, selectedModel]);

  const AccordionSection = ({ 
    id, title, subtitle, children, isLocked 
  }: { 
    id: 'brand' | 'model' | 'variant' | 'stage';
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    isLocked?: boolean;
  }) => {
    const isOpen = openSection === id && !isLocked;
    return (
      <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isLocked 
          ? 'border-border/30 opacity-50' 
          : isOpen 
            ? 'border-[#39FF14]/40 bg-surface' 
            : 'border-border bg-surface/60 hover:border-border-hover cursor-pointer'
      }`}>
        <button
          onClick={() => !isLocked && setOpenSection(id)}
          disabled={isLocked}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div>
            <div className="font-semibold text-text-primary text-sm">{title}</div>
            {subtitle && (
              <div className="text-xs text-text-muted mt-0.5">{subtitle}</div>
            )}
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="size-5 text-text-muted" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="chip-calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full px-4 py-1.5 text-[#39FF14] text-sm font-medium mb-4">
            <BadgePercent className="size-4" />
            {ALL_BRANDS.length} марок · {ALL_BRANDS.reduce((a,b)=>a+b.models.length,0)} моделей
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
            КАЛЬКУЛЯТОР{' '}
            <span className="text-[#39FF14]">ЧИП-ТЮНИНГА</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Реальные цены по каждой марке, модели и двигателю.
            Выберите автомобиль — получите точную стоимость чип-тюнинга.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Левая колонка — выбор */}
          <div className="lg:col-span-3 flex flex-col gap-3">

            {/* Шаг 1 — Марка */}
            <AccordionSection
              id="brand"
              title="1. Выберите марку"
              subtitle={selectedBrand ? `✓ ${selectedBrand.name}` : `${ALL_BRANDS.length} марок доступно`}
            >
              <SearchInput 
                value={brandSearch} 
                onChange={setBrandSearch} 
                placeholder="Поиск марки..." 
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {filteredBrands.map(brand => (
                  <motion.button
                    key={brand.slug}
                    onClick={() => handleBrandSelect(brand)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedBrand?.slug === brand.slug
                        ? 'border-[#39FF14] bg-[#39FF14]/10 text-text-primary shadow-[0_0_15px_rgba(57,255,20,0.15)]'
                        : 'border-border bg-surface/50 text-text-secondary hover:border-[#39FF14]/40 hover:text-text-primary'
                    }`}
                  >
                    <span className="text-base">{BRAND_ICONS[brand.slug] || '🚗'}</span>
                    <span className="truncate">{brand.name}</span>
                    {selectedBrand?.slug === brand.slug && (
                      <Check className="size-3 ml-auto text-[#39FF14] flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </AccordionSection>

            {/* Шаг 2 — Модель */}
            <AccordionSection
              id="model"
              title="2. Выберите модель"
              subtitle={
                !selectedBrand 
                  ? 'Сначала выберите марку' 
                  : selectedModel 
                    ? `✓ ${selectedModel.name}` 
                    : `${selectedBrand.models.length} моделей`
              }
              isLocked={!selectedBrand}
            >
              <SearchInput 
                value={modelSearch} 
                onChange={setModelSearch} 
                placeholder="Поиск модели..." 
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {filteredModels.map(model => (
                  <motion.button
                    key={model.slug}
                    onClick={() => handleModelSelect(model)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                      selectedModel?.slug === model.slug
                        ? 'border-[#39FF14] bg-[#39FF14]/10 text-text-primary'
                        : 'border-border bg-surface/50 text-text-secondary hover:border-[#39FF14]/40 hover:text-text-primary'
                    }`}
                  >
                    <div className="font-semibold truncate">{model.name}</div>
                    <div className="text-xs text-text-muted mt-0.5">{model.variants.length} вар.</div>
                  </motion.button>
                ))}
              </div>
            </AccordionSection>

            {/* Шаг 3 — Двигатель / вариант */}
            <AccordionSection
              id="variant"
              title="3. Выберите двигатель"
              subtitle={
                !selectedModel 
                  ? 'Сначала выберите модель' 
                  : selectedVariant 
                    ? `✓ ${selectedVariant.label}` 
                    : `${selectedModel.variants.length} вариантов`
              }
              isLocked={!selectedModel}
            >
              <SearchInput 
                value={variantSearch} 
                onChange={setVariantSearch} 
                placeholder="Поиск двигателя..." 
              />
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {filteredVariants.map(variant => {
                  const sd1 = variant.stages?.stage1;
                  const price = (sd1?.our ?? sd1?.ours) ?? variant.our_price;
                  const compPrice = variant.stages?.stage1?.competitor ?? variant.competitor_price;
                  const disc = compPrice > 0 ? Math.round((1 - price / compPrice) * 100) : 0;
                  return (
                    <motion.button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-[#39FF14] bg-[#39FF14]/10 shadow-[0_0_12px_rgba(57,255,20,0.12)]'
                          : 'border-border bg-surface/50 hover:border-[#39FF14]/30'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-text-primary">{variant.label}</div>
                        {variant.hp > 0 && (
                          <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                            <Gauge className="size-3" />
                            {variant.hp} л.с.
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="font-bold text-[#39FF14]">{fmt(price)}</div>
                        {disc > 0 && (
                          <div className="text-xs text-text-muted line-through">{fmt(compPrice)}</div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </AccordionSection>

            {/* Шаг 4 — Stage */}
            <AccordionSection
              id="stage"
              title="4. Выберите уровень тюнинга"
              subtitle={selectedVariant ? STAGE_LABELS[selectedStage] : 'Сначала выберите двигатель'}
              isLocked={!selectedVariant}
            >
              <div className="grid grid-cols-3 gap-3">
                {(['stage1', 'stage2', 'stage3'] as StageKey[]).map(stageKey => {
                  const stageData = selectedVariant?.stages?.[stageKey];
                  const price = (stageData?.our ?? stageData?.ours) ?? (stageKey === 'stage1' ? selectedVariant?.our_price : 0);
                  const hasData = !!price && price > 0;
                  
                  return (
                    <motion.button
                      key={stageKey}
                      onClick={() => hasData && setSelectedStage(stageKey)}
                      disabled={!hasData}
                      whileHover={hasData ? { scale: 1.03 } : {}}
                      whileTap={hasData ? { scale: 0.97 } : {}}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedStage === stageKey && hasData
                          ? 'border-opacity-100 shadow-lg'
                          : !hasData
                            ? 'border-border/30 opacity-40 cursor-not-allowed'
                            : 'border-border hover:border-opacity-60'
                      }`}
                      style={{
                        borderColor: selectedStage === stageKey && hasData 
                          ? STAGE_COLORS[stageKey] 
                          : undefined,
                        backgroundColor: selectedStage === stageKey && hasData 
                          ? `${STAGE_COLORS[stageKey]}15` 
                          : undefined,
                        boxShadow: selectedStage === stageKey && hasData
                          ? `0 0 20px ${STAGE_COLORS[stageKey]}25`
                          : undefined,
                      }}
                    >
                      <div 
                        className="font-black text-lg"
                        style={{ color: hasData ? STAGE_COLORS[stageKey] : '#444' }}
                      >
                        {STAGE_LABELS[stageKey]}
                      </div>
                      {hasData && price ? (
                        <div className="text-sm font-bold text-text-primary mt-1">
                          {fmt(price)}
                        </div>
                      ) : (
                        <div className="text-xs text-text-muted mt-1">Недоступно</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-xs text-text-muted mt-3 leading-relaxed">
                {STAGE_DESC[selectedStage]}
              </p>
            </AccordionSection>
          </div>

          {/* Правая колонка — результат */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {showResult && selectedVariant && currentPrice ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-2xl border border-[#39FF14]/30 bg-surface overflow-hidden"
                  >
                    {/* Шапка с брендом */}
                    <div className="bg-gradient-to-br from-[#39FF14]/10 to-transparent p-5 border-b border-border">
                      <div className="text-2xl mb-2">
                        {BRAND_ICONS[selectedBrand?.slug || ''] || '🚗'}
                      </div>
                      <div className="text-xs text-text-muted font-medium uppercase tracking-widest mb-1">
                        {selectedBrand?.name}
                      </div>
                      <div className="font-black text-lg text-text-primary leading-tight">
                        {selectedModel?.name}
                      </div>
                      <div className="text-sm text-text-secondary mt-0.5">
                        {selectedVariant.label}
                      </div>
                      {selectedVariant.hp > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-sm">
                          <Gauge className="size-4 text-[#39FF14]" />
                          <span className="text-text-primary font-semibold">{selectedVariant.hp} л.с.</span>
                          <span className="text-text-muted">стандарт</span>
                        </div>
                      )}
                    </div>

                    {/* Цены */}
                    <div className="p-5 space-y-4">
                      {/* Stage badge */}
                      <div 
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold"
                        style={{ 
                          backgroundColor: `${STAGE_COLORS[selectedStage]}15`,
                          color: STAGE_COLORS[selectedStage],
                          border: `1px solid ${STAGE_COLORS[selectedStage]}40`,
                        }}
                      >
                        <Zap className="size-3.5" />
                        {STAGE_LABELS[selectedStage]}
                      </div>

                      {/* Наша цена */}
                      <div>
                        <div className="text-xs text-text-muted mb-1">Наша цена</div>
                        <div className="text-4xl font-black text-[#39FF14]">
                          {fmt(currentPrice.our)}
                        </div>
                      </div>

                      {/* Сравнение с конкурентом */}
                      {currentPrice.competitor > 0 && (
                        <div className="bg-background rounded-xl p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Рыночная цена</span>
                            <span className="line-through text-text-muted">{fmt(currentPrice.competitor)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-text-secondary">Ваша экономия</span>
                            <span className="text-[#39FF14]">
                              − {fmt(savings)}
                            </span>
                          </div>
                          <div className="h-px bg-border" />
                          <div className="flex justify-between text-xs text-text-muted">
                            <span>Скидка</span>
                            <span className="text-[#39FF14] font-bold">
                              {Math.round((savings / currentPrice.competitor) * 100)}%
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Что входит */}
                      <div className="space-y-2">
                        {[
                          { icon: Zap, text: 'Прошивка ЭБУ Alientech KESS3' },
                          { icon: TrendingUp, text: 'Прирост мощности и тяги' },
                          { icon: Phone, text: 'Консультация перед и после' },
                        ].map(({ icon: Icon, text }) => (
                          <div key={text} className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="size-3 text-[#39FF14]" />
                            </div>
                            <span className="text-text-secondary">{text}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <motion.button
                        onClick={handleBooking}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#39FF14] text-[#0A0A0A] font-black py-4 rounded-xl text-sm hover:brightness-110 transition-all"
                      >
                        Записаться за {fmt(currentPrice.our)}
                      </motion.button>

                      <a
                        href="tel:+79818428151"
                        className="flex items-center justify-center gap-2 w-full border border-border rounded-xl py-3 text-sm text-text-secondary hover:border-[#39FF14]/40 hover:text-text-primary transition-colors"
                      >
                        <Phone className="size-4" />
                        +7 981 842-81-51
                      </a>



                      <p className="text-xs text-text-subtle text-center">
                        Цена действительна 7 дней. Финальная стоимость уточняется при записи.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-border bg-surface/50 p-8 text-center"
                  >
                    {/* Статистика */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {[
                        { value: `${ALL_BRANDS.length}+`, label: 'марок' },
                        { 
                          value: `${ALL_BRANDS.reduce((a, b) => a + b.models.length, 0)}+`, 
                          label: 'моделей' 
                        },
                        { 
                          value: `${ALL_BRANDS.reduce((a, b) => a + b.models.reduce((c, m) => c + m.variants.length, 0), 0)}+`, 
                          label: 'двигателей' 
                        },
                        { value: '25%', label: 'экономия' },
                      ].map(({ value, label }) => (
                        <div key={label} className="bg-surface rounded-xl p-3">
                          <div className="text-2xl font-black text-[#39FF14]">{value}</div>
                          <div className="text-xs text-text-muted mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-text-muted text-sm mb-6">
                      Выберите марку, модель и двигатель — увидите точную цену
                    </div>

                    {/* Преимущества */}
                    <div className="space-y-3 text-left">
                      {[
                        { icon: Star, text: 'Актуальные рыночные цены' },
                        { icon: BadgePercent, text: 'Цены на 25% ниже рынка' },
                        { icon: Star, text: 'Alientech KESS3 · Лицензия' },
                        { icon: Zap, text: 'Прошивка за 1–2 часа' },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                          <Icon className="size-4 text-[#39FF14] flex-shrink-0" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Кнопка сброса */}
              {(selectedBrand || selectedModel) && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleReset}
                  className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors py-2"
                >
                  <RotateCcw className="size-3" />
                  Начать заново
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(57, 255, 20, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(57, 255, 20, 0.4);
        }
      `}</style>
    </section>
  );
}

export default ChipCalculatorNew;
