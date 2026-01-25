'use client';

import { useTranslations } from 'next-intl';
import ReservationForm from '@/app/components/reservation/ReservationForm';

export default function ReservePage() {
    const t = useTranslations('reserve');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold font-heading mb-3 animate-fade-in">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground text-lg animate-fade-in delay-100">
                    {t('subtitle')}
                </p>
            </div>

            <ReservationForm />
        </div>
    );
}
