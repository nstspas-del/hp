#!/usr/bin/env python3
"""
Полный парсер SevenForce.ru - все бренды, модели, варианты
Структура URL: /chip-tuning/{brand}/{model}/{generation}/{variant}
Variant может содержать точки: 1.2-tfsi-105-ls
"""
import json, re, time, subprocess

BASE = 'https://sevenforce.ru'
DISCOUNT = 0.75  # -25% от конкурента

def fetch(url, retries=3):
    for attempt in range(retries):
        try:
            result = subprocess.run(
                ['curl', '-s', '-L', '--max-time', '12', '-A',
                 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120',
                 url],
                capture_output=True, text=True, timeout=15
            )
            if result.returncode == 0 and len(result.stdout) > 100:
                return result.stdout
        except Exception:
            pass
        if attempt < retries - 1:
            time.sleep(1.5)
    return None

def extract_variant_links(html, brand_slug):
    """Извлечь все ссылки вида /chip-tuning/brand/model/gen/variant"""
    # Разрешаем точки и цифры в сегментах (напр. 1.2-tfsi-105-ls)
    pattern = rf'href="(/chip-tuning/{brand_slug}/([a-z0-9-]+)/([a-z0-9.-]+)/([a-z0-9.-]+))"'
    matches = re.findall(pattern, html)
    seen = set()
    result = []
    for full_path, model, gen, variant in matches:
        if model == 'gearbox':
            continue
        if 'kopiya' in gen or 'kopiya' in variant:
            continue
        full_url = BASE + full_path
        if full_url not in seen:
            seen.add(full_url)
            result.append({
                'url': full_url,
                'model_slug': model,
                'gen': gen,
                'variant': variant,
            })
    return result

def get_model_list(html, brand_slug):
    """Список моделей бренда"""
    links = re.findall(rf'href="/chip-tuning/{brand_slug}/([a-z0-9-]+)/?\"', html)
    result = []
    seen = set()
    for m in links:
        if m not in seen and m != 'gearbox' and not m.startswith('kopiya'):
            seen.add(m)
            result.append(m)
    return result

def get_prices(url):
    """Получить цены Stage1-4"""
    html = fetch(url)
    if not html:
        return None
    raw = re.findall(r'data-price=["\'](\d+)["\']', html)
    if not raw:
        return None
    unique = list(dict.fromkeys(int(p) for p in raw))
    stages = {}
    for i, price in enumerate(unique[:4]):
        stages[f'stage{i+1}'] = price
    return stages

BRAND_NAMES = {
    'bmw': 'BMW',
    'mercedes': 'Mercedes-Benz',
    'audi': 'Audi',
    'porsche': 'Porsche',
    'land-rover': 'Land Rover',
    'volkswagen': 'Volkswagen',
    'volvo': 'Volvo',
    'toyota': 'Toyota',
}

