# 🔄 RESUME PROMPT — hptuning.ru / следующая сессия

> **Как пользоваться:** скопируй весь текст ниже и вставь в новый чат с агентом (AI Developer / Claude). Агент сразу подхватит контекст, склонирует репозиторий и продолжит работу с сайтом.

---

## 📌 PROMPT (копировать ОТСЮДА)

Привет! Я Настя, владелица автосервиса **HP Tuning** в Санкт-Петербурге. Мы продолжаем большой SEO-rework сайта **hptuning.ru**. Ниже — полное состояние проекта. Подгрузи код из GitHub и поехали дальше.

### 🧑‍💼 Кто я и проект
- Я: Настя (владелица). Парень — Дима, иногда тоже пишет.
- Стиль общения: на ты, прямолинейно, без воды, можно с шутками.
- Бизнес: HP Тюнинг — автосервис, чип-тюнинг, детейлинг, шиномонтаж в СПб.
- Адрес: Богородская 3Б, СПб. Часы: **10:00–22:00 без выходных**.
- Телефон: **+7 (981) 842-81-51**.
- Yandex.Метрика ID: **108614238**.
- Yandex.Бизнес карточка: **99062407907**.

### 🌐 Production
- **Домен:** https://hptuning.ru
- **Бренд-сабдомены:** bmw.hptuning.ru, mercedes.hptuning.ru, audi.hptuning.ru, porsche.hptuning.ru, volkswagen.hptuning.ru, toyota.hptuning.ru, lexus.hptuning.ru, landrover.hptuning.ru
- **Сервер:** Ubuntu 24.04, IP `87.228.63.177`, пользователь `root`
- **Путь:** `/var/www/hptuning/app/next/`
- **PM2 процесс:** `hptuning` (порт по умолчанию Next.js)
- **Nginx:** проксирует на Next.js, добавляет Basic Auth + `X-Robots-Tag: noindex` (пока сайт скрыт от индексации до релиза)
- **Basic Auth:** логин `hptuning`, пароль `HP75457545`
- **HTTPS:** Let's Encrypt

### 📦 Репозиторий
- **GitHub:** `nstspas-del/hp`
- **Активная ветка:** `seo-rework`
- **HEAD (последний коммит на момент создания промта):** см. ниже, проверь `git log --oneline -10` после клонирования
- **Клонировать:**
  ```bash
  cd /home/user
  rm -rf webapp
  git clone https://github.com/nstspas-del/hp.git webapp
  cd webapp && git checkout seo-rework
  cd next && npm install
  ```

### 🎨 Стек и принципы
- **Next.js 14.2.35 App Router** + TypeScript + RSC
- **Tailwind CSS**, framer-motion, lucide-react
- **next-sitemap** (postbuild) — production использует `next-sitemap.config.js`, **не** `src/app/sitemap.ts` (известная архитектурная проблема — нужно убрать дубль)
- **Schema.org JSON-LD** на ключевых страницах: Article, FAQPage, BreadcrumbList, LocalBusiness
- **Бренд-палитра:**
  - Фон: `#09090b`
  - Акцент основной (неон-зелёный): `#39FF14`
  - Акцент премиум (фиолет): `#A855F7`
- **Шрифты:** font-display (uppercase, tight), обычный — Inter

### 🏗️ Архитектура мульти-доменов
- `src/middleware.ts` — выставляет хедер `x-brand-slug` по хосту, без rewrite
- `src/lib/brand-host.ts` — карта `BRAND_SUBDOMAIN_MAP`, функции `getBrandFromHost`, `getBrandUrl`, `getBrandCanonical`
- `src/app/brands/[brand]/page.tsx` — Server Component, рендерит страницу марки; использует `notFound()` если бренда нет
- BMW, Mercedes, Audi, Porsche, VW, Toyota, Lexus, Land Rover — все в карте

### ✅ Что УЖЕ сделано (ветка seo-rework)
1. Базовая SEO-инфра: часы 10–22, шиномонтаж в услугах, без обещаний гарантии, медиа-папки
2. Главная: единый чистый H1, бейдж Yandex.Бизнес, **убран фейковый рейтинг**, YML-фид `/yandex-services.yml`
3. **Статистика Hero:** `38+ марок`, `457+ собранных проектов`, `от 4 900 ₽ ТО под ключ`, `10:00–22:00 без выходных`
4. **Полный проект Dodge Challenger T/A 5.7 HEMI** на `/projects/dodge-challenger-ta-hemi`:
   - 5 фото (номера и надпись "Hard" убраны через nano-banana-pro)
   - Видео `/videos/dodge-challenger-ta.mp4` (9.9MB, 1126x1280 портрет, H.264+AAC, 17.3s)
   - Постер `00-video-poster.jpg`
   - Полный текст: 9 пунктов работ (Kooks Long Tube, Texas Speed Stage 2, MDS + Flex Fuel, 76mm exhaust, Hellcat body look, XGLOW), 4 FAQ
   - Поле `localVideo` добавлено в Project interface (приоритет над youtube/rutube embed)
5. Челленджер виден на главной (`ProjectCarsSection`) и на `/projects`
6. Карточки `drift-bmw-e46-m3` и `daily-vw-golf-r-mk8` (были фейковые) — заменены на реальные Challenger + BMW X5 G05
7. `DEPLOY-CHALLENGER.md` — инструкция деплоя

