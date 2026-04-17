import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';
import services from '@/data/services.json';

export const metadata: Metadata = {
  title: 'Автосервис в СПб — ТО, диагностика, ремонт подвески | HP Тюнинг',
  description: 'Автосервис в Санкт-Петербурге: ТО, компьютерная диагностика, ремонт тормозов, подвески, двигателя и АКПП. BMW, Mercedes, Audi, Porsche. От 1 500 ₽.',
  alternates: { canonical: 'https://hptuning.ru/services/service' },
};

const cat = services.categories.find((c) => c.slug === 'service')!;

export default function AutoservicePage() {
  return (
    <div className="section container">
      <nav className="text-sm text-text-subtle mb-8">
        <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
        <span className="mx-2">→</span>
        <Link href="/services" className="hover:text-accent transition-colors">Услуги</Link>
        <span className="mx-2">→</span>
        <span className="text-text-muted">Автосервис</span>
      </nav>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Wrench className="size-7 text-orange-400" />
        </div>
        <div>
          <span className="badge">Ремонт и ТО</span>
          <h1 className="section-title text-4xl md:text-5xl mt-1">АВТОСЕРВИС В СПБ</h1>
        </div>
      </div>
      <p className="section-subtitle mb-12">
        Техническое обслуживание и ремонт премиальных автомобилей. Компьютерная диагностика,
        ремонт двигателя, АКПП, подвески и тормозной системы. Запчасти только оригинал или премиум-аналог.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {cat.items.map((item) => (
          <Link key={item.slug} href={`/services/service/${item.slug}`}
            className="card group hover:border-accent-dim flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-text font-semibold text-lg group-hover:text-accent transition-colors">{item.name}</h2>
              <ArrowRight className="size-4 text-text-subtle group-hover:text-accent transition-colors shrink-0 mt-1" />
            </div>
            {item.shortDescription && <p className="text-text-subtle text-sm leading-relaxed line-clamp-2">{item.shortDescription}</p>}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
              <span className="text-accent font-bold">от {item.priceFrom.toLocaleString('ru-RU')} ₽</span>
              {item.duration && <span className="text-text-subtle text-xs">{item.duration}</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="card border-accent-dim p-8 glow-box text-center">
        <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">ЗАПИСЬ НА ДИАГНОСТИКУ</h2>
        <p className="text-text-muted mb-5">Компьютерная диагностика от 1 500 ₽. Запишитесь онлайн или позвоните.</p>
        <a href="tel:+79818428151" className="btn-primary text-base px-10 py-4">+7 (981) 842-81-51</a>
      </div>
    </div>
  );
}
