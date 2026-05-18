'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Droplets, Wind, Wrench, ChevronRight } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';

/**
 * Калькулятор детейлинга — полный комплект услуг 1:1 по структуре Platinum Garage.
 * Сервисы:
 *   - PPF (защитная плёнка): пакет × материал × тип кузова
 *   - Керамика: 5 комплексов × категория авто
 *   - Полировка: 3 типа × категория авто + поэлементная
 *   - Химчистка: полная × категория + точечная (сидения, потолок, пол и т.д.)
 *
 * Формула цены: Platinum_Garage × 0.90, округление до ближайших 500 ₽ (приоритет — красивое число).
 * Все цены проверены вручную через ceil/round для итоговой "красоты".
 */

// ─── Сервисы (вкладки) ──────────────────────────────────────────────────────

type ServiceId = 'ppf' | 'ceramic' | 'polishing' | 'cleaning';

interface ServiceTab {
  id: ServiceId;
  label: string;
  short: string;
  icon: typeof Shield;
}

const SERVICES: ServiceTab[] = [
  { id: 'ppf',       label: 'Антигравийная плёнка PPF', short: 'PPF',        icon: Shield },
  { id: 'ceramic',   label: 'Керамическое покрытие',     short: 'Керамика',   icon: Sparkles },
  { id: 'polishing', label: 'Полировка кузова',          short: 'Полировка',  icon: Wrench },
  { id: 'cleaning',  label: 'Химчистка салона',          short: 'Химчистка',  icon: Droplets },
];

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE 1: PPF (защитная плёнка)
// ═══════════════════════════════════════════════════════════════════════════

type MaterialId = 'hybrid' | 'gloss_x' | 'gloss_pro';
type BodyId = 'sedan' | 'suv';
type PackageId = 'city' | 'city_plus' | 'full';

interface Material { id: MaterialId; name: string; spec: string; warranty: string; }
interface Package {
  id: PackageId; label: string; desc: string; elements: string; duration: string;
  prices: Record<MaterialId, Record<BodyId, number>>;
}
interface Extra { id: string; label: string; sedan: number; suv: number; }

const MATERIALS: Material[] = [
  { id: 'hybrid',    name: 'Hybrid PPF', spec: 'Полиуретан + ПВХ 160 мкм',         warranty: '1 год гарантии' },
  { id: 'gloss_x',   name: 'Gloss X',    spec: 'Полиуретан + Topcoat 190 мкм',     warranty: '2 года гарантии' },
  { id: 'gloss_pro', name: 'Gloss Pro',  spec: 'Премиум-полиуретан 210–250 мкм',   warranty: '3 года гарантии' },
];

const BODIES: { id: BodyId; label: string; sub: string }[] = [
  { id: 'sedan', label: 'Седан / хэтчбек', sub: 'Универсалы, мини-кроссоверы' },
  { id: 'suv',   label: 'Кроссовер / SUV', sub: 'Минивэны, внедорожники, бизнес-класс' },
];

// Цены = Platinum_Garage × 0.90, округлено до 500 ₽ (вверх или к ближайшему — для красоты)
const PACKAGES: Package[] = [
  {
    id: 'city',
    label: '«Городской» пакет',
    desc: 'Защита уязвимых зон от сколов в условиях города. Покрывает 70% типичных повреждений.',
    elements: 'Передний бампер, часть капота (до 40 см), часть крыльев, передняя оптика',
    duration: '1 день',
    prices: {
      hybrid:    { sedan: 31000, suv: 33000 },
      gloss_x:   { sedan: 39500, suv: 41500 },
      gloss_pro: { sedan: 45000, suv: 47500 },
    },
  },
  {
    id: 'city_plus',
    label: '«Городской +» пакет',
    desc: 'Расширенная защита всей передней зоны, включая зеркала и ПТФ. Самый популярный пакет.',
    elements: 'Передний бампер, капот, передние крылья, оптика, ПТФ, зеркала',
    duration: '1–2 дня',
    prices: {
      hybrid:    { sedan: 56000, suv: 60500 },
      gloss_x:   { sedan: 68000, suv: 76500 },
      gloss_pro: { sedan: 77000, suv: 80500 },
    },
  },
  {
    id: 'full',
    label: 'Полная оклейка кузова',
    desc: 'Все окрашенные элементы. Рекомендуется для новых автомобилей и редких/коллекционных машин.',
    elements: 'Все окрашенные панели кузова, передняя часть крыши, передняя оптика',
    duration: 'от 2 дней',
    prices: {
      hybrid:    { sedan: 160500, suv: 189500 },
      gloss_x:   { sedan: 212000, suv: 230000 },
      gloss_pro: { sedan: 248000, suv: 270000 },
    },
  },
];

