'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Info } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

/**
 * Калькулятор детейлинга — построен 1:1 по структуре Platinum Garage:
 *   Материал → Тип кузова → Готовый пакет ИЛИ отдельные элементы → Итог.
 * Цены = Platinum Garage × 0.95, округление ceil() до ближайших 500 ₽ вверх.
 * Источник: https://platinum-garage.ru/services/zashhitnye-plenki/#calc
 */

// ─── Материалы PPF ──────────────────────────────────────────────────────────

type MaterialId = 'hybrid' | 'gloss_x' | 'gloss_pro';

interface Material {
 id: MaterialId;
 name: string;
 spec: string;
 warranty: string;
 thickness: string;
}

const MATERIALS: Material[] = [
 {
   id: 'hybrid',
   name: 'Hybrid PPF',
   spec: 'Полиуретан + ПВХ + Topcoat 160 мкм',
   warranty: '1 год гарантии',
   thickness: '160 мкм',
 },
 {
   id: 'gloss_x',
   name: 'Gloss X',
   spec: 'Полиуретан + Topcoat 190 мкм',
   warranty: '2 года гарантии',
   thickness: '190 мкм',
 },
 {
   id: 'gloss_pro',
   name: 'Gloss Pro',
   spec: 'Премиум-полиуретан + Topcoat 210/250 мкм',
   warranty: '3 года гарантии',
   thickness: '210–250 мкм',
 },
];

// ─── Типы кузова ────────────────────────────────────────────────────────────

type BodyId = 'sedan' | 'suv';

interface Body {
 id: BodyId;
 label: string;
 sub: string;
}

const BODIES: Body[] = [
 { id: 'sedan', label: 'Седан / хэтчбек', sub: 'Универсалы, мини-кроссоверы' },
 { id: 'suv',   label: 'Кроссовер / SUV', sub: 'Минивэны, внедорожники, бизнес-класс' },
];

// ─── Готовые пакеты ─────────────────────────────────────────────────────────
// Цены = Platinum Garage × 0.95, потом ceil до ближайших 500 ₽ вверх.
// PG: gor_pak hybrid sedan 33900 → 33900×0.95=32205 → ceil 500 = 32500
// и т.д.

type PackageId = 'city' | 'city_plus' | 'full';

interface Package {
 id: PackageId;
 label: string;
 desc: string;
 elements: string;
 duration: string;
 /** Цена по матрице material × body. */
 prices: Record<MaterialId, Record<BodyId, number>>;
}

const PACKAGES: Package[] = [
 {
   id: 'city',
   label: '«Городской» пакет',
   desc: 'Защита уязвимых зон от сколов в условиях города. Покрывает 70% типичных повреждений.',
   elements: 'Передний бампер, часть капота (до 40 см), часть крыльев, передняя оптика',
   duration: '1 день',
   prices: {
     hybrid:    { sedan: 32500, suv: 34500 },
     gloss_x:   { sedan: 41500, suv: 43500 },
     gloss_pro: { sedan: 47500, suv: 50000 },
   },
 },
 {
   id: 'city_plus',
   label: '«Городской +» пакет',
   desc: 'Расширенная защита всей передней зоны, включая зеркала и ПТФ. Самый популярный пакет.',
   elements: 'Передний бампер, капот, передние крылья, оптика, ПТФ, зеркала',
   duration: '1–2 дня',
   prices: {
     hybrid:    { sedan: 59000, suv: 63500 },
     gloss_x:   { sedan: 71500, suv: 80500 },
     gloss_pro: { sedan: 81000, suv: 85000 },
   },
 },
 {
   id: 'full',
   label: 'Полная оклейка кузова',
   desc: 'Все окрашенные элементы. Рекомендуется для новых автомобилей и редких/коллекционных машин.',
   elements: 'Все окрашенные панели кузова, передняя часть крыши, передняя оптика',
   duration: 'от 2 дней',
   prices: {
     hybrid:    { sedan: 169500, suv: 200000 },
     gloss_x:   { sedan: 223500, suv: 242500 },
     gloss_pro: { sedan: 261500, suv: 285000 },
   },
 },
];