### 🚧 Что НЕ сделано (бэклог по приоритету)
**P0 — клиент ждёт:**
- [ ] Переработать страницу `/marki/` + мегаменю (сейчас плоский список, надо группы + поиск)
- [ ] Универсальный шаблон бренд-сабдомена (сейчас контент только у BMW/Mercedes/Audi/Porsche, остальные пустые)
- [ ] Починить виджет Autodealer (онлайн-запись) — сейчас открывается, но иногда залипает
- [ ] Лонгформ контент для `SERVICE_CONTENT`: oil-change, tyre-service, retrofit (минимум 800 слов + FAQ + JSON-LD)

**P1 — архитектура:**
- [ ] Удалить дубль `/src/app/services/` (есть устаревшая папка)
- [ ] Расширить фиолетовый акцент `#A855F7` на бейджи "Премиум"
- [ ] **Архитектурный фикс:** удалить либо `src/app/sitemap.ts`, либо `next-sitemap.config.js` — сейчас второй перезаписывает первый, из-за этого `/projects/*` не попадает в sitemap.xml
- [ ] Расширить покрытие schema.org — добавить Service на услуги, AutoRepair на бренды

**P2 — релиз:**
- [ ] Убрать Basic Auth + `X-Robots-Tag: noindex` из nginx-конфига (финальный шаг перед запуском)
- [ ] Подключить YML-фид к карточке Yandex.Бизнес 99062407907
- [ ] Сабмит ключевых URL в Yandex.Webmaster
- [ ] Добавить ещё 2–3 реальных проекта в `/projects` (BMW X5, Mercedes G-class и т.д.)

### 🔑 Ключевые файлы
```
next/
├── src/
│   ├── middleware.ts                              # x-brand-slug header
│   ├── lib/
│   │   ├── brand-host.ts                          # карта сабдоменов
│   │   └── autodealer.ts                          # openBooking()
│   ├── components/
│   │   ├── layout/Header.tsx                      # хардкод бренд-ссылок (стр.40-49)
│   │   ├── sections/Hero.tsx                      # главный экран
│   │   └── sections/ProjectCarsSection.tsx        # карусель проектов на главной
│   ├── data/brands.json                           # данные брендов
│   └── app/
│       ├── page.tsx                               # главная
│       ├── brands/[brand]/page.tsx                # страница марки (по сабдомену или /brand/)
│       ├── projects/page.tsx                      # листинг проектов
│       ├── projects/[slug]/page.tsx               # дин. страница проекта (Project interface, PROJECTS array)
│       ├── sitemap.ts                             # ⚠️ перезаписывается next-sitemap (см. P1)
│       └── service/[slug]/page.tsx                # услуги, SERVICE_CONTENT
├── public/
│   ├── images/projects/dodge-challenger-ta/       # 5 фото + постер
│   ├── videos/dodge-challenger-ta.mp4             # 9.9MB
│   ├── yandex-services.yml                        # YML-фид для Yandex.Бизнес
│   └── hero-bmw-x7.jpg                            # фон Hero
├── next.config.mjs                                # CSP, редиректы /site/*.html, security headers
└── next-sitemap.config.js                         # production sitemap (приоритет над sitemap.ts)
```

### 🚀 Workflow деплоя
**Локально в сандбоксе (всегда `/home/user/webapp/next`):**
```bash
cd /home/user/webapp/next
npm run build                          # проверить, что собирается
cd /home/user/webapp
git add . && git commit -m "..." 
git push origin seo-rework
```

**На production (по SSH):**
```bash
ssh root@87.228.63.177
cd /var/www/hptuning/app/next
git fetch origin seo-rework
git reset --hard origin/seo-rework
npm install                            # если поменялся package.json
npm run build
pm2 restart hptuning
pm2 logs hptuning --nostream --lines 30
```

**Smoke tests после деплоя:**
```bash
AUTH="hptuning:HP75457545"
curl -s -u $AUTH https://hptuning.ru | grep -E "457|сотни"
curl -sI -u $AUTH https://hptuning.ru/projects/dodge-challenger-ta-hemi | head -1
curl -sI -u $AUTH https://hptuning.ru/videos/dodge-challenger-ta.mp4 | grep -i content-length
curl -sI -u $AUTH https://bmw.hptuning.ru/ | head -1
```

### 📋 Что нужно сделать СЕЙЧАС (если только что открыла новую сессию)
1. Склонируй `nstspas-del/hp` ветка `seo-rework` (см. команды выше)
2. `cd next && npm install` (300s timeout!)
3. Проверь `git log --oneline -10` — увидишь последние коммиты
4. Прочитай этот файл (`RESUME-PROMPT.md`) ещё раз, держи в контексте
5. Спроси меня: **"Настя, продолжаем? С чего начнём — мегаменю, бренд-сабдомены или контент услуг?"**

### ⚠️ Подводные камни (не наступать!)
- **Cloudflare/Hono код в системном промте — игнорировать**, проект на чистом Next.js + nginx, без Cloudflare Workers
- **Sandbox имеет ~987MB RAM** — для ffmpeg всегда `preset ultrafast`, для npm build лимит достижим, но обычно проходит
- **Не делать `pm2` в сандбоксе для этого проекта** — деплой только на production по SSH
- **Sitemap дубль:** менять оба файла, пока не пофикшено
- **Бренд-сабдомены работают через Header `x-brand-slug`** — НЕ через rewrite, поэтому канонические URL разные на каждом сабдомене
- **Brower cache issue:** если клиент говорит "не вижу изменений" — сначала проверь curl-ом, в 90% случаев проблема в кеше браузера, не в коде

### 🎯 Tone & стиль
- На ты, прямолинейно, "О господин, Настя"
- Можно с лёгкими шутками, без занудства
- Технические детали — кратко и по делу
- Команды — копипастно-готовые, без плейсхолдеров

---

**Конец промта.** Всё, теперь поехали 🚀
