import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, MapPin, Clock, Send, Mail } from 'lucide-react';
import company from '@/data/company.json';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
  title: seoData.pages.contacts.title,
  description: seoData.pages.contacts.description,
  alternates: { canonical: 'https://hptuning.ru/contacts' },
};

export default function ContactsPage() {
  return (
    <div className="section container">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-subtle mb-8">
        <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
        <span className="mx-2">→</span>
        <span className="text-text-muted">Контакты</span>
      </nav>

      <h1 className="section-title mb-10">{seoData.pages.contacts.h1}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Контакты */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="font-display text-xl text-text uppercase tracking-wider mb-5">Как связаться</h2>
            <div className="flex flex-col gap-4">
              <a href={company.contacts.phone.href}
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group">
                <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="size-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Телефон</div>
                  <div className="font-semibold group-hover:text-accent transition-colors">
                    {company.contacts.phone.display}
                  </div>
                </div>
              </a>
              <a href={company.contacts.telegram.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group">
                <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
                  <Send className="size-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Telegram</div>
                  <div className="font-semibold group-hover:text-accent transition-colors">
                    {company.contacts.telegram.display}
                  </div>
                </div>
              </a>
              <a href={company.contacts.email.href}
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group">
                <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Email</div>
                  <div className="font-semibold group-hover:text-accent transition-colors">
                    {company.contacts.email.display}
                  </div>
                </div>
              </a>
              <div className="flex items-start gap-3 text-text-muted">
                <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Адрес</div>
                  <div className="font-semibold">{company.address.full}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="size-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Режим работы</div>
                  <div className="font-semibold">{company.workHours.schedule}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Реквизиты */}
          <div className="card">
            <h2 className="font-display text-xl text-text uppercase tracking-wider mb-5">Реквизиты</h2>
            <dl className="flex flex-col gap-3 text-sm">
              {[
                { label: 'Юридическое лицо', value: company.legalName },
                { label: 'ИНН', value: company.inn },
                { label: 'ОГРНИП', value: company.ogrnip },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="text-text-subtle w-40 shrink-0">{label}</dt>
                  <dd className="text-text-muted">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Яндекс карта */}
        <div className="card p-0 overflow-hidden min-h-[400px]">
          <iframe
            src={`https://yandex.ru/map-widget/v1/?pt=${company.geo.longitude},${company.geo.latitude}&z=16&l=map`}
            width="100%"
            height="100%"
            style={{ minHeight: 400, border: 0 }}
            allowFullScreen
            loading="lazy"
            title="HP Тюнинг на карте"
          />
        </div>
      </div>
    </div>
  );
}
