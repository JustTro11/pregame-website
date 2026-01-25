'use client';

import { useTranslations } from 'next-intl';
import Card from '@/app/components/ui/Card';
import { Link } from '@/app/i18n/routing';
import Button from '@/app/components/ui/Button';

// Placeholder data - replace with real data/images later
const drinks = [
    {
        id: 1,
        image: '/drink-1.jpg',
        bg: 'bg-amber-900/20',
    },
    {
        id: 2,
        image: '/drink-2.jpg',
        bg: 'bg-orange-900/20',
    },
    {
        id: 3,
        image: '/drink-3.jpg',
        bg: 'bg-red-900/20',
    },
];

export default function FeaturedDrinks() {
    const t = useTranslations('home');
    const tCommon = useTranslations('common');

    return (
        <section className="section bg-bg-primary relative overflow-hidden">
            <div className="container-wide">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in text-gradient">
                        {t('featured_title')}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('featured_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {drinks.map((drink, index) => (
                        <div
                            key={drink.id}
                            className={`animate-fade-in-up delay-${(index + 1) * 100}`}
                        >
                            <Card variant="glass" hoverEffect className="h-full flex flex-col items-center text-center group overflow-hidden p-0 border-white/5">
                                <div className={`w-full aspect-[4/5] ${drink.bg} relative overflow-hidden`}>
                                    {/* Placeholder for real image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-heading text-4xl font-bold uppercase tracking-widest group-hover:scale-110 transition-transform duration-700">
                                        Drink {drink.id}
                                    </div>

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link href="/menu">
                                            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                                                {tCommon('view_menu')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 w-full bg-bg-card/50 backdrop-blur-md">
                                    <h3 className="text-xl font-bold mb-1">Signature Drink {drink.id}</h3>
                                    <p className="text-accent-primary font-mono">$120</p>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
