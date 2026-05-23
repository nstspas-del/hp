/**
 * /projects/[slug] — HP Тюнинг
 * Layer D: Проекты / Кейсы
 *
 * Шаблон страницы проекта. Данные подтягиваются из projects.json.
 * Включает: модель, проблема/цель, диагностика, выполненные работы,
 * результат, фотогалерея, видео (Rutube + YouTube), FAQ, внутренние ссылки.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle, Clock, Wrench, Zap, ChevronRight, Camera } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { VideoModule } from '@/components/ui/VideoModule';

// ── Типы данных проекта ────────────────────────────────────────────────────────
export interface Project {
  slug: string;
  brandSlug: string;
  brandName: string;
  model: string;
  generation: string;
  engine: string;
  year?: number;

  /** Краткий заголовок */
  title: string;
  /** Метаописание для <title> и og:description */
  metaDescription?: string;

  /** Исходная задача или проблема клиента */
  problemStatement: string;
  /** Что выяснила диагностика */
  diagnosticsResult?: string;
  /** Список выполненных работ */
  worksDone: string[];
  /** Итоговый результат */
  result: string;

  /** Параметры до / после (опционально) */
  specs?: {
    label: string;
    before: string;
    after: string;
  }[];

  /** Ссылки на фото (пути из /public/) */
  gallery?: string[];
  coverImage?: string;

  /** Видео */
  youtubeId?: string;
  rutubeId?: string;
  /** Локальное видео (mp4 в /public/videos/) — приоритет над embed */
  localVideo?: {
    src: string;
    poster?: string;
    /** Соотношение сторон, e.g. 'aspect-[9/16]' (портрет) или 'aspect-video' */
    aspectClass?: string;
  };

  /** Блок FAQ */
  faq?: { q: string; a: string }[];

  /** Категории / теги */
  services?: string[];

  createdAt?: string;
}

