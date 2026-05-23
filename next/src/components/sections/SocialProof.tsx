/**
 * Секция социальных доказательств. Серверный компонент.
 *
 * Задача — сразу показать клиенту экспертизу, оборудование и атмосферу
 * мастерской. Без обещаний «гарантия N месяцев» и без отсылок к ребрендингу.
 *
 * Никаких внешних запросов и виджетов → работает в России без VPN.
 */

import { ShieldCheck, Award, Clock, Wrench, Users, Cpu } from 'lucide-react';

const FACTS = [
  {
    icon: Award,
    title: 'Оборудование Alientech KESS3',
    body: 'Работаем на Alientech KESS3 — это эталонный программатор для чип-тюнинга премиум-марок (BMW, Mercedes, Porsche, Audi, Land Rover). Корректные карты, безопасные прошивки, оригинальный файл сохраняем перед каждой работой.',
    accent: true,
  },
  {
    icon: Cpu,
    title: 'Дилерская диагностика',
    body: 'AUTEL MaxiSYS MS919, Bosch KTS, Launch X-431 — читаем ЭБУ всех немецких, британских, японских и китайских марок так же, как дилер.',
  },
  {
    icon: ShieldCheck,
    title: 'Откат к стоку в любой момент',
    body: 'Перед каждой прошивкой сохраняем оригинальный файл ЭБУ. Перед ТО у дилера или продажей — бесплатно возвращаем заводскую версию.',
  },
  {
    icon: Clock,
    title: 'Работаем с 2019 года',
    body: 'Команда с 2019-го: премиум-сегмент — Porsche, BMW M, AMG, Range Rover — и современный массовый рынок (Haval, Chery, Geely, Tank, Exeed).',
  },
  {
    icon: Wrench,
    title: 'Уютный бокс в Порошкино',
    body: 'Своя мастерская на ул. Богородская, 3Б — арендуем, но обустроили под себя: дизайнерский пол, два подъёмника, отдельная клиентская зона с диваном и кофе. Большой баннер Hot Wheels Legends UK — фотозона, где снимаем каждый клиентский автомобиль.',
  },
  {
    icon: Users,
    title: 'Прозрачные цены на все услуги',
    body: 'Калькулятор на сайте показывает стоимость ТО, диагностики, ремонта подвески и тормозов, чип-тюнинга и детейлинга (керамика, PPF, химчистка). Без «накруток в процессе» и «доплат на выходе» — фиксируем смету заранее.',
  },
];

export function SocialProof() {
  return (
    <section className="container py-10 md:py-14 border-t border-white/5">
      {/* Заголовок секции */}
      <div className="max-w-3xl mb-6 md:mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-text tracking-tight mb-3">
          Почему нам доверяют <span className="text-accent">премиум-авто</span>
        </h2>
        <p className="text-text-muted text-sm md:text-base leading-relaxed">
          Команда с экспертизой по премиум-сегменту, дилерское диагностическое оборудование,
          уютная мастерская в Порошкино и честное ценообразование.
        </p>
      </div>

      {/* Сетка фактов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FACTS.map((f, i) => {
          const Icon = f.icon;
          return (
            <article
              key={i}
              className={[
                'card p-6 transition-all hover:border-accent-dim',
                f.accent ? 'border-accent-dim bg-accent/5' : '',
              ].join(' ')}
            >
              <div
                className={[
                  'size-12 rounded-xl flex items-center justify-center mb-4',
                  f.accent ? 'bg-accent text-black' : 'bg-accent/10 text-accent',
                ].join(' ')}
              >
                <Icon className="size-6" strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg text-text tracking-tight mb-2">
                {f.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default SocialProof;