// ─── Опциональные элементы (точечные дополнения) ────────────────────────────
// Базовые цены (для седана), для SUV умножаем на 1.07.
// Округление до 500 ₽ вверх.

type ExtraId =
 | 'headlights' | 'fog_lights' | 'mirrors'
 | 'door_handles' | 'sills' | 'roof_part'
 | 'rear_bumper' | 'door_edges' | 'door_jambs'
 | 'loading_zone' | 'wsh_pillars' | 'door_pillars';

interface Extra {
 id: ExtraId;
 label: string;
 sedan: number;
 suv: number;
}

const EXTRAS: Extra[] = [
 { id: 'headlights',   label: 'Передняя оптика (2 шт.)',         sedan: 4500,  suv: 5000 },
 { id: 'fog_lights',   label: 'ПТФ (2 шт.)',                       sedan: 2500,  suv: 2500 },
 { id: 'mirrors',      label: 'Зеркала (2 шт.)',                   sedan: 4500,  suv: 4500 },
 { id: 'door_handles', label: 'Под ручками дверей (4 шт.)',        sedan: 3000,  suv: 3000 },
 { id: 'sills',        label: 'Пороги (2 шт.)',                    sedan: 12000, suv: 14000 },
 { id: 'roof_part',    label: 'Часть крыши',                       sedan: 9000,  suv: 11000 },
 { id: 'rear_bumper',  label: 'Задний бампер',                     sedan: 10500, suv: 12500 },
 { id: 'door_edges',   label: 'Кромки дверей (4 шт.)',             sedan: 3500,  suv: 3500 },
 { id: 'door_jambs',   label: 'Дверные проёмы (4 шт.)',            sedan: 6500,  suv: 7500 },
 { id: 'loading_zone', label: 'Погрузочная зона',                  sedan: 4500,  suv: 5500 },
 { id: 'wsh_pillars',  label: 'Стойки лобового стекла (2 шт.)',    sedan: 5000,  suv: 5000 },
 { id: 'door_pillars', label: 'Глянцевые стойки дверей (4 шт.)',   sedan: 4500,  suv: 4500 },
];

// ─── Компонент ──────────────────────────────────────────────────────────────

