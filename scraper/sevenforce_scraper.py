import csv
import json
import math
import re
import sys
from collections import deque
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

ROOT = 'https://sevenforce.ru/chip-tuning/'
ALLOWED_PREFIX = 'https://sevenforce.ru/chip-tuning/'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
}
CSV_HEADERS = [
    'brand','brand_slug','brand_url','model','model_slug','model_url','generation_or_year','generation_url',
    'engine_name','engine_slug','engine_url','displacement_cc','stock_hp','stock_nm','tuned_hp_stage1','tuned_nm_stage1',
    'tuned_hp_stage2','tuned_nm_stage2','tuned_hp_stage3','tuned_nm_stage3','zero_to_100_before','zero_to_100_stage1',
    'zero_to_100_stage2','zero_to_100_stage3','stage1_price','stage2_price','stage3_price','extra_options',
    'source_site','source_url','hp_tuning_formula_raw','hp_tuning_price_rounded','notes'
]
HIGH_PRIORITY = {
    'BMW','Mercedes','Audi','Porsche','Toyota','Lexus','Volkswagen','Land Rover','Haval','Chery',
    'Geely','Tank','EXEED','Changan','GAC','Hyundai','Kia','Genesis'
}


def ceil500(value):
    if value is None:
        return None
    return int(math.ceil((value * 0.70) / 500.0) * 500)


def get(url):
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    return r.text


def clean_text(text):
    return re.sub(r'\s+', ' ', text or '').strip()


def slug_from_url(url):
    path = urlparse(url).path.rstrip('/')
    return path.split('/')[-1] if path else ''


def is_detail_url(url):
    path = urlparse(url).path.strip('/').split('/')
    return len(path) >= 5 and path[0] == 'chip-tuning'


def extract_internal_chip_links(html, current_url):
    soup = BeautifulSoup(html, 'html.parser')
    links = set()
    for a in soup.select('a[href]'):
        href = urljoin(current_url, a.get('href'))
        if href.startswith(ALLOWED_PREFIX):
            links.add(href.split('#')[0])
    return sorted(links)


def parse_breadcrumbs(soup):
    crumbs = [clean_text(x.get_text(' ', strip=True)) for x in soup.select('nav.breadcrumb a, .breadcrumbs a, .breadcrumb a, .breadcrumbs span, .breadcrumb span')]
    return [c for c in crumbs if c and c.lower() not in {'seven force', 'главная', 'чип тюнинг'}]


def find_numbers_near_stage(text, stage_label):
    block = re.search(rf'{stage_label}.*?(?:Цена|Стоимость)?[^\d]*(\d[\d\s]+)\s*₽', text, re.I | re.S)
    price = int(re.sub(r'\D', '', block.group(1))) if block else None
    hp = None
    nm = None
    z = None
    hp_match = re.search(rf'{stage_label}.*?(\d+)\s*[→>-]\s*(\d+)\s*л\.?с', text, re.I | re.S)
    if hp_match:
        hp = int(hp_match.group(2))
    nm_match = re.search(rf'{stage_label}.*?(\d+)\s*[→>-]\s*(\d+)\s*нм', text, re.I | re.S)
    if nm_match:
        nm = int(nm_match.group(2))
    z_match = re.search(rf'{stage_label}.*?(\d+[\.,]?\d*)\s*[→>-]\s*(\d+[\.,]?\d*)\s*сек', text, re.I | re.S)
    if z_match:
        z = float(z_match.group(2).replace(',', '.'))
    return price, hp, nm, z


