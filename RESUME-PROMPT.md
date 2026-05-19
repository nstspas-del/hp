# 🔄 RESUME PROMPT — hptuning.ru (актуально на 2026-05-19)

> **Как использовать:** скопируй блок ниже целиком (от «Привет!» до «Жду команды.») и вставь в новый чат с агентом (Claude / AI Developer). Агент сразу подхватит контекст и продолжит работу без вопросов «а где у нас что».

---

## 📌 PROMPT — копировать ОТСЮДА ↓

Привет! Я Настя (О господин), владелица **HP Тюнинг** (автосервис в СПб). Парень — Дима, иногда тоже пишет. Стиль общения: на ты, прямолинейно, остроумно, можно с шутками, без воды. Продолжаем большой SEO-rework сайта **hptuning.ru**.

### 🌐 Production

| Параметр | Значение |
|---|---|
| **Домен** | https://hptuning.ru |
| **Сервер** | Ubuntu, доступ под `root` |
| **Боевая папка** | `/var/www/hptuning/app/` (git-репа) |
| **Next.js папка** | `/var/www/hptuning/app/next/` (внутри неё PM2 запускает приложение) |
| **PM2 процесс** | `hptuning` (порт `127.0.0.1:3000`) |
| **Nginx** | проксирует `127.0.0.1:3000` → внешний `:443`, добавляет Basic Auth + `X-Robots-Tag: noindex` |
| **Basic Auth** | логин `hptuning`, пароль `7545` (для curl: `-u hptuning:7545`) |
| **HTTPS** | Let's Encrypt |
| **Бренд-сабдомены** | bmw.hptuning.ru, mercedes.hptuning.ru, audi.hptuning.ru, porsche.hptuning.ru, vw.hptuning.ru, toyota.hptuning.ru, lexus.hptuning.ru, landrover.hptuning.ru |

⚠️ **ВАЖНО — только один путь на проде!** Раньше на сервере было два клона: `/root/Documents/projects/hp/` и `/var/www/hptuning/app/`. **Песочница `/root/Documents/projects/hp/` УДАЛЕНА 2026-05-18.** Деплой ТОЛЬКО в `/var/www/hptuning/app/`.

### 📦 GitHub

- **Репозиторий:** https://github.com/nstspas-del/hp.git
- **Рабочая ветка:** `seo-rework` (всё пушим сюда, `main` не трогаем до релиза)
- **Последний коммит на 2026-05-19:** `6f8a921` — «refactor(blog): удалить все фейковые кейсы без реальных фото»

### 🧰 Технологический стек

- **Next.js 14.2.35** (App Router, RSC, TypeScript)
- **Tailwind CSS** + **framer-motion** + **lucide-react**
- **PM2** (под пользователем `root`, ecosystem.config.cjs внутри `next/`)
- **Nginx** (basic auth через `.htpasswd`)
- **NO Cloudflare Pages** — это голый VPS

### 💰 Формулы ценообразования (важно!)

| Тип услуги | Формула |
|---|---|
| **Чип-тюнинг** | `ceil((Seven_Force_цена × 0.70) / 500) × 500` |
| **Детейлинг** (PPF, керамика, полировка, химчистка) | `Platinum_Garage × 0.90` округление до ближайших 500 ₽ |

Все цены живут в JSON-файлах в `next/src/data/`. Источники парсинга — в `scraper/`.

### 🚀 Стандартная команда деплоя (после `git push` локально)

```bash
cd /var/www/hptuning/app && \
  git fetch origin && git pull origin seo-rework && \
  cd next && npm ci && npm run build && \
  chown -R hptuning:hptuning .next public node_modules && \
  pm2 restart hptuning --update-env && \
  pm2 flush hptuning && \
  pm2 logs hptuning --nostream --lines 15
```

⚠️ `npm ci` обязателен **только если изменился `package-lock.json`**. Для правок JSON/контента достаточно `npm run build` без `npm ci`.

