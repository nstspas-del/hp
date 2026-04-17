import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  /** compact — только иконка (для мобильного меню) */
  variant?: 'full' | 'compact';
  className?: string;
  onClick?: () => void;
}

export function Logo({ variant = 'full', className = '', onClick }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="HP Тюнинг — на главную"
      onClick={onClick}
      className={`flex items-center gap-2.5 group shrink-0 select-none ${className}`}
    >
      {/* Neon-логотип картинкой */}
      <div className="relative w-10 h-10 shrink-0 drop-shadow-[0_0_12px_rgba(57,255,20,0.6)]
                      group-hover:drop-shadow-[0_0_22px_rgba(57,255,20,0.85)] transition-all duration-300">
        <Image
          src="/images/logo/logo-hp-neon.png"
          alt="HP Тюнинг лого"
          fill
          className="object-contain"
          sizes="40px"
          priority
        />
      </div>

      {/* Текст — скрывается в compact */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span
              className="font-display text-[22px] tracking-[0.1em] text-[#39FF14] uppercase"
              style={{ textShadow: '0 0 18px rgba(57,255,20,0.7)' }}
            >
              HP
            </span>
            <span className="font-display text-[22px] tracking-[0.1em] text-white uppercase">
              ТЮНИНГ
            </span>
          </div>
          <span className="text-[9px] text-zinc-500 tracking-[0.18em] uppercase mt-0.5">
            Premium · Санкт-Петербург
          </span>
        </div>
      )}
    </Link>
  );
}
