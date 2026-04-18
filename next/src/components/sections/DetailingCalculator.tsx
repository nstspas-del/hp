'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

// ─── Данные ─────────────────────────────────────────────────────────────────

const CAR_CLASSES = [
 { id: 'small', label: 'Малый класс', sub: 'Toyota Yaris, MINI, Golf', coeff: 1.0 },
 { id: 'medium', label: 'Средний класс', sub: 'BMW 3, Mercedes C, Audi A4', coeff: 1.2 },
 { id: 'business',label: 'Бизнес / кроссовер', sub: 'BMW 5/X5, Mercedes E/GLC, Q7', coeff: 1.4 },
 { id: 'premium', label: 'Премиум / большой SUV', sub: 'BMW 7/X7, Porsche, Bentley, Range Rover', coeff: 1.65 },
];

type ServiceId =
 | 'cleaning_dry' | 'cleaning_wet' | 'cleaning_full'
 | 'polish_1' | 'polish_2' | 'polish_3'
 | 'ceramic_1' | 'ceramic_2'
 | 'ppf_hood' | 'ppf_front' | 'ppf_full'
 | 'tint_front' | 'tint_rear' | 'tint_panorama';

interface Service {
 id: ServiceId;
 group: string;
 label: string;
 desc: string;
 basePrice: number; // цена для малого класса (coeff=1)
 duration: string;
 competitor: number; // цена конкурента Platinum Garage
}

const SERVICES: Service[] = [
 // Химчистка
 {
 id: 'cleaning_dry', group: 'Химчистка салона', label: 'Сухая чистка', desc: 'Пылесос, протирка поверхностей, чистка стёкол изнутри', basePrice: 4000, duration: '3–4 ч', competitor: 4500 },
 { id: 'cleaning_wet', group: 'Химчистка салона', label: 'Влажная чистка', desc: 'Глубокая мойка всех тканевых и пластиковых поверхностей', basePrice: 7000, duration: '5–6 ч', competitor: 7500 },
 { id: 'cleaning_full', group: 'Химчистка салона', label: 'Полная химчистка', desc: 'Экстракторная мойка сидений, потолка, ковров + обработка кожи', basePrice: 11000, duration: '1 день', competitor: 11500 },
 // Полировка
 { id: 'polish_1', group: 'Полировка кузова', label: 'Одношаговая (защита)', desc: 'Устранение лёгких свирлей, нанесение защитного полироля', basePrice: 10000, duration: '1 день', competitor: 10500 },
 { id: 'polish_2', group: 'Полировка кузова', label: 'Двухшаговая (коррекция)', desc: 'Коррекция царапин + финишный защитный слой, блеск +80%', basePrice: 18000, duration: '1–2 дня', competitor: 18500 },
 { id: 'polish_3', group: 'Полировка кузова', label: 'Трёхшаговая (полная)', desc: 'Полная коррекция ЛКП + защита + перед нанесением керамики', basePrice: 27000, duration: '2–3 дня', competitor: 28000 },
 // Керамика
 { id: 'ceramic_1', group: 'Керамическое покрытие', label: '1 слой 9H (1 год)', desc: 'Профессиональная керамика Gyeon Q2 или Ceramic Pro — 1 слой 9H', basePrice: 22000, duration: '1–2 дня', competitor: 23000 },
 { id: 'ceramic_2', group: 'Керамическое покрытие', label: '2 слоя 9H (2+ года)', desc: 'Двойное покрытие Gyeon Q2 или Ceramic Pro — максимальная защита', basePrice: 33000, duration: '2–3 дня', competitor: 34000 },
 // PPF
 { id: 'ppf_hood', group: 'PPF плёнка', label: 'Капот', desc: 'Антигравийная плёнка XPEL/SunTek только на капот', basePrice: 8000, duration: '4–6 ч', competitor: 9000 },
 { id: 'ppf_front', group: 'PPF плёнка', label: 'Полный перед', desc: 'Капот, крылья, бампер, фары, зеркала — полная защита переда', basePrice: 32000, duration: '2–3 дня', competitor: 33000 },
 { id: 'ppf_full', group: 'PPF плёнка', label: 'Полный кузов', desc: 'Все наружные панели кузова — максимальная защита от сколов и царапин', basePrice: 95000, duration: '5–7 дней', competitor: 96000 },
 // Тонировка
 { id: 'tint_front', group: 'Тонировка', label: 'Передние стёкла', desc: 'Тонировочная плёнка LLUMAR/SunTek на передние боковые', basePrice: 3500, duration: '2 ч', competitor: 4000 },
 { id: 'tint_rear', group: 'Тонировка', label: 'Все боковые + заднее', desc: 'Тонировка всех боковых стёкол и заднего', basePrice: 6000, duration: '3–4 ч', competitor: 6500 },
 { id: 'tint_panorama', group: 'Тонировка', label: 'Панорамная крыша', desc: 'Тонировочная плёнка на панорамный люк/крышу', basePrice: 5500, duration: '3 ч', competitor: 6000 },
];

