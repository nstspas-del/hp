#!/usr/bin/env python3
"""
Парсер оставшихся брендов SevenForce.
Читает уже собранные данные и добавляет недостающие бренды.
Цены -25% от SevenForce.
"""
import requests, re, json, time, os, sys
from collections import OrderedDict

BASE = "https://sevenforce.ru"
OUT = "src/data/sevenforce-parsed.json"
DELAY = 0.3

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}

# Все бренды SevenForce с их слагами
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

def fetch(url, retries=3):
    for i in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=20)
            if r.status_code == 200:
                return r.text
            time.sleep(1)
        except Exception as e:
            print(f"  [ERR] {url}: {e}", flush=True)
            time.sleep(2)
    return ""

def get_prices_from_page(html):
    """Извлекаем цены из data-price атрибутов."""
    prices = re.findall(r'data-price=["\']?(\d+)["\']?', html)
    if prices:
        return [int(p) for p in prices]
    # Fallback: ищем в тексте "Стоимость ... руб"
    prices2 = re.findall(r'(\d{2,6})\s*(?:₽|руб)', html)
    if prices2:
        return [int(p) for p in prices2 if 10000 <= int(p) <= 500000]
    return []

def parse_brand(brand_slug, brand_name):
    """Парсим все модели и варианты бренда."""
    url = f"{BASE}/chip-tuning/{brand_slug}/"
    print(f"\n=== Парсим {brand_name} ({brand_slug}) ===", flush=True)
    html = fetch(url)
    if not html:
        print(f"  Не удалось получить страницу {url}", flush=True)
        return None
    
    # Ищем ссылки вида /chip-tuning/brand/model/generation/variant
    pattern = rf'/chip-tuning/{re.escape(brand_slug)}/([a-z0-9.-]+)/([a-z0-9.-]+)/([a-z0-9.-]+)'
    matches = re.findall(pattern, html)
    
    # Также ищем прямые модели (2 уровня)
    pattern2 = rf'/chip-tuning/{re.escape(brand_slug)}/([a-z0-9.-]+)/?\"'
    model_only = re.findall(pattern2, html)
    
    if not matches and not model_only:
        print(f"  Нет вариантов на странице бренда, пробуем прямой поиск...", flush=True)
        return None
    
    # Собираем уникальные variant URLs
    seen = set()
    variant_urls = []
    for model, gen, variant in matches:
        if model == 'gearbox' or 'kopiya' in variant or 'kopiya' in gen:
            continue
        full_url = f"{BASE}/chip-tuning/{brand_slug}/{model}/{gen}/{variant}"
        if full_url not in seen:
            seen.add(full_url)
            variant_urls.append({
                "url": full_url,
                "model_slug": model,
                "gen": gen,
                "variant": variant
            })
    
    print(f"  Найдено {len(variant_urls)} вариантов на странице бренда", flush=True)
    
    # Если мало вариантов — заходим в каждую модель отдельно
    if len(variant_urls) < 5 and model_only:
        for model_slug in set(model_only[:20]):
            if model_slug in ['gearbox', 'chip-tuning']:
                continue
            model_url = f"{BASE}/chip-tuning/{brand_slug}/{model_slug}/"
            model_html = fetch(model_url)
            if not model_html:
                continue
            time.sleep(DELAY)
            sub_matches = re.findall(
                rf'/chip-tuning/{re.escape(brand_slug)}/{re.escape(model_slug)}/([a-z0-9.-]+)/([a-z0-9.-]+)',
                model_html
            )
            for gen, variant in sub_matches:
                if 'kopiya' in variant or 'kopiya' in gen:
                    continue
                full_url = f"{BASE}/chip-tuning/{brand_slug}/{model_slug}/{gen}/{variant}"
                if full_url not in seen:
                    seen.add(full_url)
                    variant_urls.append({
                        "url": full_url,
                        "model_slug": model_slug,
                        "gen": gen,
                        "variant": variant
                    })
    
    # Группируем по моделям
    models_dict = OrderedDict()
    for vd in variant_urls:
        ms = vd["model_slug"]
        if ms not in models_dict:
            models_dict[ms] = []
        models_dict[ms].append(vd)
    
    models_result = []
    for model_slug, variants_data in models_dict.items():
        model_name = model_slug.upper().replace("-", " ")
        variants_result = []
        
        for vd in variants_data:
            time.sleep(DELAY)
            vhtml = fetch(vd["url"])
            if not vhtml:
                continue
            
            # Извлекаем цены
            prices = get_prices_from_page(vhtml)
            if not prices:
                continue
            
            # Мощность из URL
            hp_match = re.search(r'[-/](\d{2,4})-(?:ls|hp|cv|ps)', vd["url"])
            hp = int(hp_match.group(1)) if hp_match else 0
            
            # Имя варианта из URL
            variant_parts = vd["variant"].replace("-ls", "").replace("-", " ").upper()
            gen_parts = vd["gen"].replace("-", " ")
            
            # Парсим заголовок со страницы для красивого имени
            title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', vhtml)
            if title_match:
                title = title_match.group(1).strip()
                # Убираем "Чип-тюнинг" из начала
                title = re.sub(r'^Чип.тюнинг\s+', '', title, flags=re.IGNORECASE)
            else:
                title = f"{variant_parts}"
            
            # Цены Stage 1-4
            stage_prices = prices[:4]
            while len(stage_prices) < 4:
                if stage_prices:
                    stage_prices.append(int(stage_prices[-1] * 1.3))
                else:
                    break
            
            if not stage_prices:
                continue
            
            # Применяем -25%
            our_prices = [int(p * 0.75) for p in stage_prices]
            
            variant_entry = {
                "id": vd["variant"],
                "label": title,
                "hp": hp,
                "our_price": our_prices[0],
                "competitor_price": stage_prices[0],
                "stages": {
                    "stage1": {"our": our_prices[0], "competitor": stage_prices[0]},
                    "stage2": {"our": our_prices[1] if len(our_prices) > 1 else 0, "competitor": stage_prices[1] if len(stage_prices) > 1 else 0},
                    "stage3": {"our": our_prices[2] if len(our_prices) > 2 else 0, "competitor": stage_prices[2] if len(stage_prices) > 2 else 0},
                    "stage4": {"our": our_prices[3] if len(our_prices) > 3 else 0, "competitor": stage_prices[3] if len(stage_prices) > 3 else 0},
                },
                "url": vd["url"]
            }
            variants_result.append(variant_entry)
            
            if stage_prices:
                print(f"    {title}: {stage_prices[0]}₽ → {our_prices[0]}₽", flush=True)
        
        if variants_result:
            models_result.append({
                "slug": model_slug,
                "name": model_name,
                "variants": variants_result
            })
    
    if models_result:
        total_v = sum(len(m["variants"]) for m in models_result)
        print(f"  Итого: {len(models_result)} моделей, {total_v} вариантов", flush=True)
        return {
            "name": brand_name,
            "slug": brand_slug,
            "models": models_result
        }
    return None

