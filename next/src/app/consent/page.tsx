import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import company from '@/data/company.json';

export const metadata: Metadata = {
  title: 'Согласие на обработку персональных данных — HP Тюнинг СПб',
  description:
    'Согласие субъекта персональных данных на обработку ПДн ИП Шпрыгиным Павлом Александровичем в соответствии с ФЗ-152.',
  alternates: { canonical: 'https://hptuning.ru/consent' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Согласие на обработку персональных данных — HP Тюнинг СПб',
    description: 'Согласие субъекта персональных данных на обработку ПДн в HP Тюнинг (ФЗ-152).',
    url: 'https://hptuning.ru/consent',
    images: [
      {
        url: 'https://hptuning.ru/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'HP Тюнинг — согласие на обработку ПДн',
      },
    ],
  },
};

export default function ConsentPage() {
  return (
    <div className="section container max-w-[840px]">
      {/* Хлебные крошки */}
      <Breadcrumbs items={[{ label: 'Согласие на обработку ПДн' }]} />

      <h1 className="section-title mb-4">Согласие на обработку персональных данных</h1>
      <p className="text-text-subtle text-sm mb-10">
        Последнее обновление: 18 апреля 2026 г.
      </p>

      <div className="prose-hp">
        {/* Преамбула */}
        <section className="mb-10">
          <p className="text-text-muted leading-relaxed">
            Настоящим в соответствии с Федеральным законом от 27.07.2006 №&nbsp;152-ФЗ
            «О персональных данных» я, заполняя и отправляя форму на сайте{' '}
            <strong className="text-text">https://hptuning.ru</strong>, свободно, своей волей
            и в своём интересе даю согласие на обработку моих персональных данных индивидуальному
            предпринимателю{' '}
            <strong className="text-text">{company.legalName}</strong> (ИНН&nbsp;{company.inn},
            ОГРНИП&nbsp;{company.ogrnip}, далее — «Оператор»).
          </p>
        </section>

        {/* 1. Оператор */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            1. Оператор персональных данных
          </h2>
          <div className="card">
            <dl className="flex flex-col gap-3 text-sm">
              {[
                { label: 'Оператор', value: company.legalName },
                { label: 'ИНН', value: company.inn },
                { label: 'ОГРНИП', value: company.ogrnip },
                {
                  label: 'Адрес',
                  value: `188679, ${company.address.region}, пос. ${company.address.locality}, ул. ${company.address.street}, д. ${company.address.building}`,
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-text-subtle text-xs uppercase tracking-wider mb-0.5">{label}</dt>
                  <dd className="text-text-muted font-medium">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-text-subtle text-xs uppercase tracking-wider mb-0.5">Email</dt>
                <dd>
                  <a href={company.contacts.email.href} className="text-accent hover:underline font-medium">
                    {company.contacts.email.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-text-subtle text-xs uppercase tracking-wider mb-0.5">Телефон</dt>
                <dd>
                  <a href={company.contacts.phone.href} className="text-accent hover:underline font-medium">
                    {company.contacts.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-text-subtle text-xs uppercase tracking-wider mb-0.5">Сайт</dt>
                <dd>
                  <a href="https://hptuning.ru" className="text-accent hover:underline font-medium">
                    https://hptuning.ru
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 2. Перечень ПДн */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            2. Перечень персональных данных, на обработку которых даётся согласие
          </h2>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed">
            {[
              'Фамилия, имя, отчество',
              'Номер мобильного телефона',
              'Адрес электронной почты',
              'Марка, модель, год выпуска и государственный регистрационный знак автомобиля',
              'VIN-номер автомобиля (при необходимости для диагностики и заказа запчастей)',
              'Данные из cookies и систем веб-аналитики (IP-адрес, User-Agent, идентификаторы сеансов, действия на сайте, источник перехода, Client ID Яндекс.Метрики)',
              'Данные из мессенджеров при обращении через них (Telegram ID, имя пользователя) — только в объёме, добровольно предоставленном субъектом',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Цели */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            3. Цели обработки персональных данных
          </h2>

          <h3 className="text-text font-semibold mb-3 mt-6">
            3.1. Обработка заявок и предоставление услуг:
          </h3>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed mb-6">
            {[
              'Подтверждение записи (звонок, SMS, email, Telegram)',
              'Согласование даты, времени и перечня работ',
              'Информирование о статусе работ и готовности автомобиля',
              'Заключение и исполнение договора оказания услуг',
              'Выставление счетов и проведение расчётов',
              'Гарантийное обслуживание',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-text font-semibold mb-3">
            3.2. Маркетинговые коммуникации (с согласия субъекта):
          </h3>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed mb-6">
            {[
              'Информирование об акциях, скидках и специальных предложениях',
              'Напоминания о плановом техническом обслуживании',
              'Рассылка полезной информации (советы по эксплуатации, сезонные рекомендации) по Email, SMS, Telegram',
              'Приглашения на мероприятия автосервиса',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-text font-semibold mb-3">3.3. Иные цели:</h3>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed">
            {[
              'Ведение внутренней клиентской базы (CRM)',
              'Учёт выполненных работ и истории обслуживания автомобиля',
              'Улучшение качества обслуживания и работы сайта',
              'Веб-аналитика для оптимизации сайта и рекламных кампаний',
              'Ретаргетинг и персонализация рекламы в Яндекс.Директ',
              'Разрешение спорных ситуаций и претензионной работы',
              'Соблюдение требований законодательства РФ',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Действия с ПДн */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            4. Перечень действий с персональными данными
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Оператор осуществляет сбор, запись, систематизацию, накопление, хранение,
            уточнение (обновление, изменение), извлечение, использование, передачу
            (предоставление, доступ), обезличивание, блокирование, удаление и уничтожение
            персональных данных как с использованием средств автоматизации, так и без них.
          </p>
          <p className="text-text-muted leading-relaxed">
            Обработка персональных данных осуществляется смешанным способом — с использованием
            средств автоматизации и без таковых.
          </p>
        </section>

        {/* 5. Передача третьим лицам */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            5. Передача персональных данных третьим лицам
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Оператор вправе передавать персональные данные следующим лицам исключительно
            для достижения указанных выше целей:
          </p>
          <ul className="flex flex-col gap-3 text-text-muted leading-relaxed">
            {[
              'ООО «АвтоДилер» (сервис онлайн-записи AutoDealer) — для обработки заявок',
              'ООО «ЯНДЕКС» (ИНН 7736207543) — для ведения веб-аналитики (Яндекс.Метрика) и размещения рекламы (Яндекс.Директ)',
              'Операторы мобильной связи (ПАО «МТС», ПАО «МегаФон», ПАО «ВымпелКом», ПАО «Ростелеком», ООО «Т2 Мобайл») — для отправки SMS',
              'Провайдеры email-рассылок — для направления информационных сообщений',
              'Банки и платёжные системы — для проведения расчётов',
              'Поставщики запчастей и материалов — в объёме, необходимом для оформления заказа конкретной детали для автомобиля клиента',
              'Налоговые, правоохранительные и иные государственные органы РФ — в случаях, предусмотренных законодательством',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-text-muted leading-relaxed mt-4">
            Оператор обеспечивает конфиденциальность передаваемых данных и требует от третьих лиц
            соблюдения аналогичного режима защиты.{' '}
            <strong className="text-text">Трансграничная передача данных за пределы РФ не осуществляется.</strong>
          </p>
        </section>

        {/* 6. Срок и отзыв */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            6. Срок действия согласия и порядок его отзыва
          </h2>

          <p className="text-text-muted leading-relaxed mb-4">
            <strong className="text-text">6.1.</strong> Настоящее согласие действует{' '}
            <strong className="text-text">бессрочно</strong> с момента отправки формы на сайте
            до момента его отзыва субъектом персональных данных.
          </p>

          <p className="text-text-muted leading-relaxed mb-3">
            <strong className="text-text">6.2.</strong> Согласие может быть отозвано субъектом
            в любое время путём направления письменного заявления одним из способов:
          </p>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed mb-4">
            <li className="flex gap-3">
              <span className="text-accent shrink-0 font-bold">—</span>
              <span>
                Email:{' '}
                <a href={company.contacts.email.href} className="text-accent hover:underline">
                  {company.contacts.email.display}
                </a>{' '}
                (с указанием ФИО и телефона)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent shrink-0 font-bold">—</span>
              <span>
                Почтой России: 188679, Санкт-Петербург, пос. Порошкино, ул. Богородская, д.&nbsp;3Б
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent shrink-0 font-bold">—</span>
              <span>Лично по адресу автосервиса в рабочие часы (ежедневно 10:00–20:00)</span>
            </li>
          </ul>

          <p className="text-text-muted leading-relaxed mb-4">
            <strong className="text-text">6.3.</strong> В случае отзыва согласия Оператор
            прекращает обработку персональных данных и уничтожает их в срок, не превышающий
            30 (тридцати) дней с даты поступления заявления, за исключением случаев, когда
            обработка может продолжаться на иных законных основаниях:
          </p>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed mb-4">
            {[
              'Исполнение обязательств Оператора по действующему договору',
              'Требования налогового и бухгалтерского законодательства РФ (хранение первичных документов — 5 лет)',
              'Требования законодательства о защите прав потребителей (срок исковой давности)',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-text-muted leading-relaxed">
            <strong className="text-text">6.4.</strong> Отдельно согласие на маркетинговые
            коммуникации (п.&nbsp;3.2) может быть отозвано в любой момент по ссылке «Отписаться»
            в любом письме/SMS, либо по команде STOP в ответном SMS, либо по запросу на email
            Оператора. Отзыв согласия на маркетинг не прекращает обработку данных для целей
            оказания услуг (п.&nbsp;3.1).
          </p>
        </section>

        {/* 7. Права субъекта */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            7. Права субъекта персональных данных
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            В соответствии со статьёй 14 Федерального закона №&nbsp;152-ФЗ субъект персональных
            данных имеет право:
          </p>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed mb-6">
            {[
              'Получать сведения об Операторе, о месте нахождения Оператора, о наличии у Оператора персональных данных, относящихся к соответствующему субъекту',
              'Знакомиться с обрабатываемыми данными, получать их копии',
              'Требовать уточнения, блокирования или уничтожения персональных данных в случае их неполноты, неточности или незаконного получения',
              'Отзывать согласие на обработку персональных данных',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-text-muted leading-relaxed mb-3">
            Обжаловать действия или бездействие Оператора:
          </p>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed">
            <li className="flex gap-3">
              <span className="text-accent shrink-0 font-bold">—</span>
              <span>
                В Федеральную службу по надзору в сфере связи, информационных технологий и
                массовых коммуникаций (Роскомнадзор):{' '}
                <a href="https://rkn.gov.ru/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  https://rkn.gov.ru/
                </a>{' '}
                | +7&nbsp;(495)&nbsp;987-68-00
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent shrink-0 font-bold">—</span>
              <span>В судебном порядке в соответствии с законодательством РФ</span>
            </li>
          </ul>
        </section>

        {/* 8. Меры защиты */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            8. Меры защиты персональных данных
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Оператор принимает необходимые правовые, организационные и технические меры для
            защиты персональных данных от неправомерного или случайного доступа, уничтожения,
            изменения, блокирования, копирования, распространения и иных неправомерных действий:
          </p>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed">
            {[
              'Назначено лицо, ответственное за организацию обработки ПДн',
              'Определены угрозы безопасности и применены средства защиты',
              'Ограничен доступ к ПДн только уполномоченными сотрудниками',
              'Ведётся учёт машинных носителей персональных данных',
              'Осуществляется резервное копирование данных',
              'Используются сертифицированные средства защиты информации',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0 font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 9. Заключительные положения */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-4">
            9. Заключительные положения
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            <strong className="text-text">9.1.</strong> Действующая редакция Согласия и
            Политики конфиденциальности всегда доступна по адресам:
          </p>
          <ul className="flex flex-col gap-2 text-text-muted leading-relaxed mb-4">
            <li className="flex gap-3">
              <span className="text-accent shrink-0 font-bold">—</span>
              <Link href="/consent" className="text-accent hover:underline">
                https://hptuning.ru/consent
              </Link>
            </li>
            <li className="flex gap-3">
              <span className="text-accent shrink-0 font-bold">—</span>
              <Link href="/privacy" className="text-accent hover:underline">
                https://hptuning.ru/privacy
              </Link>
            </li>
          </ul>
          <p className="text-text-muted leading-relaxed mb-4">
            <strong className="text-text">9.2.</strong> Оператор вправе вносить изменения в
            настоящее Согласие. При внесении существенных изменений Оператор уведомляет субъектов
            по указанным контактам не менее чем за 10 дней до вступления изменений в силу.
          </p>
          <p className="text-text-muted leading-relaxed">
            <strong className="text-text">9.3.</strong> Во всём, что не урегулировано настоящим
            Согласием, применяются нормы действующего законодательства Российской Федерации.
          </p>
        </section>
      </div>

      {/* Навигация */}
      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 items-center">
        <Link href="/" className="btn-secondary">← На главную</Link>
        <Link href="/privacy" className="text-accent hover:underline text-sm">
          Политика конфиденциальности →
        </Link>
      </div>
    </div>
  );
}
