export const dynamic = 'force-static';
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ChipTuningCalculator } from '@/components/ui/ChipTuningCalculator'
import Link from 'next/link'
import calcData from '@/data/calculator.json'

export const metadata: Metadata = {
 title: 'Калькулятор чип-тюнинга BMW, Mercedes, Audi, Porsche — цена онлайн | HP Тюнинг СПб',
 description: 'Сколько стоит чип-тюнинг BMW 320d, Mercedes E-Class, Audi A6, Porsche Cayenne, Haval Jolion в СПб? Калькулятор Stage 1 / Stage 2 — рассчитайте прошивку ЭБУ и прирост мощности онлайн за 30 секунд. 44 марки, 2 993 двигателя.',
 keywords: [
   'калькулятор чип тюнинг спб',
   'цена чип тюнинга онлайн',
   'сколько стоит чип bmw',
   'сколько стоит чип bmw 320d',
   'сколько стоит чип мерседес',
   'сколько стоит чип audi',
   'сколько стоит чип porsche',
   'прошивка эбу цена спб',
   'прошивка эбу спб',
   'stage 1 цена спб',
   'stage 2 цена спб',
   'stage 1 mercedes цена',
   'stage 2 bmw цена',
   'прирост мощности калькулятор',
   'чип тюнинг bmw 320d цена',
   'чип тюнинг bmw x5 цена',
   'чип тюнинг mercedes e-class цена',
   'чип тюнинг haval jolion цена',
   'чип тюнинг audi a6 цена',
   'чип тюнинг porsche cayenne цена',
   'чип тюнинг chery цена',
   'чип тюнинг geely цена',
   'чип тюнинг tank цена',
   'стоимость чип тюнинга',
 ],
 alternates: { canonical: 'https://hptuning.ru/calculator' },
 openGraph: {
   title: 'Калькулятор чип-тюнинга — цена Stage 1 / Stage 2 онлайн | HP Тюнинг СПб',
   description: 'Сколько стоит прошивка ЭБУ вашего авто? Калькулятор: 44 марки, 2 993 двигателя — точная цена и прирост мощности за 30 секунд.',
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
   const allVariants = brand.models.flatMap((m) => m.variants)
   const minPrice = allVariants.length
     ? Math.min(...allVariants.map((v) => v.our_price))
     : 20000

   return {
     '@type': 'ListItem',
     position: i + 1,
     name: `Чип-тюнинг ${brand.name} в СПб — цена и прирост мощности`,
     // Ведём не на пустые /brands/*, а на калькулятор с предвыбранным брендом
     url: `https://hptuning.ru/calculator?brand=${brand.slug}`,
     description: `Стоимость чип-тюнинга ${brand.name} Stage 1 от ${minPrice.toLocaleString('ru-RU')} ₽. Рассчитайте точную цену прошивки ЭБУ онлайн.`,
   }
 })

 return {
   '@context': 'https://schema.org',
   '@type': 'ItemList',
   name: 'Калькулятор стоимости чип-тюнинга HP Тюнинг — цены по маркам',
   description: 'Цены чип-тюнинга Stage 1 / Stage 2 по 44 маркам автомобилей в Санкт-Петербурге',
   numberOfItems: items.length,
   itemListElement: items,
 }
}

