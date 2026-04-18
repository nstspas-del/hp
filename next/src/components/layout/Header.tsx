'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { openBooking } from '@/lib/autodealer';

// ── Навигация — строго по ТЗ Блок 1 ─────────────────────────────────────────
const NAV = [
 {
 label: 'Автосервис',
 href: '/services/service',
 sub: [
 { label: 'Техническое обслуживание', href: '/services/service/to', desc: 'Замена масла, фильтров, свечей' },
 { label: 'Диагностика', href: '/services/service/diagnostics', desc: 'Компьютерная и ходовая' },
 { label: 'Двигатель', href: '/services/service/engine', desc: 'Ремонт и обслуживание' },
 { label: 'Тормоза', href: '/services/service/brakes', desc: 'Колодки, диски, суппорты' },
 { label: 'Подвеска', href: '/services/service/suspension', desc: 'Амортизаторы, рычаги, ступицы' },
 { label: 'Коробка передач', href: '/services/service/gearbox', desc: 'АКПП, DSG, вариатор' },
 { label: 'Электрика', href: '/services/service/electrics', desc: 'Проводка, датчики, блоки' },
 { label: 'Все услуги →', href: '/services', desc: '' },
 ],
 },
 {
 label: 'Марки',
 href: '/brands',
 sub: [
 { label: 'BMW', href: '/brands/bmw', logo: '/images/brands/bmw.svg' },
 { label: 'Mercedes-Benz', href: '/brands/mercedes', logo: '/images/brands/mercedes.svg' },
 { label: 'Audi', href: '/brands/audi', logo: '/images/brands/audi.svg' },
 { label: 'Porsche', href: '/brands/porsche', logo: '/images/brands/porsche.svg' },
 { label: 'Lexus', href: '/brands/lexus', logo: '/images/brands/lexus.svg' },
 { label: 'Land Rover', href: '/brands/land-rover', logo: '/images/brands/land-rover.svg' },
 { label: 'Все 23 марки →', href: '/brands', logo: null },
 ],
 },
 {
 label: 'Тюнинг',
 href: '/services/chip-tuning',
 sub: [
 { label: 'Чип-тюнинг', href: '/services/chip-tuning', desc: 'Stage 1 / 2 / 3, от 24 000 ₽' },
 { label: 'Тормозной тюнинг', href: '/services/chip-tuning/brakes', desc: 'Тормозные системы Brembo, AP Racing' },
 { label: 'Выхлопная система', href: '/services/chip-tuning/exhaust', desc: 'Sport-выхлоп, клапаны, катбэки' },
 { label: 'Шумоизоляция', href: '/services/chip-tuning/sound', desc: 'Виброизол, шумка дверей и пола' },
 { label: 'Тюнинг салона', href: '/services/chip-tuning/interior', desc: 'Карбон, алькантара, подсветка' },
 ],
 },
 {
 label: 'Детейлинг',
 href: '/services/detailing',
 sub: [
 { label: 'Керамика 9H', href: '/services/detailing/ceramic', desc: 'Gyeon, Ceramic Pro, от 25 000 ₽' },
 { label: 'PPF плёнка', href: '/services/detailing/ppf', desc: 'XPEL, SunTek — полная защита кузова' },
 { label: 'Полировка', href: '/services/detailing/polish', desc: 'Коррекция царапин, глубокий блеск' },
 { label: 'Химчистка', href: '/services/detailing/cleaning', desc: 'Салон, кожа, ковры, потолок' },
 { label: 'Тонировка', href: '/services/detailing/tinting', desc: 'LLUMAR, SunTek, съёмная' },
 ],
 },
 { label: 'Работы', href: '/works' },
 { label: 'Блог', href: '/blog' },
 { label: 'Контакты', href: '/contacts' },
];

// ── Dropdown ──────────────────────────────────────────────────────────────────
type DropItem = { label: string; href: string; desc?: string; logo?: string | null };

