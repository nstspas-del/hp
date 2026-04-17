import type { Metadata } from 'next';
import Link from 'next/link';
import { Settings, ChevronRight, CheckCircle, Phone, Clock } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Техническое обслуживание (ТО) BMW, Mercedes, Audi в СПб | HP Тюнинг',
  description: 'ТО автомобилей в Санкт-Петербурге от 3 000 ₽. Замена масла, фильтров, жидкостей по регламенту. BMW, Mercedes, Audi, Porsche, Lexus. Фиксированные цены.',
  alternates: { canonical: 'https://hptuning.ru/service/to' },
};

const PRICES = [
  { class: 'Малый класс (A/B)', oil: '3 000', full: '5 500' },
  { class: 'Средний класс (C/E)', oil: '4 500', full: '7 500' },
  { class: 'Бизнес-класс (E/S/7/A8)', oil: '5 500', full: '9 500' },
  { class: 'Внедорожник (X5/GLE/Q7)', oil: '5 000', full: '9 000' },
  { class: 'Суперкар (Porsche/AMG/M)', oil: '7 000', full: '14 000' },
];

const WORKS = [
  'Замена моторного масла',
  'Замена масляного фильтра',
  'Проверка и замена воздушного фильтра',
  'Замена фильтра салона',
  'Проверка уровня всех технических жидкостей',
  'Диагностика тормозной системы',
  'Проверка состояния шин и давления',
  'Проверка освещения',
  'Сброс индикатора ТО',
  'Компьютерное считывание ошибок',
];

const STEPS = [
  { step: '01', title: 'Приёмка', desc: 'Осмотр автомобиля, фиксация пробега и состояния, согласование объёма работ.' },
  { step: '02', title: 'Работы по ТО', desc: 'Подъём на подъёмник, замена масла и фильтров, проверка всех систем по регламенту.' },
  { step: '03', title: 'Диагностика', desc: 'Считываем ошибки, проверяем тормоза, ходовую и электрику.' },
  { step: '04', title: 'Выдача', desc: 'Отчёт о проделанных работах, сброс сервисного индикатора, рекомендации.' },
];

const FAQ = [
  { q: 'Как часто нужно делать ТО?', a: 'По регламенту — каждые 10 000–15 000 км или раз в год. Для немецких премиум-авто рекомендуем каждые 10 000 км.' },
  { q: 'Сколько стоит ТО для BMW?', a: 'Замена масла для BMW 5-й серии — от 4 500 ₽. Полное ТО с заменой всех фильтров — от 7 500 ₽.' },
  { q: 'Используете ли вы оригинальное масло?', a: 'Да, работаем с Castrol, Liqui Moly, Mobil 1, Shell — только допущенные производителем марки для вашего мотора.' },
  { q: 'Сколько времени займёт ТО?', a: 'Базовое ТО (масло + фильтры) — 1–2 часа. Полное с диагностикой — 2–4 часа.' },
  { q: 'Можно ли сделать ТО без записи?', a: 'Желательно записаться заранее — тогда мастер и запчасти будут готовы. Без записи берём при наличии свободного бокса.' },
];

export default function ToPage() {
  return (
    <>
      <section className="relative pt-28 pb-16">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-text-subtle mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
            <ChevronRight className="size-4" />
            <Link href="/service" className="hover:text-accent transition-colors">Автосервис</Link>
            <ChevronRight className="size-4" />
            <span className="text-text-muted">ТО</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="w-14 h-14 rounded-xl bg-[#39FF14]/10 flex items-center justify-center mb-6">
                <Settings className="size-7 text-[#39FF14]" />
              </div>
              <span className="badge mb-4">Регулярное обслуживание</span>
              <h1 className="section-title text-4xl md:text-5xl mb-4">ТЕХНИЧЕСКОЕ ОБСЛУЖИВАНИЕ</h1>
              <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-xl">
                Профессиональное ТО по заводскому регламенту для BMW, Mercedes, Audi и 10+ марок.
                Фиксированные цены, оригинальные расходники, сброс сервисного индикатора.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WORKS.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                    <CheckCircle className="size-4 text-[#39FF14] shrink-0 mt-0.5" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <aside>
              <div className="card sticky top-24">
                <div className="text-[#39FF14] font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
                <div className="font-display text-4xl text-text mb-1">от 3 000 ₽</div>
                <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
                  <Clock className="size-3.5" />
                  1–4 часа
                </div>
                <BookingButton label="Записаться на ТО" className="btn-primary w-full justify-center mb-3" />
                <a href="tel:+79818428151" className="btn-secondary w-full justify-center">
                  <Phone className="size-4" />+7 (981) 842-81-51
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Прайс */}
      <section className="py-16 bg-[#111113]">
        <div className="container">
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЦЕНЫ НА ТО</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-subtle text-sm">Класс автомобиля</th>
                  <th className="text-center py-3 px-4 text-text-subtle text-sm">Масло + фильтр</th>
                  <th className="text-center py-3 px-4 text-[#39FF14] text-sm">Полное ТО</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((p, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-text text-sm">{p.class}</td>
                    <td className="py-3 px-4 text-center text-text-muted text-sm">{p.oil} ₽</td>
                    <td className="py-3 px-4 text-center text-[#39FF14] font-semibold text-sm">{p.full} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Этапы */}
      <section className="py-16 container">
        <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">КАК МЫ РАБОТАЕМ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.step} className="card">
              <div className="font-display text-3xl text-[#39FF14]/30 mb-3">{s.step}</div>
              <h3 className="font-semibold text-text mb-2">{s.title}</h3>
              <p className="text-text-subtle text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#111113]">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЧАСТЫЕ ВОПРОСЫ</h2>
          <div className="flex flex-col gap-4">
            {FAQ.map((item, i) => (
              <details key={i} className="card group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-text group-open:text-[#39FF14] transition-colors pr-4">{item.q}</span>
                  <span className="text-text-subtle group-open:text-[#39FF14] shrink-0 text-lg leading-none">+</span>
                </summary>
                <p className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-border">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 container">
        <div className="card border-[#39FF14]/20 text-center p-10 glow-box">
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">ЗАПИСАТЬСЯ НА ТО</h2>
          <p className="text-text-muted mb-6">Ответим в течение 15 минут — подберём удобное время.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookingButton label="Записаться онлайн" className="btn-primary text-base px-10 py-4" />
            <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
              <Phone className="size-4" /> +7 (981) 842-81-51
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
