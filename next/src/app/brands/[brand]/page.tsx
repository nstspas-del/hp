/**
 * /brands/[brand]/page.tsx — HP Тюнинг
 *
 * Два режима работы:
 *  1. Субдомен bmw.hptuning.ru → middleware делает rewrite сюда.
 *     x-brand-slug header = 'bmw'
 *     Canonical = https://bmw.hptuning.ru/
 *
 *  2. Прямой URL hptuning.ru/brands/bmw → middleware делает 301 на субдомен.
 *     Эта страница больше не рендерится напрямую для субдоменных брендов.
 *     Для остальных брендов (не в BRAND_SUBDOMAIN_MAP) — рендерится как раньше.
 */
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { CheckCircle, AlertTriangle, Phone, Zap, Sparkles, Wrench, Shield, Clock, Award, Star } from 'lucide-react';
import brands from '@/data/brands.json';
import { BookingButton } from '@/components/ui/BookingButton';
import {
  getBrandFromHeaders,
  getBrandFromHost,
  getBrandCanonical,
  getBrandUrl,
  BRAND_SUBDOMAIN_MAP,
} from '@/lib/brand-host';

// Dynamic — нужен чтобы читать x-brand-slug из request headers
export const dynamic = 'force-dynamic';

/** Allowlist брендовых slug-ов — только эти значения принимаются от middleware */
const ALLOWED_BRANDS = new Set([
  'bmw', 'mercedes', 'audi', 'porsche', 'volkswagen',
  'toyota', 'lexus', 'landrover',
]);

/* ── Маппинг фото брендов ── */
const BRAND_PHOTOS: Record<string, string> = {
  bmw:        '/images/works/10-bmw-x5-neon-workshop.jpg',
  mercedes:   '/images/works/11-mercedes-s-class-black-front.jpg',
  audi:       '/images/works/subaru-wrx-lift.jpg',
  porsche:    '/images/works/01-porsche-cayman-pink-lift.jpg',
  volkswagen: '/images/works/subaru-wrx-lift.jpg',
  land_rover: '/images/works/05-mercedes-gle-coupe-dark-blue.jpg',
  landrover:  '/images/works/05-mercedes-gle-coupe-dark-blue.jpg',
  volvo:      '/images/works/02-underbody-exhaust-work.jpg',
  lexus:      '/images/works/06-mercedes-cls-yellow-amg.jpg',
  jaguar:     '/images/works/06-mercedes-cls-yellow-amg.jpg',
  toyota:     '/images/works/15-mercedes-cls-orange-lift.jpg',
  kia:        '/images/works/subaru-wrx-lift.jpg',
  nissan:     '/images/works/17-subaru-wrx-sti-exhaust.jpg',
  genesis:    '/images/works/15-mercedes-cls-orange-lift.jpg',
};
const DEFAULT_PHOTO = '/images/works/mercedes-amg-orange-lift.jpg';

