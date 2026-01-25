'use client';

import { useTranslations } from 'next-intl';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface Drink {
    id: string | number;
    name: string;
    nameEn: string;
    description?: string;
    price: number;
    image?: string;
    category: string;
    isPopular?: boolean;
    isNew?: boolean;
}

interface DrinkCardProps {
    drink: Drink;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
    const t = useTranslations('menu');

    return (
        <Card variant="glass" className="h-full flex flex-col p-4 overflow-hidden group hover:bg-white/5 transition-colors border-white/5">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-bg-elevated flex items-center justify-center">
                {drink.image ? (
                    // In real app use Next.js Image
                    <img
                        src={drink.image}
                        alt={drink.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="text-4xl font-heading text-white/10">{drink.name.charAt(0)}</div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {drink.isPopular && (
                        <span className="badge badge-accent bg-accent-primary text-black font-bold">
                            {t('popular')}
                        </span>
                    )}
                    {drink.isNew && (
                        <span className="badge badge-new bg-green-500 text-black font-bold">
                            {t('new')}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-grow">
                <h3 className="text-lg font-bold font-heading mb-1">{drink.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 font-mono">{drink.nameEn}</p>
                <p className="text-xs text-text-muted line-clamp-2 mb-3">{drink.description}</p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                <span className="text-xl font-bold text-accent-primary font-mono">${drink.price}</span>
                {/* Add button logic later if needed */}
                {/* <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full border border-white/20 hover:bg-accent-primary hover:text-black hover:border-accent-primary">
          +
        </Button> */}
            </div>
        </Card>
    );
}
