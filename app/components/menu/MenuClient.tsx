'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import DrinkCard from '@/app/components/menu/DrinkCard';
import CategoryFilter from '@/app/components/menu/CategoryFilter';
import { MenuItem } from '@/app/actions/menu';

interface MenuClientProps {
    initialItems: MenuItem[];
}

export default function MenuClient({ initialItems }: MenuClientProps) {
    const t = useTranslations('menu');
    const [category, setCategory] = useState('all');

    const { foodItems, drinkItems } = useMemo(() => {
        const food: MenuItem[] = [];
        const drink: MenuItem[] = [];

        initialItems.forEach(item => {
            const catName = item.category?.name_en.toLowerCase() || '';
            if (catName.includes('bites') || catName.includes('food')) {
                food.push(item);
            } else {
                drink.push(item);
            }
        });

        return { foodItems: food, drinkItems: drink };
    }, [initialItems]);

    // Helper to render grid
    const renderGrid = (items: MenuItem[]) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-200">
            {items.map((item) => (
                <DrinkCard key={item.id} drink={item} />
            ))}
        </div>
    );

    // Filter logic for specific category
    const filteredItems = useMemo(() => {
        if (category === 'all') return [];

        return initialItems.filter(item => {
            const catName = item.category?.name_en.toLowerCase() || '';
            if (category === 'tea') return catName.includes('tea');
            if (category === 'float') return catName.includes('float');
            if (category === 'mocktail') return catName.includes('mocktail');
            if (category === 'food') return catName.includes('bites') || catName.includes('food');
            return false;
        });
    }, [category, initialItems]);

    return (
        <div>
            <CategoryFilter
                activeCategory={category}
                onSelectCategory={setCategory}
            />

            {category === 'all' ? (
                <div className="space-y-16">
                    {/* Drinks Section */}
                    <section>
                        <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3 text-white/90">
                            <span className="w-1.5 h-6 bg-accent-primary rounded-full shadow-glow"></span>
                            {t('section_drinks')}
                        </h2>
                        {renderGrid(drinkItems)}
                    </section>

                    {/* Food Section */}
                    {foodItems.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3 text-white/90">
                                <span className="w-1.5 h-6 bg-accent-primary rounded-full shadow-glow"></span>
                                {t('section_food')}
                            </h2>
                            {renderGrid(foodItems)}
                        </section>
                    )}
                </div>
            ) : (
                // Filtered View
                <div>
                    {renderGrid(filteredItems)}

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground animate-fade-in">
                            No items found in this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