def parse_detail_page(url, html):
    soup = BeautifulSoup(html, 'html.parser')
    page_text = clean_text(soup.get_text(' ', strip=True))
    parts = [p for p in urlparse(url).path.strip('/').split('/') if p]
    brand_slug = parts[1] if len(parts) > 1 else ''
    model_slug = parts[2] if len(parts) > 2 else ''
    generation_slug = parts[3] if len(parts) > 3 else ''
    engine_slug = parts[4] if len(parts) > 4 else ''

    title = clean_text(soup.title.get_text(' ', strip=True)) if soup.title else ''
    h1 = clean_text(soup.select_one('h1').get_text(' ', strip=True)) if soup.select_one('h1') else ''
    breadcrumbs = parse_breadcrumbs(soup)

    brand = breadcrumbs[0] if len(breadcrumbs) > 0 else brand_slug.replace('-', ' ').title()
    model = breadcrumbs[1] if len(breadcrumbs) > 1 else model_slug.replace('-', ' ').title()
    generation = breadcrumbs[2] if len(breadcrumbs) > 2 else generation_slug
    engine_name = h1 or engine_slug.replace('-', ' ')

    displacement = None
    stock_hp = None
    stock_nm = None
    z_before = None

    disp_match = re.search(r'(\d{3,5})\s*см[³3]', page_text, re.I)
    if disp_match:
        displacement = int(disp_match.group(1))

    hp_nm_match = re.search(r'(\d{2,4})\s*л\.?с[^\d]+(\d{2,4})\s*нм', page_text, re.I)
    if hp_nm_match:
        stock_hp = int(hp_nm_match.group(1))
        stock_nm = int(hp_nm_match.group(2))

    z_before_match = re.search(r'0\s*[-–]\s*100[^\d]*(\d+[\.,]?\d*)\s*сек', page_text, re.I)
    if z_before_match:
        z_before = float(z_before_match.group(1).replace(',', '.'))

    stage1_price, tuned_hp_1, tuned_nm_1, z1 = find_numbers_near_stage(page_text, 'Stage\s*1')
    stage2_price, tuned_hp_2, tuned_nm_2, z2 = find_numbers_near_stage(page_text, 'Stage\s*2')
    stage3_price, tuned_hp_3, tuned_nm_3, z3 = find_numbers_near_stage(page_text, 'Stage\s*3')

    extra_options = []
    for keyword in ['снятие ограничения скорости', 'изменение максимальных оборотов', 'отключение катализаторов', 'отключение egr', 'отключение dpf']:
        if keyword.lower() in page_text.lower():
            extra_options.append(keyword)

    return {
        'brand': brand,
        'brand_slug': brand_slug,
        'brand_url': f'{ROOT}{brand_slug}/' if brand_slug else '',
        'model': model,
        'model_slug': model_slug,
        'model_url': f'{ROOT}{brand_slug}/{model_slug}/' if brand_slug and model_slug else '',
        'generation_or_year': generation,
        'generation_url': f'{ROOT}{brand_slug}/{model_slug}/{generation_slug}/' if brand_slug and model_slug and generation_slug else '',
        'engine_name': engine_name,
        'engine_slug': engine_slug,
        'engine_url': url,
        'displacement_cc': displacement,
        'stock_hp': stock_hp,
        'stock_nm': stock_nm,
        'tuned_hp_stage1': tuned_hp_1,
        'tuned_nm_stage1': tuned_nm_1,
        'tuned_hp_stage2': tuned_hp_2,
        'tuned_nm_stage2': tuned_nm_2,
        'tuned_hp_stage3': tuned_hp_3,
        'tuned_nm_stage3': tuned_nm_3,
        'zero_to_100_before': z_before,
        'zero_to_100_stage1': z1,
        'zero_to_100_stage2': z2,
        'zero_to_100_stage3': z3,
        'stage1_price': stage1_price,
        'stage2_price': stage2_price,
        'stage3_price': stage3_price,
        'extra_options': '; '.join(extra_options),
        'source_site': 'Seven Force',
        'source_url': url,
        'hp_tuning_formula_raw': 'Seven_Force_price * 0.70',
        'hp_tuning_price_rounded': ceil500(stage1_price),
        'notes': title
    }


def main():
    out_prefix = sys.argv[1] if len(sys.argv) > 1 else 'sevenforce_export'
    queue = deque([ROOT])
    seen = set()
    detail_records = []
    bad_urls = []

    while queue:
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        try:
            html = get(url)
        except Exception as e:
            bad_urls.append({'url': url, 'error': str(e)})
            continue

        if is_detail_url(url):
            detail_records.append(parse_detail_page(url, html))

        for link in extract_internal_chip_links(html, url):
            if link not in seen and link not in queue:
                queue.append(link)

    with open(f'{out_prefix}.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writeheader()
        writer.writerows(detail_records)

    with open(f'{out_prefix}.json', 'w', encoding='utf-8') as f:
        json.dump(detail_records, f, ensure_ascii=False, indent=2)

    with open(f'{out_prefix}_high_priority.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writeheader()
        for row in detail_records:
            if row['brand'] in HIGH_PRIORITY:
                writer.writerow(row)

    with open(f'{out_prefix}_errors.json', 'w', encoding='utf-8') as f:
        json.dump(bad_urls, f, ensure_ascii=False, indent=2)

    print(f'Collected {len(detail_records)} detail pages')
    print(f'Errors: {len(bad_urls)}')


if __name__ == '__main__':
    main()
