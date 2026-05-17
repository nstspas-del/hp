#!/usr/bin/env bash
#
# rename-media-for-seo.sh
# ------------------------------------------------------------------
# Переименовывает медиа, выгруженные из AI Drive
# (https://www.genspark.ai/aidrive/shared/5d72a937-...),
# под SEO-friendly имена и раскладывает по нужным папкам проекта.
#
# Использование (на Mac, в Терминале):
#   1. Скачайте архив с AI Drive в одну папку, например ~/Downloads/hp-media
#   2. cd в эту папку
#   3. bash /путь/к/проекту/next/scripts/rename-media-for-seo.sh
#   4. После выполнения у вас появится подпапка ./renamed/ — её содержимое
#      нужно положить в next/public/images/ соответствующих категорий.
#
# Скрипт идемпотентный: если файл уже переименован — пропускает.
# ------------------------------------------------------------------

set -euo pipefail

OUT_DIR="./renamed"
mkdir -p \
  "$OUT_DIR/hero" \
  "$OUT_DIR/og" \
  "$OUT_DIR/services" \
  "$OUT_DIR/detailing" \
  "$OUT_DIR/projects" \
  "$OUT_DIR/workshop" \
  "$OUT_DIR/videos"

# Утилита для копирования с сохранением EXIF, если есть
copy_if_missing() {
  local src="$1"
  local dst="$2"
  if [[ -f "$src" ]]; then
    if [[ ! -f "$dst" ]]; then
      cp -p "$src" "$dst"
      echo "  ✓ $src  →  $dst"
    else
      echo "  · $dst уже существует, пропускаю"
    fi
  else
    echo "  ⚠ $src не найден"
  fi
}

echo "→ Шаг 1/3: hero и og"
# Подставьте свои исходные имена → SEO имена
copy_if_missing "hero-main.jpeg"           "$OUT_DIR/hero/hero-autosrv-spb.jpg"
copy_if_missing "ewlFZIuv.jpeg"            "$OUT_DIR/hero/hero-autosrv-spb-1.jpg"
copy_if_missing "og-default.jpg"           "$OUT_DIR/og/og-hp-tuning-spb.jpg"
copy_if_missing "og-services.jpg"          "$OUT_DIR/og/og-services.jpg"

echo
echo "→ Шаг 2/3: услуги и детейлинг"
copy_if_missing "service-to.jpeg"          "$OUT_DIR/services/to-zamena-masla-spb.jpg"
copy_if_missing "service-diagnostics.jpeg" "$OUT_DIR/services/komputernaya-diagnostika-spb.jpg"
copy_if_missing "service-brakes.jpeg"      "$OUT_DIR/services/remont-tormoznoy-sistemy.jpg"
copy_if_missing "service-suspension.jpeg"  "$OUT_DIR/services/remont-podveski-spb.jpg"
copy_if_missing "service-engine.jpeg"      "$OUT_DIR/services/remont-dvigatelya-spb.jpg"
copy_if_missing "service-tyre.jpeg"        "$OUT_DIR/services/shinomontazh-spb.jpg"
copy_if_missing "detailing-ceramic.jpeg"   "$OUT_DIR/detailing/keramicheskoe-pokrytie-9h.jpg"
copy_if_missing "detailing-ppf.jpeg"       "$OUT_DIR/detailing/ppf-plenka-bmw.jpg"
copy_if_missing "detailing-polishing.jpeg" "$OUT_DIR/detailing/polirovka-kuzova.jpg"

echo
echo "→ Шаг 3/3: проекты, мастерская, видео"
copy_if_missing "project-bmw-x7.jpeg"      "$OUT_DIR/projects/bmw-x7-detailing-spb.jpg"
copy_if_missing "project-mercedes-s.jpeg"  "$OUT_DIR/projects/mercedes-s-class-keramika.jpg"
copy_if_missing "workshop-1.jpeg"          "$OUT_DIR/workshop/hp-tuning-boks-1.jpg"
copy_if_missing "workshop-2.jpeg"          "$OUT_DIR/workshop/hp-tuning-boks-2.jpg"

# Видео
copy_if_missing "A001_C001.mov"            "$OUT_DIR/videos/hp-tuning-overview.mp4"
copy_if_missing "A001_C002.mov"            "$OUT_DIR/videos/hp-tuning-detailing.mp4"
copy_if_missing "showreel.mov"             "$OUT_DIR/videos/hp-tuning-showreel.mp4"

echo
echo "✓ Готово. Папка $OUT_DIR содержит файлы с SEO-friendly именами."
echo
echo "Дальше:"
echo "  1. Скопируйте $OUT_DIR/hero/*       в next/public/images/hero/"
echo "  2. Скопируйте $OUT_DIR/og/*         в next/public/images/og/"
echo "  3. Скопируйте $OUT_DIR/services/*   в next/public/images/services/"
echo "  4. Скопируйте $OUT_DIR/detailing/*  в next/public/images/detailing/"
echo "  5. Скопируйте $OUT_DIR/projects/*   в next/public/images/projects/"
echo "  6. Скопируйте $OUT_DIR/workshop/*   в next/public/images/workshop/"
echo "  7. Скопируйте $OUT_DIR/videos/*     в next/public/videos/"
echo
echo "Для оптимизации (опционально, требует ImageMagick):"
echo "  brew install imagemagick"
echo "  for f in $OUT_DIR/**/*.jpg; do"
echo "    convert \"\$f\" -strip -interlace JPEG -quality 82 \"\$f\""
echo "  done"