/* ── FAQ данные по брендам (уникальные для каждого) ── */
const BRAND_FAQ: Record<string, Array<{ q: string; a: string }>> = {
  bmw: [
    { q: 'Какой прирост мощности даёт чип-тюнинг BMW?', a: 'Stage 1 на дизельных BMW N47/B47 даёт +30–60 л.с. и +80–100 Нм. Бензиновые N54/N55/B58 прибавляют +40–80 л.с. Stage 2 с даунпайпом — до +100 л.с. на B58. Результат зависит от серии и двигателя.' },
    { q: 'Безопасно ли делать чип BMW серий G?', a: 'G-серия с двигателями B48/B58 — одни из лучших платформ для чипа. ЭБУ Bosch/Siemens хорошо поддаются прошивке. Мы работаем с файлами от проверенных разработчиков и даём 1 год гарантии на работу.' },
    { q: 'Сколько стоит чип BMW в СПб?', a: 'Чип-тюнинг BMW начинается от 25 000 ₽ за Stage 1. Stage 2 от 35 000 ₽. Stage 3 (с форсунками и турбиной) от 90 000 ₽. Точная стоимость — после диагностики на ISTA.' },
    { q: 'Чип BMW снимут ли на гарантии дилера?', a: 'Официально BMW не предлагает программы по выявлению чипа. Наши прошивки не оставляют следов в журналах ЭБУ. По желанию восстанавливаем стандарт перед визитом к дилеру.' },
    { q: 'Работаете ли с BMW E-серии (E90, E60)?', a: 'Да, работаем со всеми поколениями: E36, E46, E90, E60, F10, F30, G20 и другими. N54, N55, N47, M57, N63 — есть готовые наработки для каждого.' },
    { q: 'Отключение DPF на BMW — что включено?', a: 'DPF off включает: удаление сажевого фильтра физически (или заглушку), перепрошивку ЭБУ, отключение контроля DPF в диагностике. Доступно для N47, B47, M57, N57 — без ошибок и DPF-предупреждений.' },
  ],
  mercedes: [
    { q: 'Какой чип для Mercedes-Benz даёт лучший результат?', a: 'На дизелях OM651 (C/E 220d) Stage 1 даёт +40–55 л.с. OM642 (ML/GL 350 CDI) — +50–70 л.с. Бензиновые M276/M278 — +30–50 л.с. Лучший результат по соотношению цена/мощность — у дизельных моделей.' },
    { q: 'Можно ли чипировать Mercedes AMG?', a: 'Да. M177 (AMG GT/C63 S) и M178 — отличные платформы. Stage 1 на C63 S даёт +40–50 л.с. Работаем с полным диапазоном AMG-моделей через XENTRY.' },
    { q: 'Сколько стоит чип Mercedes в HP Тюнинг?', a: 'Чип-тюнинг Mercedes-Benz от 30 000 ₽. Дизельные модели — от 28 000 ₽. Мощные AMG-серии — от 40 000 ₽. Выезд на диагностику XENTRY бесплатно при записи на чип.' },
    { q: 'Гарантия при чипировании Mercedes?', a: 'Даём 1 год гарантии на прошивку. При появлении ошибок или нарушении работы — бесплатная корректировка. Используем файлы от верифицированных европейских разработчиков.' },
    { q: 'Есть ли чип Mercedes Sprinter / Vito?', a: 'Да. OM651 и OM642 в Sprinter / Vito чипируем — Stage 1 даёт +40–55 л.с. и экономию 1–2 л/100 км при трассовом режиме. Актуально для коммерческого транспорта.' },
    { q: 'Отключение AdBlue на Mercedes — что это?', a: 'AdBlue off — программное отключение системы SCR без физического вмешательства. Устраняет ошибки по уровню и качеству мочевины. Доступно для OM651, OM642, OM654. Работает без ошибок в диагностике.' },
  ],
  audi: [
    { q: 'Какой прирост мощности у Audi после чипа?', a: 'EA888 Gen3 (2.0 TFSI, 220–252 л.с.) Stage 1: +40–60 л.с. Audi A6/A7/Q7 3.0 TDI: +50–70 л.с. RS6 / RS7 с 4.0 TFSI Stage 1: +60–80 л.с. Результат подтверждаем замером на стенде.' },
    { q: 'Безопасен ли чип Audi для DSG/S-Tronic?', a: 'Stage 1 не превышает допустимую нагрузку на DQ250/DQ381. Адаптация АКПП после прошивки — стандартная процедура, занимает 20 минут. При Stage 2 обязательна перепрошивка коробки.' },
    { q: 'Стоимость чип-тюнинга Audi в СПб?', a: 'Чип-тюнинг Audi от 25 000 ₽ за Stage 1. 3.0 TDI и старше — от 30 000 ₽. 4.0 TFSI — от 40 000 ₽. Точная цена — после считывания данных через VCDS.' },
    { q: 'Можно ли чипировать Audi RS5/RS6?', a: 'Да, работаем со всей линейкой RS: RS3, RS4, RS5, RS6, RS7, RSQ8. 4.0 TFSI хорошо поддаётся прошивке — Stage 1 даёт +60–80 л.с. без замены механики.' },
    { q: 'Отключение EGR на Audi TDI — нужно ли?', a: 'На пробеге 80+ тыс. км EGR на TDI начинает закоксовываться. Программное отключение EGR в связке с прошивкой ЭБУ решает проблему и улучшает тягу. Включено в Stage 1 при наличии ошибок EGR.' },
    { q: 'Какое оборудование для диагностики Audi вы используете?', a: 'Работаем с VCDS (Ross-Tech) и ODIS — тем же ПО, что использует официальный дилер. Это позволяет считывать все параметры и адаптировать прошивку точно под ваш двигатель.' },
  ],
  porsche: [
    { q: 'Чип Porsche Cayenne — на что рассчитывать?', a: 'Cayenne 3.0 TDI Stage 1: +50–60 л.с. Cayenne 3.6 V6: +30–40 л.с. Cayenne Turbo 4.8 Stage 1: +50–70 л.с. Cayenne E-Hybrid не чипируем — только механическая часть.' },
    { q: 'Диагностируете ли вы PDK-коробку Porsche?', a: 'Да. PIWIS позволяет диагностировать PDK в полном объёме. При чипировании проводим адаптацию PDK под новые характеристики двигателя. Замена мехатроника — тоже наша тема.' },
    { q: 'Сколько стоит чип Porsche?', a: 'Чип-тюнинг Porsche от 40 000 ₽. Cayenne / Macan дизель — от 38 000 ₽. 911 Carrera/Turbo — от 50 000 ₽. Panamera — от 45 000 ₽. Цена зависит от типа ЭБУ.' },
    { q: 'Обслуживаете ли Porsche 911?', a: 'Да. 911 (991, 992) с PDK и атмосферными/турбо двигателями — чипируем и обслуживаем. Работаем через PIWIS — полный доступ к ЭБУ Bosch ME 9.x.' },
    { q: 'Есть ли опасность для двигателя от чипа Porsche?', a: 'При правильно подобранном файле — нет. Мы используем проверенные прошивки с контролем давления наддува и температур. Все параметры остаются в безопасных диапазонах.' },
  ],
  volkswagen: [
    { q: 'Какой чип для VW Tiguan самый популярный?', a: 'Tiguan 2.0 TDI (EA288) Stage 1 — самый востребованный вариант: +40–50 л.с., -1–1,5 л/100 км. TSI 1.4 Stage 1 даёт +25–35 л.с. Tiguan 2.0 TSI (EA888) — до +55 л.с.' },
    { q: 'Можно ли чипировать VW Touareg 3.0 TDI?', a: 'Да, 3.0 TDI (EA896) — отличная платформа для Stage 1/2. Прирост: +50–70 л.с., +100–140 Нм. Обязательна адаптация ZF 8HP под новый крутящий момент.' },
    { q: 'Стоимость чип-тюнинга VW в HP Тюнинг?', a: 'Чип-тюнинг Volkswagen от 20 000 ₽ за Stage 1. Touareg 3.0 TDI — от 28 000 ₽. Golf GTI/R — от 25 000 ₽. DSG-адаптация включена в стоимость.' },
    { q: 'Проводите ли ремонт DSG7 (DQ200) Volkswagen?', a: 'Да. DQ200 — одна из наших специализаций: диагностика мехатроника, замена сцепления, прошивка блока управления. Работаем как с заменой мехатроника, так и с ремонтом.' },
    { q: 'Что такое поп-банг тюнинг для VW GTI?', a: 'Поп-банг (burble tune) — это прошивка ЭБУ, при которой при сбросе газа впрыскивается небольшое количество топлива, создавая хлопки в выпуске. Доступно для Golf GTI, R, Passat R-Line. Из 25 000 ₽.' },
    { q: 'Отключение AdBlue на VW Touareg / Multivan?', a: 'AdBlue off доступно для V6 TDI и V8 TDI на Touareg, Multivan T6. Программное решение без ошибок в диагностике. Совместимо со Stage 1 прошивкой двигателя.' },
  ],
  toyota: [
    { q: 'Чип Toyota Land Cruiser 200 — что получаю?', a: 'LC 200 4.5D (1VD-FTV) Stage 1: +40–60 л.с., ощутимое улучшение тяги на низах. 4.0 V6 (1GR-FE) — более скромно, +15–20 л.с. Для 4.5D ещё доступно отключение EGR и DPF.' },
    { q: 'Можно ли чипировать Toyota Camry?', a: 'Camry V70 2.5 (A25A-FKS) — поддаётся прошивке, прирост +15–20 л.с. V50 2.5 — аналогично. 3.5 V6 (2GR-FKS) — Stage 1 даёт +25–35 л.с. Диагностика через Techstream.' },
    { q: 'Стоимость чипа Toyota в СПб?', a: 'Чип-тюнинг Toyota от 20 000 ₽. LC 200 дизель — от 30 000 ₽. RAV4 1.8/2.0 — от 18 000 ₽. LC 300 3.3 TwinTurbo — от 35 000 ₽. Цена зависит от модели и ЭБУ.' },
    { q: 'Делаете ли чип RAV4 гибрид?', a: 'Гибридные RAV4 с мотором 2AZ-FXE или A25A чипируем только в части бензинового ЭБУ — улучшается реакция на газ и адаптация АКПП. Электрическую часть не трогаем.' },
    { q: 'Как отключить ограничение скорости Toyota LC 200?', a: 'LC 200 ограничен на 180 км/ч. Программно снимается при прошивке ЭБУ через Techstream. Занимает 30–40 минут, включено в Stage 1 прошивку.' },
    { q: 'Принимаете ли Toyota на ТО?', a: 'Да. Принимаем Toyota на плановое ТО, диагностику, замену масла, тормозных колодок. Techstream позволяет сбрасывать сервисный интервал и работать с адаптациями — без ограничений.' },
  ],
  lexus: [
    { q: 'Есть ли чип для Lexus LX 570?', a: 'Да. LX 570 (3UR-FE) Stage 1: +15–20 л.с., + улучшение отклика педали газа. Также снимается ограничение скорости 140 км/ч. LX 600 3.5T (A35A-FNK) — Stage 1 даёт до +50 л.с.' },
    { q: 'Чип Lexus RX 350 — какой результат?', a: 'RX 350 (2GR-FKS) Stage 1: +20–30 л.с., улучшение тяги на 1 500–3 000 об/мин. RX 450h гибрид — только коррекция дроссельной характеристики, без силового чипа.' },
    { q: 'Стоимость чипа Lexus в СПб?', a: 'Чип-тюнинг Lexus от 25 000 ₽. LX 470/570 — от 28 000 ₽. GX 460 — от 25 000 ₽. IS 220d — от 22 000 ₽. RX 350 — от 25 000 ₽.' },
    { q: 'Можно ли чипировать Lexus IS 250/350?', a: 'IS 250 (4GR-FSE) — ограниченный потенциал, прирост 10–15 л.с. IS 350 (2GR-FSE) Stage 1: +25–35 л.с. Работаем через Techstream, полная поддержка IS-серии.' },
    { q: 'Отключение EGR на Lexus IS 220d?', a: 'IS 220d (2AD-FHV) страдает от закоксовки EGR. Программное отключение + промывка впуска — комплексное решение. Улучшается приёмистость и устраняется хаотичная тяга на холодную.' },
    { q: 'Работаете ли с Lexus NX?', a: 'Да. NX 200t / NX 300 (8AR-FTS) Stage 1: +25–35 л.с. NX 300h гибрид — только оптимизация дроссельной карты. NX 350h — аналогично. Принимаем на диагностику и ТО.' },
  ],
  landrover: [
    { q: 'Чип Range Rover — какой прирост мощности?', a: 'Range Rover L405 3.0 TDV6: Stage 1 +50–65 л.с., -1,5 л/100 км. 4.4 SDV8: +70–90 л.с. Si4 3.0 бензин: +40–55 л.с. Range Rover L460 P400/P530 — Stage 1 +50–80 л.с.' },
    { q: 'Можно ли чипировать Land Rover Defender L663?', a: 'Defender L663 P300 (Ingenium 2.0T) и D300 (3.0 SDV6) — да. Stage 1 на D300 даёт +50–60 л.с. P300 бензин: +30–40 л.с. Диагностика через IDS/SDD — дилерский уровень JLR.' },
    { q: 'Сколько стоит чип Land Rover в СПб?', a: 'Чип-тюнинг Land Rover от 30 000 ₽. Range Rover TDV6/SDV8 — от 35 000 ₽. Discovery 4/5 TDV6 — от 30 000 ₽. Defender D300 — от 35 000 ₽. Цена зависит от модели.' },
    { q: 'Ремонтируете ли пневматическую подвеску Land Rover?', a: 'Да. Пневмоподвеска Range Rover / Discovery — наша специализация: замена баллонов, компрессора, клапанного блока, датчиков. Работаем со всеми поколениями L322, L405, L320, L319.' },
    { q: 'Отключение AdBlue на Range Rover?', a: 'AdBlue off доступно для Range Rover 3.0/4.4 TDV6/SDV6/SDV8. Программное отключение SCR-системы без физического вмешательства. Нет ошибок по AdBlue, нет ограничения пуска двигателя.' },
    { q: 'Что такое отключение Start/Stop на Range Rover?', a: 'Система Start/Stop на холостом ходу может создавать вибрации и ускорять износ стартера. Программное отключение в прошивке ЭБУ — постоянно без кнопки. Включено в Stage 1.' },
  ],
};

