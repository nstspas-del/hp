import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Блог HP Тюнинг — статьи о чип-тюнинге и детейлинге | СПб',
  description: 'Экспертный блог HP Тюнинг: чип-тюнинг Stage 1/2/3 BMW, Mercedes, Audi, Porsche, Land Rover — сравнения, реальные результаты. Детейлинг, керамика, PPF. Советы по уходу за авто.',
  keywords: ['блог чип тюнинг спб', 'статьи про тюнинг', 'stage 1 vs stage 2', 'детейлинг советы'],
  alternates: { canonical: 'https://hptuning.ru/blog' },
  openGraph: {
    title: 'Блог HP Тюнинг — эксперты о тюнинге и детейлинге',
    description: 'Экспертный блог HP Тюнинг: чип-тюнинг Stage 1/2/3 BMW, Mercedes, Audi, Porsche, Land Rover — сравнения, реальные результаты. Детейлинг, керамика, PPF. Советы по у',
    url: 'https://hptuning.ru/blog',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [{ url: 'https://hptuning.ru/images/og/blog.jpg', width: 1200, height: 630, alt: 'Блог HP Тюнинг — эксперты о тюнинге и детейлинге' }],
  },
};

const POSTS = [
  {
    slug: 'chip-tuning-stage-1-vs-stage-2',
    title: 'Stage 1 vs Stage 2: что выбрать для ежедневного авто',
    excerpt: 'Разбираем разницу между Stage 1 и Stage 2 простым языком: риски, цены, что нужно для перехода. Опыт 500+ клиентов HP Тюнинг.',
    category: 'Чип-тюнинг',
    date: '2025-12-10',
    readTime: '8 мин',
  },
  {
    slug: 'ceramic-coating-9h-spb',
    title: 'Керамическое покрытие 9H: всё что нужно знать перед нанесением',
    excerpt: 'Как работает керамика, сколько служит, как за ней ухаживать. Сравниваем с PPF плёнкой и стандартным воском.',
    category: 'Детейлинг',
    date: '2025-11-28',
    readTime: '10 мин',
  },
  {
    slug: 'bmw-chip-tuning-spb',
    title: 'Чип-тюнинг BMW в СПб: какие серии поддаются прошивке лучше всего',
    excerpt: 'F-серия, G-серия, M-модели — что можно выжать из каждого поколения. Конкретные цифры прироста мощности для популярных BMW.',
    category: 'Бренды',
    date: '2025-11-15',
    readTime: '12 мин',
  },
  {
    slug: 'dpf-egr-off-spb',
    title: 'DPF и EGR-off: когда это нужно и как это делается',
    excerpt: 'Разбираем когда оправдано удаление сажевого фильтра и клапана EGR, какие ошибки это устраняет и что ждать после.',
    category: 'Чип-тюнинг',
    date: '2025-10-30',
    readTime: '9 мин',
  },
  {
    slug: 'ppf-film-what-is-it',
    title: 'PPF плёнка: что защищает, сколько стоит и как выбрать',
    excerpt: 'Полиуретановая плёнка vs антигравий vs керамика. Где лучше клеить PPF, как долго служит и почему это дорого.',
    category: 'Детейлинг',
    date: '2025-10-15',
    readTime: '7 мин',
  },
  {
    slug: 'mercedes-amg-tuning',
    title: 'Тюнинг Mercedes-Benz AMG: реально ли прошить AMG-двигатель',
    excerpt: 'AMG 2.0, 3.0 biturbo, 4.0 V8 biturbo — разбираем особенности прошивки и почему AMG тюнинг требует опыта.',
    category: 'Бренды',
    date: '2025-09-20',
    readTime: '11 мин',
  },
  {
    slug: 'fuel-economy-chip-tuning',
    title: 'Чип-тюнинг для экономии топлива: миф или реальность',
    excerpt: 'Реальные цифры снижения расхода топлива после чип-тюнинга. Кому это особенно актуально и когда ожидать эффекта.',
    category: 'Чип-тюнинг',
    date: '2025-09-05',
    readTime: '8 мин',
  },
  {
    slug: 'car-wash-after-ceramic',
    title: 'Уход за автомобилем после нанесения керамики: памятка',
    excerpt: 'Как правильно мыть авто с керамикой, чем нельзя пользоваться, когда первая мойка после нанесения.',
    category: 'Детейлинг',
    date: '2025-08-18',
    readTime: '5 мин',
  },
];

const CATEGORIES = ['Все', 'Чип-тюнинг', 'Детейлинг', 'Бренды'];

const CATEGORY_COLORS: Record<string, string> = {
  'Чип-тюнинг': 'text-accent',
  'Детейлинг': 'text-blue-400',
  'Бренды': 'text-orange-400',
};

export default function BlogPage() {
  return (
    <div className="section container">
<Breadcrumbs items={[{ label: "Блог" }]} />

      <span className="badge mb-4">Экспертный блог</span>
      <h1 className="section-title mb-4">БЛОГ HP ТЮНИНГ</h1>
      <p className="section-subtitle mb-10">
        Разбираем тюнинг, детейлинг и обслуживание премиальных авто без воды.
        Реальный опыт 500+ клиентов.
      </p>

      {/* Категории */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <span key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
              cat === 'Все'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-border text-text-subtle hover:border-accent-dim hover:text-text'
            }`}>
            {cat}
          </span>
        ))}
      </div>

      {/* Первая статья — большая */}
      <article className="card hover:border-accent-dim group mb-6 lg:flex gap-8 p-0 overflow-hidden">
        <div className="lg:w-2/5 bg-gradient-to-br from-bg-elevated to-bg-card min-h-48 flex items-center justify-center p-8">
          <div className="font-display text-6xl text-accent opacity-20">01</div>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold uppercase tracking-wider ${CATEGORY_COLORS[POSTS[0].category] ?? 'text-accent'}`}>
              {POSTS[0].category}
            </span>
            <span className="text-text-subtle text-xs flex items-center gap-1">
              <Calendar className="size-3" />{new Date(POSTS[0].date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-text uppercase tracking-wider group-hover:text-accent transition-colors mb-3 leading-tight">
            {POSTS[0].title}
          </h2>
          <p className="text-text-muted leading-relaxed mb-5 flex-1">{POSTS[0].excerpt}</p>
          <div className="flex items-center gap-4">
            <span className="btn-primary text-sm px-6 py-2.5 cursor-pointer">Читать статью</span>
            <span className="text-text-subtle text-xs flex items-center gap-1">
              <Clock className="size-3" />{POSTS[0].readTime}
            </span>
          </div>
        </div>
      </article>

      {/* Остальные статьи */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
        {POSTS.slice(1).map((post, i) => (
          <article key={post.slug} className="card hover:border-accent-dim group flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Tag className={`size-3.5 ${CATEGORY_COLORS[post.category] ?? 'text-accent'}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'text-accent'}`}>
                {post.category}
              </span>
            </div>
            <h2 className="font-semibold text-text group-hover:text-accent transition-colors leading-snug mb-3">
              {post.title}
            </h2>
            <p className="text-text-subtle text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-text-subtle text-xs flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(post.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </span>
              <span className="text-text-subtle text-xs flex items-center gap-1">
                <Clock className="size-3" />{post.readTime}
              </span>
            </div>
          </article>
        ))}
      </div>

      <p className="text-center text-text-subtle text-sm">
        Скоро — больше статей. Следите за обновлениями или позвоните за личной консультацией:&nbsp;
        <a href="tel:+79818428151" className="text-accent hover:underline">+7 (981) 842-81-51</a>
      </p>
    </div>
  );
}
