#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HP ТЮНИНГ — Деплой обновлений с GitHub
# Использование: bash /var/www/hptuning/app/server/scripts/04-deploy-update.sh
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

APP_DIR="/var/www/hptuning/app"
NEXT_DIR="$APP_DIR/next"
BRANCH="next-migration"
LOG_FILE="/var/log/hptuning-deploy.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# ── Цвета ─────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[${TIMESTAMP}]${NC} $1" | tee -a "$LOG_FILE"; }
ok()  { echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"; }
warn(){ echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"; }
err() { echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"; }

# ── Rollback при ошибке ────────────────────────────────────────
ROLLBACK() {
  err "Ошибка при деплое! Откатываемся к предыдущей версии..."
  cd "$NEXT_DIR"
  # Пробуем перезапустить уже запущенный инстанс
  pm2 restart hptuning 2>/dev/null || true
  err "Откат выполнен. Детали: pm2 logs hptuning --lines 50"
  echo "[$TIMESTAMP] FAILED rollback triggered" >> "$LOG_FILE"
  exit 1
}
trap ROLLBACK ERR

echo ""
echo -e "${BLUE}══════════════════════════════════════════${NC}"
echo -e "${BLUE} HP ТЮНИНГ — Deploy Update${NC}"
echo -e "${BLUE} $TIMESTAMP${NC}"
echo -e "${BLUE}══════════════════════════════════════════${NC}"
echo ""

# ── 0. Сохраняем .env.local (git reset --hard его не трогает, но перестрахуемся) ─
if [ -f "$NEXT_DIR/.env.local" ]; then
  cp "$NEXT_DIR/.env.local" /tmp/hptuning-env.local.bak
  log ".env.local сохранён в /tmp/hptuning-env.local.bak"
fi

# ── 1. Git pull ────────────────────────────────────────────────
log "Шаг 1/5: Получаем обновления из GitHub (ветка: $BRANCH)..."
cd "$APP_DIR"

# Показываем текущий коммит до обновления
PREV_COMMIT=$(git log --oneline -1 2>/dev/null || echo "unknown")
log "  Текущий коммит: $PREV_COMMIT"

git fetch origin
git reset --hard origin/$BRANCH

NEW_COMMIT=$(git log --oneline -1)
ok "Git обновлён: $NEW_COMMIT"

# Если коммит не изменился — предупреждаем, но продолжаем
if [ "$PREV_COMMIT" = "$NEW_COMMIT" ]; then
  warn "Коммит не изменился — возможно, обновлений нет. Продолжаем пересборку..."
fi

# Восстанавливаем .env.local если вдруг пропал
if [ -f /tmp/hptuning-env.local.bak ] && [ ! -f "$NEXT_DIR/.env.local" ]; then
  cp /tmp/hptuning-env.local.bak "$NEXT_DIR/.env.local"
  warn ".env.local восстановлен из бэкапа"
fi

# ── 2. Зависимости ────────────────────────────────────────────
log "Шаг 2/5: Проверяем зависимости..."
cd "$NEXT_DIR"

# npm ci только если изменился package-lock.json
if git diff HEAD@{1} --name-only 2>/dev/null | grep -q "package-lock.json"; then
  log "  package-lock.json изменился — запускаем npm ci..."
  npm ci --production=false 2>&1 | tail -5
  ok "npm ci завершён"
else
  log "  package-lock.json не изменился — пропускаем npm ci"
fi

# ── 3. Сборка Next.js ─────────────────────────────────────────
log "Шаг 3/5: Сборка Next.js (это займёт 1–2 минуты)..."
BUILD_START=$(date +%s)
npm run build 2>&1 | tail -15
BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))
ok "Build завершён за ${BUILD_TIME}с"

# ── 4. Перезапуск PM2 ─────────────────────────────────────────
log "Шаг 4/5: Перезапуск PM2..."
if pm2 list | grep -q "hptuning"; then
  pm2 restart hptuning
  ok "PM2 restarted (hptuning)"
else
  warn "Процесс hptuning не найден в PM2 — пробуем запустить..."
  cd "$NEXT_DIR"
  pm2 start npm --name hptuning -- run start -- -p 3000
  ok "PM2 запущен как новый процесс"
fi
pm2 save

# ── 5. Smoke test ─────────────────────────────────────────────
log "Шаг 5/5: Проверка доступности сайта..."
sleep 4

MAX_TRIES=5
for i in $(seq 1 $MAX_TRIES); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "302" ]; then
    ok "Сайт отвечает: HTTP $HTTP_CODE (попытка $i/$MAX_TRIES)"
    break
  else
    warn "Попытка $i/$MAX_TRIES — HTTP $HTTP_CODE, ждём 3с..."
    sleep 3
    if [ "$i" = "$MAX_TRIES" ]; then
      err "Сайт не отвечает после $MAX_TRIES попыток (HTTP $HTTP_CODE)"
      err "Смотри логи: pm2 logs hptuning --lines 50"
      exit 1
    fi
  fi
done

# ── Итог ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN} ✅ ДЕПЛОЙ ЗАВЕРШЁН УСПЕШНО${NC}"
echo -e "${GREEN} Коммит: $NEW_COMMIT${NC}"
echo -e "${GREEN} Время: $(date '+%H:%M:%S')${NC}"
echo -e "${GREEN} Лог: $LOG_FILE${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""

echo "[$TIMESTAMP] SUCCESS commit=$NEW_COMMIT build_time=${BUILD_TIME}s" >> "$LOG_FILE"

# ── Подсказки ─────────────────────────────────────────────────
echo "Полезные команды:"
echo "  pm2 logs hptuning --lines 30   # последние логи"
echo "  pm2 list                        # статус процессов"
echo "  cat $LOG_FILE                   # история деплоев"
echo "  nginx -t && systemctl reload nginx  # перезагрузка nginx"
