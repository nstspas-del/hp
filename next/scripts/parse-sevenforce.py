#!/usr/bin/env python3
"""
Парсер sevenforce.ru → обновляет competitor_price в calculator.json
Использует data-price="XXXXX" атрибут — первое значение = Stage1, второе = Stage2, третье = Stage3

Запуск: cd next && python3 scripts/parse-sevenforce.py
"""
import json, time, re, os

BASE = "https://sevenforce.ru"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "ru-RU,ru;q=0.9",
    "Connection": "keep-alive",
}

BRAND_MAP = {
    "bmw": "bmw", "mercedes": "mercedes", "audi": "audi",
    "porsche": "porsche", "volkswagen": "volkswagen", "volvo": "volvo",
    "lexus": "lexus", "land-rover": "land-rover", "jaguar": "jaguar",
    "toyota": "toyota", "kia": "kia", "nissan": "nissan", "genesis": "genesis",
}

MODEL_MAP = {
    ("bmw", "1er"): "1er", ("bmw", "2er"): "2er", ("bmw", "3er"): "3er",
    ("bmw", "4er"): "4er", ("bmw", "5er"): "5er", ("bmw", "6er"): "6er",
    ("bmw", "7er"): "7er", ("bmw", "8er"): "8er",
    ("bmw", "x1"): "x1", ("bmw", "x3"): "x3", ("bmw", "x4"): "x4",
    ("bmw", "x5"): "x5", ("bmw", "x6"): "x6", ("bmw", "x7"): "x7",
    ("bmw", "m3"): "m3", ("bmw", "m5"): "m5",
    ("mercedes", "c-class"): "c-class", ("mercedes", "e-class"): "e-class",
    ("mercedes", "s-class"): "s-class", ("mercedes", "gle"): "gle",
    ("mercedes", "glc"): "glc", ("mercedes", "gls"): "gls",
    ("mercedes", "a-class"): "a-class", ("mercedes", "cla"): "cla",
    ("audi", "a3"): "a3", ("audi", "a4"): "a4", ("audi", "a5"): "a5",
    ("audi", "a6"): "a6", ("audi", "a7"): "a7", ("audi", "a8"): "a8",
    ("audi", "q5"): "q5", ("audi", "q7"): "q7", ("audi", "q8"): "q8",
    ("porsche", "911"): "911", ("porsche", "cayenne"): "cayenne",
    ("porsche", "panamera"): "panamera", ("porsche", "macan"): "macan",
    ("volkswagen", "golf"): "golf", ("volkswagen", "tiguan"): "tiguan",
    ("volkswagen", "touareg"): "touareg",
}

def fetch(url):
    from urllib.request import urlopen, Request
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=12) as r:
            return r.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"    ⚠ {e}")
        return ""

def extract_stage_prices(html):
    """Извлекает Stage цены через data-price атрибут SevenForce."""
    # Паттерн: data-price="35000"  (только цены без опций - total price)
    # Берём только из class="price total"
    totals = re.findall(r'class="price total"[^>]*data-price="(\d+)"', html)
    if not totals:
        # Fallback: любой data-price в диапазоне
        totals = re.findall(r'data-price="(\d+)"', html)
    
    prices = []
    seen = set()
    for t in totals:
        n = int(t)
        if 10000 <= n <= 300000 and n not in seen:
            seen.add(n)
            prices.append(n)
    return prices  # [stage1, stage2, stage3, ...]

def get_variant_urls(brand_sf, model_sf, limit=4):
    """URL конкретных модификаций на странице модели."""
    html = fetch(f"{BASE}/chip-tuning/{brand_sf}/{model_sf}")
    if not html:
        return []
    pattern = rf'href="(/chip-tuning/{re.escape(brand_sf)}/{re.escape(model_sf)}/[^"#]+)"'
    found = re.findall(pattern, html)
    unique = []
    for l in found:
        parts = [p for p in l.split("/") if p]
        if len(parts) >= 5:
            full = BASE + l
            if full not in unique:
                unique.append(full)
    return unique[:limit]

def get_competitor_prices(brand_sf, model_sf):
    """
    Возвращает (stage1, stage2, stage3) — средние цены по нескольким модификациям.
    """
    variant_urls = get_variant_urls(brand_sf, model_sf)

    all_s = [[], [], []]

    pages = variant_urls if variant_urls else [f"{BASE}/chip-tuning/{brand_sf}/{model_sf}"]
    for url in pages[:4]:
        time.sleep(0.7)
        html = fetch(url)
        if not html:
            continue
        prices = extract_stage_prices(html)
        for i in range(3):
            if len(prices) > i:
                all_s[i].append(prices[i])

    def avg(lst):
        if not lst:
            return None
        return int(round(sum(lst) / len(lst) / 500) * 500)

    return avg(all_s[0]), avg(all_s[1]), avg(all_s[2])


def main():
    calc_path = os.path.normpath(
        os.path.join(os.path.dirname(__file__), "..", "src", "data", "calculator.json")
    )
    with open(calc_path, encoding="utf-8") as f:
        data = json.load(f)

    updated_total = 0

    for brand in data["brands"]:
        bs = brand["slug"]
        sf_brand = BRAND_MAP.get(bs)
        if not sf_brand:
            continue

        print(f"\n🚗 {brand['name']}")

        for model in brand["models"]:
            ms = model["slug"]
            sf_model = MODEL_MAP.get((bs, ms), ms)

            print(f"  ⏳ {model['name']} → /chip-tuning/{sf_brand}/{sf_model}")
            s1, s2, s3 = get_competitor_prices(sf_brand, sf_model)

            if s1 and s1 >= 15000:
                print(f"     ✓ Stage1={s1:,} | Stage2={s2 or '?':} | Stage3={s3 or '?':}")
                base_our = model["variants"][0]["our_price"] if model["variants"] else 1
                for v in model["variants"]:
                    ratio = v["our_price"] / base_our if base_our else 1
                    comp = int(round(s1 * ratio / 500) * 500)
                    v["competitor_price"] = max(comp, v["our_price"] + 3000)
                    updated_total += 1
            else:
                print(f"     ✗ не найдено → ставим our_price + 5 000")
                for v in model["variants"]:
                    v["competitor_price"] = v["our_price"] + 5000

            time.sleep(1.3)

    with open(calc_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Обновлено: {updated_total} вариантов")
    print(f"   Файл: {calc_path}")


if __name__ == "__main__":
    main()
