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
import { ChipTuningCalculator } from '@/components/ui/ChipTuningCalculator';
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

/* ── H1 по брендам — полный сервис, не только чип-тюнинг ── */
const BRAND_H1: Record<string, string> = {
  bmw:        'Сервис, тюнинг и детейлинг BMW',
  mercedes:   'Премиальный сервис Mercedes-Benz',
  audi:       'Сервис Audi: диагностика, тюнинг и детейлинг',
  porsche:    'Porsche: премиальный сервис, тюнинг и детейлинг',
  volkswagen: 'Volkswagen: VAG-экспертиза, сервис и тюнинг',
  toyota:     'Сервис и тюнинг Toyota',
  lexus:      'Lexus: премиальный сервис, гибриды и детейлинг',
  landrover:  'Land Rover: сервис, тюнинг и защита кузова',
  'land-rover':'Land Rover: сервис, тюнинг и защита кузова',
};

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

/* ── FAQ данные по брендам ─────────────────────────────────────────────────────
 * Shingle-hardened: каждый вопрос и ответ уникальны по 5-граммному правилу.
 * Голос — технический, конкретные цифры, без общих фраз.
 * ─────────────────────────────────────────────────────────────────────────── */
const BRAND_FAQ: Record<string, Array<{ q: string; a: string }>> = {
  bmw: [
    {
      q: 'Сколько лошадиных сил прибавляет чип BMW N47/B47/N55/B58?',
      a: 'N47D20 (318d, 320d): Stage 1 прибавляет 51 л.с. — вых. 255 л.с. N55B30 (335i, 435i): Stage 1 = 306→370 л.с., Stage 2 с даунпайпом = 306→430 л.с. B58B30 (340i, 440i, M340i): Stage 1 = 326→400 л.с., Stage 2 с интеркулером и даунпайпом = до 455 л.с. B47D20 (320d, 520d): правим карту давления наддува Bosch EDC17 — выход 244 л.с., момент +60 Нм. Итог зависит от состояния ЭБУ и актуального ТО.',
    },
    {
      q: 'Насколько безопасна прошивка B58 на BMW G-серии?',
      a: 'B58 — один из прочнейших рядных шести BMW: кованый блок, шатуны с запасом. Stage 1 до 420–430 л.с. безопасен без замены механики. Stage 2 (430–450 л.с.) требует улучшенного интеркулера и масляного радиатора. Работаем через ISTA, контролируем параметры наддува и форсунок в реальном времени.',
    },
    {
      q: 'Можно ли откатить прошивку BMW перед визитом к официалам?',
      a: 'Да. Мы сохраняем оригинальную прошивку перед записью — восстановление занимает 30–40 минут. Следов в ISA-журнале не остаётся: счётчики перезаписи ЭБУ у BMW сбрасываются вместе с файлом.',
    },
    {
      q: 'Чипируете ли дизельные BMW M57/N57 на крупных кроссоверах?',
      a: 'M57TU2 (535d, X5 35d, X6 35d): Stage 1 — 286→355 л.с. N57D30 (550d, M50d): Stage 1 — 381→440 л.с. Оба мотора уверенно держат момент; при Stage 2 рекомендуем маслопомпу. Дизельный сажевый фильтр и клапан рециркуляции выхлопа убираем программно — отдельной строкой в заказ-наряде.',
    },
    {
      q: 'Что даёт отключение DPF+EGR на дизельном BMW?',
      a: 'Исчезают ошибки P244A/P246C, прекращаются принудительные регенерации, расход падает на 0,5–1 л/100 км. Одновременно правим карты давления наддува и угол впрыска — движок получает «честную» прошивку без компромиссов экологического ПО. Работаем с N47, B47, M57, N57.',
    },
    {
      q: 'Берёте ли BMW M-серию (M3, M4, M5)?',
      a: 'Да. S55B30 (F80 M3 / F82 M4): Stage 1 — 431→510 л.с. S63B44 (F90 M5): Stage 1 — 600→680 л.с. S58B30 (G80 M3 Competition): Stage 1 — 510→590 л.с. Настройка через ISTA, все OBD-параметры под контролем. Клапанная крышка и маслосъёмники — диагностируем до записи.',
    },
  ],
  mercedes: [
    {
      q: 'Какой реальный прирост мощности у Mercedes OM651 и OM642 после чипа?',
      a: 'OM651 (C220d, E220d): Stage 1 — 170→222 л.с., крутящий момент 400→490 Нм. OM642 (ML350 CDI, GL350 CDI): Stage 1 — 258→320 л.с., момент 620→740 Нм. Итог проверяем на стенде — результаты стабильны на 90% автомобилей.',
    },
    {
      q: 'Прошивка AMG C63/E63 через XENTRY — в чём особенность?',
      a: 'M177DE40 (C63 S): Stage 1 — 510→575 л.с. M178DE40 (AMG GT): Stage 1 — 557→630 л.с. XENTRY даёт доступ к защищённым модулям — IME, ME17. Без этого инструмента прошивка невозможна: стандартный OBD2 не открывает AMG-ЭБУ.',
    },
    {
      q: 'Стоимость чипа Mercedes в HP Тюнинг — что входит в цену?',
      a: 'Базовая работа по Mercedes: чтение ЭБУ через XENTRY, калибровка файла под VIN и пробег, запись, контрольный прогон по XENTRY — 30 000 ₽. Отдельно: деактивация сажевого фильтра от 8 000 ₽, клапана рециркуляции от 5 000 ₽, мочевинной системы SCR — от 10 000 ₽. Итог фиксируем в письменном акте до оплаты.',
    },
    {
      q: 'Mercedes Sprinter 2.2 CDI — выгодно ли чипировать фургон?',
      a: 'OM651 в Sprinter 316 CDI (163 л.с.) после Stage 1 выдаёт 210 л.с. и 430 Нм — груженая машина уверенно держит 120 км/ч на подъёме. Топливо: -1,0–1,5 л/100 км на трассе. Окупаемость при пробеге 50 000 км/год — менее 6 месяцев.',
    },
    {
      q: 'Как работает AdBlue off на Mercedes OM654 и OM656?',
      a: 'Отключение SCR — программное эмулирование исправной системы: ЭБУ «считает», что дозирующий клапан и датчик NH₃ работают корректно. Нет предупреждений на щитке, нет блокировки пуска при пустом баке. Ошибки P20EE/P20BD не появляются.',
    },
    {
      q: 'Чем ваша прошивка Mercedes отличается от «гаражного» варианта?',
      a: 'Работаем с файлами, откалиброванными под атмосферу СПб (нулевая высота, температура -30..+30 °С). Учитываем состояние топлива в РФ — ограничиваем давление топливной рампы во избежание задиров ТНВД. Каждое изменение карты документируется, оригинал сохраняется у клиента.',
    },
  ],
  audi: [
    {
      q: 'EA888 Gen3 — сколько л.с. даёт Stage 1 на A4/A5/Q5 2.0 TFSI?',
      a: 'EA888.3 (252 л.с.): Stage 1 выводит мотор на 320 л.с., момент 370→440 Нм. Версия 225 л.с.: Stage 1 даёт 290 л.с. Версия 185 л.с. (1.8 TFSI): Stage 1 — выход 230 л.с. Все результаты без замены механики — прошивка через VCDS/ODIS-E, без разборки ЭБУ.',
    },
    {
      q: 'Stage 2 на Audi 3.0 TFSI (S4, S5, Q5 S) — что нужно и что получу?',
      a: '3.0 TFSI (EA839, компрессор, S4/S5): Stage 1 через ODIS-E выводит 354→425 л.с. Stage 2 требует замены впускного трубопровода, шкива нагнетателя с передаточным числом 1:1,35 и обновлённых форсунок — итог 480 л.с. S-Tronic DL501 адаптируем одновременно: давление пакетов под новый крутящий момент без рывков.',
    },
    {
      q: 'Сколько стоит чип Audi в СПб и что влияет на цену?',
      a: 'Stage 1 от 25 000 ₽ (EA888, EA839). 3.0 TDI (EA896, V6) от 32 000 ₽. RS6 / RS7 4.0 TFSI от 45 000 ₽. Цену снижает предварительная диагностика через VCDS: если ЭБУ нестандартный — цена уточняется до начала работ, не после.',
    },
    {
      q: 'RS6 C8 4.0 TFSI — реальные цифры после прошивки?',
      a: 'RS6 C8 (EA825, 4.0 BiTurbo, 600 л.с.): Stage 1 поднимает отдачу до 680 л.с. и 900 Нм — сток 800 Нм, +12,5%. Stage 2 с Y-pipe, силиконовыми подводами и калиброванными форсунками — до 720 л.с. при стоковых турбинах K04. Динамика 0–100: 3,6 с → ~2,9 с по GPS.',
    },
    {
      q: 'Quattro + DSG после чипа — нет ли проблем с полным приводом?',
      a: 'Haldex 4-го поколения и Torsen C штатно выдерживают Stage 1 без нареканий — момент не выходит за паспортные пределы карданного вала. При Stage 2 проверяем масло Haldex (промывка каждые 40 000 км). DQ381: через VCDS меняем стратегию переключения и давление фрикционных пакетов под увеличенный момент.',
    },
    {
      q: 'Как долго длится прошивка Audi и нужен ли разогрев?',
      a: 'Весь процесс Audi: 1,5–2 часа. VCDS-диагностика, чтение исходного файла, индивидуальная калибровка под конкретный VIN, запись через ODIS-E, проверочный цикл. Двигатель прогреваем до рабочей температуры (не холодный старт): при записи на холодном моторе ЭБУ фиксирует адаптационные ошибки. Далее — 30 минут адаптации дроссельного модуля на ходу.',
    },
  ],
  porsche: [
    {
      q: 'Cayenne 3.0 TDI — конкретные цифры прироста после Stage 1?',
      a: 'Cayenne 9YA 3.0 TDI (286 л.с.): Stage 1 через PIWIS — выход 362 л.с., момент 600→725 Нм. Время 0–100: 6,4 с → 5,4 с по GPS. Cayenne 958 3.0 TDI (245 л.с.): Stage 1 — выход 308 л.с., +63 л.с. Прошиваем только через Bosch EDC17 по каналу PIWIS — иных стабильных методов для дизельного Cayenne не существует.',
    },
    {
      q: 'Какой инструмент вы используете для диагностики Porsche и почему это важно?',
      a: 'PIWIS Tester III — штатная дилерская станция Porsche. Открывает закрытые параметры DME: корректировки по цилиндрам, данные детонации, кривые давления наддува. Без PIWIS невозможно корректно откалибровать PDK после прошивки — стандартный сканер просто не видит эти каналы.',
    },
    {
      q: 'Прошивка 911 992 — Stage 1 на Carrera и Carrera S?',
      a: '992 Carrera (3.0 биТурбо, 385 л.с.): Stage 1 — 385→455 л.с. 992 Carrera S (450 л.с.): Stage 1 — 450→525 л.с. Stage 2 с OPF-delete и даунпайпами: Carrera — до 490 л.с., Carrera S — до 570 л.с. PDK адаптируем под новые моменты срабатывания.',
    },
    {
      q: 'Что происходит с гарантией Porsche после чипа?',
      a: 'Официальная гарантия Porsche не покрывает повреждения от тюнинга — это стандартное условие любого производителя. Мы восстанавливаем оригинальный файл перед гарантийным обращением: PIWIS не фиксирует факт перепрошивки в перманентных логах при корректном откате.',
    },
    {
      q: 'Macan 2.0 TFSI и 3.0 TDI — есть ли смысл чипировать?',
      a: 'Macan 2.0 TFSI (252 л.с., EA888): Stage 1 через PIWIS — 252→312 л.с. Macan S 3.0 TFSI (354 л.с.): Stage 1 — 357→428 л.с., компрессор нагнетателя остаётся стоковым. Macan Turbo 3.0 TDI (258 л.с.): Stage 1 — 262→333 л.с. Во всех случаях механика остаётся стоковой — только перекалибровка ЭБУ.',
    },
  ],
  volkswagen: [
    {
      q: 'Tiguan 2.0 TDI EA288 — сколько лошадей после Stage 1?',
      a: 'Tiguan 2.0 TDI с EA288 150 л.с.: Stage 1 через Simos 18 — выход 196 л.с., тяга 340→432 Нм. Версия 190 л.с.: Stage 1 через KESSv3 — выход 242 л.с., момент 400→492 Нм. Экономия топлива: -0,8–1,2 л/100 км при умеренном стиле. Преселективная коробка DQ250 или DQ381 адаптируется под новый момент без доплаты.',
    },
    {
      q: 'VW Touareg 3.6 FSI и 3.0 TDI — в чём разница по результату?',
      a: '3.0 TDI V6 (262 л.с.): Stage 1 — 262→330 л.с., момент 600→720 Нм — главный выбор для тяги. 3.6 FSI (249 л.с.): прирост скромнее, 249→290 л.с. — атмосферник хуже реагирует на прошивку. ZF 8HP адаптируем в обоих случаях под удар момента на ранних передачах.',
    },
    {
      q: 'Что такое Simos 18 и как вы с ним работаете?',
      a: 'Simos 18.10/18.30 — ЭБУ Golf 8 GTI, Golf R, Tiguan II поколения. Требует OBD-подключения через лицензированный адаптер (не clone). Мы используем Alientech KESSv3 + заводской канал Simos: это единственный безопасный способ без риска «кирпича». Прошивка занимает 45–60 минут.',
    },
    {
      q: 'Golf GTI Mk8 — Stage 1 через OBD без снятия ЭБУ?',
      a: 'Да. Golf GTI Mk8 (EA888.4, 245 л.с.): Stage 1 через OBD — 245→310 л.с. Golf R Mk8 (300 л.с.): Stage 1 — 300→380 л.с. Процедура занимает 1,5 часа, снимать ЭБУ не нужно. Включаем поп-банг, launch control, удаляем тягу педали.',
    },
    {
      q: 'DSG DQ200 рывки на холодную — это лечится чипом?',
      a: 'Рывки DQ200 при температуре ниже +10 °С — поведение мехатроника, а не двигателя. Перепрошивка блока сцепления через VCDS снижает давление при первых трогательных движениях: рывки уходят у 80% машин. В остальных 20% нужна замена сцепления — тоже выполняем.',
    },
    {
      q: 'Бурбл-тюн (поп-банг) VW — опасен ли для выхлопа?',
      a: 'При умеренной настройке — нет. Контролируем интервал догорания: выхлоп нагревается не более чем на 60–80 °C выше штатного. Катализатор не разрушается. У Golf GTI Mk7/Mk8, Arteon R-Line — делаем по запросу от 5 000 ₽ в дополнение к Stage 1.',
    },
  ],
  toyota: [
    {
      q: 'Land Cruiser 200 4.5D (1VD-FTV) — точные цифры после прошивки?',
      a: '1VD-FTV 235 л.с.: Stage 1 — 235→295 л.с., момент 615→740 Нм. Субъективно: машина перестаёт «думать» перед обгоном, разгон с 80 до 130 км/ч ощутимо быстрее. EGR + DPF off делаем одновременно с чипом — экономит время и деньги.',
    },
    {
      q: 'Toyota Land Cruiser 300 3.3 TwinTurbo — возможен ли чип?',
      a: 'LC 300 F33A-FTV (309 л.с.): прошивка через Techstream + OBD — Stage 1 до 370 л.с. Движок новый, материалов мало, но уже есть верифицированные файлы от японских разработчиков. Перед записью читаем логи детонации и состояние цепи ГРМ.',
    },
    {
      q: 'Camry V70 2.5 A25A-FKS — стоит ли чипировать атмосферник?',
      a: 'A25A-FKS (181 л.с.): Stage 1 — 181→205 л.с., момент 221→255 Нм. Субъективный эффект заметен: дроссель реагирует живее, АКПП UA80E меньше «зависает» при обгоне. Для тех, кто хочет не скорость, а комфорт управления — оправдано.',
    },
    {
      q: 'Как снять ограничение скорости 180 км/ч на LC 200 и LC 300?',
      a: 'Ограничение вшито в карту ЭБУ Toyota (ECM). Через Techstream открываем защищённый раздел — снятие занимает 20 минут. Входит в стандартную прошивку Stage 1 без доплаты. На LC 300 ограничение 180 км/ч убирается аналогично.',
    },
    {
      q: 'RAV4 2.5 Hybrid — можно ли улучшить динамику?',
      a: 'Гибридная система A25A-FXS не поддаётся силовой прошивке — Toyota защитила PCM гибрида отдельно. Но настраиваем дроссельную карту и точки переключения CVT: машина отзывается быстрее, убирается «резина» педали при старте. Стоимость — от 12 000 ₽.',
    },
    {
      q: 'Toyota Hilux 2.8 GD6 — чипируете ли пикапы?',
      a: 'Hilux 2.8 1GD-FTV (177 л.с.): Stage 1 через Techstream — 177→232 л.с., тяга 450→555 Нм. Эффект тяги ощущается уже с 1 200 об/мин — пикап везёт нагрузку без провала педали. Сажевый фильтр и система рециркуляции отработавших газов деактивируются по отдельному заказу-наряду. Принимаем парковые заявки на флот из 3+ машин.',
    },
  ],
  lexus: [
    {
      q: 'LX 570 3UR-FE — что реально меняет прошивка?',
      a: '3UR-FE 381 л.с.: Stage 1 — 381→405 л.с., момент 535→570 Нм. Главное — снятие ограничения 140 км/ч и улучшение реакции АКПП AB60F: передачи переключаются быстрее, исчезает ватность при обгонах. Расход по трассе снижается на 0,5–0,8 л за счёт оптимизации угла опережения зажигания.',
    },
    {
      q: 'LX 600 3.5T A35A-FNK — первые данные по прошивке в СПб?',
      a: 'LX 600 базовая мощность 409 л.с. (A35A-FNK): прошивка через Techstream JDM + OBD2 выводит мотор на 449–464 л.с. Платформа TNGA-F, файлы верифицированы в 2024 году. До записи: фулл-диагностика по форсункам, давлению масла и параметрам разгонной системы — защищаем двигатель до записи.',
    },
    {
      q: 'Чип Lexus IS 350 2GR-FSE — стоит ли при атмосферном моторе?',
      a: '2GR-FSE 306 л.с.: Stage 1 — 306→345 л.с. Атмосферник даёт скромный прирост по л.с., зато ощутимо меняет характер тяги в диапазоне 3 000–5 500 об/мин. Педаль газа живее, АКПП не «тупит» на кик-дауне. Стоимость от 25 000 ₽, срок — 1 рабочий день.',
    },
    {
      q: 'Что значит «Techstream JDM-уровень» применительно к Lexus?',
      a: 'Японский Techstream открывает дополнительные сервисные функции, недоступные в международной версии: полная калибровка дроссельного модуля, управление адаптацией АКПП, прямой доступ к логам детонации по цилиндрам. Это позволяет точнее настраивать прошивку под реальное состояние мотора.',
    },
    {
      q: 'GX 460 1UR-FE — почему прирост мощности меньше, чем ожидают?',
      a: '1UR-FE 296 л.с.: Stage 1 — 296→325 л.с. Атмосферный V8 без наддува имеет ограниченный потенциал прироста — максимум 10–12% от штатных значений. Но главный эффект другой: исчезает задержка педали, момент ощущается плотнее с 1 500 об/мин. Снятие ограничения скорости 180 км/ч включено.',
    },
    {
      q: 'Lexus IS 220d 2AD-FHV — чип + EGR off, какой порядок действий?',
      a: 'Сначала промываем впускной коллектор — закоксованный впуск не даст корректно снять базовые данные ЭБУ. Затем прошивка Stage 1 (170→215 л.с.) с одновременным отключением EGR. После — адаптация АКПП A960E под новый момент. Итог: машина перестаёт дымить при холодном старте и тянет ровно.',
    },
  ],
  landrover: [
    {
      q: 'Range Rover L405 SDV8 — что получим от Stage 1 по тяге и разгону?',
      a: '4.4 SDV8 (340 л.с.): Stage 1 — 340→420 л.с., момент 700→840 Нм. 3.0 SDV6 (306 л.с.): Stage 1 — 306→375 л.с., момент 700→810 Нм. ZF 8HP70 адаптируем одновременно — точки переключения и давление пакетов сцепления. Результат стабилен при +30 °C и -20 °C.',
    },
    {
      q: 'Defender L663 D300 — как вы прошиваете Ingenium 3.0?',
      a: 'Ingenium AJ126 (300 л.с.) в Defender L663: прошивка через JLR SDD по OBD — 300→365 л.с., момент 650→760 Нм. SDD — единственный инструмент с доступом к закрытым разделам Bosch EDC17CP42. Без него невозможно корректно откалибровать наддув Ingenium без ошибок P0299.',
    },
    {
      q: 'Сколько стоит прошивка Land Rover и что входит в стоимость?',
      a: 'Land Rover Stage 1: диагностика через JLR SDD, клонирование оригинала, подготовка файла под VIN и историю пробега, запись через JLR SDD, калибровка ZF 8HP, финальная проверка давления наддува — стоимость от 30 000 ₽. SCR-off (AdBlue): +12 000 ₽. DPF-off: +10 000 ₽. При записи на прошивку — диагностика пневмокомпрессора и клапанного блока без доплаты.',
    },
    {
      q: 'Пневматическая подвеска Range Rover — что вы умеете делать?',
      a: 'Ремонтируем L322, L405, L460, Discovery 4/5: замена пневмобаллонов (оригинал или аналог Dunlop/Arnott), замена компрессора WABCO, ремонт клапанного блока, замена датчиков высоты. Диагностику делаем через JLR SDD — видим реальное время наполнения камер, определяем утечку до 0,05 бар/мин.',
    },
    {
      q: 'Отключение AdBlue на Discovery 5 TDV6 — как это работает технически?',
      a: 'SCR-off на TDV6: программируем эмуляцию сигналов датчика NH₃ и температуры ДПФ-катализатора. ЭБУ Bosch «видит» исправный SCR-контур — нет ошибок P203D/P20BD, нет ограничения запусков при пустом баке AdBlue. Обратимо: при необходимости восстанавливаем за 1 час.',
    },
    {
      q: 'Range Rover L460 P400 (3.0 биТурбо бензин) — есть ли прошивка?',
      a: 'AJ126 P400 (400 л.с.): Stage 1 — 400→470 л.с., момент 550→640 Нм. Файлы появились в конце 2023 года. Требуется SDD последней версии — только так открывается Jaguar–Land Rover VME. Перед записью читаем историю детонации: новые моторы иногда приходят с заводским браком форсунок.',
    },
  ],
};

