#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HP ТЮНИНГ — Шаг 3: nginx + SSL (Let's Encrypt) + Basic Auth
# Запускать: bash 03-nginx-ssl.sh
# ВАЖНО: DNS должен уже указывать на 87.228.63.177
# ═══════════════════════════════════════════════════════════════
set -e

DOMAIN="hptuning.ru"
EMAIL="hptuningspb@yandex.ru"
BASIC_AUTH_USER="hptuning"
BASIC_AUTH_PASS="HpT2026spb!"   # ← СМЕНИТЬ ПОСЛЕ ЗАПУСКА

# Субдомены для будущих брендовых страниц
SUBDOMAINS="bmw mercedes audi porsche volkswagen toyota lexus landrover"

echo "══════════════════════════════════════════"
echo " HP ТЮНИНГ — nginx + SSL Step 3"
echo "══════════════════════════════════════════"

# ── 1. Создаём Basic Auth файл ────────────────────────────────
htpasswd -cb /etc/nginx/.htpasswd "$BASIC_AUTH_USER" "$BASIC_AUTH_PASS"
echo "Basic Auth: /etc/nginx/.htpasswd создан"
echo "  Логин: $BASIC_AUTH_USER"
echo "  Пароль: $BASIC_AUTH_PASS"

# ── 2. Копируем конфиг nginx ──────────────────────────────────
cp /var/www/hptuning/app/server/nginx/hptuning.conf \
   /etc/nginx/sites-available/hptuning.conf
ln -sf /etc/nginx/sites-available/hptuning.conf \
   /etc/nginx/sites-enabled/hptuning.conf

# Удаляем default
rm -f /etc/nginx/sites-enabled/default

# ── 3. Проверяем конфиг ───────────────────────────────────────
nginx -t
systemctl reload nginx
echo "nginx: OK"

# ── 4. SSL для основного домена ───────────────────────────────
certbot --nginx \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive \
  --redirect
echo "SSL hptuning.ru: OK"

# ── 5. SSL для субдоменов (пропускаем если DNS не настроен) ───
echo ""
echo "⚠️  Субдомены — запускай после настройки DNS в reg.ru:"
echo ""
for sub in $SUBDOMAINS; do
  echo "certbot --nginx -d $sub.$DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect"
done

echo ""
echo "✅ Шаг 3 завершён!"
echo "   Сайт: https://$DOMAIN"
echo "   Basic Auth: $BASIC_AUTH_USER / $BASIC_AUTH_PASS"
echo ""
echo "⚠️  СМЕНИ ПАРОЛЬ: htpasswd /etc/nginx/.htpasswd $BASIC_AUTH_USER"
