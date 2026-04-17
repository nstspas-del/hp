'use client';
import { useState, useMemo } from 'react';
import { openBooking } from '@/lib/autodealer';
import calcData from '@/data/detailing-calculator.json';

/* ── Типы ── */
interface CarClass { id: string; label: string; desc: string; examples: string; }
interface Package { id: string; name: string; desc: string; duration: string; prices: Record<string, number>; }
interface Service { id: string; name: string; icon: string; desc: string; packages: Package[]; }

const carClasses = calcData.carClasses as CarClass[];
const services   = calcData.services   as Service[];

const ICONS: Record<string, string> = {
  polishing: '✦',
  ceramic:   '◈',
  ppf:       '⬡',
  cleaning:  '❋',
  tinting:   '◐',
};

const SERVICE_COLORS: Record<string, string> = {
  polishing: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  ceramic:   'from-sky-500/20 to-sky-500/5 border-sky-500/30',
  ppf:       'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  cleaning:  'from-violet-500/20 to-violet-500/5 border-violet-500/30',
  tinting:   'from-zinc-400/20 to-zinc-400/5 border-zinc-400/30',
};

const ACTIVE_COLORS: Record<string, string> = {
  polishing: 'border-amber-400 bg-amber-400/10',
  ceramic:   'border-sky-400 bg-sky-400/10',
  ppf:       'border-emerald-400 bg-emerald-400/10',
  cleaning:  'border-violet-400 bg-violet-400/10',
  tinting:   'border-zinc-300 bg-zinc-300/10',
};

const ICON_COLORS: Record<string, string> = {
  polishing: 'text-amber-400',
  ceramic:   'text-sky-400',
  ppf:       'text-emerald-400',
  cleaning:  'text-violet-400',
  tinting:   'text-zinc-300',
};

export function DetailingCalculator() {
  const [carClassId, setCarClassId] = useState<string>('sedan-m');
  const [serviceId,  setServiceId]  = useState<string>('polishing');
  const [packageId,  setPackageId]  = useState<string | null>(null);

  const currentService = useMemo(
    () => services.find((s) => s.id === serviceId)!,
    [serviceId]
  );

  const currentPackage = useMemo(
    () => currentService?.packages.find((p) => p.id === packageId) ?? null,
    [currentService, packageId]
  );

  const price = useMemo(
    () => (currentPackage ? currentPackage.prices[carClassId] ?? 0 : null),
    [currentPackage, carClassId]
  );

  const carClass = useMemo(
    () => carClasses.find((c) => c.id === carClassId),
    [carClassId]
  );

  /* Сброс пакета при смене услуги */
  const handleServiceChange = (id: string) => {
    setServiceId(id);
    setPackageId(null);
  };

  return (
    <section id="calculator" className="py-20 bg-[#0c0c0e]">
      <div className="container max-w-5xl">

        {/* ── Заголовок ── */}
        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-4">
            Калькулятор
          </span>
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wide text-white mb-3">
            Стоимость детейлинга
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">
            Выберите класс автомобиля, вид работ и пакет — узнайте точную цену за 10 секунд
          </p>
        </div>

        {/* ── Шаг 1: класс авто ── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            01 · Класс автомобиля
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {carClasses.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setCarClassId(cls.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-150 ${
                  carClassId === cls.id
                    ? 'border-[#39FF14]/60 bg-[#39FF14]/8 text-white'
                    : 'border-white/8 bg-[#111113] text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className={`text-[11px] font-semibold leading-tight mb-1 ${carClassId === cls.id ? 'text-[#39FF14]' : ''}`}>
                  {cls.label}
                </span>
                <span className="text-[10px] text-zinc-600">{cls.desc}</span>
                <span className="text-[10px] text-zinc-600 mt-1 leading-tight">{cls.examples}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Шаг 2: вид услуги ── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            02 · Вид работ
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {services.map((svc) => (
              <button
                key={svc.id}
                onClick={() => handleServiceChange(svc.id)}
                className={`flex flex-col items-start p-4 rounded-xl border transition-all duration-150 text-left ${
                  serviceId === svc.id
                    ? `${ACTIVE_COLORS[svc.id]} text-white`
                    : 'border-white/8 bg-[#111113] text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className={`text-2xl mb-2 ${serviceId === svc.id ? ICON_COLORS[svc.id] : 'text-zinc-600'}`}>
                  {ICONS[svc.id]}
                </span>
                <span className="text-[13px] font-semibold">{svc.name}</span>
                <span className="text-[11px] text-zinc-600 mt-1 leading-tight">{svc.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Шаг 3: пакет ── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            03 · Пакет
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentService.packages.map((pkg) => {
              const pkgPrice = pkg.prices[carClassId];
              const isActive = packageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => setPackageId(pkg.id)}
                  className={`relative flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-150 ${
                    isActive
                      ? `bg-gradient-to-br ${SERVICE_COLORS[serviceId]} shadow-lg`
                      : 'border-white/8 bg-[#111113] hover:border-white/20'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#39FF14] flex items-center justify-center text-black text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <p className={`text-sm font-bold mb-1 ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                    {pkg.name}
                  </p>
                  <p className="text-[12px] text-zinc-500 mb-3 leading-snug">{pkg.desc}</p>
                  <div className="flex items-center justify-between w-full mt-auto">
                    <span className={`text-xl font-bold ${isActive ? ICON_COLORS[serviceId] : 'text-zinc-300'}`}>
                      {pkgPrice.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-[11px] text-zinc-600 bg-white/5 px-2 py-1 rounded-full">
                      ⏱ {pkg.duration}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Результат ── */}
        <div
          className={`rounded-2xl border transition-all duration-300 ${
            price !== null
              ? 'bg-gradient-to-r from-[#39FF14]/10 to-transparent border-[#39FF14]/30 p-6'
              : 'border-white/8 bg-[#111113] p-6'
          }`}
        >
          {price !== null && currentPackage ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Ваш расчёт</p>
                <p className="text-white font-semibold text-lg">
                  {currentService.name} · {currentPackage.name}
                </p>
                <p className="text-zinc-500 text-sm mt-0.5">
                  Класс: <span className="text-zinc-300">{carClass?.label}</span>
                  &nbsp;·&nbsp;Срок: <span className="text-zinc-300">{currentPackage.duration}</span>
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-3">
                <span className="text-[#39FF14] text-3xl font-display font-bold" style={{ textShadow: '0 0 20px rgba(57,255,20,0.4)' }}>
                  {price.toLocaleString('ru-RU')} ₽
                </span>
                <button
                  onClick={() => openBooking()}
                  className="btn-primary px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap"
                >
                  Записаться на этот пакет
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-zinc-600">
              <span className="text-2xl">↑</span>
              <p className="text-sm">Выберите пакет выше — цена отобразится здесь</p>
            </div>
          )}
        </div>

        {/* ── Сноска ── */}
        <p className="text-center text-zinc-600 text-xs mt-5">
          Цены актуальны на апрель 2026. Точный расчёт — после осмотра автомобиля. Выезд мастера бесплатно.
        </p>
      </div>
    </section>
  );
}
