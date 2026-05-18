#!/usr/bin/env python3
"""
Пересчитывает цены в sevenforce-parsed.json по формуле:
our_price = ceil(competitor_price * 0.70 / 500) * 500

Это исправляет ошибку: текущие цены посчитаны как × 0.75 без округления.
Правильная формула HP Тюнинг: × 0.70, округление вверх до 500 ₽.
"""
import json
import math
import shutil
from pathlib import Path

SRC = Path('/home/user/webapp/next/src/data/sevenforce-parsed.json')
BAK = SRC.with_suffix('.json.bak075')

def ceil500(value):
    if not value or value <= 0:
        return None
    return int(math.ceil(value / 500.0) * 500)

# Делаем бэкап
if not BAK.exists():
    shutil.copy(SRC, BAK)
    print(f"Backup -> {BAK}")

data = json.loads(SRC.read_text(encoding='utf-8'))

total_variants = 0
total_stages = 0
changed = 0
samples_before = []
samples_after = []

for brand in data['brands']:
    for model in brand.get('models', []):
        for variant in model.get('variants', []):
            total_variants += 1
            stages = variant.get('stages', {})
            for stage_key, stage in stages.items():
                comp = stage.get('competitor')
                if not comp:
                    continue
                total_stages += 1
                new_our = ceil500(comp * 0.70)
                # Старая цена
                old_our = stage.get('our') or stage.get('ours')
                if old_our != new_our:
                    changed += 1
                    if len(samples_before) < 5:
                        samples_before.append(
                            f"{brand['name']}/{variant['id']}/{stage_key}: comp={comp}, old={old_our} → new={new_our}"
                        )
                stage['our'] = new_our
                # Удаляем 'ours' если есть (для единообразия)
                if 'ours' in stage:
                    del stage['ours']

            # Обновляем top-level цены варианта (берём stage1)
            stage1 = stages.get('stage1', {})
            if stage1.get('competitor') and stage1.get('our'):
                variant['competitor_price'] = stage1['competitor']
                variant['our_price'] = stage1['our']

SRC.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

print(f"\n=== Пересчёт завершён ===")
print(f"Всего вариантов:    {total_variants}")
print(f"Всего цен (этапов): {total_stages}")
print(f"Изменено цен:       {changed}")
print(f"\nПримеры изменений:")
for s in samples_before:
    print(f"  {s}")

# Финальный размер
print(f"\nФайл: {SRC.stat().st_size:,} байт")
