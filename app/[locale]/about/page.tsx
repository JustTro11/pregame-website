'use client';

import { useTranslations } from 'next-intl';
import { businessConfig, formatHoursDisplay } from '@/app/config/business';
import { useLocale } from 'next-intl';
import Card from '@/app/components/ui/Card';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
    const t = useTranslations('about');
    const tHours = useTranslations('hours');
    const locale = useLocale();

    const days = [0, 1, 2, 3, 4, 5, 6]; // Sun to Sat

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-gradient">
                    {t('title')}
                </h1>
                <div className="max-w-3xl mx-auto prose prose-invert">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {t('story_content')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up delay-200">
                {/* Info Column */}
                <div className="space-y-8">
                    {/* Location */}
                    <Card className="space-y-4">
                        <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                            <MapPin className="text-accent-primary" />
                            {t('find_us')}
                        </h2>
                        <p className="text-lg">{businessConfig.address.full[locale === 'zh-TW' || locale.startsWith('zh') ? 'zh' : 'en']}</p>

                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <h3 className="font-bold text-accent-primary">{t('contact_title')}</h3>
                            <a href={businessConfig.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent-primary transition-colors">
                                <span className="font-bold">Instagram</span>
                                <span>{businessConfig.contact.instagram}</span>
                            </a>
                            {/* Add more contacts if available */}
                        </div>
                    </Card>

                    {/* Hours */}
                    <Card className="space-y-4">
                        <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                            <Clock className="text-accent-primary" />
                            {t('location_title')}
                        </h2>

                        <div className="space-y-2">
                            {days.map((day) => {
                                const dayNameKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day];
                                const hours = businessConfig.hours[day];
                                const today = new Date().getDay();
                                const isToday = day === today;

                                return (
                                    <div key={day} className={`flex justify-between py-2 border-b border-white/5 last:border-0 ${isToday ? 'text-accent-primary font-bold' : ''}`}>
                                        <span>{tHours(dayNameKey)}</span>
                                        <span className="font-mono">
                                            {formatHoursDisplay(hours, locale === 'zh-TW' || locale.startsWith('zh') ? 'zh' : 'en')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Map Column */}
                <div className="h-full min-h-[400px] rounded-xl overflow-hidden border border-white/10 relative group">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.686523992015!2d120.2001!3d22.9908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU5JzI2LjkiTiAxMjDCsDEyJzAwLjQiRQ!5e0!3m2!1sen!2stw!4v1620000000000!5m2!1sen!2stw"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
