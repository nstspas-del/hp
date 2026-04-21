import json

with open('/home/user/hp-repo/next/src/data/brands.json', 'r') as f:
    brands = json.load(f)

existing_slugs = {b['slug'] for b in brands}
print("Existing slugs:", sorted(existing_slugs))

# Популярные марки в СПб которых нет — добавляем
new_brands = [
  # ── КИТАЙСКИЕ ──────────────────────────────────────────────────────────────
  {
    "slug": "haval",
    "name": "Haval",
    "nameRu": "Хавал",
    "featured": True,
    "priority": 15,
    "color": "#E31837",
    "description": "Диагностика, ТО и чип-тюнинг Haval H6, Jolion, F7, Dargo в Санкт-Петербурге. Оригинальные запчасти, адаптация прошивки ЭБУ под топливо и климат.",
    "tagline": "Haval в Санкт-Петербурге",
    "priceFrom": 15000,
    "seo": {
      "title": "Сервис и чип-тюнинг Haval в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика, ТО и прошивка ЭБУ Haval H6, Jolion, F7, Dargo в СПб. Адаптация под российский бензин, чип-тюнинг от 15 000 ₽. Гарантия 12 месяцев."
    },
    "trust": [
      {"title": "Прошивка под АИ-95", "desc": "Адаптируем карты под российский топливо — без детонации и потери ресурса"},
      {"title": "Диагностика LAUNCH X431", "desc": "Полная диагностика всех систем Haval: двигатель, АКПП, ABS, ESP"},
      {"title": "Откат к стоку бесплатно", "desc": "Файл оригинальной прошивки хранится у нас — откат за 30 минут"}
    ],
    "faq": [
      {"q": "Можно ли делать чип-тюнинг Haval H6?", "a": "Да. Двигатели 1.5T и 2.0T Haval хорошо поддаются оптимизации прошивки. Прирост Stage 1 — +20–35 л.с. и снижение расхода топлива на 5–10%."},
      {"q": "Какой прирост мощности у Haval H6 2.0T после чип-тюнинга?", "a": "Haval H6 2.0T 190 л.с. после Stage 1 — около 225–230 л.с. и +40–50 Нм момента. Используем Alientech KESS3."},
      {"q": "Сколько стоит ТО Haval в СПб?", "a": "ТО Haval в HP Тюнинг от 8 000 ₽. Включает замену масла, фильтров и компьютерную диагностику всех систем."},
      {"q": "Как подключиться к ЭБУ Haval?", "a": "Haval H6 и Jolion прошиваются через OBD-порт без снятия блока. Процедура занимает 1,5–2 часа."},
      {"q": "Влияет ли тюнинг на гарантию Haval?", "a": "Формально — да. Поэтому мы всегда сохраняем оригинальный файл и делаем бесплатный откат перед обращением к дилеру."},
      {"q": "Есть ли проблемы с ЭБУ у Haval?", "a": "Основная особенность — чувствительность к качеству топлива. После адаптации прошивки под АИ-95 детонация и ошибки пропадают."}
    ],
    "series": [
      {"slug": "h6", "name": "Haval H6", "priceFrom": 15000, "engines": [
        {"code": "GW4B15A", "displacement": 1.5, "type": "turbo", "hp": 150, "nm": 210,
         "tuning": {"stage1": {"hp": 180, "nm": 260}}},
        {"code": "GW4C20NT", "displacement": 2.0, "type": "turbo", "hp": 190, "nm": 340,
         "tuning": {"stage1": {"hp": 228, "nm": 385}, "stage2": {"hp": 260, "nm": 420}}}
      ]},
      {"slug": "jolion", "name": "Haval Jolion", "priceFrom": 15000, "engines": [
        {"code": "GW4B15A", "displacement": 1.5, "type": "turbo", "hp": 143, "nm": 210,
         "tuning": {"stage1": {"hp": 172, "nm": 255}}}
      ]},
      {"slug": "f7", "name": "Haval F7", "priceFrom": 16000, "engines": [
        {"code": "GW4C20NT", "displacement": 2.0, "type": "turbo", "hp": 190, "nm": 340,
         "tuning": {"stage1": {"hp": 228, "nm": 385}, "stage2": {"hp": 260, "nm": 420}}}
      ]},
      {"slug": "dargo", "name": "Haval Dargo", "priceFrom": 16000, "engines": [
        {"code": "GW4C20NT", "displacement": 2.0, "type": "turbo", "hp": 190, "nm": 340,
         "tuning": {"stage1": {"hp": 228, "nm": 385}}}
      ]}
    ]
  },
  {
    "slug": "chery",
    "name": "Chery",
    "nameRu": "Чери",
    "featured": True,
    "priority": 16,
    "color": "#003DA5",
    "description": "Диагностика, ТО и чип-тюнинг Chery Tiggo 8, Tiggo 7 Pro, Tiggo 4 Pro в Санкт-Петербурге. Адаптация прошивки ACTECO под российский топливо.",
    "tagline": "Chery в Санкт-Петербурге",
    "priceFrom": 15000,
    "seo": {
      "title": "Сервис и чип-тюнинг Chery в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Chery Tiggo 8, Tiggo 7 Pro, Tiggo 4 Pro в СПб. Чип-тюнинг от 15 000 ₽, адаптация под АИ-95, откат к стоку бесплатно."
    },
    "trust": [
      {"title": "Двигатели ACTECO", "desc": "Специализируемся на турбомоторах ACTECO 1.6T и 2.0T — настройка под российский бензин"},
      {"title": "Диагностика по VIN", "desc": "Полная диагностика Chery через официальные протоколы: ошибки, датчики, исполнительные механизмы"},
      {"title": "ТО под ключ", "desc": "Замена масла, фильтров, свечей, регулировка клапанов — всё в одном визите"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг для Chery Tiggo 8?", "a": "Да. Двигатель 2.0T ACTECO — отличный потенциал для тюнинга. Stage 1 даёт +30–40 л.с. и +50 Нм без замены железа."},
      {"q": "Какой прирост у Chery Tiggo 8 2.0T после прошивки?", "a": "С 197 л.с. до 230–235 л.с. Момент с 400 до 450–460 Нм. Время 0–100 км/ч улучшается примерно на 0,5–0,7 с."},
      {"q": "Можно ли прошить Chery Tiggo 7 Pro 1.6T?", "a": "Да. Tiggo 7 Pro 1.6T (147 л.с.) прошивается через OBD. Stage 1 — около 175 л.с. и +30 Нм."},
      {"q": "Сколько стоит чип-тюнинг Chery в СПб?", "a": "Прошивка ЭБУ Chery от 15 000 ₽. Итоговая цена зависит от модели и года. Звоните — назовём точную цену за 2 минуты."},
      {"q": "Адаптируете прошивку под АИ-95?", "a": "Обязательно. Все наши прошивки для Chery адаптированы под российский АИ-95 с защитой от детонации."},
      {"q": "Есть ли ограничения по году выпуска Chery?", "a": "Работаем с Chery от 2018 года. Более ранние модели — уточняйте индивидуально по VIN."}
    ],
    "series": [
      {"slug": "tiggo-8", "name": "Tiggo 8", "priceFrom": 16000, "engines": [
        {"code": "ACTECO 2.0T", "displacement": 2.0, "type": "turbo", "hp": 197, "nm": 400,
         "tuning": {"stage1": {"hp": 233, "nm": 452}, "stage2": {"hp": 260, "nm": 490}}}
      ]},
      {"slug": "tiggo-7", "name": "Tiggo 7 Pro", "priceFrom": 15000, "engines": [
        {"code": "ACTECO 1.6T", "displacement": 1.6, "type": "turbo", "hp": 147, "nm": 230,
         "tuning": {"stage1": {"hp": 175, "nm": 270}}}
      ]},
      {"slug": "tiggo-4", "name": "Tiggo 4 Pro", "priceFrom": 14000, "engines": [
        {"code": "ACTECO 1.5T", "displacement": 1.5, "type": "turbo", "hp": 150, "nm": 230,
         "tuning": {"stage1": {"hp": 178, "nm": 268}}}
      ]}
    ]
  },
  {
    "slug": "geely",
    "name": "Geely",
    "nameRu": "Джили",
    "featured": True,
    "priority": 17,
    "color": "#1B4FD8",
    "description": "Диагностика и чип-тюнинг Geely Atlas Pro, Coolray, Monjaro в Санкт-Петербурге. Прошивка двигателей JLY-4G15T и JLY-4G20T.",
    "tagline": "Geely в Санкт-Петербурге",
    "priceFrom": 15000,
    "seo": {
      "title": "Сервис и чип-тюнинг Geely в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Geely Atlas Pro, Coolray, Monjaro в СПб. Чип-тюнинг от 15 000 ₽, адаптация под российское топливо."
    },
    "trust": [
      {"title": "Моторы Geely-Volvo", "desc": "Многие Geely используют платформы и моторы Volvo — работаем с ними на уровне официального дилера"},
      {"title": "Monjaro 2.0T", "desc": "Geely Monjaro 238 л.с. — топовый мотор серии. Stage 1 до 275–280 л.с. без замены железа"},
      {"title": "Диагностика Geely", "desc": "Работаем с протоколами ОЕМ: полная диагностика Geely через сканер LAUNCH X431 Pro"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Geely Monjaro?", "a": "Да. Monjaro с двигателем 2.0T (238 л.с.) — отличный потенциал. Stage 1 даёт ~275 л.с. и прирост момента +45 Нм."},
      {"q": "Можно ли прошить Geely Coolray?", "a": "Да. Coolray 1.5T прошивается через OBD. Прирост Stage 1 — +25–30 л.с. и улучшение тяги на низах."},
      {"q": "Geely Atlas Pro — какой прирост мощности?", "a": "Atlas Pro 1.5T (150 л.с.) → Stage 1 около 178 л.с. и +35 Нм момента."},
      {"q": "Сколько стоит чип-тюнинг Geely?", "a": "Прошивка ЭБУ Geely от 15 000 ₽. Точная цена — по модели и году. Рассчитайте в калькуляторе на странице."},
      {"q": "Влияет ли прошивка на надёжность Geely?", "a": "Stage 1 работает в пределах заводского запаса прочности. Геометрия двигателя не изменяется. Откат к стоку — бесплатно."},
      {"q": "Какие Geely популярны в СПб?", "a": "В Петербурге чаще всего к нам приезжают Coolray, Atlas Pro и Monjaro. Все три модели хорошо прошиваются."}
    ],
    "series": [
      {"slug": "monjaro", "name": "Monjaro", "priceFrom": 17000, "engines": [
        {"code": "JLY-4G20T", "displacement": 2.0, "type": "turbo", "hp": 238, "nm": 380,
         "tuning": {"stage1": {"hp": 278, "nm": 425}, "stage2": {"hp": 305, "nm": 460}}}
      ]},
      {"slug": "atlas-pro", "name": "Atlas Pro", "priceFrom": 15000, "engines": [
        {"code": "JLY-4G15T", "displacement": 1.5, "type": "turbo", "hp": 150, "nm": 215,
         "tuning": {"stage1": {"hp": 178, "nm": 250}}}
      ]},
      {"slug": "coolray", "name": "Coolray", "priceFrom": 15000, "engines": [
        {"code": "JLY-4G15T", "displacement": 1.5, "type": "turbo", "hp": 150, "nm": 215,
         "tuning": {"stage1": {"hp": 178, "nm": 250}}}
      ]}
    ]
  },
  {
    "slug": "tank",
    "name": "Tank",
    "nameRu": "Танк",
    "featured": True,
    "priority": 18,
    "color": "#4A4A4A",
    "description": "Диагностика и чип-тюнинг Tank 300 и Tank 500 в Санкт-Петербурге. Прошивка 2.0T и 3.0T V6 — серьёзный прирост для внедорожников.",
    "tagline": "Tank в Санкт-Петербурге",
    "priceFrom": 18000,
    "seo": {
      "title": "Сервис и чип-тюнинг Tank 300/500 в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и чип-тюнинг Tank 300 (2.0T) и Tank 500 (3.0T V6) в СПб. Прирост мощности +40–60 л.с., откат к стоку бесплатно. HP Тюнинг."
    },
    "trust": [
      {"title": "Tank 500 V6 3.0T", "desc": "354 л.с. стандарт — после Stage 1 до 420 л.с. без замены железа. Идеально для трассы"},
      {"title": "Tank 300 Off-Road", "desc": "2.0T 220 л.с. — прошивка улучшает тягу на низких оборотах: идеально для бездорожья"},
      {"title": "Протоколы Great Wall", "desc": "Tank — платформа Great Wall. Работаем с ЭБУ через LAUNCH X431 и Alientech KESS3"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Tank 500?", "a": "Да. Tank 500 с 3.0T V6 (354 л.с.) — Stage 1 даёт 415–425 л.с. и +70–80 Нм. Прошивается через OBD."},
      {"q": "Какой прирост у Tank 300 после тюнинга?", "a": "Tank 300 2.0T (220 л.с.) — Stage 1 около 265 л.с. и +55 Нм момента. Существенный прирост тяги с низов."},
      {"q": "Сколько стоит прошивка Tank в СПб?", "a": "Прошивка Tank от 18 000 ₽ (Tank 300) и от 24 000 ₽ (Tank 500 V6). Финальная цена уточняется при записи."},
      {"q": "Можно ли прошить Tank без снятия ЭБУ?", "a": "Да, оба Tank прошиваются через OBD-порт. Снятие блока управления не требуется."},
      {"q": "Подходит ли тюнинг Tank для бездорожья?", "a": "Да. Мы настраиваем прошивку под режим off-road: улучшаем тягу на 1000–2500 об/мин без потери управляемости на бездорожье."},
      {"q": "Влияет ли прошивка на АКПП Tank?", "a": "При необходимости настраиваем алгоритм переключения АКПП совместно с прошивкой двигателя — более чёткие переключения, меньше перегрев коробки."}
    ],
    "series": [
      {"slug": "tank-500", "name": "Tank 500", "priceFrom": 22000, "engines": [
        {"code": "GW3.0T", "displacement": 3.0, "type": "turbo", "hp": 354, "nm": 500,
         "tuning": {"stage1": {"hp": 420, "nm": 575}, "stage2": {"hp": 470, "nm": 620}}}
      ]},
      {"slug": "tank-300", "name": "Tank 300", "priceFrom": 18000, "engines": [
        {"code": "GW4C20NT", "displacement": 2.0, "type": "turbo", "hp": 220, "nm": 387,
         "tuning": {"stage1": {"hp": 265, "nm": 442}, "stage2": {"hp": 295, "nm": 480}}}
      ]}
    ]
  },
  {
    "slug": "changan",
    "name": "Changan",
    "nameRu": "Чанган",
    "featured": False,
    "priority": 19,
    "color": "#C8102E",
    "description": "Диагностика и чип-тюнинг Changan CS75 Plus, UNI-T в Санкт-Петербурге. Прошивка моторов BLUE WHALE 2.0T.",
    "tagline": "Changan в Санкт-Петербурге",
    "priceFrom": 15000,
    "seo": {
      "title": "Сервис и чип-тюнинг Changan в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Changan CS75 Plus, UNI-T в СПб. Чип-тюнинг BLUE WHALE 2.0T от 15 000 ₽. Адаптация под АИ-95."
    },
    "trust": [
      {"title": "BLUE WHALE 2.0T", "desc": "Мотор Changan CS75 Plus — хороший потенциал: Stage 1 до 230 л.с. без замены деталей"},
      {"title": "OBD прошивка", "desc": "CS75 Plus и UNI-T прошиваются через OBD. Без снятия блока, за 1,5 часа"},
      {"title": "Адаптация под АИ-95", "desc": "Все прошивки адаптированы под российский 95-й бензин — без детонации"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Changan CS75 Plus?", "a": "Да. CS75 Plus с мотором 2.0T (192 л.с.) — Stage 1 даёт около 225–230 л.с. и +40 Нм."},
      {"q": "Можно ли прошить Changan UNI-T?", "a": "Да. UNI-T 1.5T (180 л.с.) прошивается через OBD. Прирост Stage 1 — +25–30 л.с."},
      {"q": "Сколько стоит чип-тюнинг Changan?", "a": "От 15 000 ₽ для UNI-T и от 17 000 ₽ для CS75 Plus. Рассчитайте в калькуляторе на сайте."},
      {"q": "Совместим ли тюнинг с гарантией Changan?", "a": "Мы сохраняем оригинальный файл прошивки. Откат к заводским настройкам — 30 минут, бесплатно."},
      {"q": "Какие Changan самые популярные в СПб?", "a": "CS75 Plus — самая распространённая модель Changan в Петербурге. Хорошо поддаётся тюнингу."},
      {"q": "Есть ли ограничения по пробегу для тюнинга?", "a": "Рекомендуем делать тюнинг после 10 000 км — к этому моменту двигатель уже обкатан и принимает прошивку стабильнее."}
    ],
    "series": [
      {"slug": "cs75-plus", "name": "CS75 Plus", "priceFrom": 17000, "engines": [
        {"code": "BLUE WHALE 2.0T", "displacement": 2.0, "type": "turbo", "hp": 192, "nm": 360,
         "tuning": {"stage1": {"hp": 228, "nm": 400}}}
      ]},
      {"slug": "uni-t", "name": "UNI-T", "priceFrom": 15000, "engines": [
        {"code": "1.5T TGDI", "displacement": 1.5, "type": "turbo", "hp": 180, "nm": 300,
         "tuning": {"stage1": {"hp": 210, "nm": 340}}}
      ]}
    ]
  },
  {
    "slug": "jetour",
    "name": "Jetour",
    "nameRu": "Джетур",
    "featured": False,
    "priority": 20,
    "color": "#0033A0",
    "description": "Диагностика и чип-тюнинг Jetour X70 Plus, Dashing в Санкт-Петербурге. Прошивка ЭБУ Jetour — адаптация под российский бензин.",
    "tagline": "Jetour в Санкт-Петербурге",
    "priceFrom": 15000,
    "seo": {
      "title": "Сервис и чип-тюнинг Jetour в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Jetour X70 Plus, Dashing в СПб. Чип-тюнинг от 15 000 ₽. Адаптация под АИ-95, откат к стоку бесплатно."
    },
    "trust": [
      {"title": "Платформа Chery", "desc": "Jetour использует моторы и платформы Chery — работаем по проверенным протоколам"},
      {"title": "X70 Plus 2.0T", "desc": "197 л.с. стандарт — Stage 1 до 230 л.с. без замены деталей"},
      {"title": "OBD прошивка", "desc": "Jetour X70 Plus и Dashing прошиваются через OBD-порт за 1,5–2 часа"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Jetour X70 Plus?", "a": "Да. X70 Plus с 2.0T (197 л.с.) — Stage 1 даёт около 228 л.с. и +45 Нм."},
      {"q": "Можно ли прошить Jetour Dashing?", "a": "Да. Dashing 1.6T (175 л.с.) поддаётся тюнингу. Прирост Stage 1 — +25–30 л.с."},
      {"q": "Сколько стоит чип-тюнинг Jetour?", "a": "От 15 000 ₽ для Dashing и от 17 000 ₽ для X70 Plus. Используйте калькулятор на сайте."},
      {"q": "Jetour — это что за марка?", "a": "Jetour — суббренд китайского концерна Chery для SUV. В Петербурге X70 Plus очень популярен благодаря соотношению цена/размер."},
      {"q": "Какой откат к стоку у Jetour?", "a": "Полный откат к заводской прошивке — 30 минут, бесплатно для всех наших клиентов в течение всего срока."},
      {"q": "Адаптируете прошивку под СПб климат?", "a": "Да. Учитываем холодный климат Петербурга: корректируем холодный запуск и прогрев двигателя."}
    ],
    "series": [
      {"slug": "x70-plus", "name": "X70 Plus", "priceFrom": 17000, "engines": [
        {"code": "ACTECO 2.0T", "displacement": 2.0, "type": "turbo", "hp": 197, "nm": 400,
         "tuning": {"stage1": {"hp": 230, "nm": 445}}}
      ]},
      {"slug": "dashing", "name": "Dashing", "priceFrom": 15000, "engines": [
        {"code": "ACTECO 1.6T", "displacement": 1.6, "type": "turbo", "hp": 175, "nm": 275,
         "tuning": {"stage1": {"hp": 205, "nm": 315}}}
      ]}
    ]
  },
  # ── КОРЕЙСКИЕ (обогащаем уже имеющиеся или добавляем) ──────────────────────
  {
    "slug": "genesis",
    "name": "Genesis",
    "nameRu": "Генезис",
    "featured": True,
    "priority": 11,
    "color": "#1C1C1C",
    "description": "Диагностика, ТО и чип-тюнинг Genesis G70, G80, GV80 в Санкт-Петербурге. Прошивка моторов Lambda II 3.3T и Theta III 2.0T.",
    "tagline": "Genesis в Санкт-Петербурге",
    "priceFrom": 24000,
    "seo": {
      "title": "Сервис и чип-тюнинг Genesis в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Genesis G70, G80, GV80 в СПб. Lambda II 3.3T и Theta III 2.0T. Чип-тюнинг от 24 000 ₽, гарантия 12 месяцев."
    },
    "trust": [
      {"title": "Lambda II 3.3T", "desc": "Genesis G80 3.3T (370 л.с.) — Stage 1 до 435–440 л.с. без замены деталей"},
      {"title": "Премиум уровня BMW", "desc": "Genesis — роскошный суббренд Hyundai. Работаем с ним на уровне BMW и Mercedes"},
      {"title": "Диагностика GDS Mobile", "desc": "Полная диагностика Genesis через OEM-сканер: все системы, адаптации, кодирования"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Genesis G80 3.3T?", "a": "Да. G80 с Lambda II 3.3T (370 л.с.) — Stage 1 даёт 430–440 л.с. и +80–90 Нм. Прошивается через OBD."},
      {"q": "Можно ли прошить Genesis G70 2.0T?", "a": "Да. G70 с Theta III 2.0T (245–252 л.с.) — Stage 1 до 295–305 л.с. и +50 Нм момента."},
      {"q": "Сколько стоит чип-тюнинг Genesis?", "a": "Прошивка Genesis от 24 000 ₽ (2.0T) и от 32 000 ₽ (3.3T). Итоговая цена зависит от модели."},
      {"q": "Genesis — это Hyundai?", "a": "Да, Genesis — премиальный суббренд Hyundai Motor Group. Технически близок к Kia и Hyundai, но на порядок богаче по оснащению."},
      {"q": "Откат к стоку Genesis перед ТО у дилера?", "a": "Да, бесплатно. 30 минут — и ваш Genesis снова с заводской прошивкой. Оригинальный файл храним бессрочно."},
      {"q": "Есть ли GV80 в вашей базе?", "a": "Да. GV80 с 3.5T и 2.5T — работаем с обеими версиями. Прирост 3.5T Stage 1 — около +55–65 л.с."}
    ],
    "series": [
      {"slug": "g80", "name": "Genesis G80", "priceFrom": 28000, "engines": [
        {"code": "Lambda II 3.3T", "displacement": 3.3, "type": "turbo", "hp": 370, "nm": 510,
         "tuning": {"stage1": {"hp": 435, "nm": 595}, "stage2": {"hp": 490, "nm": 640}}}
      ]},
      {"slug": "g70", "name": "Genesis G70", "priceFrom": 24000, "engines": [
        {"code": "Theta III 2.0T", "displacement": 2.0, "type": "turbo", "hp": 252, "nm": 353,
         "tuning": {"stage1": {"hp": 300, "nm": 405}, "stage2": {"hp": 335, "nm": 445}}}
      ]},
      {"slug": "gv80", "name": "Genesis GV80", "priceFrom": 28000, "engines": [
        {"code": "Lambda II 3.5T", "displacement": 3.5, "type": "turbo", "hp": 380, "nm": 530,
         "tuning": {"stage1": {"hp": 445, "nm": 610}}}
      ]}
    ]
  },
  # ── ДОБАВЛЯЕМ HONDA (нет в списке, но популярна) ───────────────────────────
  {
    "slug": "honda",
    "name": "Honda",
    "nameRu": "Хонда",
    "featured": False,
    "priority": 25,
    "color": "#CC0000",
    "description": "Диагностика, ТО и чип-тюнинг Honda CR-V, Pilot, Accord в Санкт-Петербурге. Прошивка моторов K20C, K24W и 2.0T VTEC Turbo.",
    "tagline": "Honda в Санкт-Петербурге",
    "priceFrom": 22000,
    "seo": {
      "title": "Сервис и чип-тюнинг Honda в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Honda CR-V, Accord, Pilot в СПб. Чип-тюнинг K20C VTEC Turbo от 22 000 ₽. Откат к стоку бесплатно."
    },
    "trust": [
      {"title": "VTEC Turbo K20C", "desc": "Civic Type R K20C (310 л.с.) — один из лучших турбомоторов. Stage 1 до 370–380 л.с."},
      {"title": "CR-V и Pilot 1.5T", "desc": "Самые популярные Honda в СПб. 1.5T Earth Dreams — Stage 1 +30–35 л.с. без замены железа"},
      {"title": "Диагnostика HDS", "desc": "Используем Honda Diagnostic System для полной диагностики всех электронных систем"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Honda CR-V 1.5T?", "a": "Да. CR-V 1.5T (173 л.с.) — Stage 1 даёт 200–205 л.с. и +35 Нм. Прирост ощутим особенно при городской езде."},
      {"q": "Можно ли прошить Honda Accord 2.0T?", "a": "Да. Accord 2.0T VTEC Turbo (192 л.с.) — Stage 1 до 228–235 л.с. Прошивается через OBD."},
      {"q": "Civic Type R чип-тюнинг?", "a": "Civic Type R (FL5) K20C 315 л.с. — Stage 1 до 375–385 л.с. и +60 Нм. Stage 2 под выхлоп — до 420+ л.с."},
      {"q": "Сколько стоит чип-тюнинг Honda?", "a": "Прошивка Honda от 22 000 ₽. Civic Type R и Accord 2.0T — от 26 000 ₽. Точнее — в калькуляторе."},
      {"q": "Откат к стоку Honda перед дилером?", "a": "Бесплатно, 30 минут. Оригинальный файл храним бессрочно."},
      {"q": "Honda Pilot — есть ли тюнинг?", "a": "Pilot 3.5 V6 (280 л.с.) — атмосферник, потенциал тюнинга ограничен. Рекомендуем сначала проконсультироваться."}
    ],
    "series": [
      {"slug": "civic-type-r", "name": "Civic Type R", "priceFrom": 28000, "engines": [
        {"code": "K20C1", "displacement": 2.0, "type": "turbo", "hp": 315, "nm": 420,
         "tuning": {"stage1": {"hp": 378, "nm": 482}, "stage2": {"hp": 420, "nm": 520}}}
      ]},
      {"slug": "accord", "name": "Accord", "priceFrom": 24000, "engines": [
        {"code": "K20C4 2.0T", "displacement": 2.0, "type": "turbo", "hp": 192, "nm": 260,
         "tuning": {"stage1": {"hp": 232, "nm": 305}}}
      ]},
      {"slug": "cr-v", "name": "CR-V", "priceFrom": 22000, "engines": [
        {"code": "L15B7 1.5T", "displacement": 1.5, "type": "turbo", "hp": 173, "nm": 220,
         "tuning": {"stage1": {"hp": 205, "nm": 255}}}
      ]}
    ]
  },
  # ── ПОПУЛЯРНЫЕ ЕВРОПЕЙЦЫ которых не хватало ────────────────────────────────
  {
    "slug": "peugeot",
    "name": "Peugeot",
    "nameRu": "Пежо",
    "featured": False,
    "priority": 30,
    "color": "#003189",
    "description": "Диагностика и чип-тюнинг Peugeot 3008, 5008, 408 в Санкт-Петербурге. Прошивка моторов PureTech 1.2T и 1.6T BlueHDI.",
    "tagline": "Peugeot в Санкт-Петербурге",
    "priceFrom": 20000,
    "seo": {
      "title": "Сервис и чип-тюнинг Peugeot в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Peugeot 3008, 5008, 408 в СПб. PureTech 1.2T и дизель BlueHDI. Чип-тюнинг от 20 000 ₽."
    },
    "trust": [
      {"title": "PureTech 1.2T", "desc": "Трёхцилиндровый турбомотор Peugeot — хорошо поддаётся оптимизации: Stage 1 +25–30 л.с."},
      {"title": "Дизель BlueHDI", "desc": "Дизельные Peugeot 1.6 HDI и 2.0 HDI — Stage 1 +40–60 Нм и снижение расхода"},
      {"title": "Диагностика PSA", "desc": "Работаем с фирменными протоколами PSA Group: Peugeot, Citroën, DS, Opel на одной платформе"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Peugeot 3008 1.6T?", "a": "Да. 3008 PureTech 180 — Stage 1 до 210–215 л.с. Также прошиваем 3008 1.2T (130 л.с.) → ~158 л.с."},
      {"q": "Можно ли прошить Peugeot 408 1.6T?", "a": "Да. 408 с THP 1.6T — Stage 1 +25–35 л.с. Прошивается через OBD."},
      {"q": "Сколько стоит чип-тюнинг Peugeot?", "a": "От 20 000 ₽. Дизельные версии — от 22 000 ₽. Точнее — по модели и году в калькуляторе."},
      {"q": "Peugeot дизель — стоит ли делать тюнинг?", "a": "Очень стоит. Дизельный Stage 1 — +40–60 Нм и расход топлива снижается на 5–8%. Самое выгодное вложение."},
      {"q": "Откат к стоку Peugeot бесплатно?", "a": "Да. Оригинальный файл храним бессрочно, откат — 30 минут без доплаты."},
      {"q": "Peugeot и Citroën — одинаковые ЭБУ?", "a": "Да. PSA Group использует общую платформу. Прайс и технология прошивки идентичны."}
    ],
    "series": [
      {"slug": "3008", "name": "3008", "priceFrom": 22000, "engines": [
        {"code": "EP6 1.6T THP", "displacement": 1.6, "type": "turbo", "hp": 180, "nm": 250,
         "tuning": {"stage1": {"hp": 213, "nm": 295}, "stage2": {"hp": 240, "nm": 330}}}
      ]},
      {"slug": "408", "name": "408", "priceFrom": 20000, "engines": [
        {"code": "EB2DTS 1.2T", "displacement": 1.2, "type": "turbo", "hp": 130, "nm": 230,
         "tuning": {"stage1": {"hp": 158, "nm": 270}}}
      ]}
    ]
  },
  {
    "slug": "citroen",
    "name": "Citroën",
    "nameRu": "Ситроен",
    "featured": False,
    "priority": 31,
    "color": "#C60000",
    "description": "Диагностика и чип-тюнинг Citroën C5 Aircross, C4 в Санкт-Петербурге. PureTech 1.2T и 1.6T THP — прошивка через OBD.",
    "tagline": "Citroën в Санкт-Петербурге",
    "priceFrom": 20000,
    "seo": {
      "title": "Сервис и чип-тюнинг Citroën в Санкт-Петербурге | HP Тюнинг",
      "metaDescription": "Диагностика и прошивка ЭБУ Citroën C5 Aircross, C4 в СПб. PureTech THP тюнинг от 20 000 ₽. Платформа PSA Group."
    },
    "trust": [
      {"title": "Платформа PSA", "desc": "Citroën и Peugeot — одна платформа PSA. Те же ЭБУ, те же протоколы, те же цены"},
      {"title": "C5 Aircross 1.6T", "desc": "THP 180 л.с. — Stage 1 до 210–215 л.с. без замены деталей"},
      {"title": "Диагностика по VIN", "desc": "Полная диагностика Citroën: двигатель, АКПП, подвеска, BSI, мультимедиа"}
    ],
    "faq": [
      {"q": "Есть ли чип-тюнинг Citroën C5 Aircross?", "a": "Да. C5 Aircross 1.6T THP 180 л.с. — Stage 1 до 212 л.с. Также прошиваем 1.2T (130 л.с.) → 158 л.с."},
      {"q": "Сколько стоит тюнинг Citroën?", "a": "От 20 000 ₽. Цена идентична Peugeot — те же ЭБУ, те же протоколы."},
      {"q": "Citroën и Peugeot одинаковые?", "a": "По платформе — да. ЭБУ, прошивки, диагностические протоколы общие для всей PSA Group."},
      {"q": "Откат к стоку бесплатно?", "a": "Да. Оригинальный файл храним бессрочно, откат — 30 минут."},
      {"q": "Какие Citroën популярны в СПб?", "a": "C5 Aircross и C4 — самые частые в Петербурге. Оба хорошо тюнингуются."},
      {"q": "Работаете ли с Citroën DS?", "a": "Да. DS3, DS4, DS5 — на базе PSA. Прошиваем по тем же протоколам."}
    ],
    "series": [
      {"slug": "c5-aircross", "name": "C5 Aircross", "priceFrom": 22000, "engines": [
        {"code": "EP6 1.6T THP", "displacement": 1.6, "type": "turbo", "hp": 180, "nm": 250,
         "tuning": {"stage1": {"hp": 212, "nm": 295}}}
      ]},
      {"slug": "c4", "name": "C4", "priceFrom": 20000, "engines": [
        {"code": "EB2DTS 1.2T", "displacement": 1.2, "type": "turbo", "hp": 130, "nm": 230,
         "tuning": {"stage1": {"hp": 158, "nm": 270}}}
      ]}
    ]
  }
]

# Добавляем только тех, кого нет
added = 0
for brand in new_brands:
    if brand['slug'] not in existing_slugs:
        brands.append(brand)
        existing_slugs.add(brand['slug'])
        added += 1
        print(f"  + Added: {brand['name']} ({brand['slug']})")
    else:
        print(f"  ~ Skip (exists): {brand['slug']}")

with open('/home/user/hp-repo/next/src/data/brands.json', 'w', encoding='utf-8') as f:
    json.dump(brands, f, ensure_ascii=False, indent=2)

print(f"\nDone! Added {added} brands. Total now: {len(brands)}")
