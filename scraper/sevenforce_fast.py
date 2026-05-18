#!/usr/bin/env python3
"""
Быстрый скрапер Seven Force: только high-priority бренды,
лимит страниц на бренд, таймаут на каждую страницу, прогресс в stdout.
"""
import csv
import json
import math
import re
import sys
import time
from collections import deque
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

ROOT = 'https://sevenforce.ru'
HEADERS = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124.0'}

# Бренды, по которым в HP Тюнинг СПб реально приезжают (топ-приоритет)
PRIORITY_BRANDS = [
    {"brand":"BMW","slug":"bmw","brand_url":"https://sevenforce.ru/chip-tuning/bmw/"},
    {"brand":"Mercedes","slug":"mercedes","brand_url":"https://sevenforce.ru/chip-tuning/mercedes/"},
    {"brand":"Audi","slug":"audi","brand_url":"https://sevenforce.ru/chip-tuning/audi/"},
    {"brand":"Porsche","slug":"porsche","brand_url":"https://sevenforce.ru/chip-tuning/porsche/"},
    {"brand":"Volkswagen","slug":"volkswagen","brand_url":"https://sevenforce.ru/chip-tuning/volkswagen/"},
    {"brand":"Skoda","slug":"skoda","brand_url":"https://sevenforce.ru/chip-tuning/skoda/"},
    {"brand":"Toyota","slug":"toyota","brand_url":"https://sevenforce.ru/chip-tuning/toyota/"},
    {"brand":"Lexus","slug":"lexus","brand_url":"https://sevenforce.ru/chip-tuning/lexus"},
    {"brand":"Land Rover","slug":"land-rover","brand_url":"https://sevenforce.ru/chip-tuning/land-rover"},
    {"brand":"Haval","slug":"haval","brand_url":"https://sevenforce.ru/chip-tuning/haval"},
    {"brand":"Chery","slug":"chery","brand_url":"https://sevenforce.ru/chip-tuning/chery"},
    {"brand":"Geely","slug":"geely","brand_url":"https://sevenforce.ru/chip-tuning/geely"},
    {"brand":"EXEED","slug":"exeed","brand_url":"https://sevenforce.ru/chip-tuning/exeed"},
    {"brand":"Tank","slug":"kopiya-toyota","brand_url":"https://sevenforce.ru/chip-tuning/kopiya-toyota/"},
    {"brand":"Changan","slug":"kopiya-chery","brand_url":"https://sevenforce.ru/chip-tuning/kopiya-chery"},
    {"brand":"Hyundai","slug":"hyundai","brand_url":"https://sevenforce.ru/chip-tuning/hyundai"},
    {"brand":"Kia","slug":"kia","brand_url":"https://sevenforce.ru/chip-tuning/kia"},
    {"brand":"Genesis","slug":"genesis","brand_url":"https://sevenforce.ru/chip-tuning/genesis"},
]

# Конфигурация
MAX_PAGES_PER_BRAND = 60   # лимит листингов на бренд (модели/поколения)
MAX_ENGINE_PAGES_PER_BRAND = 80  # лимит страниц двигателей на бренд
REQUEST_TIMEOUT = 8
DELAY_BETWEEN_REQUESTS = 0.15


def ceil500(value):
    if not value or value <= 0:
        return None
    return int(math.ceil(value / 500.0) * 500)


