#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HP ТЮНИНГ — Шаг 1: Первичная настройка VPS (Ubuntu 24.04)
# Запускать: bash 01-setup-vps.sh
# Сервер: 87.228.63.177 (Selectel, SPb ru-1b)
# ═══════════════════════════════════════════════════════════════
set -e

echo "══════════════════════════════════════════"
echo " HP ТЮНИНГ — VPS Setup Step 1"
echo "══════════════════════════════════════════"

# ── 1. Обновление системы ──────────────────────────────────────
apt-get update -y && apt-get upgrade -y
apt-get install -y \
  curl wget git unzip \
  nginx certbot python3-certbot-nginx \
  apache2-utils \
  ufw fail2ban \
  htop tmux

# ── 2. Node.js 20 LTS (через NodeSource) ──────────────────────
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "Node: $(node -v) | npm: $(npm -v)"

# ── 3. PM2 (менеджер процессов) ───────────────────────────────
npm install -g pm2
pm2 startup systemd -u root --hp /root
echo "PM2: $(pm2 -v)"

# ── 4. UFW — фаервол ──────────────────────────────────────────
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'   # 80 + 443
ufw --force enable
echo "UFW: enabled"

# ── 5. Fail2ban — защита SSH ──────────────────────────────────
systemctl enable fail2ban
systemctl start fail2ban

# ── 6. Создать системного пользователя для приложения ─────────
if ! id "hptuning" &>/dev/null; then
  useradd -m -s /bin/bash hptuning
  echo "User hptuning created"
fi

# ── 7. Директории приложения ──────────────────────────────────
mkdir -p /var/www/hptuning
chown -R hptuning:hptuning /var/www/hptuning

# ── 8. Клонируем репозиторий ──────────────────────────────────
if [ ! -d "/var/www/hptuning/app/.git" ]; then
  git clone --branch next-migration \
    https://github.com/nstspas-del/hp.git \
    /var/www/hptuning/app
  echo "Repo cloned"
else
  echo "Repo already exists, pulling..."
  cd /var/www/hptuning/app && git pull origin next-migration
fi

chown -R hptuning:hptuning /var/www/hptuning

echo ""
echo "✅ Шаг 1 завершён! Запускай: bash 02-build-app.sh"
