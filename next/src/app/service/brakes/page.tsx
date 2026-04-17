import type { Metadata } from 'next';
import Link from 'next/link';
import { Disc, ChevronRight, CheckCircle, Phone, Clock } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Ремонт тормозной системы BMW, Mercedes, Audi в СПб | HP Тюнинг',
  description: 'Ремонт тормозов в Санкт-Петербурге: замена колодок от 4 000 ₽, тормозных дисков, суппортов, прокачка системы. BMW, Mercedes, Audi, Porsche. Гарантия.',
  alternates: { canonical: 'https://hptuning.ru/service/brakes' },
};

const PRICES = [
  { service: 'Замена колодок (1 ось)', min: '4 000', max: '9 000' },
  { service: 'Замена дисков + колодок (1 ось)', min: '8 000', max: '25 000' },
  { service: 'Ремонт/замена суппорта', min: '6 000', max: '30 000' },
  { service: 'Замена тормозных шлангов', min: '2 000', max: '6 000' },
  { service: 'Прокачка + замена жидкости', min: '3 500', max: '6 000' },
];

const WORKS = [
  'Диагностика тормозной системы',
  'Замена тормозных колодок (ось)',
  'Замена тормозных дисков',
  'Замена и ремонт суппортов',
  'Замена тормозных шлангов и трубок',
  'Замена тормозного цилиндра',
  'Прокачка тормозной системы',
  'Замена тормозной жидкости',
];

const FAQ = [
  { q: 'Как часто менять тормозные колодки?', a: 'Передние колодки — каждые 30 000–50 000 км, задние — каждые 50 000–80 000 км. Признаки износа: скрип при торможении, увеличение тормозного пути, вибрации.' },
  { q: 'Когда нужно менять тормозные диски?', a: 'Диски меняют при износе ниже минимальной толщины (указана в ТД) или при появлении глубоких борозд и трещин. Обычно — каждые 60 000–100 000 км.' },
  { q: 'Нужно ли менять диски вместе с колодками?', a: 'Не всегда. Если диск в хорошем состоянии — меняем только колодки. Проверяем толщину и состояние диска при каждой замене.' },
  { q: 'Что значит «прокачка тормозов»?', a: 'Удаление воздуха и старой жидкости из системы. Нужна после замены цилиндра, шланга или при падении педали тормоза. Рекомендуем раз в 2 года.' },
];

export default function Page() {
  return (
    <>
      <section className="relative pt-28 pb-16">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-text-subtle mb-8">
            <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
            <ChevronRight className="size-4" />
            <Link href="/service" className="hover:text-accent transition-colors">Автосервис</Link>
            <ChevronRight className="size-4" />
            <span className="text-text-muted">Тормозная система</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                <Disc className="size-7 text-orange-400" />
              </div>
              <span className="badge mb-4">Тормоза</span>
              <h1 className="section-title text-4xl md:text-5xl mb-4">РЕМОНТ ТОРМОЗНОЙ СИСТЕМЫ</h1>
              <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-xl">
                Замена колодок, дисков, суппортов, тормозных трубок и шлангов. Прокачка тормозной системы. Специализируемся на BMW, Mercedes, Audi, Porsche.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WORKS.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                    <CheckCircle className="size-4 text-orange-400 shrink-0 mt-0.5" />{w}
                  </li>
                ))}
              </ul>
            </div>
            <aside>
              <div className="card sticky top-24">
                <div className="text-orange-400 font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
                <div className="font-display text-4xl text-text mb-1">от 4 000 ₽</div>
                <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
                  <Clock className="size-3.5" />{'2–4 часа'}
                </div>
                <BookingButton label="Записаться" className="btn-primary w-full justify-center mb-3" />
                <a href="tel:+79818428151" className="btn-secondary w-full justify-center">
                  <Phone className="size-4" />+7 (981) 842-81-51
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#111113]">
        <div className="container">
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЦЕНЫ</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-subtle text-sm">Вид работ</th>
                  <th className="text-center py-3 px-4 text-text-subtle text-sm">от</th>
                  <th className="text-center py-3 px-4 text-text-subtle text-sm">до</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((p, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-text-muted text-sm">{p.service}</td>
                    <td className="py-3 px-4 text-center text-[#39FF14] font-semibold text-sm">{p.min} ₽</td>
                    <td className="py-3 px-4 text-center text-text-subtle text-sm">{p.max} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 container max-w-3xl">
        <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-8">ЧАСТЫЕ ВОПРОСЫ</h2>
        <div className="flex flex-col gap-4">
          {FAQ.map((item, i) => (
            <details key={i} className="card group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-medium text-text group-open:text-orange-400 transition-colors pr-4">{item.q}</span>
                <span className="text-text-subtle group-open:text-orange-400 shrink-0 text-lg leading-none">+</span>
              </summary>
              <p className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-border">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[#111113] container">
        <div className="card text-center p-10">
          <h2 className="font-display text-3xl text-text uppercase tracking-wider mb-3">ЗАПИСАТЬСЯ НА СЕРВИС</h2>
          <p className="text-text-muted mb-6">Ответим в течение 15 минут.</p>
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