/* ── Trust блоки — уникальный голос каждого бренда ─────────────────────────
 * Shingle-hardened: нет общих 5-граммных цепочек между брендами.
 * ─────────────────────────────────────────────────────────────────────────── */
const BRAND_TRUST: Record<string, Array<{ icon: string; title: string; desc: string }>> = {
  bmw: [
    { icon: '🔧', title: 'ISTA/ISTA+ — как у дилера', desc: 'Немецкий диагностический комплекс BMW: полный доступ к DME, EGS, FRM и кузовным модулям. Видим то, что скрыто от обычных сканеров' },
    { icon: '🏎️', title: 'Более 300 BMW прошито', desc: 'E36, E46, E9x, F-серии, G-серии — каждое поколение знаем по характеристикам ЭБУ, слабым местам и реальным приростам мощности' },
    { icon: '📋', title: 'Письменная гарантия 12 мес.', desc: 'Фиксируем результаты в акте: исходная мощность, итоговая, параметры наддува. Ошибки после прошивки устраняем бесплатно' },
  ],
  mercedes: [
    { icon: '⭐', title: 'XENTRY PassThru', desc: 'Работаем через официальный Mercedes-Benz XENTRY — единственный способ вскрыть защиту AMG-ЭБУ (ME17, ME9.7) и OM654' },
    { icon: '🏆', title: '250+ Mercedes в базе', desc: 'C, E, S, G, GLE, GLS, Sprinter — знаем поведение M271, M276, OM642, OM651 в условиях российского топлива и климата' },
    { icon: '🛡️', title: 'Топливная корректировка', desc: 'Адаптируем давление ТНВД и угол опережения под отечественный дизель Euro-5: ресурс форсунок не снижается после прошивки' },
  ],
  audi: [
    { icon: '🖥️', title: 'VCDS + ODIS-E', desc: 'Ross-Tech VCDS для диагностики + ODIS Engineering для прошивки: тот же стек, что использует дилер Audi. Видим адаптационные блоки недоступные стандартным сканерам' },
    { icon: '🏎️', title: 'Quattro знаем изнутри', desc: 'A3, A4, A6, Q5, Q7, RS3–RS7 — понимаем поведение Haldex и Torsen после увеличения момента. Дифференциалы не страдают при Stage 1' },
    { icon: '🔄', title: 'S-Tronic в пакете', desc: 'Адаптация DSG DQ250, DQ381, DL501 входит в стоимость Stage 1 — перепрограммируем давление пакетов под новый крутящий момент без доплат' },
  ],
  porsche: [
    { icon: '🔬', title: 'PIWIS III — Porsche Factory', desc: 'Официальная дилерская станция Porsche: открывает защищённые разделы DME, данные детонации по цилиндрам, карты давления турбины' },
    { icon: '🏎️', title: 'PDK-адаптация в комплекте', desc: 'После каждой прошивки перекалибровываем PDK: точки переключения, давление сцепления, логику kick-down — иначе коробка не реализует прирост' },
    { icon: '📐', title: 'Контроль параметров наддува', desc: 'Логируем boost-давление, температуру ОГ и лямбду до и после записи файла — убеждаемся, что мотор Porsche работает в безопасном диапазоне' },
  ],
  volkswagen: [
    { icon: '🖥️', title: 'VCDS + KESSv3 Alientech', desc: 'Simos 18, Bosch MG1 — прошиваем через лицензированный KESSv3 по официальному каналу производителя, без риска «кирпича» ЭБУ' },
    { icon: '⚙️', title: 'DSG под ключ', desc: 'DQ200 рывки на холодную, DQ250 пробуксовки, DQ381 перегрев — диагностируем мехатроник и прошиваем блок управления. Один из немногих сервисов СПб с лицензией на DSG-ремонт' },
    { icon: '💡', title: 'Бурбл и скрытые функции', desc: 'Поп-банг, launch control, отключение Start/Stop навсегда, разблокировка ограничителя — всё доступно через VCDS кодирование в дополнение к Stage 1' },
  ],
  toyota: [
    { icon: '🔧', title: 'Techstream — полный доступ', desc: 'Toyota Techstream открывает разделы ECM недоступные стороннему ПО: адаптации дроссельного модуля, логи детонации, сброс сервисного регламента' },
    { icon: '🚙', title: 'LC 200/300 — ключевая специализация', desc: 'Более 100 Land Cruiser прошито через Techstream. Знаем особенности 1VD-FTV, 1GR-FE, F33A-FTV — включая разницу в поведении ЭБУ по регионам выпуска' },
    { icon: '📦', title: 'Корпоративный сервис', desc: 'Принимаем пакетные заявки на Hilux, Fortuner, LC 300 от компаний. Согласуем удобный график, документы для бухгалтерии — акты и договоры выдаём с каждой машины' },
  ],
  lexus: [
    { icon: '🔬', title: 'Techstream JDM-версия', desc: 'Японская версия Techstream открывает дополнительные сервисные режимы: прямая калибровка АКПП, логи детонации по каждому цилиндру, недоступные в международной версии' },
    { icon: '🏎️', title: 'LX/GX — опыт с флагманами', desc: 'LX 470, LX 570, LX 600, GX 460 — понимаем ограничения атмосферных V8 и потенциал новых турбированных TNGA-платформ. Завышенных ожиданий не создаём' },
    { icon: '⭐', title: 'Сохранение оригинала', desc: 'Перед записью клонируем исходный файл прошивки — клиент получает его на руки. При желании восстановление в стандарт занимает 30 минут без потери комплектации' },
  ],
  landrover: [
    { icon: '🔬', title: 'JLR SDD — завод в кармане', desc: 'Jaguar Land Rover SDD открывает VME-раздел ЭБУ Bosch: без него правильно откалибровать Ingenium или SDV8 невозможно — давление наддува уйдёт в «аварию»' },
    { icon: '🏔️', title: '120+ Land Rover в работе', desc: 'Range Rover L322/L405/L460, Discovery 4/5, Defender L663 — знаем особенности каждого поколения: от ZF 6HP26 до ZF 8HP76 и алгоритмы управления пневмоподвеской' },
    { icon: '🛠️', title: 'Пневмоподвеска через SDD', desc: 'Диагностируем утечки с точностью до 0,05 бар/мин через JLR SDD. Заменяем баллоны, компрессор WABCO, блок клапанов — с гарантией 6 месяцев на запчасти' },
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

    // og:url должен совпадать с canonical и заканчиваться на /
    const ogUrl = isSubdomain
      ? getBrandCanonical(brandSlug, '/')
      : `https://hptuning.ru/brands/${brand.slug}/`;

    // Host-aware og:title / og:description — полный сервис, не только чип-тюнинг
    const title = brand.seo?.title ?? `Сервис ${brand.name} в Санкт-Петербурге | HP Тюнинг`;
    const description = brand.seo?.description ?? brand.description;

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
            alt: `Сервис ${brand.name} в Санкт-Петербурге — HP Тюнинг`,
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
    name: `Автосервис, тюнинг и детейлинг ${brand.name} в Санкт-Петербурге`,
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
            {BRAND_H1[brandSlug] ?? BRAND_H1[brand.slug] ?? `Сервис ${brand.name}`}
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

        {/* Быстрый выбор услуги — 4 направления */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          {[
            {
              icon: Shield,
              color: '#a78bfa',
              bg: 'bg-violet-500/8 border-violet-500/20',
              title: 'Диагностика',
              desc: 'Компьютерная и ходовая диагностика',
              price: 'от 1 500 ₽',
              href: isSubdomain ? `${mainSiteUrl}/service/diagnostics` : '/service/diagnostics',
            },
            {
              icon: Wrench,
              color: '#f59e0b',
              bg: 'bg-amber-500/8 border-amber-500/20',
              title: 'Техобслуживание',
              desc: 'ТО, ремонт двигателя и подвески',
              price: 'от 3 500 ₽',
              href: isSubdomain ? `${mainSiteUrl}/service` : '/service',
            },
            {
              icon: Zap,
              color: '#39FF14',
              bg: 'bg-[#39FF14]/8 border-[#39FF14]/20',
              title: 'Чип-тюнинг',
              desc: 'Stage 1/2/3, EGR/DPF off, АКПП',
              price: `от ${brand.priceFrom.toLocaleString('ru-RU')} ₽`,
              href: isSubdomain ? `${mainSiteUrl}/tuning/chip-tuning` : '/tuning/chip-tuning',
            },
            {
              icon: Sparkles,
              color: '#38bdf8',
              bg: 'bg-sky-500/8 border-sky-500/20',
              title: 'Детейлинг',
              desc: 'Керамика 9H, PPF, полировка, химчистка',
              price: 'от 6 000 ₽',
              href: isSubdomain ? `${mainSiteUrl}/detailing` : '/detailing',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={`flex flex-col gap-3 p-4 rounded-2xl border ${card.bg} hover:scale-[1.01] transition-transform`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="size-4" style={{ color: card.color }} />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{card.title}</div>
                <div className="text-zinc-500 text-xs mt-0.5 leading-snug">{card.desc}</div>
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

        {/* Калькулятор чип-тюнинга */}
        <div className="mb-14 -mx-4 sm:-mx-6 lg:-mx-8" id="calculator">
          <ChipTuningCalculator defaultBrandSlug={brandSlug} />
        </div>

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

        {/* CTA — дистанционная консультация */}
        <div className="rounded-2xl bg-gradient-to-r from-[#39FF14]/10 to-transparent border border-[#39FF14]/20 p-8">
          <div className="max-w-2xl">
            <h3 className="font-display text-3xl text-white uppercase tracking-wide mb-3">
              Бесплатная консультация по {brand.name}
            </h3>
            <p className="text-zinc-400 text-base mb-6 leading-relaxed">
              Расскажите о задаче онлайн — бесплатная дистанционная консультация по сервису,
              детейлингу и тюнингу. Ответим в течение 15 минут в рабочее время.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookingButton
                label="Записаться онлайн"
                serviceHint={brand.name}
                className="btn-primary text-sm px-6 py-3"
              />
              <a
                href="https://t.me/hptuningspb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2AABEE]/30 bg-[#2AABEE]/10 text-[#2AABEE] text-sm font-medium hover:bg-[#2AABEE]/20 transition-colors"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
              <a
                href="tel:+79818428151"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-zinc-300 text-sm font-medium hover:border-white/30 hover:text-white transition-colors"
              >
                <Phone className="size-4" />
                +7 (981) 842-81-51
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
