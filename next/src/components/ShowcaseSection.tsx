'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Wrench, Zap, Settings, Activity, Gauge,
  Trophy, Volume2, Sparkles, Star, Droplets, Eye,
  Camera, ArrowRight, Check
} from 'lucide-react';
import showcaseData from '@/data/showcase.json';

// Маппинг иконок
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; color?: string }>> = {
  Shield, Wrench, Zap, Settings, Activity, Gauge,
  Trophy, Volume2, Sparkles, Star, Droplets, Eye, Camera, Check,
};

function getIcon(name: string) {
  return ICON_MAP[name] ?? Check;
}

const TABS = showcaseData.tabs;

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tab = TABS[activeTab];

  return (
    <section className="section bg-background">
      <div className="container">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <h2 className="heading-2 mb-3">Что мы делаем</h2>
          <p className="text-text-muted text-base max-w-xl mx-auto">
            Полный цикл работ с автомобилем — от диагностики до защитных покрытий
          </p>
        </div>

        {/* Таб-переключатель */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 rounded-2xl bg-surface border border-border gap-1">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(i)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  i === activeTab ? 'text-background' : 'text-text-muted hover:text-text'
                }`}
              >
                {i === activeTab && (
                  <motion.div
                    layoutId="showcase-tab-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: t.accent }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Контент */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start"
          >
            {/* Левая часть — фото (2/5) */}
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-border">
                <Image
                  src={tab.image}
                  alt={tab.label}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback при отсутствии фото
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = 'none';
                  }}
                />
                {/* Градиент-оверлей */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                {/* Подпись внизу фото */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium leading-snug">{tab.subtitle}</p>
                </div>
                {/* Цветовой акцент-точка */}
                <div
                  className="absolute top-4 right-4 w-3 h-3 rounded-full"
                  style={{ backgroundColor: tab.accent, boxShadow: `0 0 12px ${tab.accent}` }}
                />
              </div>

              {/* CTA под фото */}
              <Link
                href={tab.href}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: tab.accent, color: activeTab === 1 ? '#0A0A0A' : '#fff' }}
              >
                {tab.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Правая часть — фичи (3/5) */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tab.features.map((feature, i) => {
                  const Icon = getIcon(feature.icon);
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.25 }}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-border hover:border-[color:var(--accent)] transition-colors group"
                      style={{ '--accent': tab.accent } as React.CSSProperties}
                    >
                      <div
                        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: `${tab.accent}18` }}
                      >
                        <Icon
                          className="size-4"
                          color={tab.accent}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-text mb-0.5">{feature.title}</div>
                        <div className="text-xs text-text-subtle leading-relaxed">{feature.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
