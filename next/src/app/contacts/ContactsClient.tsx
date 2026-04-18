'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, Send, Mail, Navigation, CheckCircle } from 'lucide-react';
import company from '@/data/company.json';
import seoData from '@/data/seo.json';
import { YandexMap } from '@/components/ui/YandexMap';

export function ContactsClient() {
 const [form, setForm] = useState({ name: '', phone: '', message: '' });
 const [sent, setSent] = useState(false);
 const [loading, setLoading] = useState(false);

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true);
 // Имитация отправки (в реальности — POST на /api/contact)
 await new Promise(r => setTimeout(r, 800));
 setSent(true);
 setLoading(false);
 window.ym?.(108614238, 'reachGoal', 'contact_form_submit');
 }

 return (
 <main className="pb-24">
 {/* Breadcrumb */}
 <nav className="bg-bg-elevated border-b border-border">
 <div className="container py-3">
 <ol className="flex items-center gap-2 text-sm text-text-subtle">
 <li><Link href="/" className="hover:text-text transition-colors">Главная</Link></li>
 <li>/</li>
 <li className="text-text">Контакты</li>
 </ol>
 </div>
 </nav>

 <div className="container section">
 <h1 className="section-title mb-10">{seoData.pages.contacts.h1}</h1>

 {/* Быстрые кнопки */}
 <div className="flex flex-wrap gap-3 mb-10">
 <a
 href="tel:+79818428151"
 className="flex items-center gap-2 bg-[#39FF14] text-black font-bold px-6 py-3 rounded-full hover:bg-[#39FF14]/90 transition-all text-sm"
 onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}
 >
 <Phone className="size-4" /> Позвонить
 </a>
 <a
 href="https://t.me/hptuningspb"
 target="_blank" rel="noopener noreferrer"
 className="flex items-center gap-2 border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-colors px-6 py-3 rounded-full text-sm font-medium"
 >
 <Send className="size-4" /> Telegram
 </a>
 <a
 href="https://yandex.ru/maps/-/CPvleY7F"
 target="_blank" rel="noopener noreferrer"
 className="flex items-center gap-2 border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-colors px-6 py-3 rounded-full text-sm font-medium"
 >
 <Navigation className="size-4" /> Построить маршрут
 </a>
 </div>

 {/* Основная сетка */}
 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">

 {/* Левая колонка — данные */}
 <div className="lg:col-span-2 flex flex-col gap-6">
 {/* Как связаться */}
 <div className="card">
 <h2 className="font-display text-xl text-text uppercase tracking-wider mb-5">Как связаться</h2>
 <div className="flex flex-col gap-4">
 <a href={company.contacts.phone.href}
 className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group"
 onClick={() => window.ym?.(108614238, 'reachGoal', 'phone_click')}>
 <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
 <Phone className="size-5 text-accent" />
 </div>
 <div>
 <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Телефон</div>
 <div className="font-semibold group-hover:text-accent transition-colors">{company.contacts.phone.display}</div>
 </div>
 </a>

 <a href={company.contacts.telegram.href} target="_blank" rel="noopener noreferrer"
 className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group">
 <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
 <Send className="size-5 text-accent" />
 </div>
 <div>
 <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Telegram</div>
 <div className="font-semibold group-hover:text-accent transition-colors">{company.contacts.telegram.display}</div>
 </div>
 </a>

 <a href={company.contacts.email.href}
 className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group">
 <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
 <Mail className="size-5 text-accent" />
 </div>
 <div>
 <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Email</div>
 <div className="font-semibold group-hover:text-accent transition-colors">{company.contacts.email.display}</div>
 </div>
 </a>

 <div className="flex items-start gap-3 text-text-muted">
 <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
 <MapPin className="size-5 text-accent" />
 </div>
 <div>
 <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Адрес</div>
 <div className="font-semibold">{company.address.full}</div>
 <a href="https://yandex.ru/maps/-/CPvleY7F" target="_blank" rel="noopener noreferrer"
 className="text-xs text-accent hover:underline mt-1 inline-block">
 Открыть в Яндекс.Картах →
 </a>
 </div>
 </div>

 <div className="flex items-center gap-3 text-text-muted">
 <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center shrink-0">
 <Clock className="size-5 text-accent" />
 </div>
 <div>
 <div className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">Режим работы</div>
 <div className="font-semibold">{company.workHours.schedule}</div>
 <div className="text-xs text-[#39FF14] mt-0.5">● Сейчас открыто</div>
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
 <div key={label} className="flex flex-col gap-0.5">
 <dt className="text-text-subtle text-xs uppercase tracking-wider">{label}</dt>
 <dd className="text-text-muted font-medium">{value}</dd>
 </div>
 ))}
 </dl>
 </div>
 </div>

 {/* Правая колонка — Яндекс.Карта */}
 <div className="lg:col-span-3">
 <YandexMap />
 <p className="text-text-subtle text-xs mt-3 text-center">
 Санкт-Петербург, ул. Богородская, 3Б (Порошкино) · 10:00–20:00 ежедневно
 </p>
 </div>
 </div>

 {/* Форма обратной связи */}
 <div className="max-w-2xl mx-auto">
 <div className="card">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-2">Написать нам</h2>
 <p className="text-text-muted text-sm mb-6">Ответим в течение 15 минут в рабочее время</p>

 {sent ? (
 <div className="flex flex-col items-center gap-3 py-8 text-center">
 <CheckCircle className="size-12 text-accent" />
 <p className="font-display text-xl text-text uppercase">Сообщение отправлено!</p>
 <p className="text-text-muted text-sm">Мы свяжемся с вами в ближайшее время</p>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="text-xs text-text-subtle uppercase tracking-wider mb-1.5 block">Имя *</label>
 <input
 type="text"
 required
 value={form.name}
 onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
 placeholder="Ваше имя"
 className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-subtle focus:outline-none focus:border-accent/50 transition-colors text-sm"
 />
 </div>
 <div>
 <label className="text-xs text-text-subtle uppercase tracking-wider mb-1.5 block">Телефон *</label>
 <input
 type="tel"
 required
 value={form.phone}
 onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
 placeholder="+7 (___) ___-__-__"
 className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-subtle focus:outline-none focus:border-accent/50 transition-colors text-sm"
 />
 </div>
 </div>
 <div>
 <label className="text-xs text-text-subtle uppercase tracking-wider mb-1.5 block">Сообщение</label>
 <textarea
 rows={4}
 value={form.message}
 onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
 placeholder="Расскажите о вашем автомобиле и задаче.."
 className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-subtle focus:outline-none focus:border-accent/50 transition-colors text-sm resize-none"
 />
 </div>
 <p className="text-xs text-text-subtle">
 Нажимая «Отправить», вы соглашаетесь с{' '}
 <Link href="/privacy" className="text-accent hover:underline">политикой конфиденциальности</Link>
 </p>
 <button
 type="submit"
 disabled={loading}
 className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
 >
 {loading ? 'Отправка..' : 'Отправить сообщение'}
 </button>
 </form>
 )}
 </div>
 </div>
 </div>
 </main>
 );
}
