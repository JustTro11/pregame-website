'use client';

import { useTranslations } from 'next-intl';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zhTW } from 'date-fns/locale/zh-TW';
import { enUS } from 'date-fns/locale/en-US';
import { useLocale } from 'next-intl';
import { Calendar } from 'lucide-react';

// Register locales
registerLocale('zh-TW', zhTW);
registerLocale('en', enUS);

interface DatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    filterDate?: (date: Date) => boolean;
    className?: string;
    placeholderText?: string;
}

export default function DatePicker({
    selected,
    onChange,
    minDate,
    maxDate,
    filterDate,
    className,
    placeholderText,
}: DatePickerProps) {
    const locale = useLocale();

    return (
        <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
                <Calendar size={18} />
            </div>
            <ReactDatePicker
                selected={selected}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                filterDate={filterDate}
                locale={locale === 'zh-TW' ? 'zh-TW' : 'en'}
                placeholderText={placeholderText}
                dateFormat={locale === 'zh-TW' ? 'yyyy/MM/dd' : 'MM/dd/yyyy'}
                className={`w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-default rounded-md text-foreground focus:outline-none focus:border-accent-primary transition-colors cursor-pointer ${className}`}
                calendarClassName="!bg-bg-card !border-border-default !font-sans !text-foreground"
                wrapperClassName="w-full"
            />

            <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          background-color: var(--bg-card) !important;
          border-color: var(--border-default) !important;
          font-family: var(--font-body) !important;
        }
        .react-datepicker__header {
          background-color: var(--bg-secondary) !important;
          border-bottom-color: var(--border-default) !important;
        }
        .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
          color: var(--text-primary) !important;
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
          color: var(--text-primary) !important;
        }
        .react-datepicker__day:hover {
          background-color: var(--bg-elevated) !important;
        }
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
          background-color: var(--accent-primary) !important;
          color: var(--bg-primary) !important;
        }
        .react-datepicker__day--disabled {
          color: var(--text-muted) !important;
          opacity: 0.5;
        }
      `}</style>
        </div>
    );
}