### 🧪 Контрольные curl-ы после деплоя

```bash
curl -s -o /dev/null -w "Главная: HTTP %{http_code}\n" -u hptuning:7545 https://hptuning.ru/
curl -s -o /dev/null -w "Блог: HTTP %{http_code}\n" -u hptuning:7545 https://hptuning.ru/blog
curl -s -o /dev/null -w "Macan hero: HTTP %{http_code} | %{size_download} bytes\n" -u hptuning:7545 https://hptuning.ru/images/projects/porsche-macan-s-helix/05-hood-open-garage.jpg
curl -s -o /dev/null -w "Range Rover hero: HTTP %{http_code} | %{size_download} bytes\n" -u hptuning:7545 https://hptuning.ru/images/projects/range-rover-sport-full-complex/02-front-headlight.jpg
curl -s -o /dev/null -w "Skoda hero: HTTP %{http_code} | %{size_download} bytes\n" -u hptuning:7545 https://hptuning.ru/images/projects/skoda-kodiaq-pdr/01-dent-closeup.jpg
```

Ожидаемо все — `HTTP 200`. Размеры фото:
- Macan `05-hood-open-garage`: **342546 bytes**
- Range Rover `02-front-headlight`: **115284 bytes**
- Skoda `01-dent-closeup`: **64794 bytes**

### ⚙️ PM2 — текущая правильная конфигурация

```bash
# Если PM2 потеряется или процесс умрёт — пересоздать ровно так:
pm2 delete hptuning 2>/dev/null
cd /var/www/hptuning/app/next
pm2 start npm --name hptuning --cwd /var/www/hptuning/app/next -- start -- -p 3000 -H 127.0.0.1
pm2 save
```

**КРИТИЧНО:** `--cwd /var/www/hptuning/app/next` — обязательно. Без него PM2 наследует cwd из текущей сессии bash, и Next.js не найдёт свой `.next/` билд.

### ✅ Что уже сделано (свежие коммиты на ветке `seo-rework`)

| Коммит | Что |
|---|---|
| `6f8a921` | **2026-05-19** — refactor: удалить все 10 фейк-кейсов из `blog-entries.json` (BMW M3, Mercedes C63, Cayenne, RS6, BMW 5er ceramic, Volvo XC90, Defender, GLE PPF, X5M, BMW X5 G05). Также убран зомби BMW X5 G05 из `ProjectCarsSection.tsx`, `projects/[slug]/page.tsx`, `sitemap.ts`. В блоге осталось 4 реальных кейса + 1 проект + 6 SEO-статей. |
| `79d5b7d` | **2026-05-19** — feat: реальные фото Skoda Kodiaq PDR (3 фото с PDR-лампой в боксе, кейс slug `skoda-kodiaq-pdr-vmyatina`). |
| `a51ee33` | **2026-05-18** — docs: обновлённый RESUME-PROMPT.md (этот файл). |
| `fe8b0ea` | **2026-05-18** — feat: 8 реальных фото Porsche Macan S × 5 + Range Rover Sport × 3 в `/images/projects/`. |
| `d70145f` | feat: кнопка «Рассчитать стоимость» на `/detailing/[service]`, открывает калькулятор сразу на нужном табе (через `?tab=` + `useEffect` в `DetailingCalculator.tsx`). |
| `08bbce5` | chore: убраны 308-редиректы webp из `next.config.mjs` — реальные файлы существуют. |
| `bdba8ed` | fix: созданы 10 реальных `.webp` файлов через ImageMagick для битых ссылок. |
| `c7f93d9` | feat: цены `priceFrom` для 37 брендов в `brands.json` пересчитаны от минимума Stage 1 × 0.70 ↑500. |
| `1af4592` | fix: все **4306 цен чип-тюнинга** в `sevenforce-parsed.json` пересчитаны × 0.70 ↑500. |

### 📝 Текущий состав блога (после чистки 2026-05-19)