const EXTRAS: Extra[] = [
  { id: 'headlights',   label: 'Передняя оптика (2 шт.)',      sedan: 4500,  suv: 4500 },
  { id: 'fog_lights',   label: 'ПТФ (2 шт.)',                    sedan: 2500,  suv: 2500 },
  { id: 'mirrors',      label: 'Зеркала (2 шт.)',                sedan: 4000,  suv: 4500 },
  { id: 'door_handles', label: 'Под ручками дверей (4 шт.)',     sedan: 3000,  suv: 3000 },
  { id: 'sills',        label: 'Пороги (2 шт.)',                 sedan: 11500, suv: 13000 },
  { id: 'roof_part',    label: 'Часть крыши',                    sedan: 8500,  suv: 10500 },
  { id: 'rear_bumper',  label: 'Задний бампер',                  sedan: 10000, suv: 12000 },
  { id: 'door_edges',   label: 'Кромки дверей (4 шт.)',          sedan: 3500,  suv: 3500 },
  { id: 'door_jambs',   label: 'Дверные проёмы (4 шт.)',         sedan: 6000,  suv: 7000 },
  { id: 'loading_zone', label: 'Погрузочная зона',               sedan: 4500,  suv: 5000 },
  { id: 'wsh_pillars',  label: 'Стойки лобового стекла (2 шт.)', sedan: 4500,  suv: 4500 },
  { id: 'door_pillars', label: 'Глянцевые стойки дверей (4 шт.)', sedan: 4000, suv: 4500 },
];

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE 2: Керамика
// ═══════════════════════════════════════════════════════════════════════════

type CeramicId = 'new_car' | 'restorative' | 'film_new' | 'film_used' | 'wheels_new' | 'wheels_used' | 'wheels_demount';
type CategoryId = 'cat1' | 'cat2';

interface CeramicPkg {
  id: CeramicId;
  label: string;
  desc: string;
  warranty: string;
  prices: Partial<Record<CategoryId, number>>;
  flat?: number; // для дисков (общая цена)
  category: 'body' | 'wheels';
}

