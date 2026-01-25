'use client';

import { useState } from 'react';
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

    // Helper to check if item is food
    const isFood = (item: MenuItem) => {
        const catName = item.category?.name_en.toLowerCase() || '';
        return catName.includes('bites') || catName.includes('food');
    };

    // Helper to render grid
    const renderGrid = (items: MenuItem[]) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-200">
            {items.map((item) => (
                <DrinkCard key={item.id} drink={item} />
            ))}
        </div>
    );

    // Filter logic for specific category
    const getFilteredItems = () => {
        return initialItems.filter(item => {
            const catName = item.category?.name_en.toLowerCase() || '';
            if (category === 'tea') return catName.includes('tea');
            if (category === 'float') return catName.includes('float');
            if (category === 'mocktail') return catName.includes('mocktail');
            if (category === 'food') return isFood(item);
            return false;
        });
    };

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
                        {renderGrid(initialItems.filter(i => !isFood(i)))}
                    </section>

                    {/* Food Section */}
                    {initialItems.some(i => isFood(i)) && (
                        <section>
                            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3 text-white/90">
                                <span className="w-1.5 h-6 bg-accent-primary rounded-full shadow-glow"></span>
                                {t('section_food')}
                            </h2>
                            {renderGrid(initialItems.filter(i => isFood(i)))}
                        </section>
                    )}
                </div>
            ) : (
                // Filtered View
                <div>
                    {renderGrid(getFilteredItems())}

                    {getFilteredItems().length === 0 && (
                        <div className="text-center py-20 text-muted-foreground animate-fade-in">
                            No items found in this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
