'use client';

/**
 * Плавающая Telegram-кнопка в правом нижнем углу.
 *
 * Почему НЕ iframe-виджет oauth.telegram.org / t.me/widget:
 *   1) Тяжело грузится, ломает CLS, гасит Core Web Vitals.
 *   2) Под VPN/блокировками иногда не пробивается → у клиента "битый" виджет.
 *   3) Не работает offline.
 *
 * Поэтому ставим простую CSS-only кнопку-ссылку:
 *   - Грузится мгновенно, нет внешних запросов до клика.
 *   - При клике открывается t.me/<username>?text=<префилл> — Telegram автозаполнит
 *     первое сообщение контекстом текущей страницы (бренд, страница услуги, etc.).
 *   - Есть подсказка-тултип и пульсация для привлечения внимания.
 *
 * Цель в Метрике (`telegram_click`) повешена через data-event='telegram_click'.
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import company from '@/data/company.json';

/**
 * Строит префилл-сообщение по текущему пути.
 * Не пытаемся быть «умнее» чем надо — простые правила на основе URL.
 */
function buildPrefill(pathname: string): string {
  // Чип-тюнинг и калькулятор
  if (pathname.startsWith('/tuning/chip-tuning') || pathname.startsWith('/calculator')) {
    return 'Здравствуйте! Интересует чип-тюнинг. Хочу рассчитать стоимость для своего авто.';
  }
  if (pathname.startsWith('/tuning')) {
    return 'Здравствуйте! Интересует тюнинг. Можете подсказать по моему авто?';
  }

  // Детейлинг
  if (pathname.startsWith('/detailing')) {
    return 'Здравствуйте! Интересует детейлинг (полировка / керамика / PPF).';
  }

  // Сервис и диагностика
  if (pathname.startsWith('/service/diagnostics')) {
    return 'Здравствуйте! Нужна диагностика автомобиля. Когда можно записаться?';
  }
  if (pathname.startsWith('/service')) {
    return 'Здравствуйте! Интересует обслуживание автомобиля.';
  }

  // Бренды (страница конкретной марки)
  const brandMatch = pathname.match(/^\/(?:brands|marki)\/([a-z0-9-]+)/i);
  if (brandMatch) {
    const brand = brandMatch[1].replace(/-/g, ' ');
    return `Здравствуйте! Интересует обслуживание/тюнинг ${brand.toUpperCase()}.`;
  }

  // Блог / проекты / отзывы — пользователь читает контент, контекста меньше
  if (pathname.startsWith('/blog') || pathname.startsWith('/projects')) {
    return 'Здравствуйте! Прочитал у вас на сайте, есть вопрос.';
  }

  // Дефолт: главная и всё остальное
  return 'Здравствуйте! Интересуют ваши услуги, можете подсказать?';
}

/**
 * Извлекает username из href вида https://t.me/hptuningspb или t.me/hptuningspb
 */
function extractUsername(href: string): string {
  const m = href.match(/t\.me\/([a-z0-9_]+)/i);
  return m ? m[1] : 'hptuningspb';
}

export function FloatingTelegram() {
  const [showTip, setShowTip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || '/';

  // Показываем тултип единожды через 3 секунды после загрузки и через 15 сек прячем
  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setShowTip(true), 3000);
    const t2 = setTimeout(() => setShowTip(false), 18000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!mounted) return null;

  // Собираем deeplink с префиллом. На мобильном Telegram-приложение откроется
  // с уже подставленным текстом, на десктопе — t.me-страница покажет «Send Message».
  const username = extractUsername(company.contacts.telegram.href);
  const prefill = buildPrefill(pathname);
  const tgHref = `https://t.me/${username}?text=${encodeURIComponent(prefill)}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {/* Всплывашка-приглашение */}
      {showTip && (
        <div
          className="absolute bottom-full right-0 mb-3 w-64 bg-card border border-border rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          role="status"
        >
          <button
            onClick={() => setShowTip(false)}
            aria-label="Закрыть подсказку"
            className="absolute top-2 right-2 size-6 rounded-full hover:bg-bg-card text-text-subtle hover:text-text flex items-center justify-center text-sm"
          >
            ×
          </button>
          <div className="flex items-start gap-2 pr-4">
            <div className="text-2xl leading-none">💬</div>
            <div>
              <div className="text-text text-sm font-semibold mb-0.5">
                Напишите нам в Telegram
              </div>
              <div className="text-text-subtle text-xs leading-snug">
                Ответим за 15 минут. Можно прислать фото авто и VIN.
              </div>
            </div>
          </div>
          {/* Хвостик */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
        </div>
      )}

      {/* Сама кнопка — с deeplink-префиллом по контексту страницы */}
      <a
        href={tgHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в Telegram"
        data-event="telegram_click"
        className="group relative flex items-center justify-center size-14 md:size-16 rounded-full bg-[#229ED9] hover:bg-[#1d8dc1] shadow-lg shadow-[#229ED9]/40 hover:shadow-[#229ED9]/60 transition-all hover:scale-110"
      >
        {/* Пульсирующий ореол */}
        <span className="absolute inset-0 rounded-full bg-[#229ED9] opacity-40 animate-ping" />

        {/* Иконка Telegram (SVG, без внешних зависимостей) */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative size-7 md:size-8 text-white"
          aria-hidden="true"
        >
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
      </a>
    </div>
  );
}

export default FloatingTelegram;
