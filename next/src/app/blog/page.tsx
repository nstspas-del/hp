import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import BlogFilter from '@/components/blog/BlogFilter';
import blogData from '@/data/blog-entries.json';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Блог HP Тюнинг — проекты, работы и статьи о чип-тюнинге и детейлинге',
  description:
    'Реальные проекты, работы с замерами и экспертные статьи HP Тюнинг: чип-тюнинг Stage 1/2/3 BMW, Mercedes, Audi, Porsche, Land Rover, Dodge. Детейлинг, керамика, PPF.',
  keywords: [
    'блог hp тюнинг',
    'проекты тюнинг спб',
    'работы чип-тюнинг',
    'статьи про тюнинг',
    'stage 1 vs stage 2',
    'детейлинг советы',
  ],
  alternates: { canonical: 'https://hptuning.ru/blog' },
  openGraph: {
    title: 'Блог HP Тюнинг — проекты, работы, статьи',
    description:
      'Реальные кейсы тюнинга BMW, Mercedes, Audi, Porsche. Замеры мощности, фотоотчёты, экспертные гайды.',
    url: 'https://hptuning.ru/blog',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'HP Тюнинг',
    images: [
      {
        url: 'https://hptuning.ru/images/og/blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Блог HP Тюнинг — проекты, работы, статьи',
      },
    ],
  },
};

type SearchParams = {
  cat?: string;
  brand?: string;
};

export default function BlogPage({ searchParams }: { searchParams?: SearchParams }) {
  const entries = blogData.entries as Array<{
    type: 'project' | 'work' | 'article';
    slug: string;
    title: string;
    excerpt: string;
    brand?: string;
    model?: string;
    services?: string[];
    tags?: string[];
    coverImage?: string;
    date: string;
    href: string;
    readTime?: string;
    specs?: { hp?: string; nm?: string };
  }>;

  const allowedCats = ['all', 'project', 'work', 'article'] as const;
  type Cat = (typeof allowedCats)[number];

  // Accept both English and Russian-friendly query values
  const catRaw = (searchParams?.cat ?? 'all').toLowerCase();
  const catMap: Record<string, Cat> = {
    all: 'all',
    projects: 'project',
    project: 'project',
    works: 'work',
    work: 'work',
    articles: 'article',
    article: 'article',
  };
  const initialCat: Cat = catMap[catRaw] ?? 'all';
  const initialBrand = searchParams?.brand ?? '';

  // Counts for SEO copy
  const counts = {
    project: entries.filter((e) => e.type === 'project').length,
    work: entries.filter((e) => e.type === 'work').length,
    article: entries.filter((e) => e.type === 'article').length,
  };

  return (
    <div className="section container">
      <Breadcrumbs items={[{ label: 'Блог' }]} />

      <span className="badge mb-4">Экспертный блог</span>
      <h1 className="section-title mb-4">БЛОГ HP ТЮНИНГ</h1>
      <p className="section-subtitle mb-2 max-w-3xl">
        Реальные кейсы тюнинга и детейлинга — без воды. Замеры мощности на стенде, фотоотчёты,
        экспертные гайды.
      </p>
      <p className="text-text-subtle text-sm mb-10">
        Сейчас в блоге: <span className="text-accent font-semibold">{counts.project}</span> подробных
        проекта · <span className="text-accent font-semibold">{counts.work}</span> работ с замерами ·{' '}
        <span className="text-accent font-semibold">{counts.article}</span> экспертных статей.
      </p>

      <BlogFilter entries={entries} initialCat={initialCat} initialBrand={initialBrand} />

      <div className="card mt-6 text-center bg-gradient-to-br from-bg-elevated/40 to-transparent">
        <p className="text-text-muted text-sm mb-2">
          Хотите так же? Узнайте, что можно выжать из вашего авто.
        </p>
        <a
          href="tel:+79818428151"
          className="text-accent hover:underline font-semibold"
        >
          +7 (981) 842-81-51
        </a>
      </div>
    </div>
  );
}