function Dropdown({ items, onClose }: {
 items: DropItem[];
 onClose: () => void;
}) {
 return (
 <div className="absolute top-full left-0 mt-2 bg-[#111113] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-50 min-w-[240px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
 {items.map((item) => (
 <Link
 key={item.href}
 href={item.href}
 onClick={onClose}
 className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
 >
 {/* Для марок — кружок-заглушка вместо svg */}
 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5 text-xs text-zinc-500 font-bold">
 {item.logo !== undefined
 ? item.label.slice(0, 2).toUpperCase()
 : '→'}
 </div>
 <div>
 <div className="text-sm text-white font-medium group-hover:text-[#39FF14] transition-colors leading-snug">
 {item.label}
 </div>
 {item.desc && (
 <div className="text-xs text-zinc-500 mt-0.5 leading-snug">{item.desc}</div>
 )}
 </div>
 </Link>
 ))}
 </div>
 );
}

// ── Компонент ─────────────────────────────────────────────────────────────────
export function Header() {
 const [scrolled, setScrolled] = useState(false);
 const [mobileOpen, setMobileOpen] = useState(false);
 const [openDrop, setOpenDrop] = useState<string | null>(null);
 const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
 const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 // Scroll detection
 useEffect(() => {
 const handler = () => setScrolled(window.scrollY > 50);
 window.addEventListener('scroll', handler, { passive: true });
 return () => window.removeEventListener('scroll', handler);
 }, []);

 // Блокировка скролла при открытом мобильном меню
 useEffect(() => {
 document.body.style.overflow = mobileOpen ? 'hidden' : '';
 return () => { document.body.style.overflow = ''; };
 }, [mobileOpen]);

 const handleDropEnter = (href: string) => {
 if (closeTimer.current) clearTimeout(closeTimer.current);
 setOpenDrop(href);
 };
 const handleDropLeave = () => {
 closeTimer.current = setTimeout(() => setOpenDrop(null), 120);
 };

 return (
 <>
 <header
 className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
 scrolled
 ? 'bg-[#09090b]/96 backdrop-blur-xl shadow-xl shadow-black/40'
 : 'bg-[#09090b]/70 backdrop-blur-md'
 }`}
 >
 {/* Зелёная линия при скролле */}
 <div className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-300 ${
 scrolled ? 'bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent' : 'opacity-0'
 }`} />

 <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex items-center justify-between h-16">

 {/* ── Лого ── */}
 <Logo />

 {/* ── Десктопная навигация (по центру) ── */}
 <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Основное меню">
 {NAV.map((item) => (
 <div
 key={item.href}
 className="relative"
 onMouseEnter={() => item.sub && handleDropEnter(item.href)}
 onMouseLeave={() => item.sub && handleDropLeave()}
 >
 <Link
 href={item.href}
 className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-colors
 ${openDrop === item.href
 ? 'text-[#39FF14] bg-[#39FF14]/8'
 : 'text-zinc-400 hover:text-white hover:bg-white/5'
 }`}
 >
 {item.label}
 {item.sub && (
 <ChevronDown
 className={`size-3 transition-transform duration-200 ${
 openDrop === item.href ? 'rotate-180 text-[#39FF14]' : 'opacity-50'
 }`}
 />
 )}
 </Link>

 {/* Дропдаун */}
 {item.sub && openDrop === item.href && (
 <Dropdown
 items={item.sub}
 onClose={() => setOpenDrop(null)}
 />
 )}
 </div>
 ))}
 </nav>

 {/* ── Правые кнопки (десктоп) ── */}
 <div className="hidden lg:flex items-center gap-3 shrink-0">
 <a
 href="tel:+79818428151"
 className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#39FF14] transition-colors"
 onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
 >
 <Phone className="size-4" />
 <span className="hidden xl:inline font-medium">+7 (981) 842-81-51</span>
 </a>
 <button
 onClick={() => openBooking()}
 className="btn-primary text-xs px-5 py-2.5 rounded-xl"
 >
 Записаться
 </button>
 </div>

 {/* ── Мобильный бургер ── */}
 <div className="lg:hidden flex items-center gap-2">
 <a
 href="tel:+79818428151"
 className="flex items-center justify-center size-10 rounded-xl bg-[#39FF14]/10 text-[#39FF14]"
 aria-label="Позвонить"
 onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
 >
 <Phone className="size-5" />
 </a>
 <button
 className="flex items-center justify-center size-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-colors"
 onClick={() => setMobileOpen(!mobileOpen)}
 aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
 aria-expanded={mobileOpen}
 >
 {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
 </button>
 </div>
 </div>
 </header>

 {/* ── Мобильное меню ── */}
 {mobileOpen && (
 <div className="lg:hidden fixed inset-0 z-40 bg-[#09090b] flex flex-col">
 {/* Шапка */}
 <div className="flex items-center justify-between h-16 px-5 border-b border-white/8 shrink-0">
 <Logo onClick={() => setMobileOpen(false)} />
 <button
 className="flex items-center justify-center size-10 rounded-xl bg-white/5 text-zinc-400"
 onClick={() => setMobileOpen(false)}
 aria-label="Закрыть меню"
 >
 <X className="size-5" />
 </button>
 </div>

 {/* Тело меню */}
 <div className="flex-1 overflow-y-auto p-4 space-y-1 pb-28">
 {/* CTA кнопки */}
 <div className="grid grid-cols-2 gap-2 mb-5">
 <button
 onClick={() => { openBooking(); setMobileOpen(false); }}
 className="btn-primary py-3 text-sm justify-center rounded-xl"
 >
 Записаться
 </button>
 <a
 href="tel:+79818428151"
 className="flex items-center justify-center gap-2 py-3 text-sm bg-white/5 text-[#39FF14] rounded-xl font-medium"
 onClick={() => setMobileOpen(false)}
 >
 <Phone className="size-4" />
 Позвонить
 </a>
 </div>

 {/* Все пункты меню */}
 {NAV.map((item) => (
 <div key={item.href}>
 {item.sub ? (
 <>
 <button
 className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
 onClick={() => setMobileExpanded(mobileExpanded === item.href ? null : item.href)}
 >
 <span className="text-white font-medium text-sm">{item.label}</span>
 <ChevronDown
 className={`size-4 text-zinc-500 transition-transform duration-200 ${
 mobileExpanded === item.href ? 'rotate-180' : ''
 }`}
 />
 </button>
 {mobileExpanded === item.href && (
 <div className="pl-4 flex flex-col gap-0.5 mb-1">
 {item.sub.map((sub) => (
 <Link
 key={sub.href}
 href={sub.href}
 onClick={() => setMobileOpen(false)}
 className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
 >
 <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/50 shrink-0" />
 <div>
 <div className="text-sm text-zinc-300 font-medium">{sub.label}</div>
 {'desc' in sub && sub.desc && (
 <div className="text-xs text-zinc-600">{sub.desc}</div>
 )}
 </div>
 </Link>
 ))}
 </div>
 )}
 </>
 ) : (
 <Link
 href={item.href}
 onClick={() => setMobileOpen(false)}
 className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
 >
 <span className="text-white font-medium text-sm">{item.label}</span>
 </Link>
 )}
 </div>
 ))}
 </div>

 {/* Подвал мобильного меню */}
 <div className="shrink-0 p-4 border-t border-white/8">
 <p className="text-center text-zinc-600 text-xs">
 +7 (981) 842-81-51 · Богородская, 3Б · 10:00–20:00
 </p>
 </div>
 </div>
 )}

 {/* ── Мобильный sticky CTA снизу ── */}
 <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#09090b]/95 backdrop-blur-md border-t border-white/8 p-3 safe-area-pb">
 <div className="flex gap-2">
 <button
 onClick={() => openBooking()}
 className="btn-primary flex-1 py-3 text-sm justify-center rounded-xl"
 >
 Записаться
 </button>
 <a
 href="tel:+79818428151"
 className="flex items-center justify-center size-12 rounded-xl bg-white/5 text-[#39FF14] shrink-0"
 onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
 >
 <Phone className="size-5" />
 </a>
 </div>
 </div>
 </>
 );
}
