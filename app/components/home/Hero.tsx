'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/app/i18n/routing';
import Button from '@/app/components/ui/Button';

export default function Hero() {
    const t = useTranslations('hero');

    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0">
                <Image
                    src="https://ebctnryujebfmewlczey.supabase.co/storage/v1/object/public/static-assets/hero.jpg"
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-black/20 to-transparent" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tighter">
                        <span className="text-white block uppercase tracking-tight">{t('title')}</span>
                        <span className="text-accent-cream text-3xl md:text-5xl lg:text-6xl block mt-2 font-light italic">
                            {t('subtitle')}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light tracking-wide">
                        {t('tagline')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/reserve">
                            <Button size="lg" className="min-w-[180px] hover:scale-105 transition-transform">
                                {t('cta_reserve')}
                            </Button>
                        </Link>

                        <Link href="/menu">
                            <Button variant="outline" size="lg" className="min-w-[180px] hover:scale-105 transition-transform bg-black/20 backdrop-blur-sm">
                                {t('cta_menu')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-white rounded-full" />
                </div>
            </div>
        </section>
    );
}
