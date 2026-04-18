# 🎛️ МАСТЕР-ПРОМТ ДЛЯ БЭКЕНД-АГЕНТА — Autodealer Widget + Legal

**Проект:** hptuning.ru  
**Дата:** 18.04.2026  
**Автор:** Настя (SEO-лид) для бэкенд/фронт-агента  
**Приоритет:** 🔴 КРИТИЧНО (блокирует запуск Яндекс.Директа)

---

## 🎯 ЗАДАЧА 1 — Установить виджет Autodealer (обновлённый код)

### Исходные данные
- **API-ключ (подтверждён владельцем):** `107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd`
- **Регион работы:** Россия, Санкт-Петербург (без VPN, высокая скорость).
- **Требование:** виджет должен быть установлен на **всех страницах сайта** (index, contacts, privacy, cookies, consent, brand-sub-domains), вставлять перед `</body>`.

### Код для вставки (перед `</body>` на каждой странице/в общем template):

```html
<!-- Autodealer Widget -->
<script type="text/javascript">
  (function(){
    function Build(name, args){return function(){window.autodealerasync.push(name, arguments);}}
    if (typeof autodealer === 'undefined') {
      var s = document.createElement('script');
      s.charset = "utf-8";
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://online.autodealer.ru/widget/app.js';
      var x = document.getElementsByTagName('head')[0];
      x.appendChild(s);
      window.autodealer = {};
      window.autodealerasync = [];
      autodealer.settings = {};
      var m = ['init','open'];
      for (var i = 0; i < m.length; i++) autodealer[m[i]] = Build(m[i]);
    }
  })();
  autodealer.init('107eb24c04be7f0ef6676d5aa84dc46132fb7e6bdb6ac10b8adcf74e6e8633dd');
</script>
```

### Кнопки вызова формы записи

**Вариант 1 — инлайн (быстрый):**
```html
<button class="btn-primary" onclick="autodealer.open()">ЗАПИСАТЬСЯ</button>
```

**Вариант 2 — глобальная функция (рекомендуется):**
```javascript
window.openBooking = function() {
  if (typeof autodealer !== 'undefined' && autodealer.open) {
    autodealer.open();
  } else {
    // Фолбэк: звонок, если виджет не загрузился
    window.location.href = 'tel:+78121234567';
  }
};
```

И везде на кнопках:
```html
<button onclick="window.openBooking()">Записаться на сервис</button>
```

### Где разместить кнопки (чек-лист)

- [ ] Главная страница (index.html) — 3 места: шапка, hero-секция, CTA перед футером.
- [ ] Контакты (contacts.html) — после блока с адресом.
- [ ] Каждая brand-страница (bmw, mercedes, audi, porsche, vw, toyota, lexus, landrover) — в hero + после прайса.
- [ ] Sticky-кнопка на мобильном (fixed bottom), появляется после скролла 300px.

### ⚠️ Критично

1. **Обязательно** загрузить `app.js` с `async` атрибутом — не блокировать рендер.
2. **Не вставлять** виджет в iframe/sandbox с другим доменом — 400 ошибка.
3. Проверить в DevTools → Network: запрос к `online.autodealer.ru/widget/app.js` должен вернуть **200 OK**.
4. Проверить в DevTools → Console: при клике — никаких ошибок, форма открывается.

---

## 🎯 ЗАДАЧА 2 — Убрать платный Yandex Places/Geosuggest API

### Проблема
API-ключ `29cbd36b-fbf2-4841-9a5d-c7a79ad036a3` — платный поиск Яндекса по организациям. **Не оплачиваем**, убираем.

### Что удалить (grep команды)

```bash
grep -rn "29cbd36b" .                          # → должно быть 0 совпадений
grep -rn "search-maps.yandex" .                # → удалить все
grep -rn "api-maps.yandex.ru/services/search" .  # → удалить
grep -rn "suggest-maps.yandex" .               # → удалить
grep -rn "ymaps.search" .                      # → заменить/удалить
grep -rn "ymaps.geocode" .                     # → заменить/удалить
```

### Что оставить
- **Только бесплатный iframe-виджет карты:**
  ```html
  <iframe src="https://yandex.ru/map-widget/v1/?z=15&ol=biz&oid=99062407907"
          width="100%" height="400" frameborder="0"
          loading="lazy" title="HP Тюнинг на карте"></iframe>
  ```

### Верификация
- [ ] `grep -rn "29cbd36b" .` → 0
- [ ] В DevTools → Network при загрузке страницы **нет запросов** к `search-maps.yandex.ru` и `suggest-maps.yandex.ru`.
- [ ] Iframe-карта работает.
- [ ] Автокомплит адреса (если был) заменён на обычный `<input type="text">`.

---

## 🎯 ЗАДАЧА 3 — Создать документ «Согласие на обработку ПДн»

### Контекст
По 152-ФЗ, AutoDealer требует **две ссылки** в настройках виджета:
1. **Согласие на обработку ПДн** → https://hptuning.ru/consent
2. **Политика обработки ПДн** → https://hptuning.ru/privacy *(уже существует)*

### Что создать: файл `site/consent.html`

**Структура:**
- DOCTYPE html, lang="ru"
- `<title>Согласие на обработку персональных данных — HP Тюнинг СПб</title>`
- `<link rel="canonical" href="https://hptuning.ru/site/consent.html">`
- `<meta name="robots" content="noindex, follow">`
- Brabcrumbs: Главная → Согласие на обработку ПДн
- Та же шапка/футер, что на privacy.html
- Макс. ширина контента 840px

### Текст документа (вставить как контент)

