#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HP ТЮНИНГ — Шаг 3: nginx + SSL (Let's Encrypt) + Basic Auth
# Запускать: bash 03-nginx-ssl.sh
# ВАЖНО: DNS для hptuning.ru И всех субдоменов должен указывать на 87.228.63.177
# ═══════════════════════════════════════════════════════════════
set -e

DOMAIN="hptuning.ru"
EMAIL="hptuningspb@yandex.ru"
BASIC_AUTH_USER="hptuning"
BASIC_AUTH_PASS="HP75457545"     # ← текущий пароль (апрель 2026)

SUBDOMAINS="bmw mercedes audi porsche volkswagen toyota lexus landrover"

echo "══════════════════════════════════════════"
echo " HP ТЮНИНГ — nginx + SSL Step 3"
echo "══════════════════════════════════════════"

# ── 1. Basic Auth файл ────────────────────────────────────────
htpasswd -cb /etc/nginx/.htpasswd "$BASIC_AUTH_USER" "$BASIC_AUTH_PASS"
echo "Basic Auth: hptuning / $BASIC_AUTH_PASS"

# ── 2. Копируем конфиг nginx ──────────────────────────────────
cp /var/www/hptuning/app/server/nginx/hptuning.conf \
   /etc/nginx/sites-available/hptuning.conf
ln -sf /etc/nginx/sites-available/hptuning.conf \
   /etc/nginx/sites-enabled/hptuning.conf
rm -f /etc/nginx/sites-enabled/default

# ── 3. Временный HTTP-блок для certbot (до SSL) ───────────────
nginx -t && systemctl reload nginx
echo "nginx: OK (HTTP)"

# ── 4. SSL для основного домена ───────────────────────────────
certbot --nginx \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --email "$EMAIL" --agree-tos --non-interactive --redirect
echo "SSL hptuning.ru: OK"

# ── 5. SSL для всех субдоменов (если DNS настроен) ────────────
echo ""
echo "Проверяем DNS субдоменов..."
CERT_DOMAINS="-d $DOMAIN -d www.$DOMAIN"
ALL_OK=true

for sub in $SUBDOMAINS; do
  IP=$(dig +short "$sub.$DOMAIN" 2>/dev/null || true)
  if [ "$IP" = "87.228.63.177" ]; then
    echo "  ✅ $sub.$DOMAIN → $IP"
    CERT_DOMAINS="$CERT_DOMAINS -d $sub.$DOMAIN"
  else
    echo "  ⚠️  $sub.$DOMAIN → DNS не настроен (пропускаем)"
    ALL_OK=false
  fi
done

echo ""
if [ "$ALL_OK" = true ]; then
  echo "Все DNS настроены! Расширяем сертификат..."
  certbot --nginx $CERT_DOMAINS --email "$EMAIL" --agree-tos --non-interactive
  echo "SSL wildcard: OK"
else
  echo "⚠️  Часть субдоменов без DNS. После настройки запусти:"
  echo "    bash 05-add-subdomain.sh bmw"
  echo "    bash 05-add-subdomain.sh mercedes"
  echo "    # ... и т.д."
fi

nginx -t && systemctl reload nginx

echo ""
echo "✅ Шаг 3 завершён!"
echo "   Основной сайт: https://$DOMAIN (Basic Auth: $BASIC_AUTH_USER / $BASIC_AUTH_PASS)"
