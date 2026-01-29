import { getTranslations } from 'next-intl/server';
import DrinkCard from '@/app/components/menu/DrinkCard';
import CategoryFilter from '@/app/components/menu/CategoryFilter';
import { getMenuItems } from '@/app/actions/menu';
import MenuClient from '@/app/components/menu/MenuClient';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'menu' });
    return {
        title: t('title'),
    };
}

export default async function MenuPage() {
    const t = await getTranslations('menu');
    const items = await getMenuItems();

    // Serialize data for client component
    // We pass all items to client, and client handles filtering interaction

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3 text-gradient">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground text-lg">
                    {t('subtitle')}
                </p>
            </div>

            <MenuClient initialItems={items} />
        </div>
    );
}
