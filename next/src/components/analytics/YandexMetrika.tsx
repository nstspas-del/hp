'use client';
import Script from 'next/script';

// ── Yandex.Metrika — HP Тюнинг (ID: 108614238) ───────────────────────────────
// Цели (настраиваются в кабинете Метрики вручную):
//   booking_open       — клик по кнопке "Записаться" (вторичная)
//   autodealer_open    — виджет AutoDealer открылся (вторичная)
//   autodealer_submit  — отправка заявки в AutoDealer (вторичная)
//   booking_success    — заявка успешно отправлена (первичная)
//   autodealer_close   — виджет закрыт без записи (антицель)
//   phone_click        — клик по номеру телефона (вторичная)
//   contact_form_submit — отправка формы /contacts (первичная)

export const YM_ID = 108614238;

// Глобальный хелпер — безопасный вызов ym()
// Используй везде: ym(YM_ID, 'reachGoal', 'goal_name')
declare global {
  interface Window {
    ym: (id: number, action: string, ...args: unknown[]) => void;
    YM_COUNTER_ID: number;
  }
}

export function YandexMetrika() {
  return (
    <>
      {/* ── Основной скрипт Метрики ──────────────────────────────────────── */}
      <Script
        id="ym-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

// Сохраняем ID глобально — используется в autodealer.ts и других компонентах
window.YM_COUNTER_ID = ${YM_ID};

ym(${YM_ID}, 'init', {
  clickmap:           true,   // карта кликов
  trackLinks:         true,   // автослежение за внешними ссылками
  accurateTrackBounce:true,   // точный отказ (15 сек)
  webvisor:           true,   // Вебвизор (запись сессий)
  ecommerce:          false,  // ecommerce не нужен для автосервиса
  defer:              false   // инициализация сразу
});
          `,
        }}
      />

      {/* ── Noscript — для браузеров без JS ─────────────────────────────── */}
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
            width={1}
            height={1}
          />
        </div>
      </noscript>
    </>
  );
}

// ── Утилита для вызова целей из любого компонента ────────────────────────────
// Пример: reachGoal('booking_open')
// Пример: reachGoal('booking_open', { service: 'chip-tuning' })
export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.ym === 'function') {
      window.ym(YM_ID, 'reachGoal', goal, params);
    }
  } catch (e) {
    console.warn('[YM] reachGoal failed:', goal, e);
  }
}
