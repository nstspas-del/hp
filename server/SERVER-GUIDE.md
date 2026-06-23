# 🖥️ HP ТЮНИНГ — Инструкция по настройке VPS

**Сервер:** 87.228.63.177 (Selectel, ru-1b, Ubuntu 24.04)  
**Домен:** hptuning.ru (регистратор: reg.ru)  
**Репо:** https://github.com/nstspas-del/hp (ветка `next-migration`)

---

## 🔐 Доступ к серверу

```bash
# Подключение по SSH
ssh root@87.228.63.177

# Если ключ сохранён в файл (например id_rsa_hptuning)
ssh -i ~/.ssh/id_rsa_hptuning root@87.228.63.177
```

---

## 🚀 Порядок установки (одноразово)

### Шаг 1 — Зайти на сервер и скачать скрипты

```bash
ssh root@87.228.63.177

# Клонируем репо для получения скриптов
git clone --branch next-migration https://github.com/nstspas-del/hp.git /tmp/hp-setup
cd /tmp/hp-setup/server/scripts

# Делаем скрипты исполняемыми
chmod +x *.sh
```

### Шаг 2 — Установка окружения (nginx, Node, PM2, UFW)

```bash
bash 01-setup-vps.sh
```

Что делает:
- Обновляет Ubuntu
- Ставит nginx, certbot, Node.js 20, PM2
- Настраивает UFW (фаервол: только SSH + 80 + 443)
- Клонирует репо в `/var/www/hptuning/app`

### Шаг 3 — Сборка Next.js

```bash
bash 02-build-app.sh
```

Что делает:
- Создаёт `.env.local` (Metrika ID, Yandex verification)
- `npm ci && npm run build`
- Запускает через PM2 на порту 3000

### Шаг 4 — nginx + SSL

> ⚠️ **Сначала переключи DNS в reg.ru!**
> A-запись `hptuning.ru → 87.228.63.177`
> Подождать 5–30 минут до распространения

```bash
bash 03-nginx-ssl.sh
```

Что делает:
- Создаёт Basic Auth (логин: `hptuning`, пароль задан в скрипте)
- Настраивает nginx → проксирует в Next.js
- Получает SSL сертификат Let's Encrypt
- Включает HTTP→HTTPS редирект
- Добавляет `X-Robots-Tag: noindex` пока в разработке

---

## 🌐 Настройка DNS в reg.ru

Перейди: **reg.ru → Мои домены → hptuning.ru → DNS-серверы и управление зоной**

| Тип | Хост | Значение | TTL |
|-----|------|----------|-----|
| A | @ | 87.228.63.177 | 300 |
| A | www | 87.228.63.177 | 300 |
| A | bmw | 87.228.63.177 | 300 |
| A | mercedes | 87.228.63.177 | 300 |
| A | audi | 87.228.63.177 | 300 |
| A | porsche | 87.228.63.177 | 300 |
| A | volkswagen | 87.228.63.177 | 300 |
| A | toyota | 87.228.63.177 | 300 |
| A | lexus | 87.228.63.177 | 300 |
| A | landrover | 87.228.63.177 | 300 |

---

## 📦 Добавление поддоменов

После настройки A-записей для каждого поддомена:

```bash
# Добавить BMW
bash 05-add-subdomain.sh bmw

# Добавить Mercedes
bash 05-add-subdomain.sh mercedes

# И так далее...
bash 05-add-subdomain.sh audi
bash 05-add-subdomain.sh porsche
bash 05-add-subdomain.sh volkswagen
bash 05-add-subdomain.sh toyota
bash 05-add-subdomain.sh lexus
bash 05-add-subdomain.sh landrover
```

---

## 🔄 Деплой обновлений (каждый раз после push в GitHub)

```bash
ssh root@87.228.63.177
bash /var/www/hptuning/app/server/scripts/04-deploy-update.sh
```

---

## 🛡️ Basic Auth — управление

```bash
# Сменить пароль
htpasswd /etc/nginx/.htpasswd hptuning

# Добавить пользователя
htpasswd /etc/nginx/.htpasswd newuser

# Текущий файл
cat /etc/nginx/.htpasswd
```

**Когда сайт готов к публикации — убрать Basic Auth:**
```bash
# Закомментировать в /etc/nginx/sites-available/hptuning.conf:
# auth_basic           "...";
# auth_basic_user_file /etc/nginx/.htpasswd;
# add_header X-Robots-Tag "noindex, nofollow" always;

nginx -t && systemctl reload nginx
```

---

## 📊 Полезные команды на сервере

```bash
# Статус сайта
pm2 list
pm2 logs hptuning --lines 50
pm2 restart hptuning

# Статус nginx
systemctl status nginx
nginx -t                    # проверка конфигов
systemctl reload nginx

# Место на диске
df -h

# SSL сертификаты
certbot certificates

# Обновление SSL (certbot делает автоматически через cron)
certbot renew --dry-run
```

---

## 📋 Чек-лист готовности

- [ ] SSH подключение работает
- [ ] DNS hptuning.ru → 87.228.63.177
- [ ] `bash 01-setup-vps.sh` — OK
- [ ] `bash 02-build-app.sh` — OK
- [ ] `bash 03-nginx-ssl.sh` — OK
- [ ] https://hptuning.ru открывается (Basic Auth)
- [ ] https://hptuning.ru/yandex_612ea2d0128620d8.html доступен (без Auth)
- [ ] Верификация в Яндекс.Вебмастер
- [ ] DNS для поддоменов (bmw, mercedes, ...)
- [ ] SSL для каждого поддомена
- [ ] Убрать Basic Auth + noindex перед запуском

---

## 🔗 Ссылки

| Сервис | URL |
|--------|-----|
| Основной сайт | https://hptuning.ru |
| BMW | https://bmw.hptuning.ru |
| Mercedes | https://mercedes.hptuning.ru |
| Яндекс.Метрика | https://metrika.yandex.ru (ID: 108614238) |
| Яндекс.Вебмастер | https://webmaster.yandex.ru |
| Яндекс.Карта | https://yandex.ru/maps/org/99062407907 |
| GitHub | https://github.com/nstspas-del/hp |
| AutoDealer | https://online.autodealer.ru |
