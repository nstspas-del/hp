import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
 title: seoData.pages.cookies.title,
 description: seoData.pages.cookies.description,
 alternates: { canonical: 'https://hptuning.ru/cookies' },
 robots: { index: false, follow: false },
 openGraph: {
 title: seoData.pages.cookies.title,
 description: seoData.pages.cookies.description,
 url: 'https://hptuning.ru/cookies',
 images: [{ url: 'https://hptuning.ru/images/og/home.jpg', width: 1200, height: 630, alt: 'HP Тюнинг — политика cookie' }],
 },
};

const COOKIE_TABLE = [
 {
 name: '_ym_uid, _ym_d, _ym_isad',
 service: 'Яндекс.Метрика',
 purpose: 'Уникальный идентификатор посетителя, анализ поведения',
 duration: '1 год',
 type: 'Аналитические',
 },
 {
 name: '_ym_visorc',
 service: 'Яндекс.Метрика',
 purpose: 'Запись посещений (Вебвизор)',
 duration: '30 минут',
 type: 'Аналитические',
 },
 {
 name: 'hp_cookie_consent',
 service: 'hptuning.ru',
 purpose: 'Хранение согласия на использование cookie',
 duration: '6 месяцев',
 type: 'Необходимые',
 },
 {
 name: 'autodealer_session',
 service: 'AutoDealer',
 purpose: 'Сессия виджета записи на сервис',
 duration: 'Сессия',
 type: 'Функциональные',
 },
];

export default function CookiesPage() {
 return (
 <div className="section container max-w-4xl">
 {/* Breadcrumb */}
 <Breadcrumbs items={[{ label: "Политика cookie" }]} />

 <h1 className="section-title mb-4">Политика использования cookie</h1>
 <p className="text-text-subtle text-sm mb-10">Последнее обновление: январь 2025 г.</p>

 <div className="prose-hp">
 <section className="mb-10">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">Что такое cookie</h2>
 <p className="text-text-muted leading-relaxed">
 Cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении
 сайта. Они помогают сайту запомнить ваши предпочтения, улучшают работу сервиса и позволяют
 нам анализировать посещаемость.
 </p>
 </section>

 <section className="mb-10">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">Какие cookie мы используем</h2>

 <div className="mb-6">
 <h3 className="text-accent font-semibold mb-3">Необходимые cookie</h3>
 <p className="text-text-muted leading-relaxed">
 Обязательны для работы сайта. Без них сайт не будет функционировать корректно.
 Отключить их через настройки сайта невозможно.
 </p>
 </div>

 <div className="mb-6">
 <h3 className="text-accent font-semibold mb-3">Аналитические cookie</h3>
 <p className="text-text-muted leading-relaxed">
 Помогают нам понять, как посетители взаимодействуют с сайтом. Все данные анонимизированы
 и используются только для улучшения сайта. Мы используем Яндекс.Метрику.
 </p>
 </div>

 <div className="mb-6">
 <h3 className="text-accent font-semibold mb-3">Функциональные cookie</h3>
 <p className="text-text-muted leading-relaxed">
 Обеспечивают работу дополнительных функций: виджета записи AutoDealer и сохранение
 пользовательских настроек.
 </p>
 </div>
 </section>

 <section className="mb-10">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-6">Список используемых cookie</h2>
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-border">
 <th className="text-left py-3 px-4 text-text font-semibold">Название</th>
 <th className="text-left py-3 px-4 text-text font-semibold">Сервис</th>
 <th className="text-left py-3 px-4 text-text font-semibold">Назначение</th>
 <th className="text-left py-3 px-4 text-text font-semibold">Срок</th>
 <th className="text-left py-3 px-4 text-text font-semibold">Тип</th>
 </tr>
 </thead>
 <tbody>
 {COOKIE_TABLE.map((row, i) => (
 <tr key={i} className="border-b border-border/50 hover:bg-bg-elevated/50 transition-colors">
 <td className="py-3 px-4 font-mono text-xs text-accent">{row.name}</td>
 <td className="py-3 px-4 text-text-muted">{row.service}</td>
 <td className="py-3 px-4 text-text-muted">{row.purpose}</td>
 <td className="py-3 px-4 text-text-muted whitespace-nowrap">{row.duration}</td>
 <td className="py-3 px-4">
 <span className="badge text-xs">{row.type}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </section>

 <section className="mb-10">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">Управление cookie</h2>
 <p className="text-text-muted leading-relaxed mb-4">
 Вы можете настроить или отключить cookie в настройках вашего браузера:
 </p>
 <ul className="list-disc list-inside text-text-muted leading-relaxed space-y-2">
 <li>
 <strong className="text-text">Яндекс Браузер:</strong>{' '}
 Настройки → Сайты → Расширенные настройки сайтов → Cookie
 </li>
 <li>
 <strong className="text-text">Chrome:</strong>{' '}
 Настройки → Конфиденциальность и безопасность → Файлы cookie
 </li>
 <li>
 <strong className="text-text">Firefox:</strong>{' '}
 Настройки → Приватность и защита → Куки и данные сайтов
 </li>
 <li>
 <strong className="text-text">Safari:</strong>{' '}
 Настройки → Конфиденциальность → Управлять данными сайтов
 </li>
 </ul>
 <p className="text-text-muted leading-relaxed mt-4">
 Обратите внимание: отключение cookie может повлиять на функциональность сайта.
 </p>
 </section>

 <section className="mb-10">
 <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">Изменения в политике</h2>
 <p className="text-text-muted leading-relaxed">
 Мы оставляем за собой право обновлять эту политику. Актуальная версия всегда доступна на
 этой странице. Продолжая использовать сайт после изменений, вы соглашаетесь с новой редакцией.
 </p>
 </section>
 </div>

 <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4">
 <Link href="/" className="btn-secondary">← На главную</Link>
 <Link href="/privacy" className="btn-secondary">Политика конфиденциальности</Link>
 </div>
 </div>
 );
}
