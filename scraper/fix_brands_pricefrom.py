"""
Fix priceFrom in brands.json based on actual minimum Stage 1 prices
from sevenforce-parsed.json (already × 0.70 ↑500).

Strategy:
- For brands present in sevenforce-parsed: use the real min Stage 1 price,
  rounded DOWN to nearest 500 ₽ (it's already a multiple of 500 actually).
- For brands NOT in sevenforce-parsed (subaru, honda, peugeot, citroen, landrover-alias):
  keep current value unchanged.
- Update top-level brand.priceFrom only. Series-level priceFrom requires
  manual generation→model mapping and is left for later.
"""
import json, math, sys
from pathlib import Path

ROOT = Path('/home/user/webapp/next/src/data')

with open(ROOT / 'sevenforce-parsed.json') as f:
    sf = json.load(f)

# Compute min Stage 1 per brand
brand_mins = {}
for brand in sf['brands']:
    bslug = brand['slug']
    brand_min = None
    for model in brand.get('models', []):
        for variant in model.get('variants', []):
            stages = variant.get('stages', {}) or {}
            s1 = stages.get('stage1') or {}
            price = s1.get('our') or s1.get('ours') or variant.get('our_price')
            if price and isinstance(price, (int, float)) and price > 0:
                if brand_min is None or price < brand_min:
                    brand_min = int(price)
    if brand_min:
        brand_mins[bslug] = brand_min

# Load brands.json (list)
with open(ROOT / 'brands.json') as f:
    brands = json.load(f)

# Backup
with open(ROOT / 'brands.json.bak', 'w') as f:
    json.dump(brands, f, ensure_ascii=False, indent=2)

changes = []
for b in brands:
    slug = b['slug']
    cur = b.get('priceFrom')
    real = brand_mins.get(slug)
    if real and real != cur:
        # real is already a multiple of 500 (since computed × 0.70 ↑500)
        # but round down to safe 500 just in case
        new_price = int(real // 500) * 500
        b['priceFrom'] = new_price
        changes.append((slug, cur, new_price))

with open(ROOT / 'brands.json', 'w') as f:
    json.dump(brands, f, ensure_ascii=False, indent=2)

print(f"Updated {len(changes)} brands:")
for slug, old, new in changes:
    diff = new - old
    print(f"  {slug:15} {old:>8} → {new:>8}  ({diff:+d})")

print(f"\nNot updated (no data in sevenforce-parsed):")
sf_slugs = set(brand_mins.keys())
for b in brands:
    if b['slug'] not in sf_slugs:
        print(f"  {b['slug']:15} kept at {b.get('priceFrom')}")
