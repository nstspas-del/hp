/**
 * YML-фид услуг для синхронизации с Яндекс.Бизнес.
 *
 * Источник: src/data/yandex-services.json
 * URL: https://hptuning.ru/yandex-services.yml
 *
 * Формат: YML (Yandex Market Language) — упрощённый набор полей под услуги,
 * с расширением service-level (priceFrom, duration, image, marks).
 *
 * Кэширование: revalidate = 3600 (1 час), чтобы Яндекс мог часто опрашивать.
 *
 * Документация Яндекса:
 * https://yandex.ru/sprav/api/2.0/objects/services/
 */
import companyData from '@/data/company.json';
import yandexServicesData from '@/data/yandex-services.json';

export const revalidate = 3600;

interface YandexService {
  slug: string;
  name: string;
  yandexCategory: string;
  shortDescription: string;
  longDescription: string;
  priceFrom: number;
  priceTo: number | null;
  duration: string;
  image: string;
  marks: string[];
}

interface YandexServicesData {
  _meta: {
    yandexCardId: string;
    yandexCardUrl: string;
    currency: string;
    updatedAt: string;
  };
  services: YandexService[];
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const data = yandexServicesData as YandexServicesData;
  const baseUrl = 'https://hptuning.ru';
  const now = new Date().toISOString();

  // Категории — уникальные yandexCategory
  const categories = Array.from(
    new Set(data.services.map((s) => s.yandexCategory)),
  );

  const categoryXml = categories
    .map((cat, i) => `      <category id="${i + 1}">${xmlEscape(cat)}</category>`)
    .join('\n');

  const offerXml = data.services
    .map((s) => {
      const catId = categories.indexOf(s.yandexCategory) + 1;
      const url = `${baseUrl}/service/${s.slug}`;
      const imageUrl = `${baseUrl}${s.image}`;
      const priceTo = s.priceTo ? `<price_to>${s.priceTo}</price_to>` : '';
      return `    <offer id="${xmlEscape(s.slug)}" type="service" available="true">
      <url>${xmlEscape(url)}</url>
      <price>${s.priceFrom}</price>
      ${priceTo}
      <currencyId>RUR</currencyId>
      <categoryId>${catId}</categoryId>
      <picture>${xmlEscape(imageUrl)}</picture>
      <name>${xmlEscape(s.name)}</name>
      <description>${xmlEscape(s.longDescription)}</description>
      <param name="Длительность">${xmlEscape(s.duration)}</param>
      <param name="Марки">${xmlEscape(s.marks.join(', '))}</param>
      <param name="Категория">${xmlEscape(s.yandexCategory)}</param>
    </offer>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${now}">
  <shop>
    <name>${xmlEscape(companyData.name)}</name>
    <company>${xmlEscape(companyData.legalName)}</company>
    <url>${baseUrl}</url>
    <currencies>
      <currency id="RUR" rate="1"/>
    </currencies>
    <categories>
${categoryXml}
    </categories>
    <offers>
${offerXml}
    </offers>
  </shop>
</yml_catalog>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
