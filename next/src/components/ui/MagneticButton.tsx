'use client';

/**
 * MagneticButton — кнопка которая физически «тянется» к курсору.
 *
 * taste-skill §4 Creative Proactivity:
 *   • Используем useMotionValue / useTransform — НЕ useState
 *   • Все вычисления вне React render cycle → нет дёрганий
 *   • Только на устройствах с мышкой (pointer:fine)
 *   • На тач-устройствах работает как обычная ссылка
 *
 * Применение:
 *   <MagneticButton href="/contacts" className="btn-primary">
 *     Связаться
 *   </MagneticButton>
 */

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type Props = {
  children: ReactNode;
  href?: string;
  /** Чувствительность магнита (1.0 = норма, 0.5 = слабее, 2.0 = сильнее) */
  strength?: number;
  className?: string;
  /** Прямой клик (для tel:/mailto:/обработчиков) */
  onClick?: () => void;
  /** target — например _blank для Telegram */
  target?: string;
  rel?: string;
};

export function MagneticButton({
  children,
  href,
  strength = 0.35,
  className,
  onClick,
  target,
  rel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  // raw mouse offset (deltaX, deltaY от центра)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // spring physics для плавного следования
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  // Ограничиваем максимальный сдвиг (чтоб не уехала далеко)
  const tx = useTransform(springX, (v) => v * strength);
  const ty = useTransform(springY, (v) => v * strength);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: tx, y: ty }}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}
