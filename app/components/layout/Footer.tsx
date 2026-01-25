'use client';

import { Link } from '@/app/i18n/routing';
import { useTranslations } from 'next-intl';
import { Instagram } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="bg-bg-secondary border-t border-white/10 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link href="/" className="text-2xl font-bold font-heading text-accent-primary">
                            PreGame
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            {t('address')}
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{t('follow_us')}</span>
                            <a
                                href="https://instagram.com/pregame.tw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 rounded-full hover:bg-accent-primary hover:text-white transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {t('copyright')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
