import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import services from '@/data/services.json';

export const metadata: Metadata = {
 title: 'Чип-тюнинг в СПб — Stage 1, 2, 3, DPF/EGR-off | HP Тюнинг',
 description: 'Профессиональный чип-тюнинг Stage 1/2/3 в Санкт-Петербурге. Удаление DPF, EGR, AdBlue. Прошивка ЭБУ BMW, Mercedes, Audi, Porsche, Land Rover. От 25 000 ₽.',
 alternates: { canonical: 'https://hptuning.ru/tuning/chip-tuning' },
 openGraph: {
 title: 'Чип-тюнинг в СПб — Stage 1, 2, 3, DPF/EGR-off | HP Тюнинг',
 description: 'Чип-тюнинг Stage 1/2/3 в Санкт-Петербурге. Alientech KESS3. BMW, Mercedes, Audi, Porsche, Land Rover. От 17 000 ₽.',
 url: 'https://hptuning.ru/tuning/chip-tuning',
 images: [{ url: 'https://hptuning.ru/images/og/chip-tuning.jpg', width: 1200, height: 630, alt: 'Чип-тюнинг Stage 1/2/3 в СПб | HP Тюнинг' }],
 },
};

const cat = services.categories.find((c) => c.slug === 'chip-tuning')!;

export default function ChipTuningPage() {
 return (
 <div className="section container">
 <nav className="text-sm text-text-subtle mb-8">
 <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
 <span className="mx-2">→</span>
 <Link href="/services" className="hover:text-accent transition-colors">Услуги</Link>
 <span className="mx-2">→</span>
 <span className="text-text-muted">Чип-тюнинг</span>
 </nav>

 <div className="flex items-center gap-4 mb-6">
 <div className="w-14 h-14 rounded-xl bg-accent-glow flex items-center justify-center">
 <Zap className="size-7 text-accent" />
 </div>
 <div>
 <span className="badge">Прошивка ЭБУ</span>
 <h1 className="section-title text-4xl md:text-5xl mt-1">ЧИП-ТЮНИНГ В СПБ</h1>
 </div>
 </div>
 <p className="section-subtitle mb-12">
 Профессиональная перепрошивка ЭБУ для роста мощности, тяги и снижения расхода топлива.
 BMW, Mercedes, Audi, Porsche, Land Rover и ещё 9 марок. </p>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
 {cat.items.map((item) => (
 <Link key={item.slug} href={`/services/chip-tuning/${item.slug}`}
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
 <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">КАКОЙ STAGE ВАМ ПОДОЙДЁТ?</h2>
 <p className="text-text-muted mb-5">Позвоните — за 2 минуты подберём оптимальный вариант для вашего авто и целей.</p>
 <a href="tel:+79818428151" className="btn-primary text-base px-10 py-4">+7 (981) 842-81-51</a>
 </div>
 </div>
 );
}
