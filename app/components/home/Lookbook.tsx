'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const STATIC_LOOKBOOK_IMAGES = [
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-1.jpg',
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-2.jpg',
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-3.jpg',
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-4.jpg',
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-5.jpg',
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-6.jpg',
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-7.jpg',
    'https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/lookbook-8.jpg',
];

interface LookbookProps {
    initialImages?: string[];
}

export default function Lookbook({ initialImages = [] }: LookbookProps) {
    const t = useTranslations('home');
    const images = initialImages.length > 0 ? initialImages : STATIC_LOOKBOOK_IMAGES;

    return (
        <section className="section overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-gradient">
                            {t('lookbook_title')}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            {t('lookbook_subtitle')}
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <a
                            href="https://instagram.com/pregame.tw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-accent-cream hover:text-accent-primary transition-colors duration-300"
                        >
                            <span className="font-mono tracking-tighter uppercase font-bold text-sm">{t('lookbook_cta')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((src: string, index: number) => (
                        <div
                            key={src}
                            className={`relative overflow-hidden group rounded-2xl aspect-[3/4] ${index === 1 || index === 4 ? 'row-span-1 md:row-span-2' : ''
                                }`}
                        >
                            <Image
                                src={src}
                                alt={`PreGame Lookbook ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <p className="font-mono text-xs uppercase tracking-widest text-accent-cream">
                                    @pregame.tw // 2025
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
