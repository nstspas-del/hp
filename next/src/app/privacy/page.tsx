import type { Metadata } from 'next';
import Link from 'next/link';
import seoData from '@/data/seo.json';
import company from '@/data/company.json';

export const metadata: Metadata = {
  title: seoData.pages.privacy.title,
  description: seoData.pages.privacy.description,
  alternates: { canonical: 'https://hptuning.ru/privacy' },
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="section container max-w-4xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-subtle mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
        <span className="mx-2">→</span>
        <span className="text-text-muted">Политика конфиденциальности</span>
      </nav>

      <h1 className="section-title mb-4">Политика конфиденциальности</h1>
      <p className="text-text-subtle text-sm mb-10">
        Последнее обновление: январь 2025 г.
      </p>

      <div className="prose-hp">
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">1. Общие положения</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Настоящая Политика конфиденциальности регулирует порядок обработки и защиты персональных
            данных пользователей сайта <strong className="text-text">hptuning.ru</strong>, принадлежащего
            ИП Шпрыгин Павел Александрович (ИНН&nbsp;{company.inn}, ОГРНИП&nbsp;{company.ogrnip}).
          </p>
          <p className="text-text-muted leading-relaxed">
            Используя наш сайт, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны,
            пожалуйста, покиньте сайт.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">2. Какие данные мы собираем</h2>
          <ul className="list-disc list-inside text-text-muted leading-relaxed space-y-2">
            <li>Имя и контактный телефон — при заполнении формы записи через AutoDealer</li>
            <li>Марка, модель, год выпуска автомобиля — для подбора услуги</li>
            <li>IP-адрес и данные браузера — автоматически через Яндекс.Метрику</li>
            <li>Файлы cookie — для корректной работы сайта и аналитики (см. <Link href="/cookies" className="text-accent hover:underline">Политику cookie</Link>)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">3. Цели обработки данных</h2>
          <ul className="list-disc list-inside text-text-muted leading-relaxed space-y-2">
            <li>Обработка заявок на запись в автосервис</li>
            <li>Связь с клиентом по указанному номеру телефона</li>
            <li>Улучшение качества сайта и пользовательского опыта</li>
            <li>Анализ посещаемости и оптимизация контента</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">4. Хранение и передача данных</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Персональные данные обрабатываются на территории Российской Федерации.
            Мы не передаём ваши данные третьим лицам, за исключением:
          </p>
          <ul className="list-disc list-inside text-text-muted leading-relaxed space-y-2">
            <li>Сервис Яндекс.Метрика — для аналитики (в соответствии с политикой Яндекса)</li>
            <li>AutoDealer — для обработки заявки на запись</li>
            <li>Случаев, предусмотренных законодательством РФ</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">5. Права пользователя</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            В соответствии с Федеральным законом №152-ФЗ «О персональных данных» вы вправе:
          </p>
          <ul className="list-disc list-inside text-text-muted leading-relaxed space-y-2">
            <li>Получить информацию об обработке ваших данных</li>
            <li>Потребовать исправления или удаления данных</li>
            <li>Отозвать согласие на обработку персональных данных</li>
          </ul>
          <p className="text-text-muted leading-relaxed mt-4">
            Для реализации прав направьте запрос на{' '}
            <a href={company.contacts.email.href} className="text-accent hover:underline">
              {company.contacts.email.display}
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">6. Срок хранения</h2>
          <p className="text-text-muted leading-relaxed">
            Персональные данные хранятся не дольше срока, необходимого для достижения цели обработки,
            но не более 3 лет с момента последнего взаимодействия с клиентом.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">7. Контакты оператора</h2>
          <div className="card">
            <p className="text-text-muted mb-2">
              <span className="text-text">Оператор:</span> {company.legalName}
            </p>
            <p className="text-text-muted mb-2">
              <span className="text-text">ИНН:</span> {company.inn}
            </p>
            <p className="text-text-muted mb-2">
              <span className="text-text">Адрес:</span> {company.address.region}, {company.address.locality}, {company.address.street} {company.address.building}
            </p>
            <p className="text-text-muted mb-2">
              <span className="text-text">Email:</span>{' '}
              <a href={company.contacts.email.href} className="text-accent hover:underline">
                {company.contacts.email.display}
              </a>
            </p>
            <p className="text-text-muted">
              <span className="text-text">Телефон:</span>{' '}
              <a href={`tel:${company.contacts.phone.raw}`} className="text-accent hover:underline">
                {company.contacts.phone.display}
              </a>
            </p>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <Link href="/" className="btn-secondary">← На главную</Link>
      </div>
    </div>
  );
}