MODEL_NAMES = {
    '1er': '1 Series', '2er': '2 Series', '3er': '3 Series',
    '4er': '4 Series', '5er': '5 Series', '6er': '6 Series',
    '7er': '7 Series', '8er': '8 Series', 'i8': 'i8',
    '1m': '1M', 'm2': 'M2', 'm3': 'M3', 'm4': 'M4', 'm5': 'M5',
    'm6': 'M6', 'm8': 'M8', 'x1': 'X1', 'x2': 'X2', 'x3': 'X3',
    'x3m': 'X3M', 'x4': 'X4', 'x4m': 'X4M', 'x5': 'X5', 'x5m': 'X5M',
    'x6': 'X6', 'x6m': 'X6M', 'x7': 'X7', 'z4': 'Z4', 'z4m': 'Z4M',
    'a-class': 'A-Class', 'b-class': 'B-Class', 'c-class': 'C-Class',
    'e-class': 'E-Class', 's-class': 'S-Class', 'g-class': 'G-Class',
    'gl-class': 'GL-Class', 'gla-class': 'GLA', 'glb-class': 'GLB',
    'glc': 'GLC', 'glc-coupe': 'GLC Coupe', 'gle-class': 'GLE',
    'gle-coupe': 'GLE Coupe', 'glk-class': 'GLK', 'gls-class': 'GLS',
    'cls-class': 'CLS', 'cla-class': 'CLA', 'cl-class': 'CL',
    'amg-gt': 'AMG GT', 'amg-gt-4-door': 'AMG GT 4-Door',
    'gt-class': 'GT-Class', 'clk-class': 'CLK', 'clc-class': 'CLC',
    'sl-class': 'SL', 'slk-class': 'SLK', 'slc-class': 'SLC',
    'sls-class': 'SLS', 'sprinter': 'Sprinter', 'v-class': 'V-Class',
    'vito': 'Vito', 'viano': 'Viano', 'citan': 'Citan',
    'maybach': 'Maybach', 'r-class': 'R-Class', 'm-class': 'M-Class',
    'x-class': 'X-Class', 'proshivka-modulya-cpc': 'CPC Module',
    'a1': 'A1', 'a3': 'A3', 'a4': 'A4', 'a5': 'A5', 'a6': 'A6',
    'a7': 'A7', 'a8': 'A8', 'q2': 'Q2', 'q3': 'Q3', 'q5': 'Q5',
    'q7': 'Q7', 'q8': 'Q8', 'r8': 'R8', 'tt': 'TT', 'tts': 'TTS', 'ttrs': 'TT RS',
    'rs3': 'RS3', 'rs4': 'RS4', 'rs5': 'RS5', 'rs6': 'RS6',
    'rs7': 'RS7', 'rs-q3': 'RS Q3', 'rs-q8': 'RS Q8',
    's1': 'S1', 's3': 'S3', 's4': 'S4', 's5': 'S5', 's6': 'S6',
    's7': 'S7', 's8': 'S8', 'sq2': 'SQ2', 'sq5': 'SQ5', 'sq7': 'SQ7', 'sq8': 'SQ8',
    '911': '911', '911-gt2': '911 GT2', '911-gt3': '911 GT3',
    'boxster': 'Boxster', 'cayenne': 'Cayenne', 'cayman': 'Cayman',
    'macan': 'Macan', 'panamera': 'Panamera',
    'defender': 'Defender', 'discovery': 'Discovery',
    'discovery-sport': 'Discovery Sport', 'freelander': 'Freelander',
    'range-rover': 'Range Rover', 'range-rover-evoque': 'Range Rover Evoque',
    'range-rover-velar': 'Range Rover Velar', 'range-rover-sport': 'Range Rover Sport',
    'golf': 'Golf', 'golf-gti': 'Golf GTI', 'golf-r': 'Golf R',
    'passat': 'Passat', 'passat-cc': 'Passat CC', 'tiguan': 'Tiguan',
    'touareg': 'Touareg', 'polo': 'Polo', 'polo-gti': 'Polo GTI',
    'polo-r-wrc': 'Polo R WRC', 'phaeton': 'Phaeton', 'sharan': 'Sharan',
    'jetta': 'Jetta', 'scirocco': 'Scirocco', 'scirocco-r': 'Scirocco R',
    'beetle': 'Beetle', 'eos': 'EOS', 'caddy': 'Caddy', 'arteon': 'Arteon',
    'amarok': 'Amarok', 'atlas-teramont': 'Atlas/Teramont',
    'caravelle': 'Caravelle', 'multivan-transporter': 'Multivan/T',
    't-roc': 'T-Roc', 't-cross': 'T-Cross', 'touran': 'Touran', 'lamando': 'Lamando',
    'xc60': 'XC60', 'xc70': 'XC70', 'xc90': 'XC90',
    's60': 'S60', 's80': 'S80', 's90': 'S90', 's40': 'S40',
    'v40': 'V40', 'v60': 'V60', 'v70': 'V70', 'v90-v90-cc': 'V90/V90 CC',
    'c30': 'C30', 'c70': 'C70',
    'camry': 'Camry', 'land-cruiser-200': 'Land Cruiser 200',
    'land-cruiser-prado': 'Land Cruiser Prado',
    'rav-4': 'RAV4', 'supra': 'Supra', 'gt86': 'GT86',
    'hilux': 'Hilux', 'auris': 'Auris', 'verso': 'Verso',
}