**4 реальных кейса с настоящими фото:**
- `porsche-macan-s-2022-to-acoustics` — Macan S, акустика Helix B (5 фото)
- `range-rover-sport-full-detailing` — Range Rover Sport, полный детейлинг (3 фото)
- `skoda-kodiaq-pdr-vmyatina` — Skoda Kodiaq, PDR без покраски (3 фото)
- `dodge-challenger-ta-hemi-build` — Dodge Challenger T/A daily-muscle (есть папка)

**1 проектная карточка (на `/projects/[slug]`):**
- `dodge-challenger-ta-hemi`

**6 SEO-статей-объяснялок (без обложек, ведут на разделы каталога):**
- `chip-tuning-stage-1-vs-stage-2`, `ceramic-coating-9h-spb`, `bmw-chip-tuning-spb`, `dpf-egr-off-spb`, `ppf-film-what-is-it`, `mercedes-amg-tuning`

### 🔥 TODO — что висит на будущее

**1. Косметика обложек разделов (низкий приоритет):**
   Файл `/images/works/10-bmw-x5-neon-workshop.jpg` всё ещё используется как декоративная обложка в 3 местах:
   - `src/app/brands/[brand]/page.tsx:55` — дефолтное hero для бренда BMW
   - `src/app/tuning/chip-tuning/page.tsx:103` — alt пишет «Mercedes на подъёмнике HP» 🤦
   - `src/components/sections/WorksPreview.tsx:17` — превью «наши работы»
   Это **не блог-кейсы**, а обложки разделов. Если есть реальные фото бокса HP — заменить. Если нет — заменить на нейтральные градиенты.

**2. Фото для будущих кейсов (когда Настя пришлёт):**
   - BMW M3, Volvo, Audi RS6, Mercedes — если есть оригинальные фото из бокса, можно вернуть их как реальные кейсы с настоящими снимками.
   - Yandex.Бизнес (карточка `99062407907`) — может, ещё перенесём что-то.

**3. `npm audit` — 2 уязвимости в dev-зависимостях:**
   Не критично для прода (только dev). Когда будет окно — `npm audit fix` без `--force`.

**4. Снять stage-защиту перед публичным релизом:**
   - Убрать basic auth в nginx (закомментировать `auth_basic` блок)
   - Убрать `X-Robots-Tag: noindex` из ответов
   - Мерж `seo-rework` → `main`
   - Деплой и проверка индексации в Яндекс.Вебмастер

**5. Brand-сабдомены (8 шт):**
   Проверить, что bmw / mercedes / audi / porsche / vw / toyota / lexus / landrover.hptuning.ru ведут на правильные страницы каталога брендов с правильными ценами.

### 🧠 Поведенческие нюансы (важно — это из реального опыта!)

1. **Не путать пути.** На сервере боевая папка — **`/var/www/hptuning/app/`**, точка. Если PM2 после правок ведёт себя странно — первым делом `pm2 show hptuning | grep "exec cwd"` и проверить, что cwd правильный.
2. **Песочница Claude (`/home/user/webapp/`)** — это для пробных правок и подготовки коммитов. Реальные изменения идут на прод через `git push origin seo-rework` + ручной деплой на сервере командой выше.
3. **Логи PM2 буферизуются.** После рестарта старые ошибки могут висеть. Всегда делать `pm2 flush hptuning` после рестарта.
4. **`next/image` оптимизатор** обходит nginx-редиректы. Если картинка 404 — создавать реальный файл в `public/`, а не редирект.
5. **`pm2 save` обязателен** после каждого изменения PM2-конфига, иначе после ребута сервера всё разъедется.
6. **GitHub-токен в песочнице Claude протухает** примерно за сутки. Если `git push` падает с «Authentication failed» — вызвать `setup_github_environment` и повторить push.
7. **Домен — `hptuning.ru`** (без `-spb`!). Это реальный продакшен. Я однажды путался с `hptuning-spb.ru` — такого домена не существует, curl возвращает `HTTP 000`.
8. **Скачивание файлов из чата** (когда Настя присылает фото): `curl` напрямую с `genspark.ai/api/files/s/...` не работает (нужен токен), используй инструмент `DownloadFileWrapper`.
9. **Структура blog-данных раздельная:**
   - `next/src/data/blog-entries.json` — это **список карточек** для `/blog` (slug, cover, excerpt)
   - `next/src/data/blog-posts.json` — это **детальные страницы** `/blog/[slug]` (полный текст, galleries, FAQ, schema.org)
   - У каждой записи в `entries` должен быть соответствующий пост в `posts` — иначе клик ведёт в 404. **Исключение:** статьи (`type: article`) могут вести на другие разделы каталога (`/brands/...`, `/detailing/...`) — там `href` отличается.

