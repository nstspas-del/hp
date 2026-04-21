#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HP ТЮНИНГ — Шаг 2: Сборка Next.js + переменные окружения
# Запускать: bash 02-build-app.sh
# ═══════════════════════════════════════════════════════════════
set -e

APP_DIR="/var/www/hptuning/app/next"

echo "══════════════════════════════════════════"
echo " HP ТЮНИНГ — Build Step 2"
echo "══════════════════════════════════════════"

# ── 1. Переходим в папку Next.js ──────────────────────────────
cd "$APP_DIR"

# ── 2. Создаём .env.local ─────────────────────────────────────
cat > .env.local << 'EOF'
# Yandex.Metrika
NEXT_PUBLIC_YM_COUNTER_ID=108614238

# Yandex Webmaster verification
NEXT_PUBLIC_YANDEX_VERIFICATION=612ea2d0128620d8

# Site URL (production)
NEXT_PUBLIC_SITE_URL=https://hptuning.ru
EOF

echo ".env.local создан"

# ── 3. Устанавливаем зависимости ──────────────────────────────
npm ci --production=false
echo "npm install: done"

# ── 4. Собираем Next.js ───────────────────────────────────────
npm run build
echo "npm build: done"

# ── 5. Запускаем через PM2 ────────────────────────────────────
pm2 delete hptuning 2>/dev/null || true
pm2 start npm --name "hptuning" -- start -- -p 3000 -H 127.0.0.1
pm2 save

echo ""
echo "Статус PM2:"
pm2 list

echo ""
echo "✅ Шаг 2 завершён! Запускай: bash 03-nginx-ssl.sh"
