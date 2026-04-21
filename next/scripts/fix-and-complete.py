#!/usr/bin/env python3
"""
Добирает оставшиеся бренды с SevenForce и добавляет к уже существующим данным.
Исправляет структуру: ours -> our для совместимости с компонентом.
"""
import requests, re, json, time, os, sys

BASE = "https://sevenforce.ru"
OUT = "src/data/sevenforce-parsed.json"
DELAY = 0.25

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "ru-RU,ru;q=0.9",
}

# Все бренды
ALL_BRANDS = [
    {"name": "BMW", "slug": "bmw"},
    {"name": "Mercedes-Benz", "slug": "mercedes"},
    {"name": "Audi", "slug": "audi"},
    {"name": "Porsche", "slug": "porsche"},
    {"name": "Land Rover", "slug": "land-rover"},
    {"name": "Volkswagen", "slug": "volkswagen"},
    {"name": "Volvo", "slug": "volvo"},
    {"name": "Toyota", "slug": "toyota"},
    {"name": "Lexus", "slug": "lexus"},
    {"name": "KIA", "slug": "kia"},
    {"name": "Hyundai", "slug": "hyundai"},
    {"name": "Nissan", "slug": "nissan"},
    {"name": "MINI", "slug": "mini"},
    {"name": "Skoda", "slug": "skoda"},
    {"name": "Jaguar", "slug": "jaguar"},
    {"name": "Mitsubishi", "slug": "mitsubishi"},
    {"name": "Mazda", "slug": "mazda"},
    {"name": "Subaru", "slug": "subaru"},
    {"name": "Infiniti", "slug": "infiniti"},
    {"name": "Ford", "slug": "ford"},
    {"name": "Jeep", "slug": "jeep"},
    {"name": "Bentley", "slug": "bentley"},
    {"name": "Maserati", "slug": "maserati"},
    {"name": "SEAT", "slug": "seat"},
    {"name": "Alfa Romeo", "slug": "alfa-romeo"},
    {"name": "Ferrari", "slug": "ferrari"},
    {"name": "Lamborghini", "slug": "lamborghini"},
    {"name": "Opel", "slug": "opel"},
    {"name": "Renault", "slug": "renault"},
    {"name": "Genesis", "slug": "genesis"},
    {"name": "Cadillac", "slug": "cadillac"},
    {"name": "Saab", "slug": "saab"},
    {"name": "McLaren", "slug": "mclaren"},
]

def fetch(url, retries=2):
    for i in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            if r.status_code == 200:
                return r.text
        except:
            time.sleep(1)
    return ""

def get_prices(html):
    prices = re.findall(r'data-price=["\']?(\d+)["\']?', html)
    return [int(p) for p in prices] if prices else []

def fix_variant_structure(variant):
    """Исправляем структуру: ours -> our в stages"""
    if 'stages' in variant:
        for stage_key, stage_data in variant['stages'].items():
            if 'ours' in stage_data and 'our' not in stage_data:
                stage_data['our'] = stage_data.pop('ours')
    return variant

def parse_brand_quick(brand_slug, brand_name):
    """Быстрый парсинг бренда - только первая страница"""
    url = f"{BASE}/chip-tuning/{brand_slug}/"
    html = fetch(url)
    if not html:
        return None
    
    pattern = rf'/chip-tuning/{re.escape(brand_slug)}/([a-z0-9.-]+)/([a-z0-9.-]+)/([a-z0-9.-]+)'
    matches = re.findall(pattern, html)
    
    seen = set()
    variant_urls = []
    for model, gen, variant in matches:
        if model == 'gearbox' or 'kopiya' in variant or 'kopiya' in gen:
            continue
        full_url = f"{BASE}/chip-tuning/{brand_slug}/{model}/{gen}/{variant}"
        if full_url not in seen:
            seen.add(full_url)
            variant_urls.append({"url": full_url, "model_slug": model, "gen": gen, "variant": variant})
    
    # Группируем по моделям
    from collections import OrderedDict
    models_dict = OrderedDict()
    for vd in variant_urls:
        ms = vd["model_slug"]
        if ms not in models_dict:
            models_dict[ms] = []
        models_dict[ms].append(vd)
    
    models_result = []
    for model_slug, variants_data in models_dict.items():
        variants_result = []
        for vd in variants_data:
            time.sleep(DELAY)
            vhtml = fetch(vd["url"])
            if not vhtml:
                continue
            prices = get_prices(vhtml)
            if not prices:
                continue
            
            hp_match = re.search(r'[-/](\d{2,4})-(?:ls|hp|cv|ps)', vd["url"])
            hp = int(hp_match.group(1)) if hp_match else 0
            
            title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', vhtml)
            if title_match:
                title = re.sub(r'^Чип.тюнинг\s+', '', title_match.group(1).strip(), flags=re.IGNORECASE)
            else:
                title = vd["variant"].replace("-ls", "").replace("-", " ").upper()
            
            stage_prices = prices[:4]
            while len(stage_prices) < 2 and stage_prices:
                stage_prices.append(int(stage_prices[-1] * 1.4))
            
            our_prices = [int(p * 0.75) for p in stage_prices]
            
            v = {
                "id": vd["variant"],
                "label": title,
                "hp": hp,
                "our_price": our_prices[0],
                "competitor_price": stage_prices[0],
                "sevenforce_url": vd["url"],
                "stages": {}
            }
            for i, sk in enumerate(["stage1", "stage2", "stage3"]):
                if i < len(stage_prices):
                    v["stages"][sk] = {"our": our_prices[i], "competitor": stage_prices[i]}
            
            variants_result.append(v)
        
        if variants_result:
            model_name = model_slug.upper().replace("-", " ")
            # Пробуем красивое имя из страницы
            models_result.append({
                "slug": model_slug,
                "name": model_name,
                "variants": variants_result
            })
    
    if models_result:
        total_v = sum(len(m["variants"]) for m in models_result)
        print(f"  {brand_name}: {len(models_result)} мод, {total_v} вар", flush=True)
        return {"name": brand_name, "slug": brand_slug, "models": models_result}
    return None

def main():
    # Читаем существующие данные
    existing = {"brands": []}
    if os.path.exists(OUT):
        with open(OUT) as f:
            existing = json.load(f)
    
    # Исправляем структуру существующих данных (ours -> our)
    for brand in existing["brands"]:
        for model in brand.get("models", []):
            for variant in model.get("variants", []):
                fix_variant_structure(variant)
    
    existing_slugs = {b["slug"] for b in existing["brands"]}
    print(f"Уже есть: {sorted(existing_slugs)}", flush=True)
    
    todo = [b for b in ALL_BRANDS if b["slug"] not in existing_slugs]
    print(f"Добираем: {len(todo)} брендов", flush=True)
    
    for brand_info in todo:
        print(f"\n--- {brand_info['name']} ---", flush=True)
        result = parse_brand_quick(brand_info["slug"], brand_info["name"])
        if result:
            existing["brands"].append(result)
            with open(OUT, "w", encoding="utf-8") as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
            total_v = sum(len(m["variants"]) for b in existing["brands"] for m in b.get("models", []))
            print(f"✅ Сохранено. Итого: {len(existing['brands'])} брендов, {total_v} вариантов", flush=True)
        time.sleep(0.5)
    
    # Итог
    total_v = sum(len(m["variants"]) for b in existing["brands"] for m in b.get("models", []))
    total_m = sum(len(b.get("models", [])) for b in existing["brands"])
    print(f"\n🎯 ИТОГО: {len(existing['brands'])} брендов, {total_m} моделей, {total_v} вариантов", flush=True)

if __name__ == "__main__":
    main()