const GROUPS = Array.from(new Set(SERVICES.map((s) => s.group)));

// ─── Компонент ────────────────────────────────────────────────────────────────

export function DetailingCalculator() {
 const [carClass, setCarClass] = useState<string | null>(null);
 const [selected, setSelected] = useState<Set<ServiceId>>(new Set());
 const [openGroup, setOpenGroup] = useState<string | null>(GROUPS[0]);

 const coeff = useMemo(
 () => CAR_CLASSES.find((c) => c.id === carClass)?.coeff ?? 1,
 [carClass]
 );

 const toggleService = (id: ServiceId) => {
 setSelected((prev) => {
 const next = new Set(prev);
 if (next.has(id)) next.delete(id);
 else next.add(id);
 return next;
 });
 };

 const selectedServices = SERVICES.filter((s) => selected.has(s.id));

 const ourTotal = useMemo(
 () => Math.round(selectedServices.reduce((sum, s) => sum + s.basePrice * coeff, 0) / 100) * 100,
 [selectedServices, coeff]
 );

 const competitorTotal = useMemo(
 () => Math.round(selectedServices.reduce((sum, s) => sum + s.competitor * coeff, 0) / 100) * 100,
 [selectedServices, coeff]
 );

 const savings = competitorTotal - ourTotal;

 const fmt = (n: number) =>
 n.toLocaleString('ru-RU') + ' ₽';

 return (
 <section className="section bg-bg-elevated" id="detailing-calculator">
 <div className="container">
 {/* Заголовок */}
 <motion.div
 className="text-center mb-12"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <span className="badge mb-4">Калькулятор детейлинга</span>
 <h2 className="section-title">РАССЧИТАЙ СТОИМОСТЬ</h2>
 <p className="text-text-muted text-base mt-3 max-w-xl mx-auto">
 Выбери класс автомобиля и нужные услуги — цены на{' '}
 <span className="text-[#39FF14] font-semibold">500–1 000 ₽ ниже</span> конкурентов.
 </p>
 </motion.div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Левая колонка — выбор */}
 <div className="lg:col-span-2 flex flex-col gap-6">

 {/* Шаг 1: Класс авто */}
 <div className="card">
 <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
 <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">1</span>
 Выберите класс автомобиля
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {CAR_CLASSES.map((cls) => (
 <button
 key={cls.id}
 onClick={() => setCarClass(cls.id)}
 className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
 carClass === cls.id
 ? 'border-[#39FF14] bg-[#39FF14]/10 text-text'
 : 'border-border text-text-muted hover:border-[#39FF14]/40'
 }`}
 >
 {carClass === cls.id && (
 <Check className="size-3.5 text-[#39FF14] mb-0.5" />
 )}
 <span className="font-semibold text-sm leading-tight">{cls.label}</span>
 <span className="text-xs text-text-subtle leading-tight">{cls.sub}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Шаг 2: Услуги */}
 <div className="card">
 <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
 <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">2</span>
 Выберите услуги
 </h3>

 <div className="flex flex-col gap-2">
 {GROUPS.map((group) => {
 const groupServices = SERVICES.filter((s) => s.group === group);
 const selectedCount = groupServices.filter((s) => selected.has(s.id)).length;
 const isOpen = openGroup === group;

 return (
 <div key={group} className="border border-border rounded-xl overflow-hidden">
 {/* Шапка группы */}
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-bg-elevated hover:bg-bg-elevated/60 transition-colors text-left"
 onClick={() => setOpenGroup(isOpen ? null : group)}
 >
 <span className="font-semibold text-text text-sm">{group}</span>
 <div className="flex items-center gap-2">
 {selectedCount > 0 && (
 <span className="px-2 py-0.5 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold">
 {selectedCount}
 </span>
 )}
 <ChevronDown
 className={`size-4 text-text-subtle transition-transform ${isOpen ? 'rotate-180' : ''}`}
 />
 </div>
 </button>

 {/* Список услуг */}
 {isOpen && (
 <div className="divide-y divide-border">
 {groupServices.map((service) => {
 const price = Math.round(service.basePrice * coeff / 100) * 100;
 const compPrice = Math.round(service.competitor * coeff / 100) * 100;
 const isChecked = selected.has(service.id);

 return (
 <button
 key={service.id}
 onClick={() => toggleService(service.id)}
 className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
 isChecked ? 'bg-[#39FF14]/5' : 'hover:bg-bg-elevated/40'
 }`}
 >
 {/* Чекбокс */}
 <div
 className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
 isChecked
 ? 'bg-[#39FF14] border-[#39FF14]'
 : 'border-border bg-transparent'
 }`}
 >
 {isChecked && <Check className="size-3 text-black" />}
 </div>

 {/* Инфо */}
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-2 flex-wrap">
 <span className="font-semibold text-sm text-text">{service.label}</span>
 <div className="flex items-center gap-2 shrink-0">
 {carClass && (
 <span className="text-xs text-text-subtle line-through">
 {fmt(compPrice)}
 </span>
 )}
 <span className={`font-bold text-sm ${carClass ? 'text-[#39FF14]' : 'text-text-muted'}`}>
 {carClass ? fmt(price) : 'выберите класс'}
 </span>
 </div>
 </div>
 <div className="text-xs text-text-subtle mt-0.5 leading-relaxed">
 {service.desc}
 </div>
 <div className="text-xs text-text-subtle mt-1">
 ⏱ {service.duration}
 </div>
 </div>
 </button>
 );
 })}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Правая колонка — итог */}
 <div className="lg:col-span-1">
 <div className="card sticky top-24 flex flex-col gap-5">
 <h3 className="text-base font-semibold text-text flex items-center gap-2">
 <Sparkles className="size-4 text-[#39FF14]" />
 Итоговый расчёт
 </h3>

 {selectedServices.length === 0 && (
 <p className="text-text-subtle text-sm text-center py-6">
 Выберите услуги, чтобы увидеть стоимость
 </p>
 )}

 {selectedServices.length > 0 && (
 <>
 {/* Список */}
 <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
 {selectedServices.map((s) => {
 const price = Math.round(s.basePrice * coeff / 100) * 100;
 return (
 <div key={s.id} className="flex justify-between items-start gap-2 text-sm">
 <span className="text-text-muted leading-tight">{s.label}</span>
 <span className="font-semibold text-text shrink-0">{fmt(price)}</span>
 </div>
 );
 })}
 </div>

 <div className="border-t border-border pt-4 flex flex-col gap-3">
 {savings > 0 && (
 <div className="flex justify-between text-sm">
 <span className="text-text-muted">У конкурентов</span>
 <span className="text-text-subtle line-through">{fmt(competitorTotal)}</span>
 </div>
 )}
 <div className="flex justify-between">
 <span className="font-semibold text-text">Наша цена</span>
 <span
 className="text-2xl font-display font-bold text-[#39FF14]"
 style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
 >
 {fmt(ourTotal)}
 </span>
 </div>
 {savings > 0 && (
 <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20">
 <Check className="size-4 text-[#39FF14] shrink-0" />
 <span className="text-[#39FF14] text-sm font-semibold">
 Экономия {fmt(savings)}
 </span>
 </div>
 )}
 </div>
 </>
 )}

 {/* Включено */}
 <div className="flex flex-col gap-1.5 text-xs text-text-subtle border-t border-border pt-4">
 {[
 'Профессиональные материалы Gyeon, XPEL, SunTek',
 'Фото до и после работы',
 'Сохранность кузова при работе',
 ].map((item) => (
 <div key={item} className="flex items-center gap-2">
 <Check className="size-3 text-[#39FF14] shrink-0" />
 {item}
 </div>
 ))}
 </div>

 <button
 onClick={() => openBooking()}
 className="btn-primary w-full text-sm py-3.5 mt-1"
 >
 Записаться на детейлинг
 </button>
 <p className="text-xs text-text-subtle text-center -mt-2">
 Финальная цена — после осмотра автомобиля
 </p>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}
