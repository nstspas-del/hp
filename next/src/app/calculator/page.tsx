import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PriceCalculator } from '@/components/ui/PriceCalculator'
import Link from 'next/link'
import calcData from '@/data/calculator.json'

export const metadata: Metadata = {
 title: 'Калькулятор чип-тюнинга — рассчитайте цену онлайн | HP Тюнинг СПб',
 description: 'Калькулятор стоимости чип-тюнинга для BMW, Mercedes, Audi, Porsche, Land Rover и 30+ марок в Санкт-Петербурге. Узнайте прирост мощности и точную цену онлайн за 30 секунд.',
 keywords: ['калькулятор чип тюнинг спб', 'цена тюнинг онлайн', 'прирост мощности калькулятор', 'стоимость чип тюнинга'],
 alternates: { canonical: 'https://hptuning.ru/calculator' },
 openGraph: {
 title: 'Калькулятор чип-тюнинга — рассчитайте цену онлайн | HP Тюнинг СПб',
 description: 'Рассчитайте прирост мощности и стоимость чип-тюнинга для вашего автомобиля онлайн за 30 секунд.',
 url: 'https://hptuning.ru/calculator',
 type: 'website',
 locale: 'ru_RU',
 siteName: 'HP Тюнинг',
 images: [{ url: 'https://hptuning.ru/images/og/chip-tuning.jpg', width: 1200, height: 630, alt: 'Калькулятор чип-тюнинга HP Тюнинг' }],
 },
}

// Генерируем ItemList schema для Яндекса — список марок с ценами
function buildItemListSchema() {
 const items = calcData.brands.map((brand, i) => {
 // Минимальная цена по бренду
 const allVariants = brand.models.flatMap((m) => m.variants)
 const minPrice = allVariants.length
 ? Math.min(...allVariants.map((v) => v.our_price))
 : 20000

 return {
 '@type': 'ListItem',
 position: i + 1,
 name: `Чип-тюнинг ${brand.name} в СПб`,
 url: `https://hptuning.ru/brands/${brand.slug}`,
 description: `Стоимость чип-тюнинга ${brand.name} от ${minPrice.toLocaleString('ru-RU')} ₽`,
 }
 })

 return {
 '@context': 'https://schema.org',
 '@type': 'ItemList',
 name: 'Калькулятор стоимости чип-тюнинга HP Тюнинг',
 description: 'Цены чип-тюнинга по маркам автомобилей в Санкт-Петербурге',
 numberOfItems: items.length,
 itemListElement: items,
 }
}

// Генерируем FAQ schema с ценами конкретных марок
function buildFaqSchema() {
 return {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: [
 {
 '@type': 'Question',
 name: 'Сколько стоит чип-тюнинг BMW?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Чип-тюнинг BMW Stage 1 стоит от 24 000 ₽. Цена зависит от модели и поколения двигателя. Точную стоимость рассчитайте в нашем калькуляторе на этой странице.',
 },
 },
 {
 '@type': 'Question',
 name: 'Сколько стоит чип-тюнинг Mercedes?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Чип-тюнинг Mercedes Stage 1 стоит от 23 500 ₽. Выберите модель и двигатель в калькуляторе — получите точную цену.',
 },
 },
 {
 '@type': 'Question',
 name: 'Сколько стоит чип-тюнинг Audi?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Чип-тюнинг Audi Stage 1 стоит от 21 000 ₽. RS-модели — от 33 000 ₽. Используйте калькулятор для точной стоимости.',
 },
 },
 {
 '@type': 'Question',
 name: 'Почему у вас дешевле, чем у конкурентов?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'HP Тюнинг работает напрямую с производителями ПО, без посредников. Наши цены ниже крупных сетевых студий на 500–1 000 ₽ при той же гарантии 1 год.',
 },
 },
 ],
 }
}

