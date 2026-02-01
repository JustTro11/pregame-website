'use client';

import { useTranslations } from 'next-intl';
import { businessConfig, isOpenOnDay, getHoursForDay } from '@/app/config/business';
import Button from '@/app/components/ui/Button';

interface TimeSlotPickerProps {
    selectedDate: Date | null;
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
}

export default function TimeSlotPicker({
    selectedDate,
    selectedTime,
    onSelectTime,
}: TimeSlotPickerProps) {
    const t = useTranslations('reserve');

    if (!selectedDate) {
        return <div className="text-center text-muted-foreground py-8">{t('step_date')}</div>;
    }

    const dayOfWeek = selectedDate.getDay();
    const hours = getHoursForDay(dayOfWeek);

    if (!hours) {
        return <div className="text-center text-destructive py-8">{t('closed')}</div>;
    }

    // Generate slots logic
    const slots: string[] = [];
    const startHour = parseInt(hours.open.split(':')[0]);
    const endHour = parseInt(hours.close.split(':')[0]);
    // Handle crossing midnight (e.g. close at 1 AM means 25)
    const effectiveEndHour = endHour < startHour ? endHour + 24 : endHour;

    // Pre-calculate date bounds outside the loop
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const minBookingTime = new Date(now.getTime() + businessConfig.reservation.minAdvanceMinutes * 60000);

    for (let h = startHour; h < effectiveEndHour; h++) {
        // Determine AM/PM display
        const hour = h % 24;
        const timeString = `${hour.toString().padStart(2, '0')}:00`;

        let isPast = false;
        if (isToday) {
            const slotTime = new Date(selectedDate);
            slotTime.setHours(hour, 0, 0, 0);
            isPast = slotTime < minBookingTime;
        }

        if (!isPast) {
            slots.push(timeString);
        }
    }

    if (slots.length === 0) {
        return <div className="text-center text-muted-foreground py-8">{t('no_slots')}</div>;
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {slots.map((time) => {
                const [h, m] = time.split(':');
                const hour = parseInt(h);
                const hour12 = hour % 12 || 12;
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayTime = `${hour12}:${m} ${period}`;

                return (
                    <Button
                        key={time}
                        variant={selectedTime === time ? 'primary' : 'outline'}
                        onClick={() => onSelectTime(time)}
                        className={`w-full ${selectedTime === time ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-primary' : ''}`}
                        size="sm"
                    >
                        {displayTime}
                    </Button>
                );
            })}
        </div>
    );
}
