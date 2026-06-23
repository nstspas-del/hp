#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HP ТЮНИНГ — Добавить поддомен (SSL + nginx конфиг)
# Использование: bash 05-add-subdomain.sh bmw
# Запускать ТОЛЬКО после настройки A-записи в reg.ru!
# ═══════════════════════════════════════════════════════════════
set -e

BRAND="${1:?Укажи бренд: bash 05-add-subdomain.sh bmw}"
DOMAIN="hptuning.ru"
EMAIL="hptuningspb@yandex.ru"
SUBDOMAIN="$BRAND.$DOMAIN"

echo "══════════════════════════════════════════"
echo " Добавляем поддомен: $SUBDOMAIN"
echo "══════════════════════════════════════════"

# ── 1. Проверяем DNS ──────────────────────────────────────────
IP=$(dig +short "$SUBDOMAIN" 2>/dev/null || true)
if [ "$IP" != "87.228.63.177" ]; then
  echo "❌ DNS не настроен! $SUBDOMAIN → $IP (нужно 87.228.63.177)"
  echo "   Добавь A-запись в reg.ru и подожди 5-30 минут"
  exit 1
fi
echo "DNS OK: $SUBDOMAIN → $IP"

# ── 2. Создаём nginx конфиг ───────────────────────────────────
TEMPLATE="/var/www/hptuning/app/server/nginx/subdomain-template.conf"
CONF="/etc/nginx/sites-available/$SUBDOMAIN.conf"

sed "s/BRAND/$BRAND/g" "$TEMPLATE" > "$CONF"
ln -sf "$CONF" "/etc/nginx/sites-enabled/$SUBDOMAIN.conf"
echo "nginx конфиг: $CONF"

# ── 3. Временный HTTP блок для certbot ────────────────────────
# Сначала проверяем без SSL
nginx -t && systemctl reload nginx

# ── 4. Получаем SSL сертификат ────────────────────────────────
certbot --nginx \
  -d "$SUBDOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive \
  --redirect

echo ""
echo "✅ Поддомен $SUBDOMAIN настроен!"
echo "   URL: https://$SUBDOMAIN"
echo ""
echo "Следующий поддомен: bash 05-add-subdomain.sh mercedes"
