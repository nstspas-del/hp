#!/usr/bin/env python3
"""
Быстрый парсер SevenForce с сохранением после каждого бренда
"""
import json, re, time, subprocess, os

BASE = 'https://sevenforce.ru'
DISCOUNT = 0.75
OUT = 'src/data/sevenforce-parsed.json'

def fetch(url, retries=2):
    for attempt in range(retries):
        try:
            r = subprocess.run(
                ['curl','-s','-L','--max-time','10','-A',
                 'Mozilla/5.0 Chrome/120',url],
                capture_output=True,text=True,timeout=12
            )
            if r.returncode==0 and len(r.stdout)>200:
                return r.stdout
        except: pass
        if attempt<retries-1: time.sleep(1)
    return None

def get_variant_links(html, brand_slug):
    pat = rf'href="(/chip-tuning/{brand_slug}/([a-z0-9-]+)/([a-z0-9.-]+)/([a-z0-9.-]+))"'
    matches = re.findall(pat, html)
    seen=set(); result=[]
    for full,model,gen,var in matches:
        url = BASE+full
        if url in seen: continue
        if model=='gearbox' or 'kopiya' in gen or 'kopiya' in var: continue
        seen.add(url)
        result.append({'url':url,'model':model,'gen':gen,'var':var})
    return result

def get_prices(url):
    html=fetch(url)
    if not html: return None
    raw=re.findall(r'data-price=["\'](\d+)["\']',html)
    if not raw: return None
    unique=list(dict.fromkeys(int(p) for p in raw))
    s={}
    for i,p in enumerate(unique[:4]): s[f'stage{i+1}']=p
    return s

def make_label(var_slug,hp):
    name=re.sub(r'-\d+-ls$','',var_slug).replace('-',' ').upper()
    return f"{name} {hp} л.с." if hp else name

MODEL_NAMES={
    '1er':'1 Series','2er':'2 Series','3er':'3 Series','4er':'4 Series',
    '5er':'5 Series','6er':'6 Series','7er':'7 Series','8er':'8 Series',
    'i8':'i8','1m':'1M','m2':'M2','m3':'M3','m4':'M4','m5':'M5',
    'm6':'M6','m8':'M8','x1':'X1','x2':'X2','x3':'X3','x3m':'X3M',
    'x4':'X4','x4m':'X4M','x5':'X5','x5m':'X5M','x6':'X6','x6m':'X6M',
    'x7':'X7','z4':'Z4','z4m':'Z4M',
    'a-class':'A-Class','b-class':'B-Class','c-class':'C-Class',
    'e-class':'E-Class','s-class':'S-Class','g-class':'G-Class',
    'gl-class':'GL-Class','gla-class':'GLA','glb-class':'GLB',
    'glc':'GLC','glc-coupe':'GLC Coupe','gle-class':'GLE',
    'gle-coupe':'GLE Coupe','glk-class':'GLK','gls-class':'GLS',
    'cls-class':'CLS','cla-class':'CLA','cl-class':'CL',
    'amg-gt':'AMG GT','amg-gt-4-door':'AMG GT 4-Door',
    'clk-class':'CLK','clc-class':'CLC','sl-class':'SL',
    'slk-class':'SLK','slc-class':'SLC','sls-class':'SLS',
    'sprinter':'Sprinter','v-class':'V-Class','vito':'Vito',
    'viano':'Viano','citan':'Citan','maybach':'Maybach',
    'r-class':'R-Class','m-class':'M-Class','x-class':'X-Class',
    'gt-class':'GT-Class',
    'a1':'A1','a3':'A3','a4':'A4','a5':'A5','a6':'A6','a7':'A7','a8':'A8',
    'q2':'Q2','q3':'Q3','q5':'Q5','q7':'Q7','q8':'Q8','r8':'R8',
    'tt':'TT','tts':'TTS','ttrs':'TT RS',
    'rs3':'RS3','rs4':'RS4','rs5':'RS5','rs6':'RS6','rs7':'RS7',
    'rs-q3':'RS Q3','rs-q8':'RS Q8',
    's1':'S1','s3':'S3','s4':'S4','s5':'S5','s6':'S6','s7':'S7','s8':'S8',
    'sq2':'SQ2','sq5':'SQ5','sq7':'SQ7','sq8':'SQ8',
    '911':'911','911-gt2':'911 GT2','911-gt3':'911 GT3',
    'boxster':'Boxster','cayenne':'Cayenne','cayman':'Cayman',
    'macan':'Macan','panamera':'Panamera',
    'defender':'Defender','discovery':'Discovery',
    'discovery-sport':'Discovery Sport','freelander':'Freelander',
    'range-rover':'Range Rover','range-rover-evoque':'Range Rover Evoque',
    'range-rover-velar':'Range Rover Velar','range-rover-sport':'Range Rover Sport',
    'golf':'Golf','golf-gti':'Golf GTI','golf-r':'Golf R',
    'passat':'Passat','passat-cc':'Passat CC','tiguan':'Tiguan',
    'touareg':'Touareg','polo':'Polo','polo-gti':'Polo GTI',
    'phaeton':'Phaeton','sharan':'Sharan','jetta':'Jetta',
    'scirocco':'Scirocco','scirocco-r':'Scirocco R','beetle':'Beetle',
    'eos':'EOS','caddy':'Caddy','arteon':'Arteon','amarok':'Amarok',
    'atlas-teramont':'Atlas/Teramont','caravelle':'Caravelle',
    'multivan-transporter':'Multivan/T','t-roc':'T-Roc',
    't-cross':'T-Cross','touran':'Touran','lamando':'Lamando',
    'polo-r-wrc':'Polo R WRC',
    'xc60':'XC60','xc70':'XC70','xc90':'XC90',
    's60':'S60','s80':'S80','s90':'S90','s40':'S40',
    'v40':'V40','v60':'V60','v70':'V70','v90-v90-cc':'V90/V90 CC',
    'c30':'C30','c70':'C70',
    'camry':'Camry','land-cruiser-200':'Land Cruiser 200',
    'land-cruiser-prado':'Land Cruiser Prado',
    'rav-4':'RAV4','supra':'Supra','gt86':'GT86',
    'hilux':'Hilux','auris':'Auris','verso':'Verso',
}

