import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import brands from '@/data/brands.json';
import seoData from '@/data/seo.json';

export const metadata: Metadata = {
  title: seoData.pages.brands.title,
  description: seoData.pages.brands.description,
  alternates: { canonical: 'https://hptuning.ru/brands' },
};

export default function BrandsPage() {
  const featured = brands.filter((b) => b.featured);
  const rest = brands.filter((b) => !b.featured);

  return (
    <div className="section container">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-subtle mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
        <span className="mx-2">→</span>
        <span className="text-text-muted">Бренды</span>
      </nav>

      <h1 className="section-title mb-4">{seoData.pages.brands.h1}</h1>
      <p className="section-subtitle mb-12">{seoData.pages.brands.description}</p>

      <h2 className="font-display text-2xl text-accent uppercase tracking-wider mb-6">Премиум бренды</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {featured.map((brand) => (
          <Link key={brand.slug} href={`/brands/${brand.slug}`}
            className="card flex flex-col gap-3 hover:border-accent-dim group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-display font-bold"
              style={{ backgroundColor: `${brand.color}20`, color: brand.color }}>
              {brand.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-display text-xl text-text tracking-wider group-hover:text-accent transition-colors">
                {brand.name}
              </h3>
              <p className="text-text-subtle text-xs mt-1">{brand.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
              <span className="text-accent text-sm font-semibold">
                от {brand.priceFrom.toLocaleString('ru-RU')} ₽
              </span>
              <ArrowRight className="size-4 text-text-subtle group-hover:text-accent transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-2xl text-text uppercase tracking-wider mb-6">Все марки</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rest.map((brand) => (
          <Link key={brand.slug} href={`/brands/${brand.slug}`}
            className="card flex items-center gap-3 hover:border-accent-dim group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-display font-bold shrink-0"
              style={{ backgroundColor: `${brand.color ?? '#39FF14'}20`, color: brand.color ?? '#39FF14' }}>
              {brand.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-text text-sm font-medium group-hover:text-accent transition-colors">{brand.name}</div>
              <div className="text-text-subtle text-xs">от {brand.priceFrom.toLocaleString('ru-RU')} ₽</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