// ── Данные проектов (статические) ─────────────────────────────────────────────
// В продакшне заменяется импортом из projects.json или CMS
const PROJECTS: Project[] = [
  // BMW X5 G05 удалён 2026-05-19 — фейковый кейс без реальных фото
  {
    slug: 'dodge-challenger-ta-hemi',
    brandSlug: 'dodge',
    brandName: 'Dodge',
    model: 'Challenger T/A',
    generation: 'LA',
    engine: '5.7 HEMI V8',
    year: 2019,
    title: 'Dodge Challenger T/A 5.7 HEMI — daily-muscle build',
    metaDescription:
      'Кейс HP Тюнинг: Dodge Challenger T/A 5.7 HEMI 2019 — комплексный daily-muscle: '
      + 'коллекторы Kooks Long Tube, распредвал Texas Speed Stage 2, доработка MDS + Flex Fuel, '
      + 'выхлоп Ø76 мм, Body Look Hellcat, подсветка XGLOW.',
    problemStatement:
      'Клиент обратился с задачей: сделать из стокового Dodge Challenger T/A 5.7 HEMI 2019 года '
      + 'дейли с характером Hellcat — чтобы машина тянула с низов, звучала как положено V8 '
      + 'и каждый день ездила по городу без проблем. Не «гаражный мускул на трейлере», а полноценная '
      + 'повседневная машина, на которой не страшно ехать и в офис, и на трек-день.',
    diagnosticsResult:
      'Перед началом — полная диагностика мотора и АКПП через wiTECH, замер компрессии, проверка форсунок и насоса. '
      + 'Двигатель в исправном состоянии, ресурсы по поршневой и шатунным вкладышам в норме. '
      + 'Принято решение собирать проект поэтапно: каждый этап — отдельный визит, '
      + 'чтобы клиент мог жить с машиной, чувствовать изменения и не выпадать из эксплуатации.',
    worksDone: [
      'Коллекторы Kooks Long Tube — раскрытие верхов и прирост момента в среднем диапазоне',
      'Распредвал Texas Speed Stage 2 — агрессивная фаза, характерный muscle-холостой',
      'Доработка системы катушек MDS (отключение деактивации цилиндров)',
      'Установка системы Flex Fuel — готовность к работе на смесях вплоть до E85',
      'Выхлопная трасса Ø 76 мм — единый диаметр от коллекторов до кормы',
      'Body Look в стиле Hellcat: капот, бамперы, расширители, оптика',
      'Контурная подсветка XGLOW — динамика днём, шоу-режим ночью',
      'Калибровка ЭБУ под новое железо и Flex Fuel (E10–E85)',
      'Дорожные тесты на каждом этапе, адаптация под клиента',
    ],
    result:
      'Получился настоящий daily-muscle: дейли с характером Hellcat, тянет с низов, звучит как V8 должен звучать, '
      + 'едет каждый день. По внешности — машина-визитка, в потоке узнают сразу. '
      + 'Главное — клиент получил не «гаражный экспонат», а инструмент: на работу в понедельник, на трек в субботу.',
    coverImage: '/images/projects/dodge-challenger-ta/02-outdoor-sunset-halo.jpg',
    gallery: [
      '/images/projects/dodge-challenger-ta/01-front-ta-stripe.jpg',
      '/images/projects/dodge-challenger-ta/02-outdoor-sunset-halo.jpg',
      '/images/projects/dodge-challenger-ta/03-engine-bay-hemi.jpg',
      '/images/projects/dodge-challenger-ta/04-rear-exhaust-lift.jpg',
      '/images/projects/dodge-challenger-ta/05-rear-quarter-workshop.jpg',
    ],
    localVideo: {
      src: '/videos/dodge-challenger-ta.mp4',
      poster: '/images/projects/dodge-challenger-ta/00-video-poster.jpg',
      aspectClass: 'aspect-[9/16]',
    },
    faq: [
      {
        q: 'Что такое Flex Fuel и зачем он на HEMI?',
        a: 'Flex Fuel — это система, которая позволяет двигателю работать на смесях бензина с этанолом вплоть до E85. '
           + 'Этанол даёт более высокое октановое число и охлаждает заряд, что позволяет агрессивнее настраивать УОЗ и наддув '
           + '(если он есть). На атмосферном HEMI 5.7 эффект скромнее, чем на турбомоторах, но прирост есть, '
           + 'плюс мотор живёт стабильнее на агрессивной прошивке.',
      },
      {
        q: 'Сколько времени заняла сборка проекта?',
        a: 'Машина собиралась поэтапно — несколько визитов растянутых по времени. '
           + 'Такой подход даёт клиенту возможность не оставаться без машины надолго '
           + 'и чувствовать каждое изменение по отдельности: сначала железо мотора, потом выхлоп, потом внешность, потом подсветка.',
      },
      {
        q: 'Можно ли с такими доработками ездить каждый день?',
        a: 'Да, в этом и был смысл проекта. Распредвал Stage 2 даёт характерный muscle-холостой, '
           + 'но не делает машину неудобной в пробках. Выхлоп 76 мм с правильными резонаторами не «гудит» в круизе. '
           + 'Flex Fuel позволяет заправляться на любой АЗС.',
      },
      {
        q: 'Делаете ли подобные проекты под других клиентов?',
        a: 'Да, специализируемся на американских V8 (Dodge, Chrysler, Jeep SRT) и европейских muscle/sport-машинах. '
           + 'Каждый проект — индивидуальный, под задачи и стиль владельца. '
           + 'Можем как полный build «под ключ», так и поэтапно — как в этом кейсе.',
      },
    ],
    services: ['Тюнинг мотора', 'Body Look', 'Выхлоп', 'Flex Fuel', 'Подсветка'],
    createdAt: '2025-11-20',
  },

  // ── Porsche Macan S — Helix Premium Audio + детейлинг салона ──────────────
  {
    slug: 'porsche-macan-s',
    brandSlug: 'porsche',
    brandName: 'Porsche',
    model: 'Macan S',
    generation: '95B',
    engine: '3.0 V6 TFSI',
    title: 'Porsche Macan S — премиум-аудио Helix + детейлинг салона',
    metaDescription:
      'Кейс HP Тюнинг: Porsche Macan S — установка премиум-аудиосистемы Helix '
      + 'с интеграцией в штатный интерфейс, доработка шумоизоляции, детейлинг салона с красной отделкой.',
    problemStatement:
      'Владелец Porsche Macan S с шикарным красным салоном пришёл с конкретной задачей: '
      + 'штатная аудиосистема (даже Bose Surround) не передавала ощущения «концертного зала» — '
      + 'хотелось аудио уровня премиум-марки, но без колхоза и пластиковых сабов в багажнике. '
      + 'Плюс — интеграция должна быть через штатный интерфейс PCM, никаких отдельных пультов.',
    diagnosticsResult:
      'Замер акустики салона: штатная Bose выдаёт ровное среднее, но низкочастотный диапазон обрезан, '
      + 'панорама смещена влево. Шумоизоляция базовая — выше 100 км/ч аэродинамические шумы съедают детальность звука. '
      + 'Решение: компонентная система Helix Esprit, отдельный сабвуфер под полом багажника, '
      + 'процессор Helix DSP с интеграцией в штатный CAN, плюс точечная шумка дверей и арок.',
    worksDone: [
      'Установка компонентной фронтальной акустики Helix Esprit (твитеры в штатные места A-стойки, мидбасы в двери)',
      'Сабвуфер Helix под штатным фальшполом багажника — без потери объёма',
      'Процессор Helix DSP с интеграцией в шину MOST/CAN — управление со штатного PCM',
      'Подключение через High-Low адаптер без вмешательства в штатный head unit',
      'Шумоизоляция передних дверей в 2 слоя (виброизол + сплен), арки колёс',
      'Полный детейлинг салона: чистка кожи Lederzentrum, кондиционер, защитный состав',
      'Финальная настройка DSP по замерам микрофоном — выравнивание АЧХ, time alignment',
      'Презентация клиенту с демонстрацией возможностей системы',
    ],
    result:
      'Получилась аудиосистема уровня хорошего домашнего hi-fi прямо в машине — '
      + 'панорама ровная, бас плотный без бубнения, средние «дышат». '
      + 'Внешне в салоне ничего не изменилось: всё через штатный PCM, никаких отдельных пультов. '
      + 'Шумка дверей бонусом убрала «гул» на трассе. Клиент тестил систему на трёх любимых альбомах — '
      + 'результатом доволен полностью.',
    coverImage: '/images/projects/porsche-macan-s-helix/02-side-door-open.jpg',
    gallery: [
      '/images/projects/porsche-macan-s-helix/01-door-red-interior.jpg',
      '/images/projects/porsche-macan-s-helix/02-side-door-open.jpg',
      '/images/projects/porsche-macan-s-helix/03-cockpit-steering.jpg',
      '/images/projects/porsche-macan-s-helix/04-center-console.jpg',
      '/images/projects/porsche-macan-s-helix/05-hood-open-garage.jpg',
    ],
    faq: [
      {
        q: 'Зачем менять Bose в Porsche — она же премиум?',
        a: 'Штатная Bose Surround — хорошая массовая система, но для меломана с высокими требованиями к звуку '
           + 'она остаётся «фоновой». Helix — это специализированный немецкий бренд car audio с компонентной акустикой, '
           + 'настраиваемым DSP и совершенно другим уровнем детальности. Это не «громче», это «точнее».',
      },
      {
        q: 'Сохраняется ли штатное управление и интерфейс PCM?',
        a: 'Да, полностью. Helix DSP подключается через High-Low адаптер без вмешательства в штатный head unit — '
           + 'все источники (Bluetooth, USB, Apple CarPlay, штатный радиоприёмник) работают как раньше. '
           + 'С виду в салоне ничего не изменилось.',
      },
      {
        q: 'Влияет ли установка сабвуфера на объём багажника?',
        a: 'Нет. Мы устанавливаем сабвуфер под штатный фальшпол багажника — пространство для вещей не уменьшается. '
           + 'Это требует кастомного короба под конкретный корпус Macan, но результат того стоит.',
      },
      {
        q: 'Сколько времени занимает установка премиум-аудио?',
        a: 'Полный комплект (компонентная акустика + саб + DSP + шумка дверей + настройка) — 3–4 рабочих дня. '
           + 'Финальная настройка DSP — отдельная сессия с микрофонными замерами в кабине, '
           + 'выравнивание АЧХ и time alignment под конкретное место водителя.',
      },
    ],
    services: ['Премиум-аудио Helix', 'Helix DSP', 'Шумоизоляция', 'Детейлинг салона', 'Интеграция в штатный PCM'],
    createdAt: '2026-01-15',
  },

  // ── Range Rover Sport — комплексный сервис под ключ ──────────────────────
  {
    slug: 'range-rover-sport',
    brandSlug: 'landrover',
    brandName: 'Land Rover',
    model: 'Range Rover Sport',
    generation: 'L494',
    engine: 'V6 / V8',
    title: 'Range Rover Sport — комплексный сервис под ключ',
    metaDescription:
      'Кейс HP Тюнинг: Range Rover Sport L494 — комплексный сервис: диагностика по живой телеметрии, '
      + 'обслуживание мотора, восстановление фары, премиум-масло Pakelo, чистка салона.',
    problemStatement:
      'Range Rover Sport L494 — машина приехала после нескольких сервисов «по очереди»: '
      + 'где-то меняли датчики, где-то «прошивали» что-то, где-то меняли лампы. '
      + 'Проблем не одна, а целый список: вопросы по мотору и тяге, мутная передняя фара (вода/конденсат), '
      + 'салон требует освежения. Владелец хотел один сервис, который соберёт всё в один комплекс и сделает «как надо».',
    diagnosticsResult:
      'Полная диагностика через Autel MaxiSys + JLR-протоколы: '
      + 'выявлены ошибки и нештатные адаптации в ЭБУ двигателя, по контуру наддува — мелкие подтравы, '
      + 'герметичность ниже нормы. Передняя фара — нарушена герметизация корпуса, изнутри конденсат и помутнение. '
      + 'Салон — нуждается в детейлинге кожи и пластика, штатная чистка уже не справляется.',
    worksDone: [
      'Полная компьютерная диагностика по живой телеметрии (логи в движении, не только на холостом)',
      'Работы по моторному отсеку: устранение нештатных мест по контуру наддува, чистка дроссельного узла',
      'Замена масла в двигателе: Pakelo Global Multi PAO с допуском JLR STJLR.51.5122',
      'Замена масляного и воздушного фильтров (оригинал)',
      'Восстановление передней фары: вскрытие корпуса, сушка, новая герметизация',
      'Полировка пластика фары изнутри и снаружи, восстановление прозрачности',
      'Детейлинг салона: чистка кожи Lederzentrum, защитный состав, чистка пластика и дисплея',
      'Контрольный заезд + повторный лог после всех работ — ошибок нет, мотор работает ровно',
    ],
    result:
      'Машина приехала с тремя «отдельными» проблемами — уехала с одним собранным результатом: '
      + 'мотор работает ровно, фара прозрачная и сухая внутри, салон выглядит на возраст −5 лет. '
      + 'Клиент впервые за долгое время сел в свой Range Rover Sport и не «прислушивался» к нему, а просто поехал. '
      + 'Главный плюс — один сервис, один разговор, один отчёт.',
    coverImage: '/images/projects/range-rover-sport-full-complex/02-front-headlight.jpg',
    gallery: [
      '/images/projects/range-rover-sport-full-complex/01-engine-bay.jpg',
      '/images/projects/range-rover-sport-full-complex/02-front-headlight.jpg',
      '/images/projects/range-rover-sport-full-complex/03-interior-cockpit.jpg',
    ],
    faq: [
      {
        q: 'Что входит в "комплексный сервис под ключ"?',
        a: 'Это формат, когда клиент приезжает с несколькими разными задачами, а мы собираем их в один план: '
           + 'диагностика мотора, плановое ТО, детейлинг кузова/салона, мелкие работы по электрике и оптике. '
           + 'Преимущество — один менеджер ведёт всю историю, один отчёт по работам, одна точка ответственности.',
      },
      {
        q: 'Какое оборудование используете для диагностики Land Rover?',
        a: 'Основной сканер — Autel MaxiSys с лицензией на полные JLR-протоколы (SDD-совместимость). '
           + 'Для глубокой работы с ЭБУ — отдельные стенды и интерфейсы. '
           + 'Главное — мы читаем не только ошибки, но и живую телеметрию в движении (логи), что даёт реальную картину.',
      },
      {
        q: 'Можно ли восстановить запотевшую фару, или только менять?',
        a: 'В большинстве случаев — восстанавливаем. Вскрываем корпус, сушим, заменяем повреждённые уплотнители, '
           + 'герметизируем заново. Полируем пластик внутри и снаружи. '
           + 'Замена фары на оригинал — это дорого и не всегда оправдано, если корпус не повреждён физически.',
      },
      {
        q: 'Какое масло заливаете в Land Rover?',
        a: 'Pakelo Global Multi PAO с допуском JLR STJLR.51.5122. '
           + 'Это полностью синтетическое (PAO) масло, по характеристикам сопоставимо с Castrol Edge Professional. '
           + 'Если у клиента есть своё масло с актуальным допуском — зальём его.',
      },
    ],
    services: ['Диагностика JLR', 'ТО под ключ', 'Восстановление фары', 'Детейлинг салона', 'Premium масло Pakelo'],
    createdAt: '2026-02-08',
  },

  // ── Skoda Kodiaq — PDR (удаление вмятин без покраски) ────────────────────
  {
    slug: 'skoda-kodiaq',
    brandSlug: 'skoda',
    brandName: 'Skoda',
    model: 'Kodiaq',
    generation: 'NS7',
    engine: 'TSI',
    title: 'Skoda Kodiaq — PDR: удаление вмятины без покраски',
    metaDescription:
      'Кейс HP Тюнинг: Skoda Kodiaq — удаление вмятины методом PDR (paintless dent repair). '
      + 'Без покраски и шпаклёвки, заводское ЛКП сохранено полностью. Процесс на фото.',
    problemStatement:
      'Владелец Skoda Kodiaq поймал классическую городскую неприятность: '
      + 'на парковке кто-то ушёл, оставив на кузове глубокую вмятину без скола краски. '
      + 'Задача: убрать вмятину без покраски — заводское ЛКП Skoda держится отлично, '
      + 'а любая покраска даже одной детали навсегда «помечает» машину при будущей продаже. '
      + 'PDR — единственный вариант сохранить оригинальность кузова.',
    diagnosticsResult:
      'Осмотр под специальной PDR-лампой (полосатая линза подсвечивает рельеф вмятины): '
      + 'вмятина — глубокая, но без излома металла и без повреждения ЛКП. '
      + 'Доступ к обратной стороне панели — есть через технологическое отверстие. '
      + 'Дефект полностью подходит под PDR — без вскрытия панели, без покраски, за один заход.',
    worksDone: [
      'Осмотр и фиксация дефекта под PDR-лампой (полосатый рисунок-индикатор)',
      'Подготовка доступа: демонтаж минимально необходимого (без разборки всей панели)',
      'Поэтапная выправка металла с обратной стороны специальными PDR-крючками',
      'Послойный контроль рельефа под лампой — пошаговое сведение «эха» вмятины',
      'Финальная докрутка зубцов на лицевой стороне (где это возможно)',
      'Контроль геометрии панели — линии и блики совпадают с заводским рельефом',
      'Лёгкая полировка зоны (без съёма ЛКП) — выравнивание блеска',
      'Сравнение фото «до/после» в той же геометрии освещения',
    ],
    result:
      'Вмятина ушла полностью, заводское ЛКП сохранено на 100%. '
      + 'Под PDR-лампой следов вмятины не видно — линии и блики совпадают с заводскими. '
      + 'Машина не «помечена» покраской, при перепродаже толщиномер покажет родную заводскую краску. '
      + 'Срок работы — один рабочий день вместо нескольких дней покраски с сушкой и полировкой.',
    coverImage: '/images/projects/skoda-kodiaq-pdr/03-pdr-result-progress.jpg',
    gallery: [
      '/images/projects/skoda-kodiaq-pdr/01-dent-closeup.jpg',
      '/images/projects/skoda-kodiaq-pdr/02-pdr-lamp-process.jpg',
      '/images/projects/skoda-kodiaq-pdr/03-pdr-result-progress.jpg',
    ],
    faq: [
      {
        q: 'Что такое PDR и в чём его преимущество перед покраской?',
        a: 'PDR (Paintless Dent Repair) — это технология удаления вмятин без покраски: специальными крючками мастер '
           + 'выправляет металл изнутри панели, восстанавливая заводскую геометрию. Главные плюсы: '
           + '(1) заводское ЛКП сохраняется на 100% — толщиномер при перепродаже покажет родную краску; '
           + '(2) дешевле и быстрее покраски (день вместо нескольких); '
           + '(3) машина не теряет в стоимости из-за «крашеной детали».',
      },
      {
        q: 'Любую ли вмятину можно убрать методом PDR?',
        a: 'Нет. PDR подходит, если: ЛКП не повреждено (нет сколов и трещин краски), металл не «изломан» (нет острых заломов), '
           + 'и есть физический доступ к обратной стороне панели. Если хотя бы одно из условий не выполнено — '
           + 'нужна частичная или полная покраска. Решение принимаем после осмотра под PDR-лампой.',
      },
      {
        q: 'Сколько времени занимает PDR одной вмятины?',
        a: 'От 30 минут до целого рабочего дня — зависит от размера, глубины и доступности вмятины. '
           + 'Сложные дефекты с трудным доступом могут потребовать частичной разборки панели (но без снятия краски). '
           + 'Простые «парковочные» вмятины — пара часов.',
      },
      {
        q: 'Почему PDR-мастер должен работать под специальной лампой?',
        a: 'PDR-лампа имеет полосатую линзу, которая создаёт на поверхности кузова чёткий полосатый рисунок. '
           + 'Любое искажение этих полос — это ещё неисправленный рельеф вмятины. Это единственный способ '
           + 'контролировать работу с точностью до сотых долей миллиметра. Без такой лампы PDR — это лотерея.',
      },
    ],
    services: ['PDR (без покраски)', 'Кузовной ремонт', 'Сохранение заводского ЛКП', 'Восстановление геометрии'],
    createdAt: '2026-03-02',
  },
];