BRANDS = [
    ('bmw','BMW'),('mercedes','Mercedes-Benz'),('audi','Audi'),
    ('porsche','Porsche'),('land-rover','Land Rover'),
    ('volkswagen','Volkswagen'),('volvo','Volvo'),('toyota','Toyota'),
]

# Загружаем уже сохранённые данные если есть
if os.path.exists(OUT):
    with open(OUT) as f:
        existing = json.load(f)
    done_slugs = {b['slug'] for b in existing.get('brands',[])}
    all_brands = existing.get('brands',[])
    print(f"Уже готово брендов: {len(done_slugs)}: {done_slugs}")
else:
    done_slugs = set()
    all_brands = []

for brand_slug, brand_name in BRANDS:
    if brand_slug in done_slugs:
        print(f"Пропускаем {brand_name} (уже есть)")
        continue

    print(f"\n{'='*50}")
    print(f"Brand: {brand_name}")

    brand_html = fetch(f'{BASE}/chip-tuning/{brand_slug}/')
    if not brand_html:
        print(f"  SKIP: no html")
        continue

    # Список моделей
    model_slugs_raw = re.findall(
        rf'href="/chip-tuning/{brand_slug}/([a-z0-9-]+)/?"',brand_html)
    model_slugs = []
    seen_ms=set()
    for ms in model_slugs_raw:
        if ms not in seen_ms and ms!='gearbox' and not ms.startswith('kopiya'):
            seen_ms.add(ms); model_slugs.append(ms)
    print(f"  Models: {len(model_slugs)}")

    # Собираем варианты по каждой модели
    all_v={}  # model_slug -> [variants]
    seen_urls=set()

    for ms in model_slugs:
        mhtml = fetch(f'{BASE}/chip-tuning/{brand_slug}/{ms}')
        if not mhtml:
            time.sleep(0.2); continue
        links = get_variant_links(mhtml, brand_slug)
        for lnk in links:
            u=lnk['url']
            if u not in seen_urls:
                seen_urls.add(u)
                m=lnk['model']
                if m not in all_v: all_v[m]=[]
                all_v[m].append(lnk)
        time.sleep(0.25)

    print(f"  Unique variants: {sum(len(v) for v in all_v.values())}")

    # Парсим цены
    brand_models=[]
    for ms, variants in sorted(all_v.items()):
        mname = MODEL_NAMES.get(ms, ms.replace('-',' ').title())
        print(f"  {mname}: {len(variants)}")
        mvars=[]
        for v in variants:
            stages=get_prices(v['url'])
            if not stages: time.sleep(0.2); continue
            s1=stages.get('stage1',0)
            if not s1: continue
            lp=v['url'].split('/')[-1]
            hm=re.search(r'(\d+)-ls$',lp)
            hp=int(hm.group(1)) if hm else 0
            our=int(s1*DISCOUNT)
            mvars.append({
                'id':v['var'],'label':make_label(v['var'],hp),
                'hp':hp,'our_price':our,'competitor_price':s1,
                'sevenforce_url':v['url'],
                'stages':{
                    'stage1':{'competitor':s1,'ours':our},
                    'stage2':{'competitor':stages.get('stage2',0),'ours':int(stages.get('stage2',0)*DISCOUNT)},
                    'stage3':{'competitor':stages.get('stage3',0),'ours':int(stages.get('stage3',0)*DISCOUNT)},
                }
            })
            print(f"    + {mvars[-1]['label']}: {s1:,} -> {our:,}")
            time.sleep(0.28)
        if mvars:
            brand_models.append({
                'slug':ms,'name':mname,
                'sevenforce_url':f'{BASE}/chip-tuning/{brand_slug}/{ms}',
                'variants':mvars
            })
        time.sleep(0.2)

    if brand_models:
        tv=sum(len(m['variants']) for m in brand_models)
        all_brands.append({'slug':brand_slug,'name':brand_name,'models':brand_models})
        print(f"  OK: {len(brand_models)} models, {tv} variants")
        # Сохраняем промежуточно после каждого бренда!
        with open(OUT,'w',encoding='utf-8') as f:
            json.dump({'brands':all_brands},f,ensure_ascii=False,indent=2)
        print(f"  SAVED -> {OUT}")

tb=len(all_brands)
tm=sum(len(b['models']) for b in all_brands)
tv=sum(len(m['variants']) for b in all_brands for m in b['models'])
print(f"\n{'='*50}")
print(f"TOTAL: {tb} brands, {tm} models, {tv} variants")
with open(OUT,'w',encoding='utf-8') as f:
    json.dump({'brands':all_brands},f,ensure_ascii=False,indent=2)
print(f"FINAL SAVED: {OUT}")
