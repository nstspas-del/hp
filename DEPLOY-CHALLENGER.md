# Деплой коммита Dodge Challenger T/A + правки Hero

**Коммит:** `6695b5b` в ветке `seo-rework`

## Одной командой на сервере (ssh root@87.228.63.177)

```bash
cd /var/www/hptuning/app/next && \
  git stash push -u -m "auto-stash before challenger deploy $(date +%s)" 2>&1 | tail -3 && \
  git fetch origin seo-rework && \
  git reset --hard origin/seo-rework && \
  git log --oneline -3 && \
  echo "=== Build ===" && \
  npm run build 2>&1 | tail -10 && \
  echo "=== Restart ===" && \
  pm2 restart hptuning && \
  sleep 2 && \
  pm2 status hptuning
```

## Смоук-тесты после деплоя

```bash
# Главная (должно быть "сотни собранных проектов" вместо "сотни проектов в работе")
curl -s https://hptuning.ru/ -u hptuning:HP75457545 | grep -oE "сотни[^<]{0,40}"

# Страница Челленджера (должна быть HTTP 200)
curl -sI https://hptuning.ru/projects/dodge-challenger-ta-hemi -u hptuning:HP75457545 | head -1

# Видео доступно (HEAD должен вернуть Content-Length ~10MB)
curl -sI https://hptuning.ru/videos/dodge-challenger-ta.mp4 -u hptuning:HP75457545 | head -5

# Листинг проектов
curl -sI https://hptuning.ru/projects -u hptuning:HP75457545 | head -1

# Sitemap должен содержать проекты
curl -s https://hptuning.ru/sitemap.xml -u hptuning:HP75457545 | grep -oE "/projects[/a-z-]*"
```

## Что в этом коммите

- ✅ Страница `/projects/dodge-challenger-ta-hemi` — полный кейс с галереей (5 фото) и плеером MP4
- ✅ 5 обработанных фото без номеров и без слова «Hard» на стене
- ✅ Видео 1080p portrait, ~10 МБ, в `/public/videos/dodge-challenger-ta.mp4`
- ✅ Карточка Челленджера на главной (ProjectCarsSection) вместо фейковых drift-bmw / vw-golf
- ✅ Карточка Челленджера в листинге `/projects/`
- ✅ Sitemap включает `/projects` и `/projects/{slug}`
- ✅ Hero: «сотни проектов в работе» → «сотни собранных проектов»

## Если деплой упрётся в локальные изменения

Перед `git reset` уже встроен `git stash push -u`, который автоматически уберёт любые локальные правки в /var/www/.
Чтобы посмотреть что заскэшилось: `git stash list`.