// Platinum_Garage × 0.90
const CERAMICS: CeramicPkg[] = [
  {
    id: 'new_car',
    label: 'Для нового автомобиля',
    desc: 'Для машин с пробегом до 1–2 тыс. км. Подготовка + полировка безабразивная + 9H + Top-Coat',
    warranty: 'Твёрдый слой 2 года · гидрофоб 6–12 мес',
    prices: { cat1: 25500, cat2: 29000 },
    category: 'body',
  },
  {
    id: 'restorative',
    label: 'Восстановительный комплекс',
    desc: 'Для авто с пробегом и дефектами. Полировка в 3 этапа + 9H + Top-Coat. Занимает 1–2 дня.',
    warranty: 'Твёрдый слой 2 года · гидрофоб 6–12 мес',
    prices: { cat1: 40500, cat2: 45000 },
    category: 'body',
  },
  {
    id: 'film_new',
    label: 'Керамика на новую плёнку',
    desc: 'Для авто, только что оклеенных PPF/ПВХ. Защита плёнки от химии и реагентов.',
    warranty: 'Твёрдый слой 2 года · гидрофоб 6–12 мес',
    prices: { cat1: 9000, cat2: 11500 },
    category: 'body',
  },
  {
    id: 'film_used',
    label: 'Керамика на плёнку с пробегом',
    desc: 'Для авто с уже эксплуатируемой плёнкой. Мойка + полировка безабразивная + 9H + Top-Coat.',
    warranty: 'Твёрдые слои 2 года · гидрофоб 6–12 мес',
    prices: { cat1: 22500, cat2: 27000 },
    category: 'body',
  },
  {
    id: 'wheels_new',
    label: 'Керамика новых дисков (4 шт.)',
    desc: 'Обезжиривание + 9H + Top-Coat. Уменьшает адгезию тормозной пыли.',
    warranty: 'Твёрдые слои 2 года · гидрофоб 6–12 мес',
    prices: {},
    flat: 4500,
    category: 'wheels',
  },
  {
    id: 'wheels_used',
    label: 'Керамика дисков с пробегом',
    desc: 'Мойка + удаление металлических вкраплений + обезжиривание + 9H + Top-Coat.',
    warranty: 'Твёрдые слои 2 года · гидрофоб 6–12 мес',
    prices: {},
    flat: 8500,
    category: 'wheels',
  },
  {
    id: 'wheels_demount',
    label: 'Керамика дисков + демонтаж',
    desc: 'Снятие/установка с авто, мойка обеих сторон, обезжиривание + 9H + Top-Coat.',
    warranty: 'Твёрдые слои 2 года · гидрофоб 6–12 мес',
    prices: {},
    flat: 9500,
    category: 'wheels',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE 3: Полировка
// ═══════════════════════════════════════════════════════════════════════════

type PolishId = 'light' | 'deep' | 'element_small' | 'element_mid' | 'element_big';

interface Polish {
  id: PolishId;
  label: string;
  desc: string;
  prices: Partial<Record<CategoryId, number>>;
  flat?: number;
  full: boolean; // true = вся машина (нужна категория), false = поэлементная
  duration?: string;
}

const POLISHINGS: Polish[] = [
  {
    id: 'light',
    label: 'Лёгкая коррекция ЛКП',
    desc: 'Для новых авто и без дефектов. Удаление помутнений, голограмм, налёта. Паста «антиголограмма».',
    prices: { cat1: 15500, cat2: 18000 },
    full: true,
    duration: '4–6 часов',
  },
  {
    id: 'deep',
    label: 'Глубокая восстановительная',
    desc: 'Для авто с пробегом и дефектами ЛКП. 4 типа пасты: крупная/средняя/мелкая абразивность + антиголограмма. Удаляет царапины, помутнения.',
    prices: { cat1: 29000, cat2: 32500 },
    full: true,
    duration: 'от 10 часов',
  },
  {
    id: 'element_small',
    label: 'Поэлементная — малый',
    desc: 'Зеркало, ПТФ. Удаление царапин, помутнений, стойких загрязнений.',
    prices: {},
    flat: 2000,
    full: false,
  },
  {
    id: 'element_mid',
    label: 'Поэлементная — средний',
    desc: 'Крыло, дверь, порог. Удаление царапин, помутнений, стойких загрязнений.',
    prices: {},
    flat: 2500,
    full: false,
  },
  {
    id: 'element_big',
    label: 'Поэлементная — крупный',
    desc: 'Капот, крыша, бампер. Удаление царапин, помутнений, стойких загрязнений.',
    prices: {},
    flat: 3000,
    full: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE 4: Химчистка
// ═══════════════════════════════════════════════════════════════════════════

type CleanFullId = 'full_cat1' | 'full_cat2' | 'full_cat3';
type CleanPartId =
  | 'seat' | 'rear_sofa' | 'floor' | 'ceiling' | 'door_trim' | 'trunk'
  | 'steering' | 'ozone' | 'leather_conditioner' | 'demount_seats_c1' | 'demount_seats_c2';

interface CleanFull {
  id: CleanFullId;
  label: string;
  desc: string;
  price: number;
  duration?: string;
}

interface CleanPart {
  id: CleanPartId;
  label: string;
  desc: string;
  price: number;
  from?: boolean; // показывать «от»
}

const CLEAN_FULL: CleanFull[] = [
  {
    id: 'full_cat1',
    label: 'Категория 1 — седан, хэтчбек, универсал, малый кроссовер',
    desc: 'Сидения, пол, потолок, торпедо, двери, багажник. Парогенератор + ТОРНАДОР.',
    price: 15500,
    duration: 'от 7 часов',
  },
  {
    id: 'full_cat2',
    label: 'Категория 2 — бизнес-класс, внедорожник, крупный кроссовер',
    desc: 'Сидения, пол, потолок, торпедо, двери, багажник. Парогенератор + ТОРНАДОР.',
    price: 17500,
    duration: 'от 7 часов',
  },
  {
    id: 'full_cat3',
    label: 'Категория 3 — большой минивэн, микроавтобус',
    desc: 'Сидения, пол, потолок, торпедо, двери, багажник. Парогенератор + ТОРНАДОР.',
    price: 21500,
    duration: 'от 8 часов',
  },
];

const CLEAN_PARTS: CleanPart[] = [
  { id: 'seat',                 label: 'Сиденье (1 шт.)',                 desc: 'Сухая чистка + парогенератор + дезинфекция',           price: 2000, from: true },
  { id: 'rear_sofa',            label: 'Задний диван',                    desc: 'Сухая чистка + парогенератор + дезинфекция',           price: 3500, from: true },
  { id: 'floor',                label: 'Пол / напольное покрытие',        desc: 'Тщательная очистка с парогенератором',                 price: 4500, from: true },
  { id: 'ceiling',              label: 'Потолок',                         desc: 'Аккуратная очистка без разводов',                      price: 4500, from: true },
  { id: 'door_trim',            label: 'Обшивка двери (1 шт.)',           desc: 'Чистка ткани/кожи + дезинфекция',                      price: 1500, from: true },
  { id: 'trunk',                label: 'Багажник',                        desc: 'Сухая + парогенератор + ТОРНАДОР',                     price: 4000, from: true },
  { id: 'steering',             label: 'Руль',                            desc: 'Глубокая очистка кожи руля',                           price: 1500 },
  { id: 'ozone',                label: 'Озонирование',                    desc: 'Уничтожение запахов, бактерий, грибков',               price: 2000 },
  { id: 'leather_conditioner',  label: 'Кондиционер кожи (сидения)',      desc: 'Водно-масляная эмульсия для эластичности кожи',        price: 3000 },
  { id: 'demount_seats_c1',     label: '+ Демонтаж двух сидений (кат. 1)', desc: 'Тщательная обработка под сиденьями',                   price: 3000 },
  { id: 'demount_seats_c2',     label: '+ Демонтаж двух сидений (кат. 2)', desc: 'Тщательная обработка под сиденьями',                   price: 3500 },
];

const CATEGORIES: { id: CategoryId; label: string; sub: string }[] = [
  { id: 'cat1', label: 'Категория 1', sub: 'Седан, хэтчбек, универсал' },
  { id: 'cat2', label: 'Категория 2', sub: 'Бизнес-класс, кроссовер, SUV' },
];

// ═══════════════════════════════════════════════════════════════════════════
// КОМПОНЕНТ
// ═══════════════════════════════════════════════════════════════════════════

export function DetailingCalculator() {
  const [service, setService] = useState<ServiceId>('ppf');

  // PPF state
  const [material, setMaterial] = useState<MaterialId | null>(null);
  const [body, setBody] = useState<BodyId | null>(null);
  const [pkg, setPkg] = useState<PackageId | null>(null);
  const [extras, setExtras] = useState<Set<string>>(new Set());

  // Ceramic state
  const [ceramicId, setCeramicId] = useState<CeramicId | null>(null);
  const [ceramicCat, setCeramicCat] = useState<CategoryId | null>(null);

  // Polish state
  const [polishId, setPolishId] = useState<PolishId | null>(null);
  const [polishCat, setPolishCat] = useState<CategoryId | null>(null);

  // Clean state
  const [cleanFullId, setCleanFullId] = useState<CleanFullId | null>(null);
  const [cleanParts, setCleanParts] = useState<Set<CleanPartId>>(new Set());

  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

  // ─── PPF total ──────────────────────────────────────────────────────────
  const ppfPackagePrice = useMemo(() => {
    if (!material || !body || !pkg) return 0;
    const p = PACKAGES.find((x) => x.id === pkg);
    return p?.prices[material][body] ?? 0;
  }, [material, body, pkg]);

  const ppfExtrasPrice = useMemo(() => {
    if (!body) return 0;
    return EXTRAS
      .filter((e) => extras.has(e.id))
      .reduce((sum, e) => sum + (body === 'sedan' ? e.sedan : e.suv), 0);
  }, [extras, body]);

  const ppfTotal = ppfPackagePrice + ppfExtrasPrice;
  const ppfReady = !!material && !!body && (!!pkg || extras.size > 0);

  // ─── Ceramic total ──────────────────────────────────────────────────────
  const ceramicTotal = useMemo(() => {
    if (!ceramicId) return 0;
    const c = CERAMICS.find((x) => x.id === ceramicId);
    if (!c) return 0;
    if (c.flat !== undefined) return c.flat;
    if (!ceramicCat) return 0;
    return c.prices[ceramicCat] ?? 0;
  }, [ceramicId, ceramicCat]);

  const ceramicNeedsCat = useMemo(() => {
    const c = CERAMICS.find((x) => x.id === ceramicId);
    return c?.category === 'body';
  }, [ceramicId]);

  const ceramicReady = !!ceramicId && (!ceramicNeedsCat || !!ceramicCat);

  // ─── Polish total ───────────────────────────────────────────────────────
  const polishTotal = useMemo(() => {
    if (!polishId) return 0;
    const p = POLISHINGS.find((x) => x.id === polishId);
    if (!p) return 0;
    if (p.flat !== undefined) return p.flat;
    if (!polishCat) return 0;
    return p.prices[polishCat] ?? 0;
  }, [polishId, polishCat]);

  const polishNeedsCat = useMemo(() => {
    const p = POLISHINGS.find((x) => x.id === polishId);
    return p?.full === true;
  }, [polishId]);

  const polishReady = !!polishId && (!polishNeedsCat || !!polishCat);

  // ─── Cleaning total ─────────────────────────────────────────────────────
  const cleanFullPrice = useMemo(() => {
    if (!cleanFullId) return 0;
    return CLEAN_FULL.find((x) => x.id === cleanFullId)?.price ?? 0;
  }, [cleanFullId]);

  const cleanPartsPrice = useMemo(() => {
    return CLEAN_PARTS
      .filter((p) => cleanParts.has(p.id))
      .reduce((sum, p) => sum + p.price, 0);
  }, [cleanParts]);

  const cleanTotal = cleanFullPrice + cleanPartsPrice;
  const cleanReady = !!cleanFullId || cleanParts.size > 0;

  // ─── Helpers ────────────────────────────────────────────────────────────
  const toggleExtra = (id: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleCleanPart = (id: CleanPartId) => {
    setCleanParts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Текущий итог
  const currentTotal =
    service === 'ppf'       ? ppfTotal     :
    service === 'ceramic'   ? ceramicTotal :
    service === 'polishing' ? polishTotal  :
    cleanTotal;

  const currentReady =
    service === 'ppf'       ? ppfReady     :
    service === 'ceramic'   ? ceramicReady :
    service === 'polishing' ? polishReady  :
    cleanReady;

  return (
    <section className="section bg-bg-elevated" id="detailing-calculator">
      <div className="container">
        {/* Заголовок */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge mb-4">Калькулятор детейлинга</span>
          <h2 className="section-title">РАССЧИТАТЬ СТОИМОСТЬ ОНЛАЙН</h2>
          <p className="text-text-muted text-base mt-3 max-w-2xl mx-auto">
            PPF, керамика, полировка, химчистка — выберите услугу и получите точную цену.
            Без скрытых доплат. Финальный расчёт уточняется по факту осмотра.
          </p>
        </motion.div>

        {/* Переключатель сервисов */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const isActive = service === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setService(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  isActive
                    ? 'border-[#39FF14] bg-[#39FF14]/15 text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.25)]'
                    : 'border-border text-text-muted hover:border-[#39FF14]/40 hover:text-text'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.short}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка: выбор */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ═══════ PPF ═══════ */}
            {service === 'ppf' && (
              <>
                {/* Материал */}
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

                {/* Тип кузова */}
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

                {/* Готовый пакет */}
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
                            isActive ? 'border-[#39FF14] bg-[#39FF14]/10' : 'border-border hover:border-[#39FF14]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isActive ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'}`}>
                                {isActive && <Check className="size-3 text-black" />}
                              </div>
                              <span className="font-semibold text-sm text-text">{p.label}</span>
                            </div>
                            {price !== null && <span className="font-bold text-base text-[#39FF14]">{fmt(price)}</span>}
                          </div>
                          <div className="text-xs text-text-subtle leading-relaxed pl-7">{p.desc}</div>
                          <div className="text-xs text-text-subtle pl-7">
                            <span className="font-semibold text-text-muted">Включено:</span> {p.elements}
                          </div>
                          <div className="text-xs text-text-subtle pl-7">⏱ {p.duration}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Дополнительные элементы */}
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
                            isChecked ? 'border-[#39FF14] bg-[#39FF14]/8' : 'border-border hover:border-[#39FF14]/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'}`}>
                              {isChecked && <Check className="size-2.5 text-black" />}
                            </div>
                            <span className="text-xs text-text leading-tight truncate">{e.label}</span>
                          </div>
                          {price !== null && <span className="text-xs font-bold text-[#39FF14] shrink-0">{fmt(price)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ═══════ КЕРАМИКА ═══════ */}
            {service === 'ceramic' && (
              <>
                <div className="card">
                  <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">1</span>
                    Выберите комплекс керамики
                  </h3>
                  <div className="flex flex-col gap-2">
                    {CERAMICS.map((c) => {
                      const isActive = ceramicId === c.id;
                      const displayPrice = c.flat ?? (ceramicCat ? c.prices[ceramicCat] : null);
                      return (
                        <button
                          key={c.id}
                          onClick={() => { setCeramicId(isActive ? null : c.id); if (c.category === 'wheels') setCeramicCat(null); }}
                          className={`flex flex-col gap-1 p-4 rounded-xl border text-left transition-all ${
                            isActive ? 'border-[#39FF14] bg-[#39FF14]/10' : 'border-border hover:border-[#39FF14]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isActive ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'}`}>
                                {isActive && <Check className="size-3 text-black" />}
                              </div>
                              <span className="font-semibold text-sm text-text">{c.label}</span>
                            </div>
                            {displayPrice !== null && displayPrice !== undefined && (
                              <span className="font-bold text-base text-[#39FF14]">{fmt(displayPrice)}</span>
                            )}
                          </div>
                          <div className="text-xs text-text-subtle leading-relaxed pl-7">{c.desc}</div>
                          <div className="text-xs text-text-subtle pl-7">🛡 {c.warranty}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {ceramicNeedsCat && (
                  <div className="card">
                    <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">2</span>
                      Категория автомобиля
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCeramicCat(cat.id)}
                          className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                            ceramicCat === cat.id ? 'border-[#39FF14] bg-[#39FF14]/10 text-text' : 'border-border text-text-muted hover:border-[#39FF14]/40'
                          }`}
                        >
                          {ceramicCat === cat.id && <Check className="size-3.5 text-[#39FF14] mb-0.5" />}
                          <span className="font-semibold text-sm leading-tight">{cat.label}</span>
                          <span className="text-xs text-text-subtle leading-tight">{cat.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ═══════ ПОЛИРОВКА ═══════ */}
            {service === 'polishing' && (
              <>
                <div className="card">
                  <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">1</span>
                    Тип полировки
                  </h3>
                  <div className="flex flex-col gap-2">
                    {POLISHINGS.map((p) => {
                      const isActive = polishId === p.id;
                      const displayPrice = p.flat ?? (polishCat ? p.prices[polishCat] : null);
                      return (
                        <button
                          key={p.id}
                          onClick={() => { setPolishId(isActive ? null : p.id); if (!p.full) setPolishCat(null); }}
                          className={`flex flex-col gap-1 p-4 rounded-xl border text-left transition-all ${
                            isActive ? 'border-[#39FF14] bg-[#39FF14]/10' : 'border-border hover:border-[#39FF14]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isActive ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'}`}>
                                {isActive && <Check className="size-3 text-black" />}
                              </div>
                              <span className="font-semibold text-sm text-text">{p.label}</span>
                            </div>
                            {displayPrice !== null && displayPrice !== undefined && (
                              <span className="font-bold text-base text-[#39FF14]">
                                {p.flat ? `от ${fmt(displayPrice)}` : fmt(displayPrice)}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-subtle leading-relaxed pl-7">{p.desc}</div>
                          {p.duration && <div className="text-xs text-text-subtle pl-7">⏱ {p.duration}</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {polishNeedsCat && (
                  <div className="card">
                    <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">2</span>
                      Категория автомобиля
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setPolishCat(cat.id)}
                          className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                            polishCat === cat.id ? 'border-[#39FF14] bg-[#39FF14]/10 text-text' : 'border-border text-text-muted hover:border-[#39FF14]/40'
                          }`}
                        >
                          {polishCat === cat.id && <Check className="size-3.5 text-[#39FF14] mb-0.5" />}
                          <span className="font-semibold text-sm leading-tight">{cat.label}</span>
                          <span className="text-xs text-text-subtle leading-tight">{cat.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ═══════ ХИМЧИСТКА ═══════ */}
            {service === 'cleaning' && (
              <>
                <div className="card">
                  <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">1</span>
                    Полная химчистка салона
                    <span className="text-xs text-text-subtle font-normal">(можно пропустить)</span>
                  </h3>
                  <div className="flex flex-col gap-2">
                    {CLEAN_FULL.map((c) => {
                      const isActive = cleanFullId === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setCleanFullId(isActive ? null : c.id)}
                          className={`flex flex-col gap-1 p-4 rounded-xl border text-left transition-all ${
                            isActive ? 'border-[#39FF14] bg-[#39FF14]/10' : 'border-border hover:border-[#39FF14]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isActive ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'}`}>
                                {isActive && <Check className="size-3 text-black" />}
                              </div>
                              <span className="font-semibold text-sm text-text">{c.label}</span>
                            </div>
                            <span className="font-bold text-base text-[#39FF14]">{fmt(c.price)}</span>
                          </div>
                          <div className="text-xs text-text-subtle leading-relaxed pl-7">{c.desc}</div>
                          {c.duration && <div className="text-xs text-text-subtle pl-7">⏱ {c.duration}</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">2</span>
                    Точечные услуги и дополнения
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CLEAN_PARTS.map((p) => {
                      const isChecked = cleanParts.has(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleCleanPart(p.id)}
                          className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                            isChecked ? 'border-[#39FF14] bg-[#39FF14]/8' : 'border-border hover:border-[#39FF14]/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#39FF14] border-[#39FF14]' : 'border-border'}`}>
                              {isChecked && <Check className="size-2.5 text-black" />}
                            </div>
                            <span className="text-xs text-text leading-tight truncate">{p.label}</span>
                          </div>
                          <span className="text-xs font-bold text-[#39FF14] shrink-0">
                            {p.from ? `от ${fmt(p.price)}` : fmt(p.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Правая колонка: итог */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 flex flex-col gap-5">
              <h3 className="text-base font-semibold text-text flex items-center gap-2">
                <Sparkles className="size-4 text-[#39FF14]" />
                Итоговая стоимость
              </h3>

              {!currentReady && (
                <p className="text-text-subtle text-sm text-center py-6 leading-relaxed">
                  Выберите параметры слева, чтобы увидеть стоимость.
                </p>
              )}

              {currentReady && (
                <>
                  {/* PPF breakdown */}
                  {service === 'ppf' && (
                    <div className="flex flex-col gap-2 text-sm">
                      {material && <div className="flex justify-between gap-2"><span className="text-text-muted">Материал</span><span className="font-semibold text-text text-right">{MATERIALS.find((m) => m.id === material)?.name}</span></div>}
                      {body && <div className="flex justify-between gap-2"><span className="text-text-muted">Кузов</span><span className="font-semibold text-text text-right">{BODIES.find((b) => b.id === body)?.label}</span></div>}
                      {pkg && <div className="flex justify-between gap-2"><span className="text-text-muted">Пакет</span><span className="font-semibold text-text text-right text-xs">{PACKAGES.find((p) => p.id === pkg)?.label}</span></div>}
                      {pkg && ppfPackagePrice > 0 && <div className="flex justify-between gap-2 text-xs text-text-subtle"><span>Стоимость пакета</span><span>{fmt(ppfPackagePrice)}</span></div>}
                      {extras.size > 0 && <div className="flex justify-between gap-2 text-xs text-text-subtle"><span>Доп. элементы ({extras.size})</span><span>+ {fmt(ppfExtrasPrice)}</span></div>}
                    </div>
                  )}

                  {/* Ceramic breakdown */}
                  {service === 'ceramic' && ceramicId && (
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-text-muted">Комплекс</span>
                        <span className="font-semibold text-text text-right text-xs">{CERAMICS.find((c) => c.id === ceramicId)?.label}</span>
                      </div>
                      {ceramicNeedsCat && ceramicCat && (
                        <div className="flex justify-between gap-2">
                          <span className="text-text-muted">Категория</span>
                          <span className="font-semibold text-text text-right">{CATEGORIES.find((c) => c.id === ceramicCat)?.label}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Polish breakdown */}
                  {service === 'polishing' && polishId && (
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-text-muted">Тип</span>
                        <span className="font-semibold text-text text-right text-xs">{POLISHINGS.find((p) => p.id === polishId)?.label}</span>
                      </div>
                      {polishNeedsCat && polishCat && (
                        <div className="flex justify-between gap-2">
                          <span className="text-text-muted">Категория</span>
                          <span className="font-semibold text-text text-right">{CATEGORIES.find((c) => c.id === polishCat)?.label}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cleaning breakdown */}
                  {service === 'cleaning' && (
                    <div className="flex flex-col gap-2 text-sm">
                      {cleanFullId && (
                        <div className="flex justify-between gap-2 text-xs text-text-subtle">
                          <span>Полная химчистка</span>
                          <span>{fmt(cleanFullPrice)}</span>
                        </div>
                      )}
                      {cleanParts.size > 0 && (
                        <div className="flex justify-between gap-2 text-xs text-text-subtle">
                          <span>Точечные услуги ({cleanParts.size})</span>
                          <span>+ {fmt(cleanPartsPrice)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-border pt-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text">Итого</span>
                      <span
                        className="text-2xl font-display font-bold text-[#39FF14]"
                        style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}
                      >
                        {service === 'polishing' && POLISHINGS.find((p) => p.id === polishId)?.flat
                          ? `от ${fmt(currentTotal)}`
                          : fmt(currentTotal)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* CTA */}
              <button
                onClick={() => openBooking()}
                disabled={!currentReady}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Записаться на детейлинг
                <ChevronRight className="size-4" />
              </button>

              {/* Что включено */}
              <div className="flex flex-col gap-1.5 text-xs text-text-subtle border-t border-border pt-4">
                {[
                  'Сертифицированные материалы',
                  'Гарантия на работы',
                  'Без скрытых доплат — всё по прайсу',
                  'Фото каждого этапа',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="size-3 text-[#39FF14] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
