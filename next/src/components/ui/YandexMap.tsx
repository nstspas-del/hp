// Яндекс.Карта — бесплатный iframe-виджет (map-widget/v1/)
// Никаких JS API, никаких платных ключей.
// Виджет работает бесплатно навсегда по условиям Яндекса.

export function YandexMap() {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 480 }}>
      <iframe
        src="https://yandex.ru/map-widget/v1/?z=15&ol=biz&oid=99062407907"
        width="100%"
        height="480"
        frameBorder="0"
        allowFullScreen
        style={{ display: 'block', border: 0, borderRadius: '1rem' }}
        title="HP Тюнинг — Яндекс.Карты"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