// Расширенный FAQPage — 20 вопросов под длинный хвост
function buildFaqSchema() {
 const faqs: { q: string; a: string }[] = [
   {
     q: 'Сколько стоит чип-тюнинг BMW 320d F30 в СПб?',
     a: 'Чип-тюнинг BMW 320d F30 Stage 1 стоит от 24 000 ₽. Прирост: +40–50 л.с. и +80–100 Нм крутящего момента. Время работы — 2–3 часа.',
   },
   {
     q: 'Сколько стоит чип-тюнинг BMW X5 F15 / G05 3.0d?',
     a: 'Чип-тюнинг BMW X5 F15/G05 30d Stage 1 — от 26 000 ₽. Прирост: +50–60 л.с. и +100–120 Нм. На M-моторах N63/S63 — от 32 000 ₽.',
   },
   {
     q: 'Прирост мощности BMW 520d после Stage 1?',
     a: 'BMW 520d Stage 1 даёт +40–45 л.с. (со стоковых 190 до 230–235 л.с.) и +80 Нм. Замер на стенде входит в стоимость.',
   },
   {
     q: 'Сколько стоит прошивка ЭБУ Mercedes E-Class W213?',
     a: 'Прошивка ЭБУ Mercedes E-Class W213 — от 25 000 ₽ (E220d, E300d). E63 AMG — от 38 000 ₽. Используем дилерское оборудование XENTRY и калибровки Alientech.',
   },
   {
     q: 'Цена Stage 1 для Mercedes GLE 350d W167?',
     a: 'Stage 1 Mercedes GLE 350d W167 — от 26 500 ₽. Прирост: +55 л.с. и +110 Нм. Гарантия на ПО — 12 месяцев.',
   },
   {
     q: 'Сколько стоит чип-тюнинг Haval Jolion 1.5T?',
     a: 'Чип-тюнинг Haval Jolion 1.5T Stage 1 — от 20 000 ₽. Прирост: +25–30 л.с. и +50 Нм. Ровный отклик педали газа и устранение «турбоямы».',
   },
   {
     q: 'Прирост Haval Dargo после прошивки?',
     a: 'Haval Dargo 2.0T Stage 1 — +30 л.с. и +60 Нм к стоковым 192 л.с. Цена — от 21 500 ₽. Бережная калибровка под АКПП 9HP48.',
   },
   {
     q: 'Цена чип-тюнинга Audi A6 C8 3.0 TDI?',
     a: 'Audi A6 C8 3.0 TDI Stage 1 — от 26 000 ₽. Прирост: +60 л.с. и +130 Нм. Возможна оптимизация под АКПП ZF 8HP.',
   },
   {
     q: 'Stage 2 Porsche Cayenne 958 — сколько стоит?',
     a: 'Stage 2 Porsche Cayenne 958 (V8 4.8T) — от 36 000 ₽. Включает программу и согласование с уже установленным железом (выпуск, интеркулер).',
   },
   {
     q: 'Чип-тюнинг Chery Tiggo 8 Pro — цена?',
     a: 'Chery Tiggo 8 Pro 2.0T Stage 1 — от 20 500 ₽. Прирост: +35 л.с. и +70 Нм. Корректная работа с китайским ЭБУ Bosch ME17.',
   },
   {
     q: 'Сколько стоит прошивка Geely Coolray?',
     a: 'Geely Coolray 1.5T Stage 1 — от 19 500 ₽. Прирост: +30 л.с. и +60 Нм. Совместимо с заводской АКПП DCT-7.',
   },
   {
     q: 'Tank 300 чип-тюнинг — есть ли прошивка?',
     a: 'Да, прошивка Tank 300 2.0T доступна. Stage 1 — от 22 000 ₽, прирост +35 л.с. и +75 Нм. Сохраняем заводскую защиту АКПП.',
   },
   {
     q: 'Сколько стоит чип-тюнинг дизеля в СПб?',
     a: 'Чип-тюнинг дизельного двигателя в HP Тюнинг — от 20 000 ₽. Прирост по дизелям обычно выше (+25–35% к крутящему моменту). При желании одновременно с EGR / DPF / AdBlue off — со скидкой комплексом.',
   },
   {
     q: 'Прошивка ЭБУ Stage 1 в Питере — сколько стоит?',
     a: 'Прошивка ЭБУ Stage 1 в СПб — от 20 000 ₽. Конкретная цена зависит от марки и двигателя. Точную сумму покажет калькулятор выше.',
   },
   {
     q: 'Чем Stage 1 отличается от Stage 2?',
     a: 'Stage 1 — программная оптимизация на стоковом железе (только калибровка ЭБУ). Stage 2 — программа под уже установленные доработки: спортивный выпуск, downpipe, увеличенный интеркулер. Stage 3 — серьёзные железные доработки (турбина, форсунки).',
   },
   {
     q: 'Можно ли вернуть стоковую прошивку обратно?',
     a: 'Да, всегда. Перед работой делаем полный бэкап заводского ПО и храним его бессрочно. Возврат к стоку — бесплатно для наших клиентов.',
   },
   {
     q: 'Слетит ли гарантия после чип-тюнинга?',
     a: 'На современных авто (BMW, Mercedes, Audi, Porsche) ОД может определить факт изменения ПО. Поэтому если машина на гарантии — рекомендуем делать чип после её окончания. Перед обращением к ОД мы можем вернуть стоковую прошивку.',
   },
   {
     q: 'Сколько по времени делается прошивка?',
     a: 'Stage 1 — 2–3 часа на машину. Stage 2 — 3–5 часов с замером на стенде. Можно сделать за один визит, ожидание в комфортной зоне с Wi-Fi.',
   },
   {
     q: 'Чип-тюнинг — это то же самое, что прошивка ЭБУ?',
     a: 'Да, это синонимы. Современный «чип-тюнинг» — это программная перепрошивка блока управления двигателем (ЭБУ) через диагностический разъём OBD. Никаких чипов физически не паяем — это технология 1990-х.',
   },
   {
     q: 'Какой ECU у моей машины — как узнать?',
     a: 'Не нужно знать заранее — мы определим ЭБУ при подключении сканера (Bosch MEDxx, Siemens SDIxx, Continental EMSxx и т.д.). Подходящее ПО подбираем из библиотек Alientech, Dimsport, CMD.',
   },
 ]
 return {
   '@context': 'https://schema.org',
   '@type': 'FAQPage',
   mainEntity: faqs.map((f) => ({
     '@type': 'Question',
     name: f.q,
     acceptedAnswer: { '@type': 'Answer', text: f.a },
   })),
 }
}