export function DetailingCalculator() {
 const [material, setMaterial] = useState<MaterialId | null>(null);
 const [body, setBody] = useState<BodyId | null>(null);
 const [pkg, setPkg] = useState<PackageId | null>(null);
 const [extras, setExtras] = useState<Set<ExtraId>>(new Set());

 const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

 const packagePrice = useMemo(() => {
   if (!material || !body || !pkg) return 0;
   const p = PACKAGES.find((x) => x.id === pkg);
   return p?.prices[material][body] ?? 0;
 }, [material, body, pkg]);

 const extrasPrice = useMemo(() => {
   if (!body) return 0;
   return EXTRAS
     .filter((e) => extras.has(e.id))
     .reduce((sum, e) => sum + (body === 'sedan' ? e.sedan : e.suv), 0);
 }, [extras, body]);

 const total = packagePrice + extrasPrice;

 const toggleExtra = (id: ExtraId) => {
   setExtras((prev) => {
     const next = new Set(prev);
     if (next.has(id)) next.delete(id);
     else next.add(id);
     return next;
   });
 };

 const ready = !!material && !!body && (!!pkg || extras.size > 0);

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
     <span className="badge mb-4">Калькулятор бронирования PPF</span>
     <h2 className="section-title">РАССЧИТАТЬ СТОИМОСТЬ ОКЛЕЙКИ</h2>
     <p className="text-text-muted text-base mt-3 max-w-xl mx-auto">
       Выберите материал, тип кузова и пакет защиты — увидите итоговую цену сразу,
       без скрытых доплат. Финальный расчёт уточняется по факту осмотра.
     </p>
   </motion.div>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     {/* Левая колонка: выбор */}
     <div className="lg:col-span-2 flex flex-col gap-6">

       {/* Шаг 1: Материал */}
       <div className="card">
         <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
           <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">1</span>
           Выберите материал плёнки
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
           {MATERIALS.map((m) => (
             <button
               key={m.id}
               onClick={() => setMaterial(m.id)}
               className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                 material === m.id
                   ? 'border-[#39FF14] bg-[#39FF14]/10 text-text'
                   : 'border-border text-text-muted hover:border-[#39FF14]/40'
               }`}
             >
               {material === m.id && <Check className="size-3.5 text-[#39FF14] mb-0.5" />}
               <span className="font-semibold text-sm leading-tight">{m.name}</span>
               <span className="text-xs text-text-subtle leading-tight">{m.spec}</span>
               <span className="text-xs font-semibold text-[#39FF14]/80 mt-1">{m.warranty}</span>
             </button>
           ))}
         </div>
       </div>

       {/* Шаг 2: Тип кузова */}
       <div className="card">
         <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
           <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">2</span>
           Выберите тип кузова
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
           {BODIES.map((b) => (
             <button
               key={b.id}
               onClick={() => setBody(b.id)}
               className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                 body === b.id
                   ? 'border-[#39FF14] bg-[#39FF14]/10 text-text'
                   : 'border-border text-text-muted hover:border-[#39FF14]/40'
               }`}
             >
               {body === b.id && <Check className="size-3.5 text-[#39FF14] mb-0.5" />}
               <span className="font-semibold text-sm leading-tight">{b.label}</span>
               <span className="text-xs text-text-subtle leading-tight">{b.sub}</span>
             </button>
           ))}
         </div>
       </div>

       {/* Шаг 3: Готовый пакет */}
       <div className="card">
         <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
           <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">3</span>
           Готовый пакет защиты
           <span className="text-xs text-text-subtle font-normal">(можно пропустить)</span>
         </h3>
         <div className="flex flex-col gap-2">
           {PACKAGES.map((p) => {
             const price = (material && body) ? p.prices[material][body] : null;
             const isActive = pkg === p.id;
             return (
               <button
                 key={p.id}
                 onClick={() => setPkg(isActive ? null : p.id)}
                 disabled={!material || !body}
                 className={`flex flex-col gap-1 p-4 rounded-xl border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                   isActive
                     ? 'border-[#39FF14] bg-[#39FF14]/10'
                     : 'border-border hover:border-[#39FF14]/40'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 flex-wrap">
                   <div className="flex items-center gap-2">
                     <div
                       className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                         isActive ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'
                       }`}
                     >
                       {isActive && <Check className="size-3 text-black" />}
                     </div>
                     <span className="font-semibold text-sm text-text">{p.label}</span>
                   </div>
                   {price !== null && (
                     <span className="font-bold text-base text-[#39FF14]">{fmt(price)}</span>
                   )}
                 </div>
                 <div className="text-xs text-text-subtle leading-relaxed pl-7">
                   {p.desc}
                 </div>
                 <div className="text-xs text-text-subtle pl-7">
                   <span className="font-semibold text-text-muted">Включено:</span> {p.elements}
                 </div>
                 <div className="text-xs text-text-subtle pl-7">⏱ {p.duration}</div>
               </button>
             );
           })}
         </div>
       </div>

       {/* Шаг 4: Дополнительные элементы */}
       <div className="card">
         <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
           <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">4</span>
           Дополнительные элементы
           <span className="text-xs text-text-subtle font-normal">(если не входят в пакет)</span>
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
           {EXTRAS.map((e) => {
             const isChecked = extras.has(e.id);
             const price = body === 'sedan' ? e.sedan : body === 'suv' ? e.suv : null;
             return (
               <button
                 key={e.id}
                 onClick={() => toggleExtra(e.id)}
                 disabled={!body}
                 className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                   isChecked
                     ? 'border-[#39FF14] bg-[#39FF14]/8'
                     : 'border-border hover:border-[#39FF14]/40'
                 }`}
               >
                 <div className="flex items-center gap-2 min-w-0">
                   <div
                     className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                       isChecked ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'
                     }`}
                   >
                     {isChecked && <Check className="size-2.5 text-black" />}
                   </div>
                   <span className="text-xs text-text leading-tight truncate">{e.label}</span>
                 </div>
                 {price !== null && (
                   <span className="text-xs font-bold text-[#39FF14] shrink-0">
                     {fmt(price)}
                   </span>
                 )}
               </button>
             );
           })}
         </div>
       </div>

     </div>

     {/* Правая колонка: итог */}
     <div className="lg:col-span-1">
       <div className="card sticky top-24 flex flex-col gap-5">
         <h3 className="text-base font-semibold text-text flex items-center gap-2">
           <Sparkles className="size-4 text-[#39FF14]" />
           Итоговая стоимость
         </h3>

         {!ready && (
           <p className="text-text-subtle text-sm text-center py-6 leading-relaxed">
             Выберите материал, тип кузова и пакет (или отдельные элементы), чтобы увидеть стоимость.
           </p>
         )}

         {ready && (
           <>
             <div className="flex flex-col gap-2 text-sm">
               {material && (
                 <div className="flex justify-between gap-2">
                   <span className="text-text-muted">Материал</span>
                   <span className="font-semibold text-text text-right">
                     {MATERIALS.find((m) => m.id === material)?.name}
                   </span>
                 </div>
               )}
               {body && (
                 <div className="flex justify-between gap-2">
                   <span className="text-text-muted">Кузов</span>
                   <span className="font-semibold text-text text-right">
                     {BODIES.find((b) => b.id === body)?.label}
                   </span>
                 </div>
               )}
               {pkg && (
                 <div className="flex justify-between gap-2">
                   <span className="text-text-muted">Пакет</span>
                   <span className="font-semibold text-text text-right text-xs">
                     {PACKAGES.find((p) => p.id === pkg)?.label}
                   </span>
                 </div>
               )}
               {pkg && packagePrice > 0 && (
                 <div className="flex justify-between gap-2 text-xs text-text-subtle">
                   <span>Стоимость пакета</span>
                   <span>{fmt(packagePrice)}</span>
                 </div>
               )}
               {extras.size > 0 && (
                 <div className="flex justify-between gap-2 text-xs text-text-subtle">
                   <span>Доп. элементы ({extras.size})</span>
                   <span>+ {fmt(extrasPrice)}</span>
                 </div>
               )}
             </div>

             <div className="border-t border-border pt-4 flex flex-col gap-3">
               <div className="flex justify-between items-center">
                 <span className="font-semibold text-text">Итого</span>
                 <span
                   className="text-2xl font-display font-bold text-[#39FF14]"
                   style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
                 >
                   {fmt(total)}
                 </span>
               </div>
             </div>
           </>
         )}

         {/* Что включено */}
         <div className="flex flex-col gap-1.5 text-xs text-text-subtle border-t border-border pt-4">
           {[
             'Сертифицированная установка',
             'Гарантия 1–3 года в зависимости от плёнки',
             'Без скрытых доплат — все работы по прайсу',
             'Фото каждого этапа работы',
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
           disabled={!ready}
         >
           {ready ? 'Записаться на оклейку' : 'Заполните калькулятор'}
         </button>
         <p className="text-xs text-text-subtle text-center -mt-2 leading-relaxed">
           <Info className="size-3 inline-block mr-1 mb-0.5" />
           Финальная цена — после осмотра автомобиля
         </p>
         <p className="text-[10px] text-text-subtle/60 text-center leading-relaxed">
           <Shield className="size-2.5 inline-block mr-0.5 mb-0.5" />
           Доп. накладки, молдинги, расширители — рассчитываются индивидуально
         </p>
       </div>
     </div>

   </div>
 </div>
 </section>
 );
}
