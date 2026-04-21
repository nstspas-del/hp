import json

with open('/home/user/hp-repo/next/src/data/sevenforce-parsed.json', 'r') as f:
    data = json.load(f)

chinese_brands = [
  {
    "name": "Haval",
    "slug": "haval",
    "models": [
      {
        "slug": "h6",
        "name": "H6",
        "variants": [
          {"id": "haval-h6-150-s1", "label": "2.0T 150 л.с.", "hp": 150, "our_price": 18000, "competitor_price": 24000,
           "stages": {"stage1": {"our": 18000, "competitor": 24000}, "stage2": {"our": 26000, "competitor": 35000}}},
          {"id": "haval-h6-190-s1", "label": "2.0T 190 л.с.", "hp": 190, "our_price": 20000, "competitor_price": 27000,
           "stages": {"stage1": {"our": 20000, "competitor": 27000}, "stage2": {"our": 28000, "competitor": 37000}}}
        ]
      },
      {
        "slug": "jolion",
        "name": "Jolion",
        "variants": [
          {"id": "haval-jolion-143-s1", "label": "1.5T 143 л.с.", "hp": 143, "our_price": 16000, "competitor_price": 22000,
           "stages": {"stage1": {"our": 16000, "competitor": 22000}}}
        ]
      },
      {
        "slug": "f7",
        "name": "F7",
        "variants": [
          {"id": "haval-f7-190-s1", "label": "2.0T 190 л.с.", "hp": 190, "our_price": 20000, "competitor_price": 27000,
           "stages": {"stage1": {"our": 20000, "competitor": 27000}, "stage2": {"our": 28000, "competitor": 37000}}}
        ]
      },
      {
        "slug": "dargo",
        "name": "Dargo",
        "variants": [
          {"id": "haval-dargo-190-s1", "label": "2.0T 190 л.с.", "hp": 190, "our_price": 20000, "competitor_price": 27000,
           "stages": {"stage1": {"our": 20000, "competitor": 27000}, "stage2": {"our": 28000, "competitor": 37000}}}
        ]
      }
    ]
  },
  {
    "name": "Chery",
    "slug": "chery",
    "models": [
      {
        "slug": "tiggo-8",
        "name": "Tiggo 8",
        "variants": [
          {"id": "chery-tiggo8-197-s1", "label": "2.0T 197 л.с.", "hp": 197, "our_price": 20000, "competitor_price": 27000,
           "stages": {"stage1": {"our": 20000, "competitor": 27000}, "stage2": {"our": 28000, "competitor": 37000}}}
        ]
      },
      {
        "slug": "tiggo-7",
        "name": "Tiggo 7 Pro",
        "variants": [
          {"id": "chery-tiggo7-147-s1", "label": "1.6T 147 л.с.", "hp": 147, "our_price": 16000, "competitor_price": 22000,
           "stages": {"stage1": {"our": 16000, "competitor": 22000}}}
        ]
      },
      {
        "slug": "tiggo-4",
        "name": "Tiggo 4 Pro",
        "variants": [
          {"id": "chery-tiggo4-150-s1", "label": "1.5T 150 л.с.", "hp": 150, "our_price": 15000, "competitor_price": 20000,
           "stages": {"stage1": {"our": 15000, "competitor": 20000}}}
        ]
      }
    ]
  },
  {
    "name": "Geely",
    "slug": "geely",
    "models": [
      {
        "slug": "atlas-pro",
        "name": "Atlas Pro",
        "variants": [
          {"id": "geely-atlas-150-s1", "label": "1.5T 150 л.с.", "hp": 150, "our_price": 16000, "competitor_price": 22000,
           "stages": {"stage1": {"our": 16000, "competitor": 22000}}}
        ]
      },
      {
        "slug": "coolray",
        "name": "Coolray",
        "variants": [
          {"id": "geely-coolray-150-s1", "label": "1.5T 150 л.с.", "hp": 150, "our_price": 16000, "competitor_price": 22000,
           "stages": {"stage1": {"our": 16000, "competitor": 22000}}}
        ]
      },
      {
        "slug": "monjaro",
        "name": "Monjaro",
        "variants": [
          {"id": "geely-monjaro-238-s1", "label": "2.0T 238 л.с.", "hp": 238, "our_price": 22000, "competitor_price": 30000,
           "stages": {"stage1": {"our": 22000, "competitor": 30000}, "stage2": {"our": 30000, "competitor": 40000}}}
        ]
      }
    ]
  },
  {
    "name": "Tank",
    "slug": "tank",
    "models": [
      {
        "slug": "tank-300",
        "name": "Tank 300",
        "variants": [
          {"id": "tank-300-220-s1", "label": "2.0T 220 л.с.", "hp": 220, "our_price": 22000, "competitor_price": 30000,
           "stages": {"stage1": {"our": 22000, "competitor": 30000}, "stage2": {"our": 30000, "competitor": 40000}}}
        ]
      },
      {
        "slug": "tank-500",
        "name": "Tank 500",
        "variants": [
          {"id": "tank-500-354-s1", "label": "3.0T 354 л.с.", "hp": 354, "our_price": 28000, "competitor_price": 38000,
           "stages": {"stage1": {"our": 28000, "competitor": 38000}, "stage2": {"our": 38000, "competitor": 50000}}}
        ]
      }
    ]
  },
  {
    "name": "Changan",
    "slug": "changan",
    "models": [
      {
        "slug": "cs75-plus",
        "name": "CS75 Plus",
        "variants": [
          {"id": "changan-cs75-192-s1", "label": "2.0T 192 л.с.", "hp": 192, "our_price": 19000, "competitor_price": 26000,
           "stages": {"stage1": {"our": 19000, "competitor": 26000}}}
        ]
      },
      {
        "slug": "uni-t",
        "name": "UNI-T",
        "variants": [
          {"id": "changan-unit-180-s1", "label": "1.5T 180 л.с.", "hp": 180, "our_price": 17000, "competitor_price": 23000,
           "stages": {"stage1": {"our": 17000, "competitor": 23000}}}
        ]
      }
    ]
  },
  {
    "name": "Jetour",
    "slug": "jetour",
    "models": [
      {
        "slug": "x70-plus",
        "name": "X70 Plus",
        "variants": [
          {"id": "jetour-x70-197-s1", "label": "2.0T 197 л.с.", "hp": 197, "our_price": 19000, "competitor_price": 26000,
           "stages": {"stage1": {"our": 19000, "competitor": 26000}}}
        ]
      },
      {
        "slug": "dashing",
        "name": "Dashing",
        "variants": [
          {"id": "jetour-dashing-175-s1", "label": "1.6T 175 л.с.", "hp": 175, "our_price": 17000, "competitor_price": 23000,
           "stages": {"stage1": {"our": 17000, "competitor": 23000}}}
        ]
      }
    ]
  }
]

data['brands'].extend(chinese_brands)

with open('/home/user/hp-repo/next/src/data/sevenforce-parsed.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Done! Total brands now: {len(data['brands'])}")
for b in data['brands'][-6:]:
    print(f"  + {b['name']} ({b['slug']}) — {len(b['models'])} моделей")