def make_label(variant_slug, hp):
    """Красивое название из slug"""
    name = re.sub(r'-\d+-ls$', '', variant_slug)
    name = name.replace('-', ' ').upper()
    if hp:
        name = f"{name} {hp} л.с."
    return name.strip()

print("=== Full SevenForce Parser (ALL models) ===\n")
all_brands = []

for brand_slug, brand_name in BRAND_NAMES.items():
    print(f"\n{'='*55}")
    print(f"Brand: {brand_name}")

    brand_html = fetch(f'{BASE}/chip-tuning/{brand_slug}/')
    if not brand_html:
        print(f"  ERROR: cannot fetch brand page")
        continue

    # Получаем список моделей
    model_slugs = get_model_list(brand_html, brand_slug)
    print(f"  Models found: {len(model_slugs)}")

    # Собираем все варианты по каждой модели отдельно
    all_variants = []
    seen_urls = set()

    for ms in model_slugs:
        model_html = fetch(f'{BASE}/chip-tuning/{brand_slug}/{ms}')
        if not model_html:
            time.sleep(0.3)
            continue
        new_v = extract_variant_links(model_html, brand_slug)
        for v in new_v:
            if v['url'] not in seen_urls:
                seen_urls.add(v['url'])
                all_variants.append(v)
        time.sleep(0.3)

    print(f"  Total variants: {len(all_variants)}")

    # Группируем по модели
    models_dict = {}
    for v in all_variants:
        ms = v['model_slug']
        if ms not in models_dict:
            models_dict[ms] = []
        models_dict[ms].append(v)

    brand_models = []
    for model_slug, model_variants_raw in sorted(models_dict.items()):
        model_name = MODEL_NAMES.get(model_slug, model_slug.replace('-', ' ').title())
        print(f"\n  {model_name}: {len(model_variants_raw)} vars")

        model_variants = []
        for vr in model_variants_raw:
            url = vr['url']
            stages = get_prices(url)
            if not stages:
                time.sleep(0.3)
                continue

            stage1 = stages.get('stage1', 0)
            if not stage1:
                continue

            lp = url.split('/')[-1]
            hm = re.search(r'(\d+)-ls$', lp)
            hp = int(hm.group(1)) if hm else 0

            our_price = int(stage1 * DISCOUNT)
            label = make_label(vr['variant'], hp)

            model_variants.append({
                'id': vr['variant'],
                'label': label,
                'hp': hp,
                'our_price': our_price,
                'competitor_price': stage1,
                'sevenforce_url': url,
                'stages': {
                    'stage1': {'competitor': stage1, 'ours': our_price},
                    'stage2': {
                        'competitor': stages.get('stage2', 0),
                        'ours': int(stages.get('stage2', 0) * DISCOUNT)
                    },
                    'stage3': {
                        'competitor': stages.get('stage3', 0),
                        'ours': int(stages.get('stage3', 0) * DISCOUNT)
                    },
                }
            })
            print(f"    + {label}: {stage1:,} -> {our_price:,}")
            time.sleep(0.3)

        if model_variants:
            brand_models.append({
                'slug': model_slug,
                'name': model_name,
                'sevenforce_url': f'{BASE}/chip-tuning/{brand_slug}/{model_slug}',
                'variants': model_variants,
            })
        time.sleep(0.2)

    if brand_models:
        tv = sum(len(m['variants']) for m in brand_models)
        all_brands.append({
            'slug': brand_slug,
            'name': brand_name,
            'models': brand_models,
        })
        print(f"\n  OK {brand_name}: {len(brand_models)} models, {tv} variants")
    else:
        print(f"  WARN: no data for {brand_name}")

# Сохраняем
out = 'src/data/sevenforce-parsed.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump({'brands': all_brands}, f, ensure_ascii=False, indent=2)

tb = len(all_brands)
tm = sum(len(b['models']) for b in all_brands)
tv = sum(len(m['variants']) for b in all_brands for m in b['models'])
print(f"\n{'='*55}")
print(f"TOTAL: {tb} brands, {tm} models, {tv} variants")
print(f"Saved: {out}")
