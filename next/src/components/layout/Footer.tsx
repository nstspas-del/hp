import Link from 'next/link';
import { Phone, MapPin, Clock, Send, Zap } from 'lucide-react';
import company from '@/data/company.json';

const LINKS = {
 services: [
 { label: 'Чип-тюнинг', href: '/tuning/chip-tuning' },
 { label: 'Тюнинг', href: '/tuning' },
 { label: 'Детейлинг', href: '/detailing' },
 { label: 'Автосервис', href: '/service' },
 { label: 'Диагностика', href: '/service/diagnostics' },
 ],
 brands: [
 { label: 'BMW',           href: 'https://bmw.hptuning.ru' },
 { label: 'Mercedes-Benz', href: 'https://mercedes.hptuning.ru' },
 { label: 'Audi',          href: 'https://audi.hptuning.ru' },
 { label: 'Porsche',       href: 'https://porsche.hptuning.ru' },
 { label: 'Lexus',         href: 'https://lexus.hptuning.ru' },
 { label: 'Land Rover',    href: 'https://landrover.hptuning.ru' },
 ],
 info: [
 { label: 'О компании', href: '/about' },
 { label: 'Работы', href: '/works' },
 { label: 'Блог', href: '/blog' },
 { label: 'Отзывы', href: '/reviews' },
 { label: 'Контакты', href: '/contacts' },
 { label: 'Политика конфиденциальности', href: '/privacy' },
 { label: 'Согласие ПДн', href: '/consent' },
 ],
};

export function Footer() {
 const year = new Date().getFullYear();
 return (
 <footer className="bg-bg-elevated border-t border-border mt-auto">
 <div className="container py-12 md:py-16">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
 {/* Brand */}
 <div>
 <Link href="/" className="flex items-center gap-2.5 mb-4">
 <div className="relative w-8 h-8 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0"
 style={{ boxShadow: '0 0 8px rgba(57,255,20,0.3)' }}>
 <Zap className="size-4 text-[#39FF14]" fill="currentColor" />
 </div>
 <div>
 <div className="flex items-baseline gap-1">
 <span className="font-display text-xl text-[#39FF14] leading-none">HP</span>
 <span className="font-display text-xl text-white leading-none">ТЮНИНГ</span>
 </div>
 </div>
 </Link>
 <p className="text-text-muted text-sm leading-relaxed mb-6">
 Премиальный тюнинг и автосервис в Санкт-Петербурге с 2015 года. Специализируемся на BMW, Mercedes, Audi, Porsche, Land Rover.
 </p>
 <div className="flex flex-col gap-3 text-sm">
 <a href={company.contacts.phone.href}
 className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors">
 <Phone className="size-4 text-accent shrink-0" />
 {company.contacts.phone.display}
 </a>
 <a href={company.contacts.telegram.href} target="_blank" rel="noopener noreferrer"
 className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors">
 <Send className="size-4 text-accent shrink-0" />
 {company.contacts.telegram.display}
 </a>
 <span className="flex items-start gap-2 text-text-muted">
 <MapPin className="size-4 text-accent shrink-0 mt-0.5" />
 {company.address.short}
 </span>
 <span className="flex items-center gap-2 text-text-muted">
 <Clock className="size-4 text-accent shrink-0" />
 {company.workHours.schedule}
 </span>
 </div>
 </div>

 {/* Услуги */}
 <div>
 <h4 className="text-text font-semibold mb-4 uppercase tracking-wider text-sm">Услуги</h4>
 <ul className="flex flex-col gap-2">
 {LINKS.services.map((l) => (
 <li key={l.href}>
 <Link href={l.href} className="text-text-muted hover:text-accent text-sm transition-colors">
 {l.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Бренды */}
 <div>
 <h4 className="text-text font-semibold mb-4 uppercase tracking-wider text-sm">Бренды</h4>
 <ul className="flex flex-col gap-2">
 {LINKS.brands.map((l) => (
 <li key={l.href}>
 <a href={l.href} className="text-text-muted hover:text-accent text-sm transition-colors">
 {l.label}
 </a>
 </li>
 ))}
 <li>
 <Link href="/brands" className="text-accent text-sm hover:underline transition-colors">
 Все бренды →
 </Link>
 </li>
 </ul>
 </div>

 {/* Информация */}
 <div>
 <h4 className="text-text font-semibold mb-4 uppercase tracking-wider text-sm">Информация</h4>
 <ul className="flex flex-col gap-2">
 {LINKS.info.map((l) => (
 <li key={l.href}>
 <Link href={l.href} className="text-text-muted hover:text-accent text-sm transition-colors">
 {l.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </div>

 <div className="border-t border-border mt-10 pt-6 flex flex-col gap-3 text-xs text-text-subtle">
 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
 <p>© {year} {company.name}. Все права защищены.</p>
 <p>{company.legalNameShort} · ИНН {company.inn} · ОГРНИП {company.ogrnip}</p>
 <div className="flex flex-wrap gap-4">
 <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-text-muted transition-colors">Политика ПДн</Link>
 <Link href="/consent" target="_blank" rel="noopener noreferrer" className="hover:text-[#39FF14] transition-colors">Согласие ПДн</Link>
 <Link href="/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-text-muted transition-colors">Cookie</Link>
 </div>
 </div>
 {/* Разработка сайта — как у КатАвто */}
 <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-2 border-t border-border/40">
 <p className="text-text-subtle/60">
 По вопросам разработки сайта:{' '}
 <a
 href="mailto:hptuningspb@yandex.ru"
 className="hover:text-accent transition-colors"
 >
 hptuningspb@yandex.ru
 </a>
 </p>
 <p className="text-text-subtle/40 text-[10px]">
 Сайт разработан под ключ для автосервиса HP Тюнинг · СПб, 2026
 </p>
 </div>
 </div>
 </div>
 </footer>
 );
}
