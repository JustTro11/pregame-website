'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getInstagramPosts, InstagramPost } from '@/lib/instagram';

const STATIC_LOOKBOOK_IMAGES = [
    '/assets/instagram/2026-01-23_08-58-31_UTC_1.jpg',
    '/assets/instagram/2026-01-06_07-19-31_UTC_1.jpg',
    '/assets/instagram/2024-11-18_11-30-38_UTC_3.jpg',
    '/assets/instagram/2026-01-05_12-00-18_UTC.jpg',
    '/assets/instagram/2026-01-03_11-39-31_UTC.jpg',
    '/assets/instagram/2025-06-18_04-07-01_UTC_5.jpg',
    '/assets/instagram/2026-01-12_07-24-47_UTC.jpg',
    '/assets/instagram/2026-01-11_10-00-43_UTC.jpg',
];

export default function Lookbook() {
    const t = useTranslations('home');
    const [images, setImages] = useState<string[]>(STATIC_LOOKBOOK_IMAGES);

    useEffect(() => {
        async function loadImages() {
            const posts = await getInstagramPosts(8);
            if (posts && posts.length > 0) {
                setImages(posts.map(p => p.media_url));
            }
        }
        loadImages();
    }, []);

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