/* ── Trust блоки ── */
const BRAND_TRUST: Record<string, Array<{ icon: string; title: string; desc: string }>> = {
  bmw: [
    { icon: '🔧', title: 'Диагностика ISTA/ISTA+', desc: 'Дилерское оборудование для полного доступа ко всем системам BMW — как у официалов, но без очередей' },
    { icon: '🏎️', title: '5+ лет на BMW', desc: 'E36, E46, E90, F10, F30, G20, G30 — знаем каждую серию изнутри. Более 300 прошитых BMW за 5 лет' },
    { icon: '📋', title: 'Гарантия 12 месяцев', desc: 'Письменная гарантия на все работы по чипу. При появлении ошибок — бесплатная корректировка' },
  ],
  mercedes: [
    { icon: '⭐', title: 'XENTRY / Star Diagnosis', desc: 'Официальный софт Mercedes-Benz — диагностируем всё то же, что и дилер, включая AMG и Maybach' },
    { icon: '🏆', title: '250+ Mercedes прошито', desc: 'C-class, E-class, S-class, GLE, GLS, Sprinter. Знаем все нюансы M276, M278, OM651, OM654' },
    { icon: '📋', title: 'Гарантия без компромиссов', desc: 'Если после чипа появляется нежелательная ошибка — приезжайте, разберёмся бесплатно' },
  ],
  audi: [
    { icon: '🖥️', title: 'VCDS + ODIS', desc: 'Профессиональный уровень диагностики VW Group. Полный доступ ко всем модулям Audi — включая MMI и кузов' },
    { icon: '🏎️', title: '200+ Audi в портфолио', desc: 'A3, A4, A6, Q5, Q7, RS3, RS6 — опыт с каждой платформой. Знаем особенности EA888 Gen1/2/3 и 3.0 TDI' },
    { icon: '🔄', title: 'Шифтовая адаптация DSG', desc: 'При каждом чипе адаптируем S-Tronic / DSG под новый момент — без лишних толчков и пробуксовок' },
  ],
  porsche: [
    { icon: '🔬', title: 'Диагностика PIWIS', desc: 'Porsche Integrated Workshop Information System — тот же уровень, что у официального дилера Porsche' },
    { icon: '🏆', title: 'Работаем с PDK', desc: 'Полная адаптация PDK-коробки после прошивки. Знаем все нюансы Cayenne, Macan, 911 и Panamera' },
    { icon: '📋', title: 'Осторожный подход', desc: 'Для Porsche используем только верифицированные файлы. Параметры наддува остаются в безопасных пределах' },
  ],
  volkswagen: [
    { icon: '🖥️', title: 'VCDS / ODIS', desc: 'Полная диагностика VW Group — Tiguan, Touareg, Passat, Golf. Доступ ко всем модулям' },
    { icon: '⚙️', title: 'Специалисты по DSG', desc: 'DQ200, DQ250, DQ381 — диагностика, прошивка, ремонт мехатроника. Один из немногих сервисов в СПб' },
    { icon: '💰', title: 'Лучшее соотношение цена/мощь', desc: 'EA888 + Stage 1 — один из самых выгодных апгрейдов в классе: +40–60 л.с. за 20 000 ₽' },
  ],
  toyota: [
    { icon: '🔧', title: 'Techstream', desc: 'Официальный дилерский сканер Toyota. Полный доступ к ЭБУ, адаптациям и сбросу сервисных интервалов' },
    { icon: '🚙', title: 'LC 200 — наша специализация', desc: 'Более 80 Land Cruiser 200/300 прошито. Знаем все версии 1VD-FTV, 1GR-FE, знаем подводные камни' },
    { icon: '📋', title: 'Комплексный подход', desc: 'Чип + ТО + диагностика в одном визите. Сброс сервисного интервала через Techstream бесплатно при записи' },
  ],
  lexus: [
    { icon: '🔬', title: 'Techstream (JDM)', desc: 'Японский дилерский уровень диагностики Lexus. Полный доступ к всем ECU — двигатель, АКПП, кузов' },
    { icon: '🏎️', title: 'Опыт с LX / GX', desc: 'LX 470, LX 570, GX 460, GX 470 — знаем специфику каждой модели и ограничения от производителя' },
    { icon: '⭐', title: 'Премиум подход', desc: 'Для Lexus — только проверенные прошивки от европейских разработчиков. Без компромиссов по надёжности' },
  ],
  landrover: [
    { icon: '🔬', title: 'IDS / SDD (JLR)', desc: 'Jaguar Land Rover SDD — официальный дилерский диагностический инструмент. Полный доступ ко всем системам' },
    { icon: '🏔️', title: '100+ Land Rover в работе', desc: 'Range Rover, Discovery, Defender — знаем все слабые места и оптимальные настройки для каждой модели' },
    { icon: '🛠️', title: 'Пневмоподвеска под ключ', desc: 'Ремонт и замена компрессора, баллонов, клапанного блока Land Rover. Диагностика включена в визит' },
  ],
};

