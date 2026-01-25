'use client';

import { useState } from 'react';
import { Link } from '@/app/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/app/components/ui/LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const t = useTranslations('nav');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/menu', label: t('menu') },
        { href: '/reserve', label: t('reserve') },
        { href: '/about', label: t('about') },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold font-heading text-accent-primary hover:text-accent-secondary transition-colors">
                        PreGame
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-foreground/80 hover:text-accent-primary transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions (Language + Mobile Toggle) */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-foreground/80 hover:text-accent-primary transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background border-b border-white/10 animate-fade-in">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-accent-primary hover:bg-white/5 rounded-md transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="px-3 py-2 border-t border-white/10">
                            <span className="text-sm text-muted-foreground mr-4">Language:</span>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
