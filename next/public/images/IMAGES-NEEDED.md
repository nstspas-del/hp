# 📸 Нужные изображения — HP Тюнинг

## Статус: ⏳ Ожидают загрузки

Все изображения должны быть в формате **WebP** (или JPG как резерв).
После добавления — задеплоить через `npm run build`.

---

## 1. Hero (главный баннер) — `public/images/hero/`

| Файл | Размер | Описание |
|------|--------|----------|
| `hero-bg.webp` | 1920×1080 | Фоновое фото: тёмный гараж с подсветкой, BMW/Porsche на подъёмнике |
| `hero-car.webp` | 800×600 | Крупный план автомобиля — можно из твоих 10 фото |

**Из твоих фото подойдут:** любое красивое фото авто из переданных 10.

---

## 2. OG-изображение — `public/images/og/`

| Файл | Размер | Описание |
|------|--------|----------|
| `og-image.jpg` | 1200×630 | Логотип + авто + текст "HP Тюнинг — чип-тюнинг в СПб" |

---

## 3. Бренды — `public/images/brands/{slug}/`

По одному фото на каждый бренд (характерный авто или логотип крупно).

| Папка | Файл | Что нужно |
|-------|------|-----------|
| `bmw/` | `hero.webp` | BMW M3/M5 сбоку |
| `mercedes/` | `hero.webp` | Mercedes AMG сбоку |
| `audi/` | `hero.webp` | Audi RS сбоку |
| `porsche/` | `hero.webp` | Porsche 911/Cayenne |
| `lexus/` | `hero.webp` | Lexus IS/GS |
| `land-rover/` | `hero.webp` | Range Rover/Defender |
| `volvo/` | `hero.webp` | Volvo XC90 |
| `volkswagen/` | `hero.webp` | VW Golf GTI/Touareg |
| `jaguar/` | `hero.webp` | Jaguar F-Pace/XF |
| `genesis/` | `hero.webp` | Genesis GV80 |
| `toyota/` | `hero.webp` | Toyota LC/Supra |
| `kia/` | `hero.webp` | Kia Stinger/Sportage |
| `nissan/` | `hero.webp` | Nissan GTR/X-Trail |

---

## 4. Портфолио (/works) — `public/images/works/`

| Файл | Описание |
|------|----------|
| `bmw-m3-chip.webp` | BMW M3 после чип-тюнинга (переданные фото!) |
| `mercedes-amg-stage2.webp` | Mercedes AMG Stage 2 |
| `porsche-ceramic.webp` | Porsche в процессе нанесения керамики |
| `audi-rs6-ppf.webp` | Audi RS6 с PPF плёнкой |
| `lexus-is-chip.webp` | Lexus IS чип-тюнинг |
| `land-rover-service.webp` | Range Rover на сервисе |

**Из твоих 10 фото — используй ВСЕ, которые есть! Назови по схеме: `{марка}-{услуга}.webp`**

---

## 5. Услуги — `public/images/services/`

| Папка | Файл | Описание |
|-------|------|----------|
| `chip-tuning/` | `dyno.webp` | Стенд для прошивки / ноутбук + авто |
| `detailing/` | `ceramic.webp` | Нанесение керамики — руки в перчатках + поверхность |
| `service/` | `diagnostics.webp` | Компьютерная диагностика — экран с данными |

---

## 🚀 Как добавить файлы

1. Переименуй файлы согласно таблице выше
2. Скопируй в нужную папку через `git`
3. Запусти `cd hp/next && npm run build`
4. Коммит: `git add public/images/ && git commit -m "images: добавлены реальные фото"`

---

## 📋 Из твоих 10 переданных фото — план использования

> Настя, скинь пожалуйста описание что на каждом фото (или названия файлов) —
> расставлю по папкам точечно. Пока создана структура под всё.

**Предположительный план** (исходя из типичного контента тюнинг-ателье):
- Фото с авто на подъёмнике → `works/` + `hero-bg.webp`
- Фото с процессом чип-тюнинга (ноутбук/оборудование) → `services/chip-tuning/dyno.webp`
- Фото детейлинга → `services/detailing/ceramic.webp`
- Фото конкретного авто (BMW/Porsche и т.д.) → `brands/{slug}/hero.webp`