```
# Согласие на обработку персональных данных

**Редакция от 18 апреля 2026 г.**

Я, субъект персональных данных, действуя своей волей и в своём интересе, 
даю согласие ИП Спасатель Анастасия Дмитриевна (далее — «Оператор»):

- ОГРНИП: [указать]
- ИНН: [указать]
- Юр. адрес: 195197, г. Санкт-Петербург, ул. Богородская, д. 3Б
- E-mail для связи по ПДн: **hptuningspb@yandex.ru**

на обработку моих персональных данных, указанных при заполнении форм 
обратной связи на сайте https://hptuning.ru.

## 1. Перечень обрабатываемых данных
- Фамилия, имя, отчество
- Номер телефона
- Адрес электронной почты
- Марка и модель автомобиля, VIN (при указании)
- Текст сообщения/комментария
- IP-адрес, cookie, данные о браузере и устройстве
- Данные систем аналитики (Яндекс.Метрика)

## 2. Цели обработки
- Обработка заявок на сервис, консультация, запись на ремонт/тюнинг
- Заключение договора оказания услуг
- Информирование о статусе заявки
- **Направление маркетинговых рассылок (SMS / Email) 
  об акциях, скидках и напоминаниях о ТО**
- Улучшение качества обслуживания на основе аналитики
- Ответ на претензии, юридические разбирательства

## 3. Действия с данными
Сбор, запись, систематизация, накопление, хранение, уточнение, 
извлечение, использование, передача (предоставление, доступ), 
блокирование, удаление, уничтожение.

## 4. Передача третьим лицам
Оператор вправе передавать данные следующим категориям:
- AutoDealer (online.autodealer.ru) — виджет записи и CRM
- ООО «Яндекс» — Яндекс.Метрика, Яндекс.Бизнес
- Telegram, WhatsApp — уведомления о заявках (при согласии клиента)
- Партнёры по доставке запчастей (только с ФИО и номером телефона)

## 5. Срок действия и отзыв согласия
Согласие действует до достижения целей обработки, но не более 5 лет 
с момента последнего контакта. Может быть отозвано в любой момент 
путём направления заявления на hptuningspb@yandex.ru.

## 6. Права субъекта
Согласно ст. 14 Федерального закона №152-ФЗ «О персональных данных», 
субъект имеет право на доступ к своим данным, их уточнение, блокирование, 
уничтожение и отзыв согласия.

---
**Нажимая кнопку «Отправить» / ставя галочку «Согласен», 
я подтверждаю, что ознакомлен(а) с настоящим Согласием 
и Политикой обработки персональных данных.**
```

### Footer — добавить третью ссылку

```html
<footer>
  ...
  <div class="legal-links">
    <a href="/privacy">Политика обработки ПДн</a> ·
    <a href="/consent">Согласие ПДн</a> ·
    <a href="/cookies">Политика cookies</a>
  </div>
</footer>
```

### Обязательный чекбокс на всех формах

```html
<label class="checkbox-legal">
  <input type="checkbox" name="consent" required id="consent-check">
  <span>
    Я согласен с 
    <a href="/consent" target="_blank">обработкой персональных данных</a> 
    и ознакомлен с 
    <a href="/privacy" target="_blank">Политикой конфиденциальности</a>
  </span>
</label>

<button type="submit" class="btn-primary" disabled id="form-submit">
  Отправить
</button>

<script>
  document.getElementById('consent-check').addEventListener('change', function() {
    document.getElementById('form-submit').disabled = !this.checked;
  });
</script>
```

### Настройки в личном кабинете AutoDealer

В настройках виджета AutoDealer клиент должен вручную указать:
- **Согласие:** `https://hptuning.ru/consent`
- **Политика:** `https://hptuning.ru/privacy`

⚠️ **Без этих ссылок AutoDealer блокирует отправку формы.**

---

## ✅ ФИНАЛЬНЫЙ ЧЕК-ЛИСТ (до мерджа в main)

### Autodealer
- [ ] Новый код виджета вставлен перед `</body>` на всех страницах.
- [ ] API-ключ `107eb24c...` подставлен в `autodealer.init()`.
- [ ] Глобальная функция `window.openBooking()` работает с фолбэком на звонок.
- [ ] Кнопки записи стоят на всех ключевых местах (hero, после прайса, CTA, sticky-mobile).
- [ ] В DevTools Network: `app.js` → 200 OK.
- [ ] В DevTools Console: 0 ошибок при открытии формы.

### Удаление платного API
- [ ] `grep -rn "29cbd36b"` → 0 совпадений.
- [ ] Нет запросов к `search-maps.yandex.ru` / `suggest-maps.yandex.ru`.
- [ ] Iframe-карта `oid=99062407907` работает.

### Legal-документы
- [ ] Создан `site/consent.html` с `noindex, follow`.
- [ ] Текст согласия включает маркетинг и email `hptuningspb@yandex.ru`.
- [ ] Чекбокс добавлен на все формы (включая contacts.html).
- [ ] Submit-кнопка отключается, если чекбокс не отмечен.
- [ ] В футере три legal-ссылки.
- [ ] В настройках AutoDealer подставлены URL (клиент делает вручную).

### Тест в реальных условиях (РФ, без VPN)
- [ ] Проверка скорости загрузки главной (PageSpeed Insights) → Mobile ≥ 80.
- [ ] Проверка виджета → форма открывается, заявка отправляется.
- [ ] Заявка приходит в админку AutoDealer.
- [ ] Нет ошибок в консоли на десктопе (Chrome, Safari, Yandex Browser).
- [ ] Нет ошибок на мобильном (iPhone Safari, Android Chrome).

---

**Когда всё готово → пинг Насте для финальной проверки и мерджа.**
