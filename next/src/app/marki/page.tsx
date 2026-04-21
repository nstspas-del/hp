export const dynamic = 'force-static';
/**
 * /marki/ — HP Тюнинг СПб
 * Хаб всех брендов с фильтрами, поиском и коммерческими факторами для Яндекса.
 * Canonical: https://hptuning.ru/marki/
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, MessageCircle, Phone, MapPin, Clock, Shield, Star } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { MarkiClient } from './MarkiClient';
import {
  SPECIALIZATION,
  CHINESE_BRANDS,
  JAPANESE_KOREAN,
  EUROPEAN_OTHER,
  ALL_BRANDS_DATA,
} from '@/data/brands-marki';

export const metadata: Metadata = {
  title: 'Марки автомобилей — ТО, диагностика, ремонт в СПб | HP Тюнинг',
  description:
    'Автосервис в Санкт-Петербурге для 38+ марок: BMW, Mercedes-Benz, Audi, Porsche, Toyota, Lexus, Haval, Chery, Geely, Tank, Kia, Hyundai и других. ТО, диагностика, ремонт, детейлинг, тюнинг. Богородская 3Б. ☎ +7 (981) 842-81-51',
  keywords: [
    'автосервис спб марки',
    'сервис haval спб',
    'сервис chery спб',
    'сервис geely спб',
    'сервис китайских автомобилей спб',
    'то bmw mercedes audi спб',
    'автосервис 38 марок санкт-петербург',
    'ремонт японских автомобилей спб',
    'сервис корейских автомобилей спб',
  ],
  alternates: { canonical: 'https://hptuning.ru/marki/' },
  openGraph: {
    title: 'Марки автомобилей — HP Тюнинг Санкт-Петербург',
    description:
      'Европейские, японские, корейские и современные китайские автомобили — ТО, диагностика, ремонт, детейлинг и тюнинг в одном месте. 38+ марок, Богородская 3Б.',
    url: 'https://hptuning.ru/marki/',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/home.jpg', width: 1200, height: 630 }],
  },
};

// ── JSON-LD ───────────────────────────────────────────────────────────────────
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Марки автомобилей — HP Тюнинг СПб',
  description: 'Полный список брендов, с которыми работает HP Тюнинг в Санкт-Петербурге',
  numberOfItems: ALL_BRANDS_DATA.length,
  itemListElement: ALL_BRANDS_DATA.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name })),
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MarkiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <section className="pt-24 pb-10 bg-[#09090b] border-b border-white/5">
        <div className="container max-w-5xl">
          <nav className="text-xs text-zinc-500 mb-5 flex items-center gap-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#39FF14] transition-colors">Главная</Link>
            <ChevronRight className="size-3" />
            <span className="text-zinc-300">Марки</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white mb-4">
            Марки автомобилей{' '}
            <span className="text-[#39FF14]">в Санкт-Петербурге</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-8">
            ТО, диагностика, ремонт, детейлинг и тюнинг — для европейских, японских,
            корейских и современных китайских автомобилей. 38+ марок в одном месте,
            без беготни между сервисами.
          </p>

          {/* Коммерческие факторы */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <MapPin className="size-4" />, text: 'Богородская 3Б, СПб' },
              { icon: <Clock className="size-4" />, text: 'Ежедневно 10:00–20:00' },
              { icon: <Shield className="size-4" />, text: 'Гарантия 1 год на работы' },
              { icon: <Star className="size-4" />, text: '4.9 ★ — 247 отзывов' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 rounded-xl bg-white/3 border border-white/8 px-3 py-2.5">
                <span className="text-[#39FF14] shrink-0">{f.icon}</span>
                <span className="text-zinc-300 text-xs font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Интерактивная часть: фильтры + поиск + карточки (client) */}
      <MarkiClient
        specialization={SPECIALIZATION}
        chinese={CHINESE_BRANDS}
        japaneseKorean={JAPANESE_KOREAN}
        european={EUROPEAN_OTHER}
      />

      {/* CTA — статический HTML */}
      <section
        aria-label="Не нашли свою марку"
        className="container py-16"
      >
        <div className="rounded-2xl border border-[#39FF14]/20 bg-gradient-to-br from-[#39FF14]/5 to-transparent p-8 md:p-12 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mb-3">
            Не нашли свою марку?
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto mb-2 leading-relaxed">
            Если автомобиль современный — скорее всего берём в работу.
            Бесплатная онлайн-консультация за 15 минут.
          </p>
          <p className="text-zinc-600 text-sm mb-8">
            ТО от 4 900 ₽ · Диагностика от 2 500 ₽ · Гарантия на все работы 1 год
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <BookingButton
              label="Записаться онлайн"
              className="btn-primary px-8 py-3.5 text-sm font-semibold"
            />
            <a
              href="https://t.me/hptuningspb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14] text-sm font-semibold hover:bg-[#39FF14]/20 transition-colors"
            >
              <MessageCircle className="size-4" />
              Telegram
            </a>
            <a
              href="tel:+79818428151"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white text-sm font-semibold hover:border-[#39FF14]/30 hover:text-[#39FF14] transition-colors"
            >
              <Phone className="size-4" />
              +7 (981) 842-81-51
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
