'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Calculator, ChevronDown, Zap, CheckCircle, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';
import { openBooking } from '@/lib/autodealer';
import calcData from '@/data/calculator.json';

interface Variant {
  id: string;
  label: string;
  hp: number;
  our_price: number;
  competitor_price: number;
}

interface Model {
  slug: string;
  name: string;
  variants: Variant[];
}

interface Brand {
  slug: string;
  name: string;
  models: Model[];
}

interface LivePrices {
  stage1: number | null;
  stage2: number | null;
  stage3: number | null;
  sevenforceUrl: string;
  loading: boolean;
  error: boolean;
}

export function PriceCalculator() {
  const brands = calcData.brands as Brand[];

  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [livePrices, setLivePrices] = useState<LivePrices | null>(null);

  const currentBrand = useMemo(
    () => brands.find((b) => b.slug === selectedBrand) ?? null,
    [brands, selectedBrand]
  );
  const currentModel = useMemo(
    () => currentBrand?.models.find((m) => m.slug === selectedModel) ?? null,
    [currentBrand, selectedModel]
  );
  const currentVariant = useMemo(
    () => currentModel?.variants.find((v) => v.id === selectedVariant) ?? null,
    [currentModel, selectedVariant]
  );

  // Актуальная цена конкурента с SevenForce
  const fetchLivePrice = useCallback(async (brand: string, model: string) => {
    if (!brand || !model) return;
    setLivePrices({ stage1: null, stage2: null, stage3: null, sevenforceUrl: '', loading: true, error: false });
    try {
      const res = await fetch(`/api/sevenforce?brand=${brand}&model=${model}`);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      setLivePrices({ ...data.prices, sevenforceUrl: data.sevenforceUrl, loading: false, error: false });
    } catch {
      setLivePrices({ stage1: null, stage2: null, stage3: null, sevenforceUrl: '', loading: false, error: true });
    }
  }, []);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      fetchLivePrice(selectedBrand, selectedModel);
    } else {
      setLivePrices(null);
    }
  }, [selectedBrand, selectedModel, fetchLivePrice]);

  const competitorPrice = livePrices?.stage1 ?? currentVariant?.competitor_price ?? 0;
  const savings = currentVariant ? competitorPrice - currentVariant.our_price : 0;

  function handleBrandChange(v: string) {
    setSelectedBrand(v);
    setSelectedModel('');
    setSelectedVariant('');
  }

  function handleModelChange(v: string) {
    setSelectedModel(v);
    setSelectedVariant('');
  }

  return (
    <section className="section bg-bg-elevated" id="calculator">
      <div className="container">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <span className="badge mb-4">
            <Calculator className="size-3 mr-1" />
            Калькулятор стоимости
          </span>
          <h2 className="section-title">УЗНАЙ ЦЕНУ ТЮНИНГА</h2>
          <p className="section-subtitle mx-auto">
            Выбери марку, модель и двигатель — мы дешевле конкурентов на&nbsp;500–1&nbsp;000&nbsp;₽ и даём 1 год гарантии.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-6 md:p-8">
            {/* Шаг 1 — марка */}
            <div className="mb-5">
              <label className="block text-text-muted text-sm font-medium mb-2">
                <span className="text-accent font-bold mr-1">1.</span> Марка автомобиля
              </label>
              <div className="relative">
                <select
                  className="w-full bg-bg border border-border text-text rounded-xl px-4 py-3 pr-10 appearance-none focus:border-accent focus:outline-none transition-colors"
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                >
                  <option value="">— Выберите марку —</option>
                  {brands.map((b) => (
                    <option key={b.slug} value={b.slug}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
              </div>
            </div>

            {/* Шаг 2 — модель */}
            <div className="mb-5">
              <label className="block text-text-muted text-sm font-medium mb-2">
                <span className="text-accent font-bold mr-1">2.</span> Модель
              </label>
              <div className="relative">
                <select
                  className="w-full bg-bg border border-border text-text rounded-xl px-4 py-3 pr-10 appearance-none focus:border-accent focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  disabled={!currentBrand}
                >
                  <option value="">— Выберите модель —</option>
                  {currentBrand?.models.map((m) => (
                    <option key={m.slug} value={m.slug}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
              </div>
            </div>

            {/* Шаг 3 — двигатель/вариант */}
            <div className="mb-8">
              <label className="block text-text-muted text-sm font-medium mb-2">
                <span className="text-accent font-bold mr-1">3.</span> Двигатель и поколение
              </label>
              <div className="relative">
                <select
                  className="w-full bg-bg border border-border text-text rounded-xl px-4 py-3 pr-10 appearance-none focus:border-accent focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  disabled={!currentModel}
                >
                  <option value="">— Выберите вариант —</option>
                  {currentModel?.variants.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-subtle pointer-events-none" />
              </div>
            </div>

            {/* Результат */}
            {currentVariant ? (
              <div className="border-t border-border pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  {/* Наша цена */}
                  <div>
                    <div className="text-text-subtle text-xs uppercase tracking-wider mb-1">Наша цена</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl text-accent glow-accent">
                        {currentVariant.our_price.toLocaleString('ru-RU')}
                      </span>
                      <span className="text-text-muted text-lg">₽</span>
                    </div>
                  </div>

                  {/* Конкурент */}
                  <div className="text-right sm:text-right">
                    <div className="flex items-center gap-1 justify-end text-text-subtle text-xs uppercase tracking-wider mb-1">
                      SevenForce
                      {livePrices?.loading && <RefreshCw className="size-3 animate-spin" />}
                      {livePrices?.sevenforceUrl && (
                        <a href={livePrices.sevenforceUrl} target="_blank" rel="noopener noreferrer" title="Смотреть на SevenForce">
                          <ExternalLink className="size-3 text-text-subtle hover:text-accent transition-colors" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-text-muted text-xl line-through opacity-60">
                        {competitorPrice > 0 ? competitorPrice.toLocaleString('ru-RU') : '—'}
                      </span>
                      <span className="text-text-subtle text-sm">₽</span>
                    </div>
                    {savings > 0 && (
                      <div className="text-accent text-sm font-semibold mt-0.5">
                        −{savings.toLocaleString('ru-RU')} ₽ дешевле!
                      </div>
                    )}
                    {livePrices?.error && (
                      <div className="text-text-subtle text-xs mt-0.5">цена из кеша</div>
                    )}
                  </div>
                </div>

                {/* Что включено */}
                <div className="flex flex-col gap-2 text-sm text-text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-accent shrink-0" />
                    Дилерское программное обеспечение для {currentBrand?.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-accent shrink-0" />
                    Прирост мощности до +20–30% в зависимости от Stage
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-accent shrink-0" />
                    Гарантия 1 год · откат к стоку бесплатно · без записи в ПТС
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-accent shrink-0" />
                    Мощность: {currentVariant.hp} л.с. → ~{Math.round(currentVariant.hp * 1.2)} л.с. (оценка Stage 1)
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => openBooking(`${currentBrand?.name} ${currentModel?.name}`)}
                    className="btn-primary flex-1 justify-center gap-2"
                  >
                    Записаться по этой цене
                    <ArrowRight className="size-4" />
                  </button>
                  <a href="tel:+79818428151" className="btn-secondary justify-center px-6">
                    Позвонить
                  </a>
                </div>

                <p className="text-text-subtle text-xs mt-3 text-center">
                  * Финальная стоимость подтверждается при записи. Цена действительна 7 дней.
                </p>
              </div>
            ) : (
              /* Подсказка когда ничего не выбрано */
              <div className="border-t border-border pt-6 text-center text-text-subtle text-sm">
                <Calculator className="size-8 text-accent/30 mx-auto mb-2" />
                Выберите марку, модель и двигатель — узнаете точную цену чип-тюнинга
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
