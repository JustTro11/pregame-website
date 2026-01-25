'use client';

import { useTranslations } from 'next-intl';
import { businessConfig } from '@/app/config/business';
import { Users } from 'lucide-react';

interface PartySizeSelectorProps {
    value: number;
    onChange: (size: number) => void;
}

export default function PartySizeSelector({
    value,
    onChange,
}: PartySizeSelectorProps) {
    const t = useTranslations('reserve');
    const max = businessConfig.reservation.maxPartySize;
    const sizes = Array.from({ length: max }, (_, i) => i + 1);

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {sizes.map((size) => (
                <button
                    key={size}
                    onClick={() => onChange(size)}
                    className={`
            relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200
            ${value === size
                            ? 'bg-accent-primary text-bg-primary scale-110 shadow-glow'
                            : 'bg-bg-elevated text-text-secondary hover:bg-white/10 hover:text-white'}
          `}
                    aria-label={`${size} ${size === 1 ? t('guests_singular') : t('guests_plural')}`}
                >
                    {size}
                </button>
            ))}
        </div>
    );
}
