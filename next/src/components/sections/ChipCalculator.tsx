'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 ChevronRight, ChevronLeft, Zap, Check, Download,
 Info, Settings, Gauge, ListChecks, Trophy, Phone
} from 'lucide-react';
import chipData from '@/data/chip-engines.json';
import { openBooking } from '@/lib/autodealer';

// ─── Типы ────────────────────────────────────────────────────────────────────

interface Engine {
 id: string;
 name: string;
 hp: number;
 torque: number;
 stage1Hp: number;
 stage1Torque: number;
 stage1Price: number;
 stage2Price: number | null;
 stage3Price: number | null;
}

interface Model {
 id: string;
 name: string;
 engines: Engine[];
}

interface Brand {
 id: string;
 name: string;
 multiplier: number;
 models: Model[];
}

interface Addon {
 id: string;
 name: string;
 price: number;
 desc: string;
}

type Stage = 'stage1' | 'stage2' | 'stage3';

const STEPS = ['Марка', 'Модель', 'Двигатель', 'Стейдж', 'Опции', 'Результат'];

const BRANDS = chipData.brands as Brand[];
const ADDONS = chipData.addons as Addon[];

const fmt = (n: number) =>
 n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

// Метрики
const trackEvent = (name: string, params?: Record<string, string | number>) => {
 if (typeof window !== 'undefined' && 'ym' in window) {
 // @ts-ignore
 window.ym(12345678, 'reachGoal', name, params);
 }
};

// ─── Шаг-индикатор ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
 return (
 <div className="flex items-center justify-between mb-8 px-1">
 {STEPS.map((label, i) => (
 <div key={label} className="flex items-center">
 <div className="flex flex-col items-center gap-1">
 <motion.div
 animate={{
 backgroundColor: i < current ? '#39FF14' : i === current ? '#39FF14' : 'transparent',
 borderColor: i <= current ? '#39FF14' : '#444',
 scale: i === current ? 1.15 : 1,
 }}
 transition={{ duration: 0.3 }}
 className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
 style={{ color: i <= current ? '#0A0A0A' : '#666' }}
 >
 {i < current ? <Check className="size-3.5" /> : i + 1}
 </motion.div>
 <span className={`text-[10px] hidden sm:block font-medium ${
 i === current ? 'text-[#39FF14]' : i < current ? 'text-text-muted' : 'text-text-subtle'
 }`}>
 {label}
 </span>
 </div>
 {i < STEPS.length - 1 && (
 <div
 className="flex-1 h-px mx-1 sm:mx-2 mt-[-12px]"
 style={{ backgroundColor: i < current ? '#39FF14' : '#333' }}
 />
 )}
 </div>
 ))}
 </div>
 );
}

// ─── Карточка выбора ──────────────────────────────────────────────────────────

function SelectCard({
 children, selected, onClick, disabled,
}: {
 children: React.ReactNode;
 selected?: boolean;
 onClick: () => void;
 disabled?: boolean;
}) {
 return (
 <motion.button
 onClick={onClick}
 disabled={disabled}
 whileHover={!disabled ? { scale: 1.02 } : {}}
 whileTap={!disabled ? { scale: 0.98 } : {}}
 className={`text-left w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
 selected
 ? 'border-[#39FF14] bg-[#39FF14]/10 shadow-[0_0_20px_rgba(57,255,20,0.2)]'
 : disabled
 ? 'border-border bg-surface/50 opacity-40 cursor-not-allowed'
 : 'border-border bg-surface hover:border-[#39FF14]/50 hover:bg-surface-hover cursor-pointer'
 }`}
 >
 {children}
 </motion.button>
 );
}

// ─── Слайд-анимация ───────────────────────────────────────────────────────────

