'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/app/i18n/routing';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'zh-TW', label: '繁體中文' },
        { code: 'en', label: 'English' },
        { code: 'zh-CN', label: '简体中文' },
        { code: 'ja', label: '日本語' },
        { code: 'ko', label: '한국어' },
    ];

    const currentLang = languages.find(l => l.code === locale)?.label || 'Language';

    const handleSwitch = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors text-sm font-medium"
                aria-label="Select Language"
            >
                <Globe size={18} />
                <span className="hidden md:inline">{currentLang}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-bg-elevated border border-white/10 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSwitch(lang.code)}
                                className={`
                                    w-full text-left px-4 py-2.5 text-sm transition-colors
                                    ${locale === lang.code
                                        ? 'bg-accent-primary/20 text-accent-primary font-bold'
                                        : 'text-text-secondary hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
