'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { format } from 'date-fns';
import { useRouter } from '@/app/i18n/routing';
import { businessConfig, isOpenOnDay } from '@/app/config/business';
import DatePicker from '@/app/components/ui/DatePicker';
import TimeSlotPicker from '@/app/components/reservation/TimeSlotPicker';
import PartySizeSelector from '@/app/components/reservation/PartySizeSelector';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { Calendar, Clock, Users, User, Phone, CheckCircle2 } from 'lucide-react';
import { createReservation } from '@/app/actions/reservation';

type Inputs = {
    name: string;
    phone: string;
    email?: string;
    lineId?: string;
    notes?: string;
};

export default function ReservationForm() {
    const t = useTranslations('reserve');
    const tCommon = useTranslations('common');
    const router = useRouter();

    // State
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [partySize, setPartySize] = useState<number>(2);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form handling
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    // Date constraints
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + businessConfig.reservation.advanceBookingDays);

    const isStep1Complete = !!date;
    const isStep2Complete = !!time;
    const isStep3Complete = true; // Default selected

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!date || !time) return;

        setIsSubmitting(true);

        // Call Server Action
        const result = await createReservation({
            ...data,
            date: format(date, 'yyyy-MM-dd'),
            time,
            partySize,
        });

        if (result.error) {
            alert(result.error); // Simple error handling for now
            setIsSubmitting(false);
            return;
        }

        // Redirect to confirmation
        router.push(`/confirmation?code=${result.code}`);
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">

            {/* Step 1: Date & Party Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-accent-primary" />
                        <h3 className="text-lg font-semibold">{t('step_date')}</h3>
                    </div>

                    <DatePicker
                        selected={date}
                        onChange={(d) => {
                            setDate(d);
                            setTime(null); // Reset time when date changes
                        }}
                        minDate={today}
                        maxDate={maxDate}
                        filterDate={(d) => isOpenOnDay(d.getDay())}
                        placeholderText={t('select_date')}
                    />
                </Card>

                <Card className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="text-accent-primary" />
                        <h3 className="text-lg font-semibold">{t('step_guests')}</h3>
                    </div>

                    <PartySizeSelector
                        value={partySize}
                        onChange={setPartySize}
                    />
                </Card>
            </div>

            {/* Step 2: Time Slots */}
            <div>
                <Card className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="text-accent-primary" />
                        <h3 className="text-lg font-semibold">{t('step_time')}</h3>
                        {date && <span className="text-sm text-muted-foreground ml-auto">{format(date, 'yyyy/MM/dd')}</span>}
                    </div>

                    <TimeSlotPicker
                        selectedDate={date}
                        selectedTime={time}
                        onSelectTime={setTime}
                    />
                </Card>
            </div>

            {/* Step 3: User Details */}
            <div>
                <Card className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="text-accent-primary" />
                        <h3 className="text-lg font-semibold">{t('step_details')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={t('name_label')}
                            placeholder={t('name_placeholder')}
                            {...register('name', { required: tCommon('required') })}
                            error={errors.name?.message}
                        />

                        <Input
                            label={t('phone_label')}
                            type="tel"
                            placeholder={t('phone_placeholder')}
                            {...register('phone', { required: tCommon('required') })}
                            error={errors.phone?.message}
                        />

                        <Input
                            label={t('email_label')}
                            type="email"
                            placeholder={t('email_placeholder')}
                            {...register('email')}
                        />

                        <Input
                            label={t('line_label')}
                            placeholder={t('line_placeholder')}
                            {...register('lineId')}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="notes"
                            className="block text-sm font-medium text-text-secondary mb-1.5 ml-1"
                        >
                            {t('notes_label')}
                        </label>
                        <textarea
                            id="notes"
                            className="input-field min-h-[100px] resize-none"
                            placeholder={t('notes_placeholder')}
                            {...register('notes')}
                        />
                    </div>
                </Card>

                <div className="mt-8 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full md:w-auto min-w-[200px]"
                        disabled={!isStep1Complete || !isStep2Complete}
                        isLoading={isSubmitting}
                        rightIcon={<CheckCircle2 size={20} />}
                    >
                        {t('confirm_booking')}
                    </Button>
                </div>
            </div>
        </form>
    );
}
