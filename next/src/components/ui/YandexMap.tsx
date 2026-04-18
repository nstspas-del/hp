'use client';

import { useEffect, useRef } from 'react';

declare global {
 interface Window {
 ymaps: any;
 }
}

const HP_LAT = 60.096423;
const HP_LNG = 30.304163;

// Кастомный SVG маркер HP Тюнинг (зелёный, 48×48)
const HP_MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
 <path d="M24 0C10.7 0 0 10.7 0 24c0 17.3 24 32 24 32s24-14.7 24-32C48 10.7 37.3 0 24 0z" fill="#39FF14"/>
 <circle cx="24" cy="24" r="10" fill="#09090b"/>
 <text x="24" y="28" font-size="10" font-family="Oswald,Arial" font-weight="700" fill="#39FF14" text-anchor="middle">HP</text>
</svg>`;

export function YandexMap() {
 const mapRef = useRef<HTMLDivElement>(null);
 const mapInstance = useRef<any>(null);

 useEffect(() => {
 const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
 const scriptSrc = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey || 'b4e7ade5-82db-4bce-9f58-8d7dae8d7a39'}&lang=ru_RU`;

 // Check if already loaded
 if (window.ymaps) {
 initMap();
 return;
 }

 const script = document.createElement('script');
 script.src = scriptSrc;
 script.async = true;
 script.onload = initMap;
 document.head.appendChild(script);

 return () => {
 if (mapInstance.current) {
 mapInstance.current.destroy();
 mapInstance.current = null;
 }
 };
 }, []);

 function initMap() {
 if (!mapRef.current) return;
 window.ymaps.ready(() => {
 if (!mapRef.current || mapInstance.current) return;

 const map = new window.ymaps.Map(mapRef.current, {
 center: [HP_LAT, HP_LNG],
 zoom: 16,
 controls: ['zoomControl', 'fullscreenControl'],
 }, {
 suppressMapOpenBlock: true,
 });

 mapInstance.current = map;

 // Кастомный маркер
 const placemark = new window.ymaps.Placemark(
 [HP_LAT, HP_LNG],
 {
 balloonContentHeader: '<strong style="font-size:15px;color:#09090b">HP Тюнинг</strong>',
 balloonContentBody: `
 <div style="font-family:Arial,sans-serif;font-size:13px;color:#333;min-width:200px">
 <p style="margin:4px 0">📍 ул. Богородская, 3Б, Порошкино</p>
 <p style="margin:4px 0">📞 <a href="tel:+79818428151" style="color:#1a73e8">+7 (981) 842-81-51</a></p>
 <p style="margin:4px 0">🕐 Ежедневно 10:00–20:00</p>
 <a href="https://yandex.ru/maps/-/CPvleY7F" target="_blank"
 style="display:inline-block;margin-top:8px;padding:6px 14px;background:#39FF14;color:#09090b;border-radius:20px;font-weight:700;font-size:12px;text-decoration:none">
 Построить маршрут →
 </a>
 </div>
 `,
 balloonContentFooter: '',
 hintContent: 'HP Тюнинг — Богородская 3Б',
 },
 {
 iconLayout: 'default#imageWithContent',
 iconImageHref: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(HP_MARKER_SVG)}`,
 iconImageSize: [48, 56],
 iconImageOffset: [-24, -56],
 balloonPanelMaxMapArea: 0,
 }
 );

 map.geoObjects.add(placemark);
 placemark.balloon.open();
 });
 }

 return (
 <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 480 }}>
 <div ref={mapRef} style={{ width: '100%', height: 480 }} />
 {/* Яндекс лицензия — обязательно */}
 <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 bg-white/80 px-2 py-0.5 rounded">
 <a href="https://yandex.ru/legal/maps_api/" target="_blank" rel="noopener noreferrer" className="hover:underline">
 Условия использования API Яндекс.Карт
 </a>
 </div>
 </div>
 );
}
