import type { Metadata } from 'next';
import NotFoundClient from './NotFoundClient';

export const metadata: Metadata = {
  title: '404 — Страница не найдена · HP Тюнинг',
  description:
    'Что-то пошло не так. Возможно, страница переехала или была удалена. Вернитесь на главную или свяжитесь с нами.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundClient />;
}
