import type { Metadata } from 'next';
import Link from 'next/link';
import { Car, ChevronRight, CheckCircle, Phone, Clock } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';

export const metadata: Metadata = {
  title: 'Ремонт ходовой части BMW, Mercedes, Audi в СПб | HP Тюнинг',
  description: 'Ремонт ходовой части в Санкт-Петербурге: замена амортизаторов от 5 000 ₽, пружин, рычагов, сайлентблоков, шаровых. BMW, Mercedes, Audi, Porsche. Гарантия.',
  alternates: { canonical: 'https://hptuning.ru/service/suspension' },
};

const PRICES = [
  { service: 'Замена амортизатора (1 шт.)', min: '5 000', max: '18 000' },
  { service: 'Замена сайлентблоков рычага', min: '4 000', max: '12 000' },
  { service: 'Замена шаровой опоры', min: '3 500', max: '10 000' },
  { service: 'Замена рулевого наконечника', min: '2 500', max: '7 000' },
  { service: 'Развал-схождение', min: '3 000', max: '5 000' },
];

const WORKS = [
  'Диагностика подвески на стенде',
  'Замена амортизаторов',
  'Замена пружин подвески',
  'Замена сайлентблоков рычагов',
  'Замена шаровых опор',
  'Замена рулевых наконечников',
  'Замена стабилизатора и стоек',
  'Развал-схождение после ремонта',
];

const FAQ = [
  { q: 'Как понять, что нужен ремонт ходовой?', a: 'Признаки: стук или скрип при езде по неровностям, увод в сторону, вибрации руля, неравномерный износ шин.' },
  { q: 'Нужно ли делать развал-схождение после замены ходовой?', a: 'Обязательно — после замены рычагов, амортизаторов, рулевых наконечников или любых элементов, влияющих на геометрию подвески.' },
  { q: 'Сколько стоит замена амортизаторов?', a: 'Замена 1 амортизатора — от 5 000 ₽ (работа). Цена зависит от марки и типа амортизатора. Рекомендуем менять попарно (ось).' },
  { q: 'Меняете ли вы амортизаторы пневмоподвески?', a: 'Да, работаем с пневмоподвеской BMW, Mercedes, Audi, Range Rover. Диагностика компрессора, клапанов, пневмобаллонов, ресивера.' },
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
            <span className="text-text-muted">Подвеска</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Car className="size-7 text-purple-400" />
              </div>
              <span className="badge mb-4">Подвеска</span>
              <h1 className="section-title text-4xl md:text-5xl mb-4">РЕМОНТ ХОДОВОЙ ЧАСТИ</h1>
              <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-xl">
                Диагностика и ремонт подвески: амортизаторы, пружины, рычаги, сайлентблоки, шаровые опоры, рулевые наконечники. Специализация на немецком и британском премиуме.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WORKS.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                    <CheckCircle className="size-4 text-purple-400 shrink-0 mt-0.5" />{w}
                  </li>
                ))}
              </ul>
            </div>
            <aside>
              <div className="card sticky top-24">
                <div className="text-purple-400 font-semibold text-xs uppercase tracking-wider mb-2">Стоимость</div>
                <div className="font-display text-4xl text-text mb-1">от 5 000 ₽</div>
                <div className="flex items-center gap-2 text-text-subtle text-sm mb-5">
                  <Clock className="size-3.5" />{'2–6 часов'}
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
                <span className="font-medium text-text group-open:text-purple-400 transition-colors pr-4">{item.q}</span>
                <span className="text-text-subtle group-open:text-purple-400 shrink-0 text-lg leading-none">+</span>
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