def main():
    # Читаем уже собранные данные
    existing_data = {"brands": []}
    if os.path.exists(OUT):
        try:
            with open(OUT, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except:
            pass
    
    existing_slugs = {b["slug"] for b in existing_data.get("brands", [])}
    print(f"Уже есть: {existing_slugs}", flush=True)
    
    # Определяем какие бренды нужно обработать
    todo_brands = [b for b in ALL_BRANDS if b["slug"] not in existing_slugs]
    print(f"Нужно обработать: {len(todo_brands)} брендов", flush=True)
    
    for brand_info in todo_brands:
        result = parse_brand(brand_info["slug"], brand_info["name"])
        if result:
            existing_data["brands"].append(result)
            # Сохраняем после каждого бренда!
            with open(OUT, "w", encoding="utf-8") as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=2)
            total_variants = sum(
                len(v) 
                for b in existing_data["brands"] 
                for m in b.get("models", [])
                for v in [m.get("variants", [])]
            )
            print(f"\n✅ Сохранено. Всего брендов: {len(existing_data['brands'])}, вариантов: {total_variants}", flush=True)
        time.sleep(1)
    
    # Финальная статистика
    brands = existing_data["brands"]
    total_models = sum(len(b.get("models", [])) for b in brands)
    total_variants = sum(len(m.get("variants", [])) for b in brands for m in b.get("models", []))
    print(f"\n🎯 ФИНАЛ: {len(brands)} брендов, {total_models} моделей, {total_variants} вариантов", flush=True)

if __name__ == "__main__":
    main()
