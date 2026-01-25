'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/app/i18n/routing';
import { locales } from '@/app/i18n/request';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const handleChange = (newLocale: string) => {
        router.replace(
            // @ts-expect-error -- TypeScript validation for routing params
            { pathname, params },
            { locale: newLocale }
        );
    };

    return (
        <div className="flex items-center gap-2">
            {locales.map((l) => (
                <button
                    key={l}
                    onClick={() => handleChange(l)}
                    className={`px-2 py-1 text-sm rounded transition-colors ${locale === l
                            ? 'bg-accent-primary text-background font-bold'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {l === 'zh-TW' ? '中文' : 'EN'}
                </button>
            ))}
        </div>
    );
}