const slideVariants = {
 enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
 center: { x: 0, opacity: 1 },
 exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// ─── Главный компонент ────────────────────────────────────────────────────────

export function ChipCalculator() {
 const [step, setStep] = useState(0);
 const [dir, setDir] = useState(1);

 const [brandId, setBrandId] = useState<string | null>(null);
 const [modelId, setModelId] = useState<string | null>(null);
 const [engineId, setEngineId] = useState<string | null>(null);
 const [stage, setStage] = useState<Stage | null>(null);
 const [addons, setAddons] = useState<Set<string>>(new Set());

 const brand = useMemo(() => BRANDS.find((b) => b.id === brandId) ?? null, [brandId]);
 const model = useMemo(() => brand?.models.find((m) => m.id === modelId) ?? null, [brand, modelId]);
 const engine = useMemo(() => model?.engines.find((e) => e.id === engineId) ?? null, [model, engineId]);

 const stagePrice = useMemo(() => {
 if (!engine || !stage) return 0;
 const base =
 stage === 'stage1' ? engine.stage1Price :
 stage === 'stage2' ? (engine.stage2Price ?? 0) :
 (engine.stage3Price ?? 0);
 return Math.round(base * (brand?.multiplier ?? 1) / 100) * 100;
 }, [engine, stage, brand]);

 const addonsTotal = useMemo(() => {
 return ADDONS.filter((a) => addons.has(a.id)).reduce((s, a) => s + a.price, 0);
 }, [addons]);

 const totalPrice = stagePrice + addonsTotal;

 const resultHp = useMemo(() => {
 if (!engine || !stage) return 0;
 if (stage === 'stage1') return engine.stage1Hp;
 if (stage === 'stage2') return Math.round(engine.stage1Hp * 1.15);
 return Math.round(engine.stage1Hp * 1.32);
 }, [engine, stage]);

 const resultTorque = useMemo(() => {
 if (!engine || !stage) return 0;
 if (stage === 'stage1') return engine.stage1Torque;
 if (stage === 'stage2') return Math.round(engine.stage1Torque * 1.18);
 return Math.round(engine.stage1Torque * 1.38);
 }, [engine, stage]);

 const stageInfo = useMemo(() => chipData.stages[stage ?? 'stage1'], [stage]);

 const goNext = useCallback(() => {
 setDir(1);
 setStep((s) => Math.min(s + 1, STEPS.length - 1));
 if (step === 0) trackEvent('chip_calc_start');
 if (step === 4) trackEvent('chip_calc_result', { brand: brandId ?? '', stage: stage ?? '', price: totalPrice });
 }, [step, brandId, stage, totalPrice]);

 const goPrev = useCallback(() => {
 setDir(-1);
 setStep((s) => Math.max(s - 1, 0));
 }, []);

 const toggleAddon = (id: string) => {
 setAddons((prev) => {
 const n = new Set(prev);
 n.has(id) ? n.delete(id) : n.add(id);
 return n;
 });
 };

 const canNext = useMemo(() => {
 if (step === 0) return !!brandId;
 if (step === 1) return !!modelId;
 if (step === 2) return !!engineId;
 if (step === 3) return !!stage;
 return true;
 }, [step, brandId, modelId, engineId, stage]);

 const handleBooking = () => {
 trackEvent('chip_calc_to_booking', { brand: brandId ?? '', stage: stage ?? '' });
 openBooking();
 };

 const handlePdf = () => {
 trackEvent('chip_calc_pdf');
 window.print();
 };

 return (
 <section id="chip-calculator" className="section bg-background-alt">
 <div className="container max-w-4xl">
 <div className="text-center mb-10">
 <span className="badge badge-primary mb-3">
 <Zap className="size-3.5" />
 Онлайн-калькулятор
 </span>
 <h2 className="heading-2 mb-3">Узнай прирост мощности и цену</h2>
 <p className="text-text-muted text-base max-w-xl mx-auto">
 Выберите марку, модель и двигатель — получите точный расчёт за 30 секунд
 </p>
 </div>

 <div className="card p-6 sm:p-8">
 <StepIndicator current={step} />

 <div className="overflow-hidden min-h-[320px]">
 <AnimatePresence mode="wait" custom={dir}>
 <motion.div
 key={step}
 custom={dir}
 variants={slideVariants}
 initial="enter"
 animate="center"
 exit="exit"
 transition={{ duration: 0.3, ease: 'easeInOut' }}
 >
 {/* ШАГ 0 — Марка */}
 {step === 0 && (
 <div>
 <h3 className="font-semibold text-text mb-5 flex items-center gap-2">
 <Settings className="size-4 text-[#39FF14]" />
 Выберите марку автомобиля
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
 {BRANDS.map((b) => (
 <SelectCard
 key={b.id}
 selected={brandId === b.id}
 onClick={() => {
 setBrandId(b.id);
 setModelId(null);
 setEngineId(null);
 setStage(null);
 }}
 >
 <div className="font-semibold text-sm text-text">{b.name}</div>
 <div className="text-xs text-text-subtle mt-1">{b.models.length} моделей</div>
 </SelectCard>
 ))}
 </div>
 </div>
 )}

 {/* ШАГ 1 — Модель */}
 {step === 1 && (
 <div>
 <h3 className="font-semibold text-text mb-5 flex items-center gap-2">
 <Settings className="size-4 text-[#39FF14]" />
 Выберите модель <span className="text-[#39FF14]">{brand?.name}</span>
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {(brand?.models ?? []).map((m) => (
 <SelectCard
 key={m.id}
 selected={modelId === m.id}
 onClick={() => {
 setModelId(m.id);
 setEngineId(null);
 setStage(null);
 }}
 >
 <div className="font-semibold text-sm text-text">{m.name}</div>
 <div className="text-xs text-text-subtle mt-1">{m.engines.length} двигателей</div>
 </SelectCard>
 ))}
 </div>
 </div>
 )}

 {/* ШАГ 2 — Двигатель */}
 {step === 2 && (
 <div>
 <h3 className="font-semibold text-text mb-5 flex items-center gap-2">
 <Gauge className="size-4 text-[#39FF14]" />
 Выберите двигатель
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {(model?.engines ?? []).map((e) => (
 <SelectCard
 key={e.id}
 selected={engineId === e.id}
 onClick={() => {
 setEngineId(e.id);
 setStage(null);
 }}
 >
 <div className="font-semibold text-sm text-text">{e.name}</div>
 <div className="flex gap-3 mt-2 text-xs text-text-subtle">
 <span>⚡ {e.hp} л.с.</span>
 <span>🔩 {e.torque} Нм</span>
 </div>
 <div className="text-xs text-text-subtle mt-1">
 Stage 1 от {fmt(e.stage1Price)}
 </div>
 </SelectCard>
 ))}
 </div>
 </div>
 )}

 {/* ШАГ 3 — Стейдж */}
 {step === 3 && (
 <div>
 <h3 className="font-semibold text-text mb-5 flex items-center gap-2">
 <Trophy className="size-4 text-[#39FF14]" />
 Выберите уровень тюнинга
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {(['stage1', 'stage2', 'stage3'] as Stage[]).map((s, i) => {
 const prices = [engine?.stage1Price, engine?.stage2Price, engine?.stage3Price];
 const price = prices[i];
 const hpGains = [engine?.stage1Hp, Math.round((engine?.stage1Hp ?? 0) * 1.15), Math.round((engine?.stage1Hp ?? 0) * 1.32)];
 const isAvail = price !== null && price !== undefined;
 const stageData = chipData.stages[s];
 return (
 <SelectCard
 key={s}
 selected={stage === s}
 onClick={() => isAvail && setStage(s)}
 disabled={!isAvail}
 >
 <div className={`text-sm font-bold mb-1 ${
 s === 'stage3' ? 'text-orange-400' :
 s === 'stage2' ? 'text-blue-400' : 'text-[#39FF14]'
 }`}>
 {stageData.name}
 {!isAvail && <span className="ml-2 text-xs text-text-subtle">(недоступно)</span>}
 </div>
 <div className="text-xs text-text-muted leading-relaxed mb-2">{stageData.description}</div>
 {isAvail && (
 <>
 <div className="text-base font-bold text-text mt-2">
 {fmt(Math.round((price ?? 0) * (brand?.multiplier ?? 1) / 100) * 100)}
 </div>
 <div className="text-xs text-[#39FF14] mt-1">↑ до {hpGains[i]} л.с.</div>
 <div className="text-xs text-text-subtle mt-1">⏱ {stageData.time}</div>
 </>
 )}
 </SelectCard>
 );
 })}
 </div>
 </div>
 )}

 {/* ШАГ 4 — Опции */}
 {step === 4 && (
 <div>
 <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
 <ListChecks className="size-4 text-[#39FF14]" />
 Дополнительные опции
 <span className="text-xs text-text-subtle font-normal">(необязательно)</span>
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
 {ADDONS.map((addon) => (
 <button
 key={addon.id}
 onClick={() => toggleAddon(addon.id)}
 className={`text-left p-4 rounded-xl border-2 transition-all ${
 addons.has(addon.id)
 ? 'border-[#39FF14] bg-[#39FF14]/10'
 : 'border-border bg-surface hover:border-[#39FF14]/40'
 }`}
 >
 <div className="flex items-center justify-between mb-1">
 <span className="font-semibold text-sm text-text">{addon.name}</span>
 <span className="text-[#39FF14] text-sm font-bold">+{fmt(addon.price)}</span>
 </div>
 <p className="text-xs text-text-subtle leading-relaxed">{addon.desc}</p>
 </button>
 ))}
 </div>
 <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-surface border border-border text-xs text-text-subtle">
 <Info className="size-4 shrink-0 mt-0.5 text-text-muted" />
 Часть опций доступна только для определённых двигателей. Уточним при записи.
 </div>
 </div>
 )}

 {/* ШАГ 5 — Результат */}
 {step === 5 && engine && stage && (
 <div>
 <div className="text-center mb-6">
 <motion.div
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ delay: 0.1 }}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 mb-4"
 >
 <Zap className="size-4 text-[#39FF14]" />
 <span className="text-[#39FF14] font-bold text-sm">Расчёт готов</span>
 </motion.div>
 <h3 className="heading-3 text-text mb-1">{brand?.name} {model?.name}</h3>
 <p className="text-text-muted text-sm">{engine.name} · {stageInfo?.name}</p>
 </div>

 {/* Таблица до/после */}
 <div className="grid grid-cols-2 gap-4 mb-6">
 <div className="card bg-surface p-5 text-center">
 <p className="text-xs text-text-subtle mb-2 uppercase tracking-wide">До тюнинга</p>
 <div className="text-3xl font-display font-bold text-text-muted">{engine.hp}</div>
 <div className="text-xs text-text-subtle">л.с.</div>
 <div className="text-xl font-bold text-text-muted mt-2">{engine.torque}</div>
 <div className="text-xs text-text-subtle">Нм</div>
 </div>
 <div className="card bg-[#39FF14]/5 border-[#39FF14]/30 p-5 text-center">
 <p className="text-xs text-[#39FF14] mb-2 uppercase tracking-wide">После тюнинга</p>
 <div
 className="text-3xl font-display font-bold text-[#39FF14]"
 style={{ textShadow: '0 0 30px rgba(57,255,20,0.5)' }}
 >
 {resultHp}
 </div>
 <div className="text-xs text-[#39FF14]/70">л.с.</div>
 <div className="text-xl font-bold text-[#39FF14] mt-2">{resultTorque}</div>
 <div className="text-xs text-[#39FF14]/70">Нм</div>
 </div>
 </div>

 {/* Прирост */}
 <div className="grid grid-cols-2 gap-3 mb-5">
 <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border">
 <Zap className="size-5 text-[#39FF14] shrink-0" />
 <div>
 <div className="text-xs text-text-subtle">Прирост мощности</div>
 <div className="font-bold text-text">+{resultHp - engine.hp} л.с.</div>
 </div>
 </div>
 <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border">
 <Gauge className="size-5 text-blue-400 shrink-0" />
 <div>
 <div className="text-xs text-text-subtle">Прирост момента</div>
 <div className="font-bold text-text">+{resultTorque - engine.torque} Нм</div>
 </div>
 </div>
 </div>

 {/* Цена */}
 <div className="px-5 py-4 rounded-2xl bg-surface border border-border mb-5">
 <div className="flex justify-between text-sm mb-2">
 <span className="text-text-muted">{stageInfo?.name}</span>
 <span className="text-text font-semibold">{fmt(stagePrice)}</span>
 </div>
 {addonsTotal > 0 && (
 <div className="flex justify-between text-sm mb-2">
 <span className="text-text-muted">Доп. опции ({addons.size})</span>
 <span className="text-text font-semibold">+{fmt(addonsTotal)}</span>
 </div>
 )}
 <div className="border-t border-border pt-3 flex justify-between items-center">
 <span className="font-semibold text-text">Итого</span>
 <span
 className="text-2xl font-display font-bold text-[#39FF14]"
 style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
 >
 {fmt(totalPrice)}
 </span>
 </div>
 </div>
 <div className="flex flex-wrap gap-2 mb-6">
 {[
`Время работы: ${stageInfo?.time}`,
 'Оборудование Alientech',
 'Дипломированные специалисты',
 ].map((item) => (
 <span key={item} className="flex items-center gap-1.5 text-xs text-text-muted px-3 py-1.5 rounded-full bg-surface border border-border">
 <Check className="size-3 text-[#39FF14]" />
 {item}
 </span>
 ))}
 </div>

 {/* CTA кнопки */}
 <div className="flex flex-col sm:flex-row gap-3">
 <button
 onClick={handleBooking}
 className="btn-primary flex-1 flex items-center justify-center gap-2"
 >
 <Phone className="size-4" />
 Записаться на чип-тюнинг
 </button>
 <button
 onClick={handlePdf}
 className="btn-outline flex items-center justify-center gap-2 sm:w-auto px-5"
 >
 <Download className="size-4" />
 PDF
 </button>
 </div>

 <button
 onClick={() => {
 setStep(0);
 setDir(-1);
 setBrandId(null);
 setModelId(null);
 setEngineId(null);
 setStage(null);
 setAddons(new Set());
 }}
 className="w-full mt-3 text-sm text-text-subtle hover:text-text transition-colors"
 >
 ← Рассчитать для другого автомобиля
 </button>
 </div>
 )}
 </motion.div>
 </AnimatePresence>
 </div>

 {/* Навигация */}
 {step < 5 && (
 <div className="flex justify-between items-center mt-8 pt-5 border-t border-border">
 <button
 onClick={goPrev}
 disabled={step === 0}
 className="flex items-center gap-2 text-sm text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
 >
 <ChevronLeft className="size-4" />
 Назад
 </button>

 <div className="text-xs text-text-subtle">
 Шаг {step + 1} из {STEPS.length}
 </div>

 <button
 onClick={goNext}
 disabled={!canNext}
 className={`flex items-center gap-2 text-sm font-semibold transition-all ${
 canNext
 ? 'text-[#39FF14] hover:text-[#39FF14]/80'
 : 'text-text-subtle cursor-not-allowed opacity-40'
 }`}
 >
 {step === 4 ? 'Получить результат' : 'Далее'}
 <ChevronRight className="size-4" />
 </button>
 </div>
 )}
 </div>
 </div>
 </section>
 );
}
