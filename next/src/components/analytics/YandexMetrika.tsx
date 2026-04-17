'use client';
import Script from 'next/script';

// Счётчик HP Тюнинг — Yandex.Metrika 108614238
const YM_ID = 108614238;

export function YandexMetrika() {
  return (
    <>
      <Script
        id="ym-tag"
        strategy="afterInteractive"
        src="https://mc.yandex.ru/metrika/tag.js"
      />
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

            window.YM_COUNTER_ID = ${YM_ID};
            ym(${YM_ID},'init',{
              ssr:true,
              webvisor:true,
              clickmap:true,
              referrer:document.referrer,
              url:location.href,
              accurateTrackBounce:true,
              trackLinks:true
            });
          `,
        }}
      />
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