### 📁 Структура `next/` (актуально)

```
next/
├── src/
│   ├── app/
│   │   ├── projects/[slug]/page.tsx     # /projects/* — отдельные проектные кейсы
│   │   └── sitemap.ts                   # генератор sitemap.xml
│   ├── components/
│   │   ├── sections/
│   │   │   ├── DetailingCalculator.tsx  # читает ?tab= из URL
│   │   │   ├── ProjectCarsSection.tsx   # «Наши машины» на главной
│   │   │   └── WorksPreview.tsx         # «Наши работы» (содержит фото-обложки)
│   │   └── ui/
│   │       └── ServicePage.tsx          # кнопка «Рассчитать стоимость»
│   └── data/
│       ├── blog-posts.json              # полные тексты постов (4 кейса)
│       ├── blog-entries.json            # списочные карточки для /blog (11 записей)
│       ├── brands.json                  # 37 брендов с priceFrom
│       └── sevenforce-parsed.json       # 4306 цен чип-тюнинга
├── public/
│   └── images/
│       ├── works/                       # старые фоновые фото + 10 реальных webp
│       └── projects/
│           ├── porsche-macan-s-helix/   # 5 реальных фото Macan
│           ├── range-rover-sport-full-complex/  # 3 реальных фото Range Rover
│           ├── skoda-kodiaq-pdr/        # 3 реальных фото Skoda
│           └── dodge-challenger-ta/     # фото Dodge
├── next.config.mjs
├── ecosystem.config.cjs
└── package.json
```

### 🎯 Чего я жду от тебя в начале сессии

1. Подтверди, что прочёл этот промпт и в курсе всех нюансов
2. Спроси меня, какую задачу берём в работу сегодня
3. Не лезь в код без согласования крупных правок
4. Если нужны команды на сервере — давай их **готовыми к копипасту**, одной строкой, с явными путями
5. Помни про пароль `7545` и не путай домены (`hptuning.ru`, не `hptuning-spb.ru`)
6. Если работаешь с фото — складывай в `next/public/images/projects/<slug>/` с осмысленными именами (`01-описание.jpg`, `02-...`)

Жду команды. 🚀

## 📌 КОНЕЦ ПРОМПТА ↑

---

## 📝 История правок этого файла

- **2026-05-19** — Чистка фейк-кейсов:
  - Удалены 10 фейк-кейсов из блога + зомби BMW X5 из 3 файлов кода
  - Добавлены реальные фото Skoda Kodiaq PDR (3 шт)
  - Обновлён TODO с косметикой обложек разделов
  - Добавлены нюансы про `DownloadFileWrapper`, протухание GitHub-токена, структуру blog-данных
- **2026-05-18** — Полный rewrite после двух смен:
  - Закрыли Task E (кнопка калькулятора на страницах услуг)
  - Закрыли Task F (реальные фото Macan + Range Rover)
  - Устранили дубль клонов (удалена песочница `/root/Documents/projects/hp/`)
  - Зафиксировали PM2 на правильной папке с явным `--cwd`
