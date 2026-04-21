#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HP ТЮНИНГ — Деплой обновлений с GitHub (запускать при каждом обновлении)
# Использование: bash 04-deploy-update.sh
# ═══════════════════════════════════════════════════════════════
set -e

APP_DIR="/var/www/hptuning/app"
NEXT_DIR="$APP_DIR/next"
BRANCH="next-migration"

# ── Rollback: git stash + pm2 restart если сборка упала ───────
ROLLBACK() {
  echo "❌ Ошибка при деплое! Откатываемся..."
  cd "$NEXT_DIR"
  git stash 2>/dev/null || true
  pm2 restart hptuning 2>/dev/null || true
  echo "   Откат выполнен. Проверь: pm2 logs hptuning"
  exit 1
}
trap ROLLBACK ERR

echo "══════════════════════════════════════════"
echo " HP ТЮНИНГ — Deploy Update"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "══════════════════════════════════════════"

# ── 1. Pull из GitHub ─────────────────────────────────────────
cd "$APP_DIR"
git fetch origin
git reset --hard origin/$BRANCH
echo "Git: обновлено до $(git log --oneline -1)"

# ── 2. Установка зависимостей (только если изменился package.json) ─
cd "$NEXT_DIR"
npm ci --production=false

# ── 3. Сборка ─────────────────────────────────────────────────
npm run build
echo "Build: OK"

# ── 4. Перезапуск PM2 ─────────────────────────────────────────
pm2 restart hptuning
echo "PM2: restarted"

# ── 5. Проверка ───────────────────────────────────────────────
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
  echo "✅ Сайт отвечает: HTTP $HTTP_CODE"
else
  echo "❌ Ошибка! HTTP $HTTP_CODE — смотри: pm2 logs hptuning"
  exit 1
fi

echo ""
echo "✅ Деплой завершён: $(date '+%H:%M:%S')"
