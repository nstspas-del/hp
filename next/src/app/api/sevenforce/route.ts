/**
 * GET /api/sevenforce?brand=bmw&model=5er
 * Возвращает актуальные цены конкурента SevenForce для указанной марки/модели.
 * ISR: 24 часа (цены меняются редко).
 */
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // 24 ч

const BASE = 'https://sevenforce.ru';

const BRAND_MAP: Record<string, string> = {
 bmw: 'bmw', mercedes: 'mercedes', audi: 'audi', porsche: 'porsche',
 volkswagen: 'volkswagen', volvo: 'volvo', lexus: 'lexus',
 'land-rover': 'land-rover', jaguar: 'jaguar', toyota: 'toyota',
 kia: 'kia', nissan: 'nissan', genesis: 'genesis',
};

const MODEL_MAP: Record<string, string> = {
 'bmw:1er': '1er', 'bmw:2er': '2er', 'bmw:3er': '3er', 'bmw:4er': '4er',
 'bmw:5er': '5er', 'bmw:6er': '6er', 'bmw:7er': '7er', 'bmw:8er': '8er',
 'bmw:x1': 'x1', 'bmw:x3': 'x3', 'bmw:x4': 'x4', 'bmw:x5': 'x5',
 'bmw:x6': 'x6', 'bmw:x7': 'x7', 'bmw:m3': 'm3', 'bmw:m5': 'm5',
 'mercedes:c-class': 'c-class', 'mercedes:e-class': 'e-class',
 'mercedes:s-class': 's-class', 'mercedes:gle': 'gle',
 'mercedes:glc': 'glc', 'mercedes:gls': 'gls',
 'audi:a3': 'a3', 'audi:a4': 'a4', 'audi:a5': 'a5',
 'audi:a6': 'a6', 'audi:a7': 'a7', 'audi:a8': 'a8',
 'audi:q5': 'q5', 'audi:q7': 'q7', 'audi:q8': 'q8',
 'porsche:911': '911', 'porsche:cayenne': 'cayenne',
 'porsche:panamera': 'panamera', 'porsche:macan': 'macan',
 'volkswagen:golf': 'golf', 'volkswagen:tiguan': 'tiguan',
 'volkswagen:touareg': 'touareg',
};

function extractPrices(html: string): number[] {
 const matches = html.match(/data-price="(\d+)"/g) ?? [];
 const prices: number[] = [];
 const seen = new Set<number>();
 for (const m of matches) {
 const n = parseInt(m.replace(/\D/g, ''), 10);
 if (n >= 10000 && n <= 300000 && !seen.has(n)) {
 seen.add(n);
 prices.push(n);
 }
 }
 return prices; // [stage1, stage2, stage3, ..]
}

async function fetchPage(url: string): Promise<string> {
 try {
 const res = await fetch(url, {
 headers: {
 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36',
 'Accept-Language': 'ru-RU,ru;q=0.9',
 },
 next: { revalidate: 86400 },
 });
 if (!res.ok) return '';
 return await res.text();
 } catch {
 return '';
 }
}

async function getVariantUrls(brandSf: string, modelSf: string): Promise<string[]> {
 const html = await fetchPage(`${BASE}/chip-tuning/${brandSf}/${modelSf}`);
 if (!html) return [];
 const pattern = new RegExp(
 `href="(/chip-tuning/${brandSf}/${modelSf}/[^"#]+)"`, 'g'
 );
 const unique: string[] = [];
 let m: RegExpExecArray | null;
 while ((m = pattern.exec(html)) !== null) {
 const parts = m[1].split('/').filter(Boolean);
 if (parts.length >= 5) {
 const full = BASE + m[1];
 if (!unique.includes(full)) unique.push(full);
 }
 }
 return unique.slice(0, 3);
}

export async function GET(req: NextRequest) {
 const { searchParams } = req.nextUrl;
 const brand = searchParams.get('brand') ?? '';
 const model = searchParams.get('model') ?? '';

 const sfBrand = BRAND_MAP[brand];
 const sfModel = MODEL_MAP[`${brand}:${model}`] ?? model;

 if (!sfBrand) {
 return NextResponse.json({ error: 'Бренд не поддерживается' }, { status: 400 });
 }

 const variantUrls = await getVariantUrls(sfBrand, sfModel);
 const pages = variantUrls.length > 0
 ? variantUrls
 : [`${BASE}/chip-tuning/${sfBrand}/${sfModel}`];

 const allStages: number[][] = [[], [], []];

 for (const url of pages) {
 const html = await fetchPage(url);
 const prices = extractPrices(html);
 for (let i = 0; i < 3; i++) {
 if (prices[i]) allStages[i].push(prices[i]);
 }
 }

 const avg = (arr: number[]) =>
 arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length / 500) * 500 : null;

 const stage1 = avg(allStages[0]);
 const stage2 = avg(allStages[1]);
 const stage3 = avg(allStages[2]);

 if (!stage1) {
 return NextResponse.json(
 { error: 'Цены не найдены', brand, model },
 {
 status: 404,
 headers: { 'Cache-Control': 'public, s-maxage=3600' },
 }
 );
 }

 return NextResponse.json(
 {
 brand,
 model,
 source: 'sevenforce.ru',
 prices: { stage1, stage2, stage3 },
 sevenforceUrl: `${BASE}/chip-tuning/${sfBrand}/${sfModel}`,
 cachedAt: new Date().toISOString(),
 },
 {
 headers: {
 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
 },
 }
 );
}
