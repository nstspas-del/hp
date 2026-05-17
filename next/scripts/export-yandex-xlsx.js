#!/usr/bin/env node
/**
 * Экспорт услуг из src/data/yandex-services.json в Excel-файл
 * для загрузки в Яндекс.Бизнес (карточка 99062407907).
 *
 * Запуск:
 *   cd /var/www/hptuning/app/next
 *   node scripts/export-yandex-xlsx.js
 *
 * На выходе: out/yandex-services.xlsx
 *
 * Требуется npm-пакет xlsx (написан так, чтобы при отсутствии пакета
 * вывести инструкцию по установке, а не падать с непонятной ошибкой).
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'yandex-services.json');
const OUT_DIR = path.join(__dirname, '..', 'out');
const OUT_PATH = path.join(OUT_DIR, 'yandex-services.xlsx');

if (!fs.existsSync(DATA_PATH)) {
  console.error('✗ Файл не найден:', DATA_PATH);
  process.exit(1);
}

let XLSX;
try {
  XLSX = require('xlsx');
} catch (e) {
  console.error('✗ Не установлен пакет xlsx.');
  console.error('  Установи его:  npm install xlsx --save-dev');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

const rows = data.services.map((s) => ({
  'Slug': s.slug,
  'Название (как в Яндекс.Бизнес)': s.name,
  'Категория Яндекс': s.yandexCategory,
  'Краткое описание': s.shortDescription,
  'Полное описание': s.longDescription,
  'Цена от, ₽': s.priceFrom,
  'Цена до, ₽': s.priceTo ?? '',
  'Длительность': s.duration,
  'Поддерживаемые марки': (s.marks || []).join(', '),
  'URL на сайте': `https://hptuning.ru/service/${s.slug}`,
  'Картинка': `https://hptuning.ru${s.image}`,
  'H1': s.h1,
  'Meta Title': s.metaTitle,
  'Meta Description': s.metaDescription,
}));

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const ws = XLSX.utils.json_to_sheet(rows);

// Ширина колонок (примерно)
ws['!cols'] = [
  { wch: 18 },  // slug
  { wch: 36 },  // Название
  { wch: 16 },  // Категория
  { wch: 50 },  // Кратко
  { wch: 80 },  // Полное
  { wch: 10 },  // Цена от
  { wch: 10 },  // Цена до
  { wch: 16 },  // Длительность
  { wch: 50 },  // Марки
  { wch: 45 },  // URL
  { wch: 45 },  // Картинка
  { wch: 45 },  // H1
  { wch: 60 },  // Meta Title
  { wch: 80 },  // Meta Description
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Услуги для Яндекс.Бизнес');

// Метаданные на отдельном листе
const metaRows = [
  { '': 'Карточка Яндекс.Бизнес', ' ': data._meta.yandexCardUrl },
  { '': 'ID карточки', ' ': data._meta.yandexCardId },
  { '': 'Валюта', ' ': data._meta.currency },
  { '': 'Дата обновления', ' ': data._meta.updatedAt },
  { '': 'Источник данных', ' ': 'src/data/yandex-services.json (single source of truth)' },
  { '': 'YML-фид', ' ': 'https://hptuning.ru/yandex-services.yml' },
];
const wsMeta = XLSX.utils.json_to_sheet(metaRows);
wsMeta['!cols'] = [{ wch: 28 }, { wch: 60 }];
XLSX.utils.book_append_sheet(wb, wsMeta, 'Мета');

XLSX.writeFile(wb, OUT_PATH);

console.log('✓ Готово:', OUT_PATH);
console.log('  Услуг:', rows.length);
console.log('  Категорий:', new Set(data.services.map((s) => s.yandexCategory)).size);
console.log('');
console.log('Дальше: загрузить файл в Яндекс.Бизнес → Услуги → Импорт.');
