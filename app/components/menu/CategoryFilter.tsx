'use client';

import { useTranslations } from 'next-intl';

interface CategoryFilterProps {
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
    activeCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    const t = useTranslations('menu');

    const categories = [
        { id: 'all', label: t('category_all') },
        { id: 'tea', label: t('category_tea') },
        { id: 'float', label: t('category_float') },
        { id: 'mocktail', label: t('category_mocktail') },
        { id: 'food', label: t('category_food') },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeCategory === cat.id
                            ? 'bg-accent-primary text-bg-primary font-bold shadow-glow scale-105'
                            : 'bg-bg-elevated text-text-secondary hover:bg-white/10 hover:text-white border border-white/5'}
          `}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
