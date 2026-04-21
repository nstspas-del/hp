'use client';
import { openBooking } from '@/lib/autodealer';

interface BookingButtonProps {
 label?: string;
 serviceHint?: string;
 className?: string;
}

export function BookingButton({ label = 'Записаться онлайн', serviceHint, className }: BookingButtonProps) {
 return (
 <button
 onClick={() => openBooking(serviceHint)}
 className={className ?? 'btn-primary text-base px-8 py-4'}
 >
 {label}
 </button>
 );
}