// Популярные расчёты — внутренние анкоры под длинный хвост
const POPULAR_CALCS: { label: string; href: string; freq: string }[] = [
 { label: 'Чип BMW 320d F30 Stage 1', href: '/calculator?brand=bmw&model=3-series', freq: 'от 24 000 ₽' },
 { label: 'Прошивка Mercedes E-Class W213', href: '/calculator?brand=mercedes&model=e-class', freq: 'от 25 000 ₽' },
 { label: 'Чип Haval Jolion 1.5T', href: '/calculator?brand=haval&model=jolion', freq: 'от 20 000 ₽' },
 { label: 'Stage 2 Porsche Cayenne 958', href: '/calculator?brand=porsche&model=cayenne', freq: 'от 36 000 ₽' },
 { label: 'Чип Audi A6 C8 3.0 TDI', href: '/calculator?brand=audi&model=a6', freq: 'от 26 000 ₽' },
 { label: 'Прошивка Chery Tiggo 8 Pro', href: '/calculator?brand=chery&model=tiggo-8-pro', freq: 'от 20 500 ₽' },
 { label: 'Чип BMW X5 G05 30d', href: '/calculator?brand=bmw&model=x5', freq: 'от 26 000 ₽' },
 { label: 'Tank 300 Stage 1', href: '/calculator?brand=tank&model=300', freq: 'от 22 000 ₽' },
]

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
           <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text leading-tight mb-6">
             СТОИМОСТЬ<br />
             <span className="text-accent glow-accent">ЧИП-ТЮНИНГА</span>
           </h1>
           <p className="text-text-muted text-lg mb-8">
             Калькулятор прошивки ЭБУ Stage 1 / Stage 2 в Санкт-Петербурге. {totalBrands} марок,{' '}
             {totalModels}+ моделей, {totalVariants}+ вариантов двигателей. Цены от{' '}
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

           {/* 🔥 Популярные расчёты — внутренние ссылки под длинный хвост */}
           <div className="mt-6">
             <div className="text-text-subtle text-sm uppercase tracking-wider mb-3">
               🔥 Чаще всего рассчитывают
             </div>
             <div className="flex flex-wrap gap-2 justify-center">
               {POPULAR_CALCS.map((c) => (
                 <Link
                   key={c.href}
                   href={c.href}
                   className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-accent hover:text-accent transition-colors text-sm text-text-muted bg-bg-elevated"
                 >
                   <span>{c.label}</span>
                   <span className="text-accent font-medium">{c.freq}</span>
                 </Link>
               ))}
             </div>
           </div>
         </div>
       </section>

       {/* Калькулятор */}
       <ChipTuningCalculator />

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
                           href={`/calculator?brand=${brand.slug}`}
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

       {/* SEO-текст: упоминание моделей для совпадения с длинным хвостом */}
       <section className="section bg-bg-elevated">
         <div className="container max-w-4xl">
           <h2 className="font-display text-3xl text-text text-center mb-8">
             ЧИП-ТЮНИНГ В САНКТ-ПЕТЕРБУРГЕ — НА КАКИХ МОДЕЛЯХ РАБОТАЕМ
           </h2>
           <div className="prose prose-invert max-w-none text-text-muted leading-relaxed space-y-4">
             <p>
               HP Тюнинг делает чип-тюнинг и прошивку ЭБУ для премиальных европейских и современных
               китайских автомобилей. <strong className="text-text">BMW</strong> — все поколения 1, 3, 5, 7-серии,
               X1, X3, X5, X6, X7, M-серия (E90, F30, G20, F10, G30, F15, G05, F16, G06, F95, G07).
               Чип-тюнинг BMW 320d, 330d, 520d, 530d, X5 30d/40d, X6 M50i, M3, M5 — все эти запросы закрывает
               наш калькулятор.
             </p>
             <p>
               <strong className="text-text">Mercedes-Benz</strong> — C-Class W205, E-Class W213, S-Class W222,
               GLE W167/W166, GLC X253, ML W164, AMG-линейка (C43, E53, E63, GLE53, GLE63, GT). Прошивка ЭБУ
               Mercedes E220d, E300d, GLE 350d, GLE 450, S500, AMG C63 — всё рассчитываем онлайн.
             </p>
             <p>
               <strong className="text-text">Audi</strong> — A3, A4 B9, A5, A6 C8, A7, A8, Q3, Q5 FY, Q7, Q8,
               RS3, RS4, RS6, S4, S5, TT, TTS. <strong className="text-text">Porsche</strong> — Cayenne 9YA,
               Cayenne 958, Macan 95B, Panamera, 911, Taycan. Stage 1, Stage 2, в отдельных случаях Stage 3
               под установленное железо.
             </p>
             <p>
               <strong className="text-text">Современные китайцы</strong> — Haval Jolion, Dargo, F7, H6, H9;
               Chery Tiggo 4, 7, 8 Pro, Tiggo 8 Pro Max; Geely Coolray, Atlas, Monjaro; Tank 300, 500;
               Exeed VX, LX, TXL; Voyah Free, Dream; Li Auto L7, L9; Aito M5, M7; BYD Han, Tang. Если вашей
               модели нет в калькуляторе — оставьте заявку, добавим за 24 часа из библиотек Alientech и Dimsport.
             </p>
             <p>
               <strong className="text-text">Land Rover / Range Rover</strong> — Range Rover Sport, Velar, Evoque,
               Discovery, Defender. <strong className="text-text">Volvo</strong>, <strong className="text-text">Lexus</strong>,
               <strong className="text-text"> Toyota</strong> (Camry, Land Cruiser 300, Highlander, RAV4) —
               рассчитываем чип-тюнинг для всех современных моторов.
             </p>
             <p className="text-sm text-text-subtle">
               Не нашли свою машину? Напишите в Telegram или WhatsApp — добавим вашу модель в калькулятор
               в течение суток. Работаем по записи 10:00–22:00, без выходных.
             </p>
           </div>
         </div>
       </section>

       {/* FAQ секция — для SEO, 20 вопросов */}
       <section className="section bg-bg">
         <div className="container max-w-3xl">
           <h2 className="font-display text-3xl text-text text-center mb-10">
             ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
           </h2>
           <dl className="space-y-6">
             {[
               { q: 'Сколько стоит чип-тюнинг BMW 320d F30 в СПб?', a: 'Чип-тюнинг BMW 320d F30 Stage 1 стоит от 24 000 ₽. Прирост: +40–50 л.с. и +80–100 Нм крутящего момента. Время работы — 2–3 часа.' },
               { q: 'Сколько стоит чип-тюнинг BMW X5 F15 / G05 3.0d?', a: 'Чип-тюнинг BMW X5 F15/G05 30d Stage 1 — от 26 000 ₽. Прирост: +50–60 л.с. и +100–120 Нм. На M-моторах N63/S63 — от 32 000 ₽.' },
               { q: 'Прирост мощности BMW 520d после Stage 1?', a: 'BMW 520d Stage 1 даёт +40–45 л.с. (со стоковых 190 до 230–235 л.с.) и +80 Нм. Замер на стенде входит в стоимость.' },
               { q: 'Сколько стоит прошивка ЭБУ Mercedes E-Class W213?', a: 'Прошивка ЭБУ Mercedes E-Class W213 — от 25 000 ₽ (E220d, E300d). E63 AMG — от 38 000 ₽. Используем дилерское оборудование XENTRY и калибровки Alientech.' },
               { q: 'Цена Stage 1 для Mercedes GLE 350d W167?', a: 'Stage 1 Mercedes GLE 350d W167 — от 26 500 ₽. Прирост: +55 л.с. и +110 Нм. Гарантия на ПО — 12 месяцев.' },
               { q: 'Сколько стоит чип-тюнинг Haval Jolion 1.5T?', a: 'Чип-тюнинг Haval Jolion 1.5T Stage 1 — от 20 000 ₽. Прирост: +25–30 л.с. и +50 Нм. Ровный отклик педали газа и устранение «турбоямы».' },
               { q: 'Прирост Haval Dargo после прошивки?', a: 'Haval Dargo 2.0T Stage 1 — +30 л.с. и +60 Нм к стоковым 192 л.с. Цена — от 21 500 ₽. Бережная калибровка под АКПП 9HP48.' },
               { q: 'Цена чип-тюнинга Audi A6 C8 3.0 TDI?', a: 'Audi A6 C8 3.0 TDI Stage 1 — от 26 000 ₽. Прирост: +60 л.с. и +130 Нм. Возможна оптимизация под АКПП ZF 8HP.' },
               { q: 'Stage 2 Porsche Cayenne 958 — сколько стоит?', a: 'Stage 2 Porsche Cayenne 958 (V8 4.8T) — от 36 000 ₽. Включает программу и согласование с уже установленным железом (выпуск, интеркулер).' },
               { q: 'Чип-тюнинг Chery Tiggo 8 Pro — цена?', a: 'Chery Tiggo 8 Pro 2.0T Stage 1 — от 20 500 ₽. Прирост: +35 л.с. и +70 Нм. Корректная работа с китайским ЭБУ Bosch ME17.' },
               { q: 'Сколько стоит прошивка Geely Coolray?', a: 'Geely Coolray 1.5T Stage 1 — от 19 500 ₽. Прирост: +30 л.с. и +60 Нм. Совместимо с заводской АКПП DCT-7.' },
               { q: 'Tank 300 чип-тюнинг — есть ли прошивка?', a: 'Да, прошивка Tank 300 2.0T доступна. Stage 1 — от 22 000 ₽, прирост +35 л.с. и +75 Нм. Сохраняем заводскую защиту АКПП.' },
               { q: 'Сколько стоит чип-тюнинг дизеля в СПб?', a: 'Чип-тюнинг дизельного двигателя в HP Тюнинг — от 20 000 ₽. Прирост по дизелям обычно выше (+25–35% к крутящему моменту). При желании одновременно с EGR / DPF / AdBlue off — со скидкой комплексом.' },
               { q: 'Прошивка ЭБУ Stage 1 в Питере — сколько стоит?', a: 'Прошивка ЭБУ Stage 1 в СПб — от 20 000 ₽. Конкретная цена зависит от марки и двигателя. Точную сумму покажет калькулятор выше.' },
               { q: 'Чем Stage 1 отличается от Stage 2?', a: 'Stage 1 — программная оптимизация на стоковом железе (только калибровка ЭБУ). Stage 2 — программа под уже установленные доработки: спортивный выпуск, downpipe, увеличенный интеркулер. Stage 3 — серьёзные железные доработки (турбина, форсунки).' },
               { q: 'Можно ли вернуть стоковую прошивку обратно?', a: 'Да, всегда. Перед работой делаем полный бэкап заводского ПО и храним его бессрочно. Возврат к стоку — бесплатно для наших клиентов.' },
               { q: 'Слетит ли гарантия после чип-тюнинга?', a: 'На современных авто (BMW, Mercedes, Audi, Porsche) ОД может определить факт изменения ПО. Поэтому если машина на гарантии — рекомендуем делать чип после её окончания. Перед обращением к ОД мы можем вернуть стоковую прошивку.' },
               { q: 'Сколько по времени делается прошивка?', a: 'Stage 1 — 2–3 часа на машину. Stage 2 — 3–5 часов с замером на стенде. Можно сделать за один визит, ожидание в комфортной зоне с Wi-Fi.' },
               { q: 'Чип-тюнинг — это то же самое, что прошивка ЭБУ?', a: 'Да, это синонимы. Современный «чип-тюнинг» — это программная перепрошивка блока управления двигателем (ЭБУ) через диагностический разъём OBD. Никаких чипов физически не паяем — это технология 1990-х.' },
               { q: 'Какой ECU у моей машины — как узнать?', a: 'Не нужно знать заранее — мы определим ЭБУ при подключении сканера (Bosch MEDxx, Siemens SDIxx, Continental EMSxx и т.д.). Подходящее ПО подбираем из библиотек Alientech, Dimsport, CMD.' },
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
