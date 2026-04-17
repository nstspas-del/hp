'use client';
import { useState, useMemo } from 'react';
import { Sparkles, ChevronDown, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';
import data from '@/data/detailing-calculator.json';

type Category = (typeof data.categories)[number];
type Service = (typeof data.services)[number];

const GROUPS = [
  { label: 'Мойка', ids: ['wash-2phase', 'wash-detail', 'wash-detail-plus', 'wash-detail-pro'] },
  { label: 'Химчистка салона', ids: ['dry-clean-partial', 'dry-clean-full'] },
  { label: 'Полировка', ids: ['polish-1', 'polish-2', 'polish-3'] },
  { label: 'Керамика', ids: ['ceramic-1', 'ceramic-2'] },
  { label: 'PPF плёнка', ids: ['ppf-hood', 'ppf-front', 'ppf-full'] },
  { label: 'Тонировка', ids: ['tint-rear', 'tint-full'] },
  { label: 'Мойка агрегатов', ids: ['engine-wash', 'bottom-wash'] },
];

function fmt(n: number) {
  return n.toLocaleString('ru-RU');
}

export function DetailingCalculator() {
  const [catId, setCatId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const cat = useMemo(() => data.categories.find((c) => c.id === catId) ?? null, [catId]);

  function getPrice(s: Service): number {
    if (catId === null) return 0;
    return s.prices[catId - 1] ?? 0;
  }

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedServices = useMemo(
    () => data.services.filter((s) => selected.has(s.id)),
    [selected]
  );

  const total = useMemo(
    () => selectedServices.reduce((acc, s) => acc + getPrice(s), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedServices, catId]
  );

  return (
    <section className="section bg-bg-elevated" id="detailing-calculator">
      <div className="container">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <span className="badge mb-4">
            <Sparkles className="size-3 mr-1" />
            Калькулятор детейлинга
          </span>
          <h2 className="section-title">РАССЧИТАЙ СТОИМОСТЬ</h2>
          <p className="section-subtitle mx-auto">
            Выбери тип авто и нужные услуги — получи точную цену за 30 секунд
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Шаг 1 — категория */}
          <div className="mb-8">
            <p className="text-text-subtle text-xs uppercase tracking-wider mb-3 font-medium">
              <span className="text-accent font-bold mr-1">1.</span> Тип автомобиля
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.categories.map((c: Category) => (
                <button
                  key={c.id}
                  onClick={() => setCatId(c.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    catId === c.id
                      ? 'border-accent bg-accent/10 shadow-[0_0_20px_rgba(57,255,20,0.15)]'
                      : 'border-border bg-bg hover:border-accent/40'
                  }`}
                >
                  <div className="text-text text-sm font-semibold leading-tight mb-1">{c.label}</div>
                  <div className="text-text-subtle text-xs leading-snug">{c.example}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Шаг 2 — услуги */}
          <div className={`transition-all duration-300 ${catId ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'}`}>
            <p className="text-text-subtle text-xs uppercase tracking-wider mb-4 font-medium">
              <span className="text-accent font-bold mr-1">2.</span> Выберите услуги (можно несколько)
            </p>

            <div className="flex flex-col gap-3">
              {GROUPS.map((group) => {
                const groupServices = group.ids
                  .map((id) => data.services.find((s) => s.id === id))
                  .filter(Boolean) as Service[];
                if (!groupServices.length) return null;

                return (
                  <div key={group.label} className="card overflow-hidden">
                    <div className="px-4 py-2.5 bg-bg border-b border-border">
                      <span className="text-text-muted text-xs uppercase tracking-widest font-bold">
                        {group.label}
                      </span>
                    </div>
                    {groupServices.map((s) => {
                      const price = getPrice(s);
                      const isSelected = selected.has(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleService(s.id)}
                          className={`w-full text-left flex items-start gap-3 px-4 py-3.5 transition-colors border-b border-border/50 last:border-0 ${
                            isSelected ? 'bg-accent/5' : 'hover:bg-bg-elevated/50'
                          }`}
                        >
                          <div
                            className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-accent bg-accent'
                                : 'border-border'
                            }`}
                          >
                            {isSelected && <CheckCircle className="size-3 text-black" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-sm font-semibold ${isSelected ? 'text-accent' : 'text-text'}`}>
                                {s.name}
                              </span>
                              <span className={`text-sm font-bold shrink-0 ${isSelected ? 'text-accent' : 'text-text-muted'}`}>
                                {catId ? `${fmt(price)} ₽` : '—'}
                              </span>
                            </div>
                            <div className="text-text-subtle text-xs mt-0.5 leading-relaxed pr-2">
                              {s.description}
                            </div>
                            <div className="flex items-center gap-1 mt-1.5 text-text-subtle text-xs">
                              <Clock className="size-3" />
                              {s.duration}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Итог */}
          {selectedServices.length > 0 && catId && (
            <div className="mt-8 card p-6 border-accent/30 bg-accent/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="text-text-subtle text-xs uppercase tracking-wider mb-1">
                    Итого за {selectedServices.length} услуг{selectedServices.length === 1 ? 'у' : 'и'}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl text-accent">{fmt(total)}</span>
                    <span className="text-text-muted text-xl">₽</span>
                  </div>
                  <div className="text-text-subtle text-xs mt-1">{cat?.label}</div>
                </div>
                <button
                  onClick={() => openBooking('Детейлинг')}
                  className="flex items-center gap-2 bg-[#39FF14] text-black font-bold px-6 py-3.5 rounded-full hover:bg-[#39FF14]/90 hover:shadow-[0_0_24px_rgba(57,255,20,0.4)] transition-all"
                >
                  Записаться по этой цене
                  <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Перечень */}
              <div className="border-t border-border pt-4 flex flex-col gap-2">
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span className="text-text-muted">{s.name}</span>
                    <span className="text-text font-medium">{fmt(getPrice(s))} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Подсказка если ничего не выбрано */}
          {catId && selected.size === 0 && (
            <div className="mt-6 text-center text-text-subtle text-sm">
              ← Выберите одну или несколько услуг выше
            </div>
          )}
          {!catId && (
            <div className="mt-6 text-center text-text-subtle text-sm">
              ↑ Сначала выберите тип автомобиля
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
