/**
 * PriceDisclaimer — короткий юр-дисклеймер под калькуляторами/прайсами.
 *
 * Зачем: на сайте везде «от X ₽». По ст. 437 ГК РФ это может быть
 * расценено как публичная оферта. Явный текст «расчёт ориентировочный,
 * не является публичной офертой» снимает риск.
 *
 * Использование:
 *   <PriceDisclaimer />               — стандартный, компактный
 *   <PriceDisclaimer variant="full"/>  — полная формулировка со ст. 437 ГК РФ
 */
import { Info } from 'lucide-react';

type Props = {
  variant?: 'compact' | 'full';
  className?: string;
};

export function PriceDisclaimer({ variant = 'compact', className = '' }: Props) {
  return (
    <div
      className={`flex items-start gap-2 text-text-subtle text-[11px] leading-snug ${className}`}
      role="note"
    >
      <Info className="size-3.5 shrink-0 mt-px text-text-subtle/70" aria-hidden="true" />
      {variant === 'compact' ? (
        <span>
          Расчёт ориентировочный. Точная стоимость работ определяется после диагностики
          автомобиля и не является публичной офертой.
        </span>
      ) : (
        <span>
          Информация на сайте носит ознакомительный характер и не является публичной офертой
          (ст.&nbsp;437 ГК&nbsp;РФ). Указанные цены «от» являются ориентировочными; окончательная
          стоимость работ определяется после диагностики автомобиля и фиксируется в
          наряд-заказе.
        </span>
      )}
    </div>
  );
}

export default PriceDisclaimer;
