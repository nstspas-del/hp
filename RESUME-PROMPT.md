# 🔄 RESUME PROMPT — hptuning.ru (актуально на 2026-05-18)

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

⚠️ **ВАЖНО — никаких других путей не существует!** Раньше на сервере было два клона: `/root/Documents/projects/hp/` и `/var/www/hptuning/app/`. **Песочница `/root/Documents/projects/hp/` УДАЛЕНА 2026-05-18.** Деплой ТОЛЬКО в `/var/www/hptuning/app/`.

### 📦 GitHub

- **Репозиторий:** https://github.com/nstspas-del/hp.git
- **Рабочая ветка:** `seo-rework` (всё пушим сюда, `main` не трогаем)
- **Последний коммит на 2026-05-18:** `fe8b0ea` — «feat(blog): реальные фото Porsche Macan S и Range Rover Sport»

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

### 🧪 Контрольные curl-ы после деплоя

```bash
curl -s -o /dev/null -w "Главная: HTTP %{http_code}\n" -u hptuning:7545 https://hptuning.ru/
curl -s -o /dev/null -w "Macan hero: HTTP %{http_code} | %{size_download} bytes\n" -u hptuning:7545 https://hptuning.ru/images/projects/porsche-macan-s-helix/05-hood-open-garage.jpg
curl -s -o /dev/null -w "Range Rover hero: HTTP %{http_code} | %{size_download} bytes\n" -u hptuning:7545 https://hptuning.ru/images/projects/range-rover-sport-full-complex/02-front-headlight.jpg
```

Ожидаемо все три — `HTTP 200`. Размеры фото: 342546 и 115284 байт соответственно.

### ⚙️ PM2 — текущая правильная конфигурация

```bash
# Если PM2 потеряется или процесс умрёт — пересоздать ровно так:
pm2 delete hptuning 2>/dev/null
cd /var/www/hptuning/app/next
pm2 start npm --name hptuning --cwd /var/www/hptuning/app/next -- start -- -p 3000 -H 127.0.0.1
pm2 save
```

**КРИТИЧНО:** `--cwd /var/www/hptuning/app/next` — обязательно. Без него PM2 наследует cwd из текущей сессии bash, и Next.js не найдёт свой `.next/` билд.

### ✅ Что уже сделано (свежие коммиты)

| Коммит | Что |
|---|---|
| `fe8b0ea` | 8 реальных фото от заказчика: Porsche Macan S × 5 (кейс акустики Helix B) + Range Rover Sport × 3 (кейс полной детейлинг-комплекс). Обновлены `blog-posts.json` и `blog-entries.json`. |
| `d70145f` | Кнопка «Рассчитать стоимость» на каждой странице детейлинг-услуги (`/detailing/[service]`), ведёт прямо на нужный таб калькулятора (`/detailing?tab=ppf#detailing-calculator` и т.д.). Реализовано через `useEffect` + `URLSearchParams` в `DetailingCalculator.tsx`. |
| `08bbce5` | Убраны 308-редиректы webp из `next.config.mjs` — реальные файлы существуют. |
| `bdba8ed` | Созданы 10 реальных `.webp` файлов через ImageMagick для битых ссылок (BMW M3, BMW 5 ceramic, BMW X5M stage2, Mercedes AMG, Mercedes GLE PPF, Porsche Cayenne, Audi RS6, Volvo XC90, Land Rover Defender, Subaru WRX). |
| `c7f93d9` | Цены `priceFrom` для 37 брендов в `brands.json` пересчитаны от минимума Stage 1 в `sevenforce-parsed.json` × 0.70 ↑500. |
| `1af4592` | Все **4306 цен чип-тюнинга** в `sevenforce-parsed.json` пересчитаны × 0.70 ↑500. |

### 🔥 Возможные следующие задачи

- **Skoda Kodiaq PDR** — заменить фото в посте `skoda-kodiaq-pdr-vmyatina` (Настя обещала прислать оригиналы)
- **Yandex.Бизнес** (карточка `99062407907`) — перенести ещё кейсы с реальными фото
- **Аудит безопасности:** `npm audit` показывает 2 уязвимости (1 moderate, 1 high) в dev-зависимостях — посмотреть, что чинить безопасно
- **Снять stage-защиту** перед публичным релизом: убрать basic auth в nginx + убрать `X-Robots-Tag: noindex` + добавить `seo-rework` → `main`
- **Brand-сабдомены:** проверить, что все 8 (bmw, mercedes, audi, porsche, vw, toyota, lexus, landrover) ведут на правильные страницы каталога

### 🧠 Поведенческие нюансы (важно!)

1. **Не путать пути.** Сегодня (2026-05-18) я весь день деплоил в `/root/Documents/projects/hp/`, а реально PM2 запускался из `/var/www/hptuning/app/next/` — потеряли час. Теперь только **`/var/www/hptuning/app/`**, точка.
2. **Песочница Claude (`/home/user/webapp/`)** — это для пробных правок и подготовки коммитов. Реальные изменения идут на прод через `git push origin seo-rework` + ручной деплой на сервере.
3. **Логи PM2 буферизуются** — если что-то не так, всегда `pm2 flush hptuning` после рестарта.
4. **`next/image` оптимизатор** обходит nginx-редиректы. Если картинка 404 — создавать реальный файл в `public/`, а не редирект.
5. **`pm2 save` обязателен** после каждого изменения PM2-конфига, иначе после ребута сервера всё разъедется.

### 📁 Структура `next/`

```
next/
├── src/
│   ├── app/                          # App Router pages
│   ├── components/
│   │   ├── sections/
│   │   │   └── DetailingCalculator.tsx  # читает ?tab= из URL
│   │   └── ui/
│   │       └── ServicePage.tsx          # кнопка «Рассчитать стоимость»
│   └── data/
│       ├── blog-posts.json              # полные тексты постов
│       ├── blog-entries.json            # списочные карточки для /blog
│       ├── brands.json                  # 37 брендов с priceFrom
│       └── sevenforce-parsed.json       # 4306 цен чип-тюнинга
├── public/
│   └── images/
│       ├── works/                       # старые фоновые фото + 10 реальных webp
│       └── projects/
│           ├── porsche-macan-s-helix/   # 5 реальных фото Macan
│           ├── range-rover-sport-full-complex/  # 3 реальных фото Range Rover
│           └── dodge-challenger-ta/
├── next.config.mjs
├── ecosystem.config.cjs
└── package.json
```

### 🎯 Чего я жду от тебя в начале сессии

1. Подтверди, что прочёл этот промпт и в курсе всех нюансов
2. Спроси меня, какую задачу берём в работу сегодня
3. Не лезь в код без согласования крупных правок
4. Если нужны команды на сервере — давай их **готовыми к копипасту**, одной строкой, с явными путями
5. Помни про два пароля и не путай домены (`hptuning.ru`, не `hptuning-spb.ru`)

Жду команды. 🚀

## 📌 КОНЕЦ ПРОМПТА ↑

---

## 📝 История правок этого файла

- **2026-05-18** — полный rewrite после смены, в которой:
  - закрыли Task E (кнопка калькулятора на страницах услуг)
  - закрыли Task F (реальные фото Macan + Range Rover)
  - устранили дубль клонов (удалена песочница `/root/Documents/projects/hp/`)
  - зафиксировали PM2 на правильной папке с явным `--cwd`
