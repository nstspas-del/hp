/**
 * BrandSubdomainBadge — HP Тюнинг
 *
 * Маленькая визуальная подсказка, которая появляется ТОЛЬКО на брендовых
 * сабдоменах (bmw.hptuning.ru, mercedes.hptuning.ru и т.п.).
 *
 * Цель: юзер должен видеть, что он в брендовом разделе HP Тюнинг,
 * и у него есть очевидный выход на основной hptuning.ru.
 *
 * Логотип сам ведёт на hptuning.ru (см. Logo.tsx). Этот компонент —
 * дополнительная навигационная подсказка («/ BMW»), чтобы юзер понимал контекст.
 */
'use client';

import { useEffect, useState } from 'react';

const BRAND_LABELS: Record<string, string> = {
  bmw: 'BMW',
  mercedes: 'Mercedes',
  audi: 'Audi',
  porsche: 'Porsche',
  volkswagen: 'Volkswagen',
  toyota: 'Toyota',
  lexus: 'Lexus',
  landrover: 'Land Rover',
};

const BRAND_HOSTS: Record<string, string> = {
  bmw: 'bmw.hptuning.ru',
  mercedes: 'mercedes.hptuning.ru',
  audi: 'audi.hptuning.ru',
  porsche: 'porsche.hptuning.ru',
  volkswagen: 'volkswagen.hptuning.ru',
  toyota: 'toyota.hptuning.ru',
  lexus: 'lexus.hptuning.ru',
  landrover: 'landrover.hptuning.ru',
};

export function BrandSubdomainBadge() {
  const [brand, setBrand] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    // Парсим bmw.hptuning.ru → 'bmw'
    const parts = host.split('.');
    if (parts.length >= 3 && parts.slice(-2).join('.') === 'hptuning.ru') {
      const sub = parts[0].toLowerCase();
      if (BRAND_LABELS[sub]) {
        setBrand(sub);
      }
    }
  }, []);

  if (!brand) return null;

  return (
    <span
      className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-500 font-medium select-none"
      aria-label={`Раздел ${BRAND_LABELS[brand]} на сайте HP Тюнинг`}
    >
      <span className="text-zinc-700">/</span>
      <span className="text-zinc-400 uppercase tracking-wider text-[10px]">
        {BRAND_LABELS[brand]}
      </span>
    </span>
  );
}
