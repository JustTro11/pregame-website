import { useTranslations } from 'next-intl';
import Card from '@/app/components/ui/Card';
import { MenuItem } from '@/app/actions/menu';
import { useLocale } from 'next-intl';

interface DrinkCardProps {
    drink: MenuItem;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
    const t = useTranslations('menu');
    const locale = useLocale();
    const isZh = locale === 'zh-TW' || locale.startsWith('zh');

    // Determine display name based on locale preference (shown prominently) vs subtitle
    const mainName = isZh ? drink.name_zh : drink.name_en;
    const subName = isZh ? drink.name_en : drink.name_zh;
    const description = isZh ? drink.description_zh : drink.description_en;

    return (
        <Card variant="glass" className="h-full flex flex-col p-4 overflow-hidden group hover:bg-white/5 transition-colors border-white/5">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-bg-elevated flex items-center justify-center">
                {drink.image_url ? (
                    // In real app use Next.js Image
                    <img
                        src={drink.image_url}
                        alt={drink.name_en}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="text-4xl font-heading text-white/10">{drink.name_en.charAt(0)}</div>
                )}

                {/* Badges - using optional fields if we add them to DB */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {drink.is_popular && (
                        <span className="badge badge-accent bg-accent-primary text-black font-bold">
                            {t('popular')}
                        </span>
                    )}
                    {drink.is_new && (
                        <span className="badge badge-new bg-green-500 text-black font-bold">
                            {t('new')}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-grow">
                <h3 className="text-lg font-bold font-heading mb-1">{mainName}</h3>
                <p className="text-sm text-muted-foreground mb-2 font-mono">{subName}</p>
                <p className="text-xs text-text-muted line-clamp-2 mb-3">{description}</p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                <span className="text-xl font-bold text-accent-primary font-mono">${drink.price}</span>
            </div>
        </Card>
    );
}
