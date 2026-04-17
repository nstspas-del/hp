import Link from 'next/link';
import { Phone, MapPin, Clock, Send } from 'lucide-react';
import company from '@/data/company.json';

const LINKS = {
  services: [
    { label: 'Чип-тюнинг Stage 1', href: '/services/chip-tuning/stage-1' },
    { label: 'Чип-тюнинг Stage 2', href: '/services/chip-tuning/stage-2' },
    { label: 'Чип-тюнинг Stage 3', href: '/services/chip-tuning/stage-3' },
    { label: 'Детейлинг', href: '/services/detailing' },
    { label: 'Автосервис', href: '/services/service' },
  ],
  brands: [
    { label: 'BMW', href: '/brands/bmw' },
    { label: 'Mercedes-Benz', href: '/brands/mercedes' },
    { label: 'Audi', href: '/brands/audi' },
    { label: 'Porsche', href: '/brands/porsche' },
    { label: 'Lexus', href: '/brands/lexus' },
    { label: 'Land Rover', href: '/brands/land-rover' },
  ],
  info: [
    { label: 'О компании', href: '/about' },
    { label: 'Работы', href: '/works' },
    { label: 'Блог', href: '/blog' },
    { label: 'Отзывы', href: '/reviews' },
    { label: 'Контакты', href: '/contacts' },
    { label: 'Политика конфиденциальности', href: '/privacy' },
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
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl text-accent">HP</span>
              <span className="font-display text-2xl text-text">ТЮНИНГ</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Премиальный тюнинг и автосервис в Санкт-Петербурге с 2015 года. Специализируемся на BMW, Mercedes, Audi, Porsche.
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
                  <Link href={l.href} className="text-text-muted hover:text-accent text-sm transition-colors">
                    {l.label}
                  </Link>
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

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-subtle">
          <p>© {year} {company.name}. Все права защищены.</p>
          <p>{company.legalNameShort} · ИНН {company.inn} · ОГРНИП {company.ogrnip}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-text-muted transition-colors">Конфиденциальность</Link>
            <Link href="/cookies" className="hover:text-text-muted transition-colors">Cookie</Link>
            <Link href="/offer" className="hover:text-text-muted transition-colors">Оферта</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
