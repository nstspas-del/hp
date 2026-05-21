/**
 * Секция социальных доказательств. Серверный компонент.
 *
 * Задача — сразу показать клиенту сертификаты, факты и экспертизу,
 * чтобы снять страх "доверить премиум-авто". Без обещаний "гарантия N месяцев"
 * (не разбрасываемся словами) и без отсылок к ребрендингу.
 *
 * Никаких внешних запросов и виджетов → работает с VPN и без.
 */

import { ShieldCheck, Award, Clock, Wrench, Users, Cpu } from 'lucide-react';

const FACTS = [
  {
    icon: Award,
    title: 'Официальное оборудование Alientech',
    body: 'Работаем на KESS3 — мировом эталоне чип-тюнинга. Это даёт корректные карты и безопасную прошивку для премиум-марок.',
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
    body: 'Более 1 500 авто прошли через наш сервис. Специализируемся на премиум-сегменте: Porsche, BMW M, AMG, Range Rover.',
  },
  {
    icon: Wrench,
    title: 'Свой бокс в Порошкино',
    body: 'Не аренда поста на стороннем сервисе — собственная мастерская на ул. Богородская, 3Б. Светлый бокс, два подъёмника, клиентская зона.',
  },
  {
    icon: Users,
    title: 'Прозрачные цены',
    body: 'Всё в калькуляторе на сайте: цена Stage 1/2/3, опции, материалы. Без «накруток в процессе» и «доплат на выходе».',
  },
];

export function SocialProof() {
  return (
    <section className="container py-10 md:py-14 border-t border-white/5">
      {/* Заголовок секции */}
      <div className="max-w-3xl mb-6 md:mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-text uppercase tracking-tight mb-3">
          Почему нам доверяют <span className="text-accent">премиум-авто</span>
        </h2>
        <p className="text-text-muted text-sm md:text-base leading-relaxed">
          Команда с экспертизой по премиум-сегменту, дилерское диагностическое оборудование,
          собственная мастерская и честное ценообразование.
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
              <h3 className="font-display text-lg text-text uppercase tracking-wide mb-2">
                {f.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.body}</p>
            </article>
          );
        })}
      </div>

      {/* Финальная плашка с цифрами */}
      <div className="mt-6 md:mt-10 card p-6 md:p-8 bg-gradient-to-r from-card via-card to-bg-card border-accent-dim">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat value="1 500+" label="авто за 5 лет" />
          <Stat value="44" label="марки в каталоге" />
          <Stat value="7 лет" label="на премиум-рынке" />
          <Stat value="15 мин" label="ответ на заявку" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-accent mb-1">{value}</div>
      <div className="text-text-subtle text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default SocialProof;
