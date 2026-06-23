# HP Тюнинг — Next.js 14 (next-migration branch)

Сайт чип-тюнинга и детейлинга в Санкт-Петербурге.  
**Домен:** https://hptuning.ru  
**Ветка:** `next-migration` → не трогаем `main` (там живой статический сайт на Netlify)

---

## Требования

- Node.js **v20 LTS** (рекомендуется через `nvm`)
- npm ≥ 10
- macOS / Linux (Windows — через WSL2)

---

## Быстрый старт (Mac + VS Code)

```bash
# 1. Установить nvm (если ещё нет)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc   # или ~/.bashrc

# 2. Установить Node 20 и переключиться
nvm install 20
nvm use 20

# 3. Клонировать репозиторий и перейти на ветку
git clone https://github.com/nstspas-del/hp.git
cd hp/next
git checkout next-migration

# 4. Установить зависимости
npm install

# 5. Скопировать переменные окружения
cp .env.example .env.local
# Откройте .env.local и при необходимости укажите ваш YM_COUNTER_ID

# 6. Запустить dev-сервер
npm run dev
```

Открыть в браузере: http://localhost:3000

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер с hot reload |
| `npm run build` | Production-сборка |
| `npm run postbuild` | Генерация sitemap.xml + robots.txt |
| `npm run start` | Запуск production-сборки |
| `npm run typecheck` | Проверка TypeScript без сборки |
| `npm run lint` | ESLint |

---

## Структура проекта

```
next/
├── public/
│   ├── fonts/          # Self-hosted Inter & Bebas Neue (.woff2)
│   └── images/
│       └── brands/     # Логотипы брендов (заглушки, заменить позже)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: Header, Footer, Metrika, Schema.org
│   │   ├── page.tsx            # Главная: Hero, Services, Brands, FAQ, CTA
│   │   ├── brands/
│   │   │   ├── page.tsx        # Список всех 13 брендов
│   │   │   └── [brand]/
│   │   │       └── page.tsx    # Динамические страницы брендов (generateStaticParams)
│   │   ├── contacts/page.tsx   # Контакты + Яндекс.Карта
│   │   ├── privacy/page.tsx    # Политика конфиденциальности
│   │   └── cookies/page.tsx    # Политика cookie
│   ├── components/
│   │   ├── analytics/
│   │   │   └── YandexMetrika.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Навигация с dropdown, mobile menu
│   │   │   ├── Footer.tsx
│   │   │   └── CookieBanner.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── BrandsSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   └── CtaSection.tsx
│   │   └── ui/
│   │       └── BookingButton.tsx  # Client component для AutoDealer
│   ├── data/
│   │   ├── company.json     # ИНН, адрес, телефон, AutoDealer key, ЯМ цели
│   │   ├── brands.json      # 13 брендов с SEO, моделями, ценами
│   │   ├── services.json    # 20+ услуг (чип-тюнинг, детейлинг, сервис)
│   │   ├── seo.json         # Мета-данные, FAQ, приоритеты страниц
│   │   └── districts.json   # 15 районов СПб для гиперлокальных страниц
│   ├── lib/
│   │   └── autodealer.ts    # initAutoDealer(), openBooking()
│   └── types/               # TypeScript типы
├── .env.example             # Шаблон переменных окружения
├── next.config.mjs          # Редиректы, заголовки, next/image настройки
├── next-sitemap.config.js   # Генерация sitemap.xml
├── tailwind.config.ts       # Дизайн-токены: bg, accent, text, border
└── tsconfig.json
```

---

## Дизайн-система

| Токен | Значение |
|---|---|
| `bg.DEFAULT` | `#09090b` (основной фон) |
| `bg.elevated` | `#111113` |
| `bg.card` | `#18181b` |
| `accent.DEFAULT` | `#39FF14` (нeon-green) |
| `accent.hover` | `#2ee00f` |
| `text.DEFAULT` | `#fafafa` |
| `text.muted` | `#a1a1aa` |
| Шрифты | Inter (текст), Bebas Neue (заголовки) |

**Запрещено:** золотые/жёлтые акценты, Google Fonts CDN, WhatsApp/Instagram.

---

## Переменные окружения

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_YM_COUNTER_ID` | ID счётчика Яндекс.Метрика (сейчас: 99999999) |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Код верификации Яндекс.Вебмастер |
| `NEXT_PUBLIC_SITE_URL` | URL сайта (https://hptuning.ru) |

---

## Что нужно заменить перед деплоем

1. `NEXT_PUBLIC_YM_COUNTER_ID=99999999` → реальный ID из Яндекс.Метрика
2. `NEXT_PUBLIC_YANDEX_VERIFICATION` → код из Яндекс.Вебмастер
3. Логотипы в `public/images/brands/{slug}/` (сейчас заглушки)
4. Координаты Яндекс.Карты в `/contacts` (текущие: 60.096423, 30.304163)
5. Фотографии команды/гаража в `/public/images/`

---

## Sprint 2 (следующие задачи)

- [ ] Страницы услуг: `/services/chip-tuning/stage-1` … `stage-3`, `/services/detailing`, `/services/service`
- [ ] Портфолио `/works` (20-30 кейсов)
- [ ] Блог `/blog` (15-20 статей, категории)
- [ ] Гиперлокальные страницы `/locations/[district]` (15 районов СПб)
- [ ] Страница `/about` и `/reviews`
- [ ] Подключить реальные фото через `next/image`
- [ ] Lighthouse: Performance ≥ 90, SEO = 100

---

## Деплой на Selectel (production)

```bash
npm run build

# Содержимое .next/ + public/ → Nginx на VDS Selectel
# Конфиг Nginx: /site/nginx.conf (в корне репо)
```

**Верcel preview:** `vercel --prod` (после подключения репо)

---

## Контакты проекта

- Клиент: ИП Шпрыгин Павел Александрович
- Маркетинг: Настя
- Телефон: +7 (981) 842-81-51
- Email: info@hptuning.ru
- Сайт: https://hptuning.ru