// ── generateMetadata ───────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) return {};
  const canonical = `https://hptuning.ru/projects/${project.slug}/`;
  return {
    title: `${project.title} | HP Тюнинг`,
    description: project.metaDescription ?? project.result,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} | HP Тюнинг`,
      description: project.metaDescription ?? project.result,
      url: canonical,
      type: 'article',
      locale: 'ru_RU',
      siteName: 'HP Тюнинг',
      images: project.coverImage
        ? [{ url: `https://hptuning.ru${project.coverImage}`, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const brandHref = project.brandSlug
    ? `https://${project.brandSlug}.hptuning.ru`
    : '/brands';

  // Schema.org
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://hptuning.ru/projects/${project.slug}/#article`,
    headline: project.title,
    description: project.metaDescription ?? project.result,
    datePublished: project.createdAt,
    publisher: { '@id': 'https://hptuning.ru/#org' },
    ...(project.coverImage && {
      image: `https://hptuning.ru${project.coverImage}`,
    }),
  };

  const faqSchema = project.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: project.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ───────── MOBILE HERO (фото сверху, текст под ним) ─────────
          На мобиле буквы НЕ закрывают красивые детали фото (фары, линии).
          Фото получает полную сцену 16/10, без overlay-теней над собой.
      */}
      <section className="md:hidden bg-[#09090b]">
        {project.coverImage && (
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              style={{ objectPosition: '50% 65%' }}
              priority
              sizes="100vw"
            />
            {/* Лёгкий градиент ТОЛЬКО снизу для бесшовного перехода в чёрный фон */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#09090b] to-transparent" />
          </div>
        )}
        <div className="container pt-4 pb-6">
          {/* Breadcrumb */}
          <nav className="text-xs text-zinc-500 mb-3 flex items-center flex-wrap gap-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#39FF14] transition-colors">Главная</Link>
            <ChevronRight className="size-3" />
            <Link href="/blog" className="hover:text-[#39FF14] transition-colors">Блог</Link>
            <ChevronRight className="size-3" />
            <span className="text-zinc-300 truncate max-w-[180px]">{project.title}</span>
          </nav>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.services?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-2xl uppercase tracking-tight text-white leading-tight">
            {project.title}
          </h1>
          <p className="text-zinc-400 text-xs mt-2">
            {project.brandName} {project.model} {project.generation} · {project.engine}
            {project.year && ` · ${project.year} г.`}
          </p>
        </div>
      </section>

      {/* ───────── DESKTOP HERO — фото сверху видимое, текст в нижней «полке» ───────── */}
      <section className="hidden md:block relative bg-[#09090b]">
        {/* Фото — целиком видно, без перекрытия текстом */}
        {project.coverImage && (
          <div className="relative w-full h-[55vh] min-h-[420px] max-h-[640px] overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            {/* Лёгкий градиент только у самого низа — для плавного перехода в чёрную полку */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
          </div>
        )}
        {/* Текстовая «полка» под фото — машину видно полностью, заголовок ниже */}
        <div className="container pt-6 pb-10">
          {/* Breadcrumb */}
          <nav className="text-xs text-zinc-500 mb-3 flex items-center flex-wrap gap-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#39FF14] transition-colors">Главная</Link>
            <ChevronRight className="size-3" />
            <Link href="/blog" className="hover:text-[#39FF14] transition-colors">Блог</Link>
            <ChevronRight className="size-3" />
            <span className="text-zinc-300 truncate max-w-[260px]">{project.title}</span>
          </nav>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.services?.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
            {project.title}
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            {project.brandName} {project.model} {project.generation} · {project.engine}
            {project.year && ` · ${project.year} г.`}
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Основная колонка */}
          <div className="lg:col-span-2 space-y-10">

            {/* Задача */}
            <section>
              <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-[#39FF14]">01.</span> Задача
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">{project.problemStatement}</p>
            </section>

            {/* Диагностика */}
            {project.diagnosticsResult && (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="text-[#39FF14]">02.</span> Диагностика
                </h2>
                <p className="text-zinc-400 text-base leading-relaxed">{project.diagnosticsResult}</p>
              </section>
            )}

            {/* Выполненные работы */}
            <section>
              <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <Wrench className="size-5 text-[#39FF14]" />
                Выполненные работы
              </h2>
              <ul className="space-y-3">
                {project.worksDone.map((work, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <CheckCircle className="size-4 text-[#39FF14] shrink-0 mt-0.5" />
                    {work}
                  </li>
                ))}
              </ul>
            </section>

            {/* Результат */}
            <section>
              <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <Zap className="size-5 text-[#39FF14]" />
                Результат
              </h2>
              <p className="text-zinc-300 text-base leading-relaxed">{project.result}</p>

              {/* Таблица до / после */}
              {project.specs && project.specs.length > 0 && (
                <div className="mt-5 rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="text-left px-5 py-3 text-zinc-400 font-medium">Параметр</th>
                        <th className="text-right px-4 py-3 text-zinc-400 font-medium">До</th>
                        <th className="text-right px-4 py-3 text-[#39FF14] font-medium">После</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.specs.map((row, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-5 py-3 text-zinc-400">{row.label}</td>
                          <td className="px-4 py-3 text-right text-zinc-300">{row.before}</td>
                          <td className="px-4 py-3 text-right font-bold text-[#39FF14]">{row.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Видео — локальный mp4 имеет приоритет над embed */}
            {project.localVideo ? (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="text-[#39FF14]">▶</span> Видео о работе
                </h2>
                <div className={`relative ${project.localVideo.aspectClass ?? 'aspect-video'} max-w-md mx-auto rounded-2xl overflow-hidden border border-white/8 bg-black`}>
                  <video
                    src={project.localVideo.src}
                    poster={project.localVideo.poster}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </section>
            ) : (project.youtubeId || project.rutubeId) ? (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="text-[#39FF14]">▶</span> Видео о работе
                </h2>
                <VideoModule
                  title={project.title}
                  summary={project.result}
                  youtubeId={project.youtubeId}
                  rutubeId={project.rutubeId}
                  posterSrc={project.coverImage}
                />
              </section>
            ) : null}

            {/* Галерея */}
            {project.gallery && project.gallery.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Camera className="size-5 text-[#39FF14]" />
                  Фотогалерея
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.gallery.map((src, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src={src}
                        alt={`${project.title} — фото ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width:768px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {project.faq && project.faq.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-white uppercase tracking-wide mb-4">
                  Частые вопросы
                </h2>
                <div className="space-y-3">
                  {project.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group bg-[#111113] rounded-xl border border-white/8 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-white/3">
                        <span className="text-white font-medium text-sm">{item.q}</span>
                        <span className="text-zinc-500 group-open:rotate-180 transition-transform shrink-0 text-lg">▾</span>
                      </summary>
                      <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Боковая колонка */}
          <aside className="space-y-5">
            {/* CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-[#39FF14]/10 to-transparent border border-[#39FF14]/20 p-6">
              <h3 className="text-white font-bold text-base mb-2">
                Хотите такой же результат?
              </h3>
              <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                Бесплатная консультация — расскажем, что реально на вашем автомобиле.
                Ответим за 15 минут.
              </p>
              <div className="space-y-2">
                <BookingButton
                  label="Записаться"
                  serviceHint={`${project.brandName} ${project.model}`}
                  className="btn-primary w-full justify-center py-3 text-sm"
                />
                <a
                  href="https://t.me/hptuningspb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14] text-sm font-medium hover:bg-[#39FF14]/20 transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>

            {/* Связанные страницы */}
            <div className="rounded-xl border border-white/8 bg-[#111113] p-5">
              <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Связанные разделы</h3>
              <div className="space-y-2">
                <a
                  href={brandHref}
                  className="flex items-center justify-between text-sm text-zinc-300 hover:text-[#39FF14] transition-colors py-1.5 border-b border-white/5"
                >
                  <span>Страница {project.brandName}</span>
                  <ChevronRight className="size-3.5 text-zinc-600" />
                </a>
                <Link
                  href="/tuning/chip-tuning"
                  className="flex items-center justify-between text-sm text-zinc-300 hover:text-[#39FF14] transition-colors py-1.5 border-b border-white/5"
                >
                  <span>Чип-тюнинг</span>
                  <ChevronRight className="size-3.5 text-zinc-600" />
                </Link>
                <Link
                  href="/service/diagnostics"
                  className="flex items-center justify-between text-sm text-zinc-300 hover:text-[#39FF14] transition-colors py-1.5"
                >
                  <span>Диагностика</span>
                  <ChevronRight className="size-3.5 text-zinc-600" />
                </Link>
              </div>
            </div>

            {/* Контакты */}
            <div className="rounded-xl border border-white/8 bg-[#111113] p-5 space-y-2">
              <div className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Контакты</div>
              <a href="tel:+79818428151" className="block text-white font-medium text-sm hover:text-[#39FF14] transition-colors">
                +7 (981) 842-81-51
              </a>
              <div className="text-zinc-500 text-xs">Пн–Вс 10:00–22:00</div>
              <div className="text-zinc-500 text-xs">Богородская, 3Б, СПб</div>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="size-3 text-[#39FF14]" />
                <span className="text-[#39FF14] text-xs font-medium">Ответим за 15 минут</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
