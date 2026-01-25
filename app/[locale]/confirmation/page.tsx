'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/app/i18n/routing';
import { supabase } from '@/lib/supabase';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { CheckCircle2, Calendar, Clock, Users, Home } from 'lucide-react';

export default function ConfirmationPage() {
    const t = useTranslations('confirmation');
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!code) return;

        async function fetchBooking() {
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .eq('confirmation_code', code)
                .single();

            if (data) {
                setBooking(data);
            }
            setLoading(false);
        }

        fetchBooking();
    }, [code]);

    if (!code) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Invalid Reservation</h1>
                <Link href="/">
                    <Button>{t('back_home')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <Card variant="glass" className="text-center p-8 md:p-12 border-accent-primary/30">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-primary/20 text-accent-primary mb-6 animate-pulse-glow">
                    <CheckCircle2 size={40} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground mb-8">
                    {t('subtitle')}
                </p>

                <div className="bg-bg-elevated rounded-xl p-6 mb-8 text-left space-y-4 border border-white/5">
                    <div className="text-center pb-4 border-b border-white/10">
                        <span className="text-sm text-muted-foreground block mb-1">{t('code_label')}</span>
                        <span className="text-3xl font-mono font-bold tracking-widest text-accent-primary">{code}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 pt-2">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-text-secondary" />
                            <div>
                                <span className="text-xs text-muted-foreground block">{t('date')}</span>
                                <span className="font-medium">{loading ? '...' : booking?.date}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock size={18} className="text-text-secondary" />
                            <div>
                                <span className="text-xs text-muted-foreground block">{t('time')}</span>
                                <span className="font-medium">{loading ? '...' : booking?.time_slot?.slice(0, 5)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Users size={18} className="text-text-secondary" />
                            <div>
                                <span className="text-xs text-muted-foreground block">{t('guests')}</span>
                                <span className="font-medium">{loading ? '...' : booking?.party_size} People</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Home size={18} className="text-text-secondary" />
                            <div>
                                <span className="text-xs text-muted-foreground block">Table</span>
                                <span className="font-medium">Any Available</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground mb-8 bg-accent-primary/10 p-4 rounded-lg">
                    {t('reminder')}
                </p>

                <Link href="/">
                    <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                        {t('back_home')}
                    </Button>
                </Link>
            </Card>
        </div>
    );
}
