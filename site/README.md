# HP Тюнинг — Премиальный автосервис и тюнинг-ателье в Санкт-Петербурге

**URL:** https://hp-tuning.ru  
**Дата последнего обновления:** 2026-04-11

---

## ✅ Реализованные функции

### Навигация (обновлено 2026-04-11)
- Новый порядок: Главная → Тюнинг → **Автосервис** → **Детейлинг** → Портфолио → Контакты
- Вкладка «Марки» убрана из шапки (дубль)
- Одинаковая навигация на всех 20+ страницах

### Главная страница (`index.html`)
- Hero-секция с фоновым видео (Platinum Garage стиль) + fallback-постер
- Блок статистики: 3000+ проектов, 10+ лет, 23+ марки
- Карточки направлений: Тюнинг / Автосервис / Детейлинг
- Блок «Проекты» — 3 типа: тюнинг, детейлинг, сервис
- Портфолио с 6 работами (Unsplash фото)
- Яндекс-карты отзывы (iframe embed OID 99062407907)
- Контакты + карта + Telegram
- AutoDealer виджет бронирования онлайн

### Социальные сети (обновлено 2026-04-11)
- **Telegram:** https://t.me/hptuningspb
- **Rutube** (заменён Instagram)

### Чип-тюнинг (`tuning.html`)
- Полный SevenForce-style калькулятор мощности
- SF_DATA — реальные данные Sevenforce с актуальными ценами:
  - BMW G20 318i (156 л.с.): Stage 1 = **35 000 ₽** (→280 л.с.)
  - BMW G20 330i (258 л.с.): Stage 1 = **35 000 ₽** (→310 л.с.), Stage 2 = 42 000 ₽ (→340 л.с.)
  - VW Golf GTI VIII (245 л.с.): Stage 1 = **41 000 ₽** (→330 л.с.)
  - Kia Stinger GT 3.3T (370 л.с.): Stage 1 = **41 000 ₽** (→420 л.с.)
  - Porsche Cayenne 3.0 (340 л.с.): Stage 1 = **55 000 ₽** (→400 л.с.)
  - Porsche Cayenne Turbo 4.0 (550 л.с.): Stage 1 = **165 000 ₽** (→700 л.с.)
  - Mercedes C63 S AMG (510 л.с.): Stage 1 = **109 000 ₽** (→580 л.с.)
  - Mercedes C200 W206 (204 л.с.): Stage 1 = **35 000 ₽** (→260 л.с.)
- VAG/Revo-style 4-шаговый интерфейс (Марка → Модель → Год → Двигатель)
- Stage 1/2/3 с визуализацией прироста
- Таблица цен на прошивки

### Детейлинг (`detailing.html`)
- Полное портфолио работ
- Услуги: полировка, керамика 9H, PPF, химчистка, тонировка, антихром
- Галерея

### Страницы марок (17 штук)
- bmw.html, mercedes.html, porsche.html, audi.html
- lexus.html, land-rover.html, volvo.html, volkswagen.html
- jaguar.html, genesis.html, infiniti.html, bentley.html
- toyota.html, hyundai.html, kia.html, nissan.html, range-rover.html

---

## 🔐 Безопасность и технические параметры

### Headers (`_headers`)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy` — полный CSP с источниками
- `Permissions-Policy` — camera, mic, geo, payment, usb отключены
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- `Cross-Origin-Resource-Policy: same-site`

### Кэширование
- HTML страницы: 1 час (index.html — 5 минут для свежести)
- JS/CSS файлы: 30 дней (immutable)
- Изображения: 30 дней (immutable)
- sitemap.xml, robots.txt: 1 день

### SEO
- `sitemap.xml` — все страницы
- `robots.txt` — Yandex + Google + crawl-delay
- Schema.org: AutoRepair, FAQPage, BreadcrumbList
- Open Graph + Twitter Card на всех страницах
- Canonical URLs

### Производительность
- Логотип: локальный SVG (`images/logo.svg`)
- Все изображения: Unsplash CDN (надёжные CORS-разрешённые)
- Hero-постер: Unsplash (без 403 ошибок)
- `loading="lazy"` на всех картинках ниже fold
- `fetchpriority="high"` на hero-изображении
- Шрифты: Google Fonts с `display=swap`

---

## ⚠️ Известные ограничения

| Проблема | Причина | Статус |
|---|---|---|
| HTTP 400 от AutoDealer | Виджет работает только на hp-tuning.ru | OK в продакшне |
| Фоновое видео — заглушка | Требуется загрузить реальное видео HP Тюнинг | Нужна Настя/Дима |

---

## 🚀 Следующие шаги

1. **Загрузить реальное видео** для hero-секции (MP4, ~10-20 сек, 1920×1080)
2. **Rutube канал** — создать и вставить реальную ссылку
3. **Яндекс Бизнес** — убедиться что OID 99062407907 корректный
4. **Реальные фото** проектов HP Тюнинг (сейчас Unsplash)
5. **Google Analytics / Яндекс.Метрика** — добавить счётчики

---

## 📞 Контакты

- **Адрес:** Санкт-Петербург, Порошкино, Богородская 3Б
- **Телефон:** +7 (981) 842-81-51
- **Telegram:** https://t.me/hptuningspb
- **Режим работы:** Ежедневно 10:00–20:00
- **Координаты:** 60.096423, 30.304163

---

## 🛠️ Технологии

- Чистый HTML5 + CSS3 + Vanilla JavaScript
- Font Awesome 6 (CDN)
- Google Fonts (Inter + Bebas Neue)
- AutoDealer виджет бронирования
- Яндекс Карты Embed API
- Netlify / любой статический хостинг
