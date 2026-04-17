# Деплой HP Тюнинг на Selectel VPS

## Что понадобится

- VPS Selectel: Ubuntu 22.04 LTS, минимум 2 CPU / 2 GB RAM (рекомендуется 4 GB)
- Домен `hptuning.ru` — DNS A-запись указывает на IP вашего VPS
- SSH-доступ к серверу

---

## 1. Подготовка сервера

```bash
# Подключаемся к серверу
ssh root@YOUR_SERVER_IP

# Обновляем систему
apt update && apt upgrade -y

# Устанавливаем необходимые пакеты
apt install -y curl git nginx certbot python3-certbot-nginx

# Устанавливаем nvm + Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20

# Проверяем
node --version  # v20.x.x
npm --version   # 10.x.x

# Устанавливаем PM2 глобально
npm install -g pm2
```

---

## 2. Клонирование репозитория

```bash
# Создаём директорию для сайта
mkdir -p /var/www/hptuning
cd /var/www/hptuning

# Клонируем репозиторий (ветка next-migration)
git clone -b next-migration https://github.com/nstspas-del/hp.git .

# Переходим в папку Next.js проекта
cd /var/www/hptuning/next
```

---

## 3. Настройка переменных окружения

```bash
cd /var/www/hptuning/next

# Создаём .env.local из примера
cp .env.example .env.local

# Редактируем переменные
nano .env.local
```

**Заполнить в .env.local:**
```env
NEXT_PUBLIC_YM_COUNTER_ID=99999999        # ← Ваш реальный ID Яндекс.Метрики
NEXT_PUBLIC_YANDEX_VERIFICATION=xxxxx     # ← Код из Яндекс.Вебмастер
NEXT_PUBLIC_SITE_URL=https://hptuning.ru
```

---

## 4. Сборка проекта

```bash
cd /var/www/hptuning/next

# Устанавливаем зависимости
npm ci --production=false

# Строим проект
npm run build

# Проверяем что .next/standalone существует (если включён output: 'standalone')
# Если нет — запускаем через pm2 с npm start
```

> **Если хотите standalone-сборку** (рекомендуется для production), добавьте в `next.config.mjs`:
> ```js
> output: 'standalone',
> ```
> Тогда в `.next/standalone/` будет минимальный сервер без `node_modules`.

---

## 5. Настройка PM2

```bash
cd /var/www/hptuning/next

# Создаём ecosystem файл для PM2
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'hptuning',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/var/www/hptuning/next',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '512M',
    restart_delay: 5000,
  }],
};
EOF

# Запускаем
pm2 start ecosystem.config.cjs

# Проверяем статус
pm2 status
pm2 logs hptuning --nostream

# Тест
curl http://localhost:3000

# Автозапуск при перезагрузке сервера
pm2 startup
pm2 save
```

---

## 6. Настройка Nginx

```bash
# Копируем конфиг
cp /var/www/hptuning/deploy/nginx.conf /etc/nginx/sites-available/hptuning

# Включаем сайт
ln -sf /etc/nginx/sites-available/hptuning /etc/nginx/sites-enabled/hptuning

# Удаляем дефолтный сайт (если мешает)
rm -f /etc/nginx/sites-enabled/default

# Проверяем конфиг
nginx -t

# Перезапускаем Nginx
systemctl restart nginx
systemctl enable nginx
```

---

## 7. SSL-сертификат (Let's Encrypt)

```bash
# DNS должен уже указывать на сервер!
certbot --nginx -d hptuning.ru -d www.hptuning.ru

# Следуем инструкциям certbot
# Выбираем "Redirect HTTP to HTTPS" когда спрашивают

# Проверяем автопродление
certbot renew --dry-run

# Автопродление через cron (обычно настраивается автоматически)
# Проверяем:
systemctl status certbot.timer
```

---

## 8. Проверка

```bash
# Проверяем что всё работает
curl -I https://hptuning.ru
curl -I https://hptuning.ru/brands/bmw
curl -I https://hptuning.ru/sitemap.xml

# Логи Nginx
tail -f /var/log/nginx/hptuning.access.log

# Логи приложения
pm2 logs hptuning --nostream
```

---

## Деплой обновлений (после изменений в коде)

```bash
cd /var/www/hptuning

# Получаем изменения
git pull origin next-migration

# Пересобираем
cd next
npm ci --production=false
npm run build

# Перезапускаем PM2
pm2 restart hptuning

# Проверяем
pm2 logs hptuning --nostream
curl https://hptuning.ru
```

---

## Решение проблем

### PM2 не видит Node.js после перезагрузки

```bash
# Добавить в /root/.bashrc или /root/.profile:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Nginx 502 Bad Gateway

```bash
# Проверить что PM2 запущен
pm2 status
pm2 restart hptuning

# Проверить порт
ss -tlnp | grep 3000
```

### Сертификат не обновляется

```bash
certbot renew --force-renewal
systemctl restart nginx
```

### Проверить DNS

```bash
dig hptuning.ru +short
# Должен вернуть IP вашего Selectel VPS
```

---

## Мониторинг

```bash
# Статус всех сервисов
pm2 status
systemctl status nginx
systemctl status certbot.timer

# Использование ресурсов
htop
df -h

# Nginx access log в реальном времени
tail -f /var/log/nginx/hptuning.access.log
```

---

## Файлы конфигурации

| Файл | Путь |
|---|---|
| Nginx конфиг | `/etc/nginx/sites-available/hptuning` |
| PM2 ecosystem | `/var/www/hptuning/next/ecosystem.config.cjs` |
| SSL сертификат | `/etc/letsencrypt/live/hptuning.ru/` |
| env переменные | `/var/www/hptuning/next/.env.local` |
| Логи Nginx | `/var/log/nginx/hptuning.*.log` |
| Логи PM2 | `~/.pm2/logs/` |
