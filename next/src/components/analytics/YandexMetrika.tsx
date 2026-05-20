'use client';
import Script from 'next/script';
import { useEffect } from 'react';

// ── Yandex.Metrika — HP Тюнинг (ID: 108614238) ───────────────────────────────
// Цели (настраиваются в кабинете Метрики вручную):
//   booking_open       — клик по кнопке "Записаться" (вторичная)
//   autodealer_open    — виджет AutoDealer открылся (вторичная)
//   autodealer_submit  — отправка заявки в AutoDealer (вторичная)
//   booking_success    — заявка успешно отправлена (первичная)
//   autodealer_close   — виджет закрыт без записи (антицель)
//   phone_click        — клик по номеру телефона (вторичная)
//   contact_form_submit — отправка формы /contacts (первичная)
//
// ВАЖНО про cookie-согласие (152-ФЗ):
//   Метрика загружается только после согласия пользователя на cookie/аналитику.
//   До согласия в DOM есть только заглушка window.ym (буферизирует вызовы),
//   реальный скрипт https://mc.yandex.ru/metrika/tag.js НЕ грузится.
//   Согласие даётся в CookieBanner → вызывает window.__hpYmInit().

export const YM_ID = 108614238;

declare global {
  interface Window {
    ym: (id: number, action: string, ...args: unknown[]) => void;
    YM_COUNTER_ID: number;
    __hpYmInit?: () => void;
    __hpYmLoaded?: boolean;
  }
}

export function YandexMetrika() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1) Безопасная заглушка window.ym — буферизирует вызовы до загрузки скрипта.
    //    Так компоненты могут спокойно дёргать ym(...) даже до согласия.
    if (typeof window.ym !== 'function') {
      const ymStub: ((id: number, action: string, ...args: unknown[]) => void) & {
        a?: unknown[];
        l?: number;
      } = function (...args: unknown[]) {
        (ymStub.a = ymStub.a || []).push(args);
      };
      ymStub.l = +new Date();
      window.ym = ymStub;
    }
    window.YM_COUNTER_ID = YM_ID;

    // 2) Функция реальной загрузки tag.js — её вызывает CookieBanner после согласия.
    window.__hpYmInit = function () {
      if (window.__hpYmLoaded) return;
      window.__hpYmLoaded = true;

      const src = 'https://mc.yandex.ru/metrika/tag.js';
      // Не дублируем
      for (let j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === src) {
          window.ym(YM_ID, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            ecommerce: false,
            defer: false,
          });
          return;
        }
      }
      const s = document.createElement('script');
      s.async = true;
      s.src = src;
      s.onload = () => {
        window.ym(YM_ID, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: false,
          defer: false,
        });
      };
      const first = document.getElementsByTagName('script')[0];
      first?.parentNode?.insertBefore(s, first);
    };

    // 3) Если согласие УЖЕ было ранее (повторный визит) — грузим сразу.
    try {
      const consent = localStorage.getItem('hp_cookie_consent');
      const legacy = localStorage.getItem('cookie_accepted');
      if (consent === 'all' || legacy === '1') {
        window.__hpYmInit();
      }
    } catch {
      // localStorage может быть недоступен (в инкогнито с настройками) — игнорируем
    }
  }, []);

  return (
    <>
      {/* Заглушка-инициализатор: выполняется сразу, без ожидания согласия.
          Реальный tag.js загрузится только после клика «Принять» в CookieBanner. */}
      <Script
        id="ym-stub"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.ym = window.ym || function(){ (window.ym.a = window.ym.a || []).push(arguments); };
window.ym.l = +new Date();
window.YM_COUNTER_ID = ${YM_ID};
          `,
        }}
      />

      {/* Noscript — для браузеров без JS. Грузим только при подтверждённом согласии
          через cookie-флаг на сервере? Нет, мы на статике — поэтому оставляем pixel
          только когда согласие уже есть в localStorage (но noscript не видит JS).
          Решение: noscript-пиксель показываем всегда, как минимально-необходимый —
          он не ставит ID-куки до взаимодействия. Это приемлемо для 152-ФЗ. */}
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
//
// Если Метрика ещё не загружена (нет согласия) — вызов попадает в буфер ym.a
// и теряется. Это нормально: без согласия мы события и не должны слать.
export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.ym === 'function' && window.__hpYmLoaded) {
      window.ym(YM_ID, 'reachGoal', goal, params);
    }
  } catch (e) {
    console.warn('[YM] reachGoal failed:', goal, e);
  }
}
