import Link from 'next/link';

export interface BreadcrumbItem {
 label: string;
 href?: string;
}

interface BreadcrumbsProps {
 items: BreadcrumbItem[];
 className?: string;
}

/**
 * Breadcrumbs — хлебные крошки с автоматической JSON-LD схемой BreadcrumbList.
 *
 * Использование:
 * <Breadcrumbs items={[
 * { label: 'Марки', href: '/brands' },
 * { label: 'BMW', href: '/brands/bmw' },
 * { label: 'Stage 2' }, // последний без href — текущая страница
 * ]} />
 *
 * Примеры:
 * "Главная › Марки › BMW"
 * "Главная › Тюнинг › Чип-тюнинг › Stage 2"
 * "Главная › Детейлинг › Керамика"
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
 // Всегда добавляем «Главная» первым элементом
 const fullItems: BreadcrumbItem[] = [
 { label: 'Главная', href: '/' },
 ...items,
 ];

 // Schema.org BreadcrumbList
 const breadcrumbSchema = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: fullItems.map((item, idx) => ({
 '@type': 'ListItem',
 position: idx + 1,
 name: item.label,
 ...(item.href
 ? { item: item.href.startsWith('http') ? item.href : `https://hptuning.ru${item.href}` }
 : {}),
 })),
 };

 return (
 <>
 {/* JSON-LD schema */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
 />

 {/* Визуальные крошки */}
 <nav
 aria-label="Хлебные крошки"
 className={`bg-bg-elevated border-b border-border ${className}`}
 >
 <div className="container py-3">
 <ol className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-text-subtle">
 {fullItems.map((item, idx) => {
 const isLast = idx === fullItems.length - 1;
 return (
 <li key={idx} className="flex items-center gap-2">
 {idx > 0 && (
 <span className="text-text-subtle/50 select-none" aria-hidden>›</span>
 )}
 {isLast || !item.href ? (
 // Активный (текущий) элемент — белый, без ссылки
 <span className="text-text font-medium" aria-current="page">
 {item.label}
 </span>
 ) : (
 // Ссылка — серая, зеленеет при hover
 <Link
 href={item.href}
 className="hover:text-accent transition-colors"
 >
 {item.label}
 </Link>
 )}
 </li>
 );
 })}
 </ol>
 </div>
 </nav>
 </>
 );
}
