'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/app/i18n/routing';
import Button from '@/app/components/ui/Button';

export default function QuickReserve() {
    const t = useTranslations('home');
    const tHero = useTranslations('hero');
    const tCommon = useTranslations('common');

    return (
        <section className="section relative py-32 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-accent-primary/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />

            <div className="container mx-auto relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
                    {tHero('tagline')}
                </h2>

                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    {t('about_description')}
                </p>

                <Link href="/reserve">
                    <Button size="lg" className="px-12 py-8 text-xl rounded-full shadow-glow animate-pulse-glow">
                        {tCommon('reserve_now')}
                    </Button>
                </Link>
            </div>
        </section>
    );
}