export default function CalculatorPage() {
 const totalBrands = calcData.brands.length
 const totalModels = calcData.brands.reduce((acc, b) => acc + b.models.length, 0)
 const totalVariants = calcData.brands.reduce(
 (acc, b) => acc + b.models.reduce((a2, m) => a2 + m.variants.length, 0),
 0
 )
 const minPrice = Math.min(
 ...calcData.brands.flatMap((b) => b.models.flatMap((m) => m.variants.map((v) => v.our_price)))
 )

 return (
 <>
 {/* JSON-LD схемы для Яндекса */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListSchema()) }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
 />

 {/* Breadcrumb schema */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify({
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://hptuning.ru' },
 { '@type': 'ListItem', position: 2, name: 'Калькулятор цен', item: 'https://hptuning.ru/calculator' },
 ],
 }),
 }}
 />

 <main>
 {/* Хлебные крошки */}
 <Breadcrumbs items={[{ label: "Калькулятор" }]} />

 {/* Hero-секция */}
 <section className="section bg-bg pt-16 pb-10">
 <div className="container text-center max-w-3xl mx-auto">
 <span className="badge mb-4">
 Онлайн-калькулятор
 </span>
 <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text leading-tight mb-6">
 СТОИМОСТЬ<br />
 <span className="text-accent glow-accent">ЧИП-ТЮНИНГА</span>
 </h1>
 <p className="text-text-muted text-lg mb-8">
 Рассчитайте цену за 30 секунд. {totalBrands} марок, {totalModels}+ моделей,{' '}
 {totalVariants}+ вариантов двигателей. Цены от{' '}
 <strong className="text-text">{minPrice.toLocaleString('ru-RU')} ₽</strong>.
 Дешевле конкурентов на 500–1 000 ₽.
 </p>

 {/* Мини-статистика */}
 <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
 {[
 { label: 'марок', value: totalBrands },
 { label: 'моделей', value: `${totalModels}+` },
 { label: 'вариантов', value: `${totalVariants}+` },
 ].map((s) => (
 <div key={s.label} className="card p-4 text-center">
 <div className="font-display text-3xl text-accent">{s.value}</div>
 <div className="text-text-subtle text-sm mt-1">{s.label}</div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Калькулятор */}
 <PriceCalculator />

 {/* Таблица цен по маркам — SEO-контент */}
 <section className="section bg-bg">
 <div className="container">
 <h2 className="font-display text-3xl text-text text-center mb-2">
 ЦЕНЫ ЧИП-ТЮНИНГА ПО МАРКАМ
 </h2>
 <p className="text-text-muted text-center mb-10">
 Ориентировочные цены Stage 1. Точную стоимость покажет калькулятор выше.
 </p>

 <div className="overflow-x-auto">
 <table className="w-full text-sm border-collapse">
 <thead>
 <tr className="border-b border-border">
 <th className="text-left py-3 px-4 text-text-muted font-medium">Марка</th>
 <th className="text-left py-3 px-4 text-text-muted font-medium">Модели</th>
 <th className="text-right py-3 px-4 text-text-muted font-medium">Цена от</th>
 <th className="text-right py-3 px-4 text-text-muted font-medium">У конкурентов</th>
 <th className="text-right py-3 px-4 text-text-muted font-medium">Экономия</th>
 </tr>
 </thead>
 <tbody>
 {calcData.brands.map((brand) => {
 const allVariants = brand.models.flatMap((m) => m.variants)
 if (!allVariants.length) return null
 const minOur = Math.min(...allVariants.map((v) => v.our_price))
 const minComp = Math.min(...allVariants.map((v) => v.competitor_price))
 const saving = minComp - minOur
 return (
 <tr
 key={brand.slug}
 className="border-b border-border/50 hover:bg-bg-elevated transition-colors"
 >
 <td className="py-3 px-4">
 <Link
 href={`/brands/${brand.slug}`}
 className="text-text font-medium hover:text-accent transition-colors"
 >
 {brand.name}
 </Link>
 </td>
 <td className="py-3 px-4 text-text-muted">
 {brand.models.slice(0, 3).map((m) => m.name).join(', ')}
 {brand.models.length > 3 && <span className="text-text-subtle"> +ещё {brand.models.length - 3}</span>}
 </td>
 <td className="py-3 px-4 text-right font-semibold text-accent">
 {minOur.toLocaleString('ru-RU')} ₽
 </td>
 <td className="py-3 px-4 text-right text-text-muted line-through opacity-60">
 {minComp.toLocaleString('ru-RU')} ₽
 </td>
 <td className="py-3 px-4 text-right text-emerald-400 font-medium">
 −{saving.toLocaleString('ru-RU')} ₽
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 </div>
 </section>

 {/* FAQ секция — для SEO */}
 <section className="section bg-bg-elevated">
 <div className="container max-w-3xl">
 <h2 className="font-display text-3xl text-text text-center mb-10">
 ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
 </h2>
 <dl className="space-y-6">
 {[
 {
 q: 'Сколько стоит чип-тюнинг BMW в Санкт-Петербурге?',
 a: 'Чип-тюнинг BMW Stage 1 стоит от 24 000 ₽. Цена зависит от конкретной модели и поколения двигателя. BMW 1, 3, 5, X5 — от 24 000–28 000 ₽. M-серия — от 30 000 ₽.',
 },
 {
 q: 'Сколько стоит чип-тюнинг Mercedes-Benz?',
 a: 'Чип-тюнинг Mercedes Stage 1 стоит от 23 500 ₽ (C-Class 180). AMG GT — от 36 000 ₽. Выберите вашу модель в калькуляторе для точной цены.',
 },
 {
 q: 'Сколько стоит чип-тюнинг Audi?',
 a: 'Чип-тюнинг Audi Stage 1 стоит от 21 000 ₽. A3, A5, A6, Q5, Q7 — 21 000–26 000 ₽. RS3, RS6, S4, TTS — 28 000–40 000 ₽.',
 },
 {
 q: 'Сколько стоит чип-тюнинг Porsche?',
 a: 'Чип-тюнинг Porsche Stage 1 стоит от 26 000 ₽ (Macan 2.0T). 911 — от 29 500 ₽. Cayenne, Panamera — от 27 000–36 000 ₽.',
 },
 {
 q: 'Чип-тюнинг Toyota, KIA, Hyundai — дорого ли?',
 a: 'Нет, чип-тюнинг японских и корейских автомобилей стоит от 20 000 ₽. Toyota Camry — от 23 000 ₽, KIA Stinger — от 28 000 ₽, Hyundai i30 N — от 26 500 ₽.',
 },
 ].map(({ q, a }) => (
 <div key={q} className="border-b border-border pb-6">
 <dt className="text-text font-semibold mb-2">{q}</dt>
 <dd className="text-text-muted leading-relaxed">{a}</dd>
 </div>
 ))}
 </dl>
 </div>
 </section>
 </main>
 </>
 )
}
