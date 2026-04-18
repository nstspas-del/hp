'use client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface WorkCase {
 id: number;
 brand: string;
 model: string;
 service: string;
 hp_before: number;
 hp_after: number;
 nm_before: number;
 nm_after: number;
 tags: string[];
 color: string;
 image?: string;
}

const PLACEHOLDER =
 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGYxNTEzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMThweCIgZmlsbD0iIzM5RkYxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZPVE8g0J3QldCh0ItQ0KLQlyDQodCa0J7QoNCePC90ZXh0Pjwvc3ZnPg==';

export function WorkCard({ w }: { w: WorkCase }) {
 const [imgSrc, setImgSrc] = useState(w.image ?? PLACEHOLDER);

 return (
 <article className="card group hover:border-accent-dim overflow-hidden p-0 flex flex-col">
 {/* Фото работы */}
 <div className="relative w-full h-48 bg-bg-elevated overflow-hidden">
 <Image
 src={imgSrc}
 alt={`${w.brand} ${w.model} — ${w.service} | HP Тюнинг`}
 fill
 className="object-cover group-hover:scale-105 transition-transform duration-500"
 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 onError={() => setImgSrc(PLACEHOLDER)}
 />
 {/* Теги поверх фото */}
 <div className="absolute top-3 left-3 flex flex-wrap gap-1">
 {w.tags.map((t) => (
 <span key={t} className="badge text-xs px-2 py-0.5">{t}</span>
 ))}
 </div>
 </div>

 {/* Контент */}
 <div className="p-5 flex flex-col flex-1">
 <div className="flex items-start justify-between gap-2 mb-3">
 <div>
 <div className="text-text font-semibold group-hover:text-accent transition-colors">
 {w.brand} {w.model}
 </div>
 <div className="text-text-subtle text-xs mt-0.5">{w.service}</div>
 </div>
 <ArrowUpRight className="size-4 text-text-subtle group-hover:text-accent transition-colors shrink-0 mt-0.5" />
 </div>

 {/* Замеры тюнинга */}
 {w.hp_after > 0 && (
 <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border">
 <div>
 <div className="text-text-subtle text-xs mb-1">Мощность</div>
 <div className="flex items-baseline gap-1">
 <span className="text-text-muted text-sm">{w.hp_before}</span>
 <span className="text-text-subtle text-xs">→</span>
 <span className="text-accent font-bold">{w.hp_after}</span>
 <span className="text-text-subtle text-xs">л.с.</span>
 </div>
 </div>
 <div>
 <div className="text-text-subtle text-xs mb-1">Тяга</div>
 <div className="flex items-baseline gap-1">
 <span className="text-text-muted text-sm">{w.nm_before}</span>
 <span className="text-text-subtle text-xs">→</span>
 <span className="text-accent font-bold">{w.nm_after}</span>
 <span className="text-text-subtle text-xs">Нм</span>
 </div>
 </div>
 </div>
 )}

 {/* Детейлинг */}
 {w.hp_after === 0 && (
 <div className="mt-auto pt-4 border-t border-border text-text-subtle text-sm">
 Профессиональная обработка. Фото до/после — по запросу.
 </div>
 )}
 </div>
 </article>
 );
}