def fetch(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200:
            return None
        return r.text
    except Exception:
        return None


def is_engine_page(url):
    """Двигатель: 4+ сегмента после /chip-tuning/, заканчивается на -ls или цифра-ls"""
    # Например: /chip-tuning/bmw/5er/g30-2016-2020/g30-m550i-530-ls
    path = url.replace(ROOT, '').strip('/')
    parts = path.split('/')
    if len(parts) < 4:
        return False
    if not parts[0] == 'chip-tuning':
        return False
    last = parts[-1].lower()
    return last.endswith('-ls') or '-ls-' in last


def extract_links(html, base_url, brand_slug):
    """Извлекаем ссылки внутри chip-tuning/{brand_slug}/"""
    soup = BeautifulSoup(html, 'html.parser')
    links = set()
    prefix = f'/chip-tuning/{brand_slug}'
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('/'):
            href = ROOT + href
        if href.startswith(ROOT) and prefix in href:
            # Убираем якори и параметры
            href = href.split('#')[0].split('?')[0].rstrip('/')
            links.add(href)
    return links


def parse_engine_page(url, html):
    soup = BeautifulSoup(html, 'html.parser')
    text = soup.get_text(' ', strip=True)

    # Заголовок страницы — например, "Чип тюнинг BMW 5er G30 M550i 530 лс | ..."
    title_m = re.search(r'^([^|]+)\s*\|', text)
    title = title_m.group(1).strip() if title_m else ''

    # Цена "от X рублей"
    price_m = re.search(r'от\s+(\d{1,3}(?:\s\d{3})*)\s*руб', text)
    base_price = int(price_m.group(1).replace(' ', '')) if price_m else None

    # Заводская мощность (число перед лс в заголовке)
    hp_in_title = re.search(r'(\d{2,4})\s*лс', title)
    stock_hp = int(hp_in_title.group(1)) if hp_in_title else None

    # Stage 1 после тюнинга — ищем "После тюнинга" блок и потом мощность/момент
    # Pattern: "Мощность XXX лс YYY лс + ZZ лс"
    power_m = re.search(r'Мощность\s+(\d+)\s*лс\s*(\d+)\s*лс\s*\+\s*(\d+)', text)
    tuned_hp_stage1 = int(power_m.group(2)) if power_m else None
    hp_gain_stage1 = int(power_m.group(3)) if power_m else None

    torque_m = re.search(r'момент\s+(\d+)\s*нм\s*(\d+)\s*нм\s*\+\s*(\d+)', text, re.IGNORECASE)
    stock_nm = int(torque_m.group(1)) if torque_m else None
    tuned_nm_stage1 = int(torque_m.group(2)) if torque_m else None

    # 0-100
    zero_m = re.search(r'0-100[^0-9]*([0-9.,]+)\s*сек\s*([0-9.,]+)\s*сек', text)
    z_before = zero_m.group(1).replace(',', '.') if zero_m else None
    z_after = zero_m.group(2).replace(',', '.') if zero_m else None

    return {
        'source_url': url,
        'title': title,
        'stock_hp': stock_hp,
        'tuned_hp_stage1': tuned_hp_stage1,
        'hp_gain_stage1': hp_gain_stage1,
        'stock_nm': stock_nm,
        'tuned_nm_stage1': tuned_nm_stage1,
        'zero_to_100_before': z_before,
        'zero_to_100_stage1': z_after,
        'seven_force_price': base_price,
        'hp_tuning_price': ceil500(base_price * 0.70) if base_price else None,
    }


def scrape_brand(brand_entry):
    brand = brand_entry['brand']
    slug = brand_entry['slug']
    root_url = brand_entry['brand_url'].rstrip('/')

    print(f"\n=== {brand} ({slug}) ===", flush=True)
    visited = set()
    queue = deque([root_url])
    engine_records = []
    listing_visited = 0

    while queue and listing_visited < MAX_PAGES_PER_BRAND and len(engine_records) < MAX_ENGINE_PAGES_PER_BRAND:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)

        html = fetch(url)
        time.sleep(DELAY_BETWEEN_REQUESTS)
        if not html:
            continue

        if is_engine_page(url):
            rec = parse_engine_page(url, html)
            rec['brand'] = brand
            rec['brand_slug'] = slug
            if rec['seven_force_price']:
                engine_records.append(rec)
                if len(engine_records) % 5 == 0:
                    print(f"  + {len(engine_records)} engines so far", flush=True)
        else:
            listing_visited += 1
            for link in extract_links(html, url, slug):
                if link not in visited:
                    queue.append(link)

    print(f"  -> DONE: {len(engine_records)} engines, {listing_visited} listing pages", flush=True)
    return engine_records


def main():
    started = time.time()
    all_records = []

    for brand in PRIORITY_BRANDS:
        records = scrape_brand(brand)
        all_records.extend(records)
        elapsed = time.time() - started
        print(f"  [Total so far: {len(all_records)} records, elapsed {elapsed:.0f}s]", flush=True)

    # Сохраняем
    out_json = '/home/user/webapp/scraper/sevenforce_data.json'
    out_csv = '/home/user/webapp/scraper/sevenforce_data.csv'

    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(all_records, f, ensure_ascii=False, indent=2)

    if all_records:
        with open(out_csv, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=list(all_records[0].keys()))
            writer.writeheader()
            writer.writerows(all_records)

    elapsed = time.time() - started
    print(f"\n=== FINISHED in {elapsed:.0f}s. Total: {len(all_records)} engines ===")


if __name__ == '__main__':
    main()
