# 🚀 Деплой ветки `seo-rework` на боевой сервер

> Источник правды: `/var/www/hptuning/app/next/`
> Репозиторий: `github.com/nstspas-del/hp` (ветка `next-migration` — прод, `seo-rework` — текущие изменения)
> PM2 процесс: `hptuning` (порт 3000)

---

## ✅ Что уже сделано в ветке `seo-rework`

### Коммит 1: `57be086` — Базовая инфраструктура
- Часы по всему сайту: **10:00–22:00, без выходных** (15 файлов)
- Услуга **Шиномонтаж** (`/service/tyre-service`, от 2 500 ₽)
- Услуга **Замена масла** (`/service/oil-change`, от 2 500 ₽)
- Услуга **Дооснащение / retrofit** (`/service/retrofit`, от 8 000 ₽)
- Убраны все обещания типа «гарантия 1 год / 6 месяцев на работы» (заменены на «письменный акт», «оригинал или OEM»)
- Структура медиа: `public/images/{og,hero,services,detailing,projects,workshop}/`, `public/videos/`
- Скрипт `scripts/rename-media-for-seo.sh` для Mac — переименование файлов из AI Drive

### Коммит 2: `92dc900` — Главная + Яндекс.Бизнес
- **Hero**: единый чистый H1, убраны «10+ лет опыта» и «500+ авто» (фейк), добавлен реальный iframe-бейдж Яндекс.Бизнес (id 99062407907)
- **Schema.org**: удалён фейковый `aggregateRating 4.9/247` из LocalBusiness и `5.0/8` из reviewsSchema. Реальный рейтинг подтянется автоматически из Яндекс.Бизнес.
- **Title главной**: 92 → 62 символа; description: 246 → 178 (помещается в Яндекс-сниппет)
- **BreadcrumbList JSON-LD** на главной
- **Tailwind**: цветовой токен `premium` (#A855F7) для точечного purple-акцента (пока используется только на hover «Смотреть все 38 марок»)
- **YML-фид для Яндекс.Бизнес**: `https://hptuning.ru/yandex-services.yml` (11 КБ XML, 10 услуг, 7 категорий, revalidate=1h)
- **Schema.org Service** на каждой услуге унифицирован с `yandex-services.json`
- **scripts/export-yandex-xlsx.js** — экспорт услуг в Excel для импорта в Яндекс.Бизнес
- **sitemap.ts** очищен от редиректных `/services/*`

### Сборка
- ✅ `npx tsc --noEmit` — без ошибок
- ✅ `npm run build` — все 10 услуг `/service/[slug]` сгенерированы, `/yandex-services.yml` отдаёт корректный XML
- ✅ `next-sitemap` postbuild прошёл

---

## 📦 Шаг 1: Загрузить медиа с AI Drive (Mac)

> AI Drive: https://www.genspark.ai/aidrive/shared/5d72a937-c8d3-48ef-bb20-3fffc70f9e69 (21 файл)

```bash
# 1. Скачайте файлы с AI Drive в одну папку, например ~/Downloads/hp-media
cd ~/Downloads/hp-media

# 2. Запустите скрипт переименования (он создаст подпапку renamed/)
bash /путь/к/локальному/клону/next/scripts/rename-media-for-seo.sh

# 3. Откройте папку renamed/ — внутри уже нужная структура.
#    Имена файлов в скрипте подобраны под манифест.
#    Если имена в AI Drive отличаются — отредактируйте scripts/rename-media-for-seo.sh
#    (строки copy_if_missing "ORIGINAL_NAME" "renamed/CATEGORY/seo-name.jpg")
```

### Шаг 1.5: Загрузить медиа на сервер
```bash
# С Mac → на сервер
scp -r ~/Downloads/hp-media/renamed/hero/*       user@hp-server:/var/www/hptuning/app/next/public/images/hero/
scp -r ~/Downloads/hp-media/renamed/og/*         user@hp-server:/var/www/hptuning/app/next/public/images/og/
scp -r ~/Downloads/hp-media/renamed/services/*   user@hp-server:/var/www/hptuning/app/next/public/images/services/
scp -r ~/Downloads/hp-media/renamed/detailing/*  user@hp-server:/var/www/hptuning/app/next/public/images/detailing/
scp -r ~/Downloads/hp-media/renamed/projects/*   user@hp-server:/var/www/hptuning/app/next/public/images/projects/
scp -r ~/Downloads/hp-media/renamed/workshop/*   user@hp-server:/var/www/hptuning/app/next/public/images/workshop/
scp -r ~/Downloads/hp-media/renamed/videos/*     user@hp-server:/var/www/hptuning/app/next/public/videos/
```

---

## 🔧 Шаг 2: Деплой кода на сервер

> Сначала **проверяем preview-ветку**, потом мержим в `next-migration` (прод).

```bash
ssh user@hp-server
cd /var/www/hptuning/app/next

# 1. Подтянуть свежий код из GitHub
git fetch origin
git checkout seo-rework
git pull origin seo-rework

# 2. Установить deps (если изменился package.json — в этой ветке не менялся)
# npm ci

# 3. Собрать production-билд
npm run build

# 4. Проверить что билд успешен (должно быть "Generating static pages...")
ls -la .next/server/app/yandex-services.yml.body  # должен существовать
ls -la .next/server/app/service/tyre-service.html # должен существовать

# 5. Перезапустить PM2
pm2 restart hptuning
pm2 status hptuning
pm2 logs hptuning --nostream --lines 30
```

---

## ✅ Шаг 3: Smoke-тесты на боевом

```bash
# Эти команды надо запустить с правильным Basic Auth (если ещё стоит)
AUTH="hptuning:HP75457545"

# 1. Главная — title должен быть короче 70 символов
curl -s -u $AUTH https://hptuning.ru/ | grep -oP '<title>.*?</title>' | head -1

# 2. Описание главной без фейкового телефона ☎
curl -s -u $AUTH https://hptuning.ru/ | grep -oP 'name="description" content="[^"]+"' | head -1

# 3. Никаких 'aggregateRating' в Schema.org главной
curl -s -u $AUTH https://hptuning.ru/ | grep -c 'aggregateRating'  # должно быть 0

# 4. /service/tyre-service отдаёт страницу с шиномонтажом
curl -s -u $AUTH https://hptuning.ru/service/tyre-service | grep -c 'Шиномонтаж'  # должно быть ≥1

# 5. YML-фид отдаёт корректный XML
curl -s -u $AUTH https://hptuning.ru/yandex-services.yml | head -20

# 6. Сайт честно говорит про часы 10–22
curl -s -u $AUTH https://hptuning.ru/contacts | grep -c '10:00.22:00'  # должно быть ≥1
```

---

## 🌟 Шаг 4: Подключить YML-фид к Яндекс.Бизнес

1. Зайти в **Яндекс.Бизнес** → карточка `99062407907` (HP Тюнинг).
2. **Услуги** → **Импорт услуг** → **YML-фид**.
3. URL фида: `https://hptuning.ru/yandex-services.yml`
4. Нажать «Синхронизировать». Яндекс подтянет 10 услуг с правильными ценами/категориями/картинками.

**Альтернатива (если YML не примут):** XLSX-импорт.
```bash
cd /var/www/hptuning/app/next
npm install xlsx --save-dev
node scripts/export-yandex-xlsx.js
# → out/yandex-services.xlsx — загрузить в Яндекс.Бизнес вручную
```

---

## 🔓 Шаг 5: Снять Basic Auth + noindex (когда всё проверено)

```bash
ssh user@hp-server
sudo nano /etc/nginx/sites-enabled/hptuning.ru
# 1. Удалить auth_basic + auth_basic_user_file (или закомментировать)
# 2. Удалить add_header X-Robots-Tag "noindex, nofollow" (или раскомментировать обратное)
sudo nginx -t
sudo systemctl reload nginx
```

После этого:
1. **Яндекс.Вебмастер** → «Переобход» → отправить главную, /yandex-services.yml, ключевые /service/* URL.
2. **Google Search Console** → submit sitemap https://hptuning.ru/sitemap.xml.

---

## 🎯 Что в этой ветке **НЕ** сделано (на следующие итерации)

- [ ] Audi-тип переделки страниц `/marki/` + мега-меню в Header
- [ ] Универсальный шаблон для брендовых субдоменов (`bmw.`, `mercedes.`, `porsche.`)
- [ ] Диагностика и фикс виджета Autodealer
- [ ] Создание отдельных страниц с лонг-формами для приоритетных услуг (oil-change, tyre-service, retrofit) — сейчас они работают через универсальный `<ServicePage>`, но без расширенного `SERVICE_CONTENT`
- [ ] Удаление дубликата `/src/app/services/` (после проверки, что все редиректы работают)
- [ ] Расширение purple-акцента на бейджи Premium в карточках
- [ ] Видеосекция через RuTube — проверить плеер

---

## 📞 Помощь

Если что-то не запустилось:
```bash
pm2 logs hptuning --nostream --lines 100
journalctl -u nginx --since "5 min ago" --no-pager | tail -50
```

Все правки в этом коммите **обратимы** — можно откатить через:
```bash
ssh user@hp-server
cd /var/www/hptuning/app/next
git checkout next-migration
npm run build
pm2 restart hptuning
```
