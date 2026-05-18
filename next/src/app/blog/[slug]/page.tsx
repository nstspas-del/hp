import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BlogPostBody, type BlogPost } from '@/components/blog/BlogPostBody';
import blogPosts from '@/data/blog-posts.json';

export const dynamic = 'force-static';
export const dynamicParams = false;

// JSON-инфер слишком узкий (литералы 'work'|'project', разные ключи specs).
// Через unknown — корректный путь привести к нашему доменному типу.
const POSTS = (blogPosts.posts as unknown as BlogPost[]) ?? [];

/**
 * Pre-render все известные slug'и постов как статические страницы.
 * Это даёт максимальную скорость + хорошие SEO-метрики (TTFB).
 */
export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};

  const url = `https://hptuning.ru/blog/${post.slug}`;
  const imageUrl = post.heroImage.startsWith('http') ? post.heroImage : `https://hptuning.ru${post.heroImage}`;

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription,
    keywords: post.keywords ?? post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription,
      url,
      type: 'article',
      locale: 'ru_RU',
      siteName: 'HP Тюнинг',
      publishedTime: post.datePublished,
      authors: ['HP Тюнинг'],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle ?? post.title,
      description: post.metaDescription,
      images: [imageUrl],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const url = `https://hptuning.ru/blog/${post.slug}`;
  const imageUrl = post.heroImage.startsWith('http') ? post.heroImage : `https://hptuning.ru${post.heroImage}`;

  // ── Schema.org Article ────────────────────────────────────────────────
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.metaDescription,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    author: {
      '@type': 'Organization',
      '@id': 'https://hptuning.ru/#org',
      name: 'HP Тюнинг',
      url: 'https://hptuning.ru',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://hptuning.ru/#org',
      name: 'HP Тюнинг',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hptuning.ru/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: (post.keywords ?? post.tags ?? []).join(', '),
    about: post.brand
      ? {
          '@type': 'Brand',
          name: post.brand,
        }
      : undefined,
  };

  // ── BreadcrumbList ────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://hptuning.ru/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  // ── FAQPage (опционально, если есть FAQ) ──────────────────────────────
  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: post.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container pt-6">
        <Breadcrumbs
          items={[
            { label: 'Блог', href: '/blog' },
            { label: post.brand, href: `/blog?brand=${encodeURIComponent(post.brand)}` },
            { label: post.model ?? post.title.split(' — ')[0] },
          ]}
        />
      </div>

      <BlogPostBody post={post} />
    </>
  );
}