export function generateStaticParams() {
  // Генерируем только НЕ-субдоменные бренды статически.
  // Субдоменные бренды рендерятся динамически (force-dynamic).
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Promise<Metadata> {
  try {
    // Валидация param — защита от подделки
    if (!params.brand || typeof params.brand !== 'string') return {};

    // Нормализация slug: landrover → land-rover для поиска в brands.json
    const normalizedParam = params.brand === 'landrover' ? 'land-rover' : params.brand;
    const brand = brands.find((b) => b.slug === normalizedParam || b.slug === params.brand);
    if (!brand) return {};

    // Читаем host из headers — установлен middleware.
    const headersList = await headers();

    const slugFromHeader = getBrandFromHeaders(headersList);
    const hostHeader = headersList.get('host') ?? '';
    const slugFromHost = getBrandFromHost(hostHeader);

    const rawSlug = slugFromHeader ?? slugFromHost ?? params.brand;
    const isSubdomain = ALLOWED_BRANDS.has(rawSlug) &&
                        Object.values(BRAND_SUBDOMAIN_MAP).includes(rawSlug);
    const brandSlug = isSubdomain ? rawSlug : params.brand;

    const canonicalUrl = isSubdomain
      ? getBrandCanonical(brandSlug, '/')
      : `https://hptuning.ru/brands/${brand.slug}`;

    const ogUrl = isSubdomain
      ? getBrandUrl(brandSlug)
      : `https://hptuning.ru/brands/${brand.slug}`;

    // Host-aware og:title / og:description
    const title = isSubdomain
      ? (brand.seo?.title ?? `Чип-тюнинг ${brand.name} в СПб | HP Тюнинг`)
      : `Чип-тюнинг ${brand.name} в СПб | HP Тюнинг`;
    const description = isSubdomain
      ? (brand.seo?.description ?? brand.description)
      : brand.description;

    return {
      title,
      description,
      keywords: brand.seo?.keywords,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: ogUrl,
        type: 'website',
        locale: 'ru_RU',
        siteName: 'HP Тюнинг',
        images: [
          {
            url: 'https://hptuning.ru/images/og/chip-tuning.jpg',
            width: 1200,
            height: 630,
            alt: `Чип-тюнинг ${brand.name} в СПб | HP Тюнинг`,
          },
        ],
      },
    };
  } catch {
    return {};
  }
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  if (!params.brand || typeof params.brand !== 'string') notFound();

  // Нормализация: landrover → land-rover для поиска в brands.json
  const normalizedParam = params.brand === 'landrover' ? 'land-rover' : params.brand;

  let brand: (typeof brands)[number] | undefined;
  try {
    brand = brands.find((b) => b.slug === normalizedParam || b.slug === params.brand);
  } catch {
    notFound();
  }
  if (!brand) notFound();

  // Читаем из headers (установил middleware)
  let brandSlug: string;
  let isSubdomain: boolean;
  try {
    const headersList = await headers();
    const slugFromHeader = getBrandFromHeaders(headersList);
    const hostHeader = headersList.get('host') ?? '';
    const slugFromHost = getBrandFromHost(hostHeader);
    const rawSlug = slugFromHeader ?? slugFromHost ?? params.brand;
    isSubdomain = ALLOWED_BRANDS.has(rawSlug) &&
                  Object.values(BRAND_SUBDOMAIN_MAP).includes(rawSlug);
    brandSlug = isSubdomain ? rawSlug : params.brand;
  } catch {
    brandSlug = params.brand;
    isSubdomain = false;
  }

  const heroPhoto = BRAND_PHOTOS[brand.slug] ?? BRAND_PHOTOS[brandSlug] ?? DEFAULT_PHOTO;

  const pageUrl = isSubdomain
    ? getBrandCanonical(brandSlug, '/')
    : `https://hptuning.ru/brands/${brand.slug}`;

  const mainSiteUrl = 'https://hptuning.ru';

  // FAQ данные
  const faqItems = BRAND_FAQ[brandSlug] ?? BRAND_FAQ[brand.slug] ?? [];
  const trustItems = BRAND_TRUST[brandSlug] ?? BRAND_TRUST[brand.slug] ?? [];

  // JSON-LD schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: isSubdomain
      ? [
          { '@type': 'ListItem', position: 1, name: 'HP Тюнинг', item: mainSiteUrl },
          { '@type': 'ListItem', position: 2, name: brand.name, item: pageUrl },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: mainSiteUrl },
          { '@type': 'ListItem', position: 2, name: 'Бренды', item: `${mainSiteUrl}/brands` },
          { '@type': 'ListItem', position: 3, name: brand.name, item: pageUrl },
        ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: `Чип-тюнинг ${brand.name} в Санкт-Петербурге`,
    url: pageUrl,
    provider: {
      '@type': 'AutoRepair',
      '@id': 'https://hptuning.ru/#org',
      name: 'HP Тюнинг',
      url: mainSiteUrl,
      telephone: '+79818428151',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Санкт-Петербург',
        addressCountry: 'RU',
      },
    },
    areaServed: 'Санкт-Петербург',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: brand.priceFrom,
    },
  };

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  } : null;

  const homeHref  = isSubdomain ? mainSiteUrl : '/';
  const brandsHref = isSubdomain ? `${mainSiteUrl}/brands` : '/brands';

  return (
    <>
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── Hero-секция бренда ── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src={heroPhoto}
          alt={`${brand.name} в HP Тюнинг СПб`}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/70 to-transparent" />

        <div className="relative container pb-10">
          <nav className="text-sm text-zinc-500 mb-4" aria-label="Breadcrumb">
            <a href={homeHref} className="hover:text-[#39FF14] transition-colors">
              Главная
            </a>
            {!isSubdomain && (
              <>
                <span className="mx-2">→</span>
                <Link href={brandsHref} className="hover:text-[#39FF14] transition-colors">
                  Бренды
                </Link>
              </>
            )}
            <span className="mx-2">→</span>
            <span className="text-zinc-300">{brand.name}</span>
          </nav>
          <span className="inline-block px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-3">
            Автосервис СПб
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
            Чип-тюнинг {brand.name}
            <span
              className="text-[#39FF14]"
              style={{ textShadow: '0 0 30px rgba(57,255,20,0.5)' }}
            >
              {' '}в СПб
            </span>
          </h1>
          <p className="text-zinc-400 text-lg mt-3 max-w-xl">{brand.description}</p>
        </div>
      </section>

      {/* ── Основной контент ── */}
      <div className="container py-12">

        {/* Быстрый выбор услуги */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {[
            {
              icon: Wrench,
              color: '#a78bfa',
              bg: 'bg-violet-500/8 border-violet-500/20',
              title: 'Техобслуживание',
              desc: 'ТО, диагностика, ремонт двигателя и подвески',
              price: 'от 1 500 ₽',
              href: isSubdomain ? `${mainSiteUrl}/service` : '/service',
            },
            {
              icon: Zap,
              color: '#39FF14',
              bg: 'bg-[#39FF14]/8 border-[#39FF14]/20',
              title: 'Чип-тюнинг',
              desc: 'Stage 1/2/3, EGR/DPF off, адаптация АКПП',
              price: `от ${brand.priceFrom.toLocaleString('ru-RU')} ₽`,
              href: isSubdomain ? `${mainSiteUrl}/tuning/chip-tuning` : '/tuning/chip-tuning',
            },
            {
              icon: Sparkles,
              color: '#38bdf8',
              bg: 'bg-sky-500/8 border-sky-500/20',
              title: 'Детейлинг',
              desc: 'Керамика 9H, PPF плёнка, химчистка, полировка',
              price: 'от 6 000 ₽',
              href: isSubdomain ? `${mainSiteUrl}/detailing` : '/detailing',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={`flex items-start gap-4 p-5 rounded-2xl border ${card.bg} hover:scale-[1.01] transition-transform`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="size-5" style={{ color: card.color }} />
              </div>
              <div>
                <div className="text-white font-semibold">{card.title}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{card.desc}</div>
                <div className="text-xs font-bold mt-2" style={{ color: card.color }}>
                  {card.price}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Типичные проблемы + Что делаем */}
        {brand.typicalProblems && brand.typicalProblems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
            <div className="bg-[#111113] rounded-2xl border border-white/8 p-6">
              <h2 className="flex items-center gap-2 font-display text-xl text-white uppercase tracking-wide mb-5">
                <AlertTriangle className="size-5 text-amber-400" />
                Типичные проблемы {brand.name}
              </h2>
              <ul className="space-y-3">
                {brand.typicalProblems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                    <span className="text-amber-400 font-bold mt-0.5 shrink-0">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {brand.whatWeDo && (
              <div className="bg-[#111113] rounded-2xl border border-white/8 p-6">
                <h2 className="flex items-center gap-2 font-display text-xl text-white uppercase tracking-wide mb-5">
                  <CheckCircle className="size-5 text-[#39FF14]" />
                  Что мы делаем
                </h2>
                <ul className="space-y-3">
                  {brand.whatWeDo.map((w, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                      <CheckCircle className="size-4 text-[#39FF14] shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Trust блоки */}
        {trustItems.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-6">
              Почему выбирают HP Тюнинг для {brand.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trustItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#111113] rounded-2xl border border-white/8 p-6 flex flex-col gap-3"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <div className="text-white font-semibold">{item.title}</div>
                  <div className="text-zinc-500 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Модельный ряд */}
        {brand.series && brand.series.length > 0 && (
          <div className="mb-14" id="modeli">
            <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-6">
              Модели {brand.name} — цены на чип-тюнинг
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brand.series.map((s) => {
                const sv = s as { slug: string; name: string; years?: string; priceFrom?: number };
                return (
                  <div
                    key={sv.slug}
                    className="bg-[#111113] rounded-xl border border-white/8 p-4 flex items-center justify-between gap-3 hover:border-[#39FF14]/30 transition-colors"
                  >
                    <div>
                      <div className="text-white text-sm font-medium">{sv.name}</div>
                      {sv.years && (
                        <div className="text-zinc-600 text-xs mt-0.5">{sv.years}</div>
                      )}
                    </div>
                    <div className="text-[#39FF14] text-sm font-bold shrink-0">
                      от {(sv.priceFrom ?? brand.priceFrom).toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ */}
        {faqItems.length > 0 && (
          <div className="mb-14" id="faq">
            <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-6">
              Частые вопросы о чип-тюнинге {brand.name}
            </h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group bg-[#111113] rounded-xl border border-white/8 overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-white/3 transition-colors">
                    <span className="text-white font-medium text-sm">{item.q}</span>
                    <span className="text-zinc-500 group-open:rotate-180 transition-transform shrink-0 text-lg">▾</span>
                  </summary>
                  <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-[#39FF14]/10 to-transparent border border-[#39FF14]/20 p-8 text-center">
          <h3 className="font-display text-3xl text-white uppercase tracking-wide mb-2">
            Записать {brand.name} на сервис
          </h3>
          <p className="text-zinc-500 mb-6">
            Ответим за 15 минут — выберем время и услугу под ваш автомобиль.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookingButton
              label="Записаться онлайн"
              serviceHint={brand.name}
              className="btn-primary text-base px-10 py-4"
            />
            <a href="tel:+79818428151" className="btn-secondary text-base px-10 py-4">
              <Phone className="size-4" /> +7 (981) 842-81-51
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
