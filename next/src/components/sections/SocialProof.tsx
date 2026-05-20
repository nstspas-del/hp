/**
 * Секция социальных доказательств. Серверный компонент.
 *
 * Контекст: у HP Тюнинг недавно был ребрендинг. Задача — донести до клиента,
 * что это не "новые ребята", а известный сервис в новом виде, и сразу показать
 * сертификаты/факты/гарантии, чтобы снять страх "доверить премиум-авто".
 *
 * Никаких внешних запросов и виджетов → работает с VPN и без.
 */

import { ShieldCheck, Award, Clock, Sparkles, Wrench, Users } from 'lucide-react';

const FACTS = [
  {
    icon: Sparkles,
    title: 'Новый бренд — та же команда',
    body: 'Мы провели ребрендинг в 2026 году. Команда, оборудование и подход остались прежними — изменились только название и визуальный стиль.',
    accent: true,
  },
  {
    icon: Award,
    title: 'Официальное оборудование Alientech',
    body: 'Работаем на KESS3 — мировом эталоне чип-тюнинга. Это даёт корректные карты и безопасную прошивку для премиум-марок.',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантия 12 месяцев',
    body: 'На все работы по чип-тюнингу — официальная гарантия. При необходимости — бесплатный откат к заводской прошивке.',
  },
  {
    icon: Clock,
    title: 'Работаем с 2019 года',
    body: 'Более 1 500 авто прошли через наш сервис. Специализируемся на премиум-сегменте: Porsche, BMW M, AMG, Range Rover.',
  },
  {
    icon: Wrench,
    title: 'Свой автосервис в Порошкино',
    body: 'Не аренда поста на стороннем сервисе — собственный бокс на ул. Богородская, 3Б. С зоной ожидания и лаунж-зоной.',
  },
  {
    icon: Users,
    title: 'Прозрачные цены',
    body: 'Всё в калькуляторе на сайте: цена Stage 1/2/3, опции, гарантия. Без «накруток в процессе» и «доплат на выходе».',
  },
];

export function SocialProof() {
  return (
    <section className="container py-16 md:py-20">
      {/* Заголовок секции */}
      <div className="max-w-3xl mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent-dim text-accent text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="size-3.5" />
          После ребрендинга 2026
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-text uppercase tracking-tight mb-4">
          Почему нам доверяют <span className="text-accent">премиум-авто</span>
        </h2>
        <p className="text-text-muted text-base md:text-lg leading-relaxed">
          Мы не стартап. Это новое лицо проверенной команды, у которой за плечами тысячи прошитых
          двигателей, своя мастерская и понятная гарантия.
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
      <div className="mt-10 md:mt-14 card p-6 md:p-8 bg-gradient-to-r from-card via-card to-bg-card border-accent-dim">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat value="1 500+" label="авто за 5 лет" />
          <Stat value="44" label="марки в каталоге" />
          <Stat value="12 мес" label="гарантия" />
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
