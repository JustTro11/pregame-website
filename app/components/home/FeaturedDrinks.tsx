'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Card from '@/app/components/ui/Card';
import { Link } from '@/app/i18n/routing';
import Button from '@/app/components/ui/Button';

// Placeholder data - replace with real data/images later
const drinks = [
    {
        id: 1,
        name: 'Dalgona Coffee',
        price: '180',
        pairing: 'Vintage Denim & Eames Seating',
        image: 'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/drink-1.jpg?v=2',
        bg: 'bg-red-900/10',
    },
    {
        id: 2,
        name: 'Signature Soda Float',
        price: '160',
        pairing: 'Fresh Kicks & City Lights',
        image: 'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/drink-2.jpg?v=2',
        bg: 'bg-cream/5',
    },
    {
        id: 3,
        name: 'Irish Coffee',
        price: '200',
        pairing: 'Late Night Beats & Oversized Tees',
        image: 'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/drink-3.jpg?v=2',
        bg: 'bg-black/20',
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
                                    <Image
                                        src={drink.image}
                                        alt={drink.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link href="/menu">
                                            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                                                {tCommon('view_menu')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-8 w-full bg-bg-card/50 backdrop-blur-md flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 font-heading tracking-tight">{drink.name}</h3>
                                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent-cream/60 mb-4">
                                            {t('pairing_label')}: <span className="text-accent-cream">{drink.pairing}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xs text-muted-foreground">$</span>
                                        <p className="text-2xl font-bold text-accent-primary font-mono">{drink.price}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
