'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DrinkCard from '@/app/components/menu/DrinkCard';
import CategoryFilter from '@/app/components/menu/CategoryFilter';

// Sample Data
const drinksData = [
    {
        id: 1,
        name: '經典珍珠奶茶',
        nameEn: 'Classic Bubble Milk Tea',
        description: 'Rich black tea with fresh milk and chewy tapioca pearls.',
        price: 65,
        category: 'tea',
        isPopular: true,
    },
    {
        id: 2,
        name: '百香雙響炮',
        nameEn: 'Passion Fruit Green Tea',
        description: 'Refreshing green tea with fresh passion fruit pulp, coconut jelly and pearls.',
        price: 75,
        category: 'tea',
    },
    {
        id: 3,
        name: '冰淇淋紅茶',
        nameEn: 'Black Tea with Ice Cream',
        description: 'Classic black tea topped with a scoop of vanilla ice cream.',
        price: 80,
        category: 'float',
        isPopular: true,
    },
    {
        id: 4,
        name: '藍色珊瑚礁',
        nameEn: 'Blue Lagoon Float',
        description: 'Blue curacao soda with vanilla ice cream and cherry.',
        price: 120,
        category: 'float',
        isNew: true,
    },
    {
        id: 5,
        name: '夕陽特調',
        nameEn: 'Sunset Mocktail',
        description: 'Layered drink with orange juice, grenadine, and sparkling water.',
        price: 150,
        category: 'mocktail',
    },
    {
        id: 6,
        name: '抹茶拿鐵',
        nameEn: 'Matcha Latte',
        description: 'Premium Japanese matcha with fresh milk.',
        price: 90,
        category: 'tea',
    },
    {
        id: 7,
        name: '芒果冰沙',
        nameEn: 'Mango Smoothie',
        description: 'Fresh mango blended with ice.',
        price: 110,
        category: 'float', // Close enough category
    },
    {
        id: 8,
        name: '莫吉托無酒精',
        nameEn: 'Virgin Mojito',
        description: 'Fresh mint, lime, sugar and sparkling water.',
        price: 140,
        category: 'mocktail',
        isNew: true,
    },
];

export default function MenuPage() {
    const t = useTranslations('menu');
    const [category, setCategory] = useState('all');

    const filteredDrinks = category === 'all'
        ? drinksData
        : drinksData.filter(d => d.category === category);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3 animate-fade-in text-gradient">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground text-lg animate-fade-in delay-100">
                    {t('subtitle')}
                </p>
            </div>

            <CategoryFilter
                activeCategory={category}
                onSelectCategory={setCategory}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-200">
                {filteredDrinks.map((drink) => (
                    <DrinkCard key={drink.id} drink={drink} />
                ))}
            </div>

            {filteredDrinks.length === 0 && (
                <div className="text-center py-20 text-muted-foreground animate-fade-in">
                    No drinks found in this category.
                </div>
            )}
        </div>
    );
}
