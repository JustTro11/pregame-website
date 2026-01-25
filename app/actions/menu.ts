import { supabase } from '@/lib/supabase';

export interface MenuCategory {
    id: string;
    name_en: string;
    name_zh: string;
}

export interface MenuItem {
    id: string;
    name_en: string;
    name_zh: string;
    description_en?: string;
    description_zh?: string;
    price: number;
    image_url?: string;
    is_available: boolean;
    category_id: string;
    category?: MenuCategory;
    is_popular?: boolean; // We might want to add this column to DB later
    is_new?: boolean;     // We might want to add this column to DB later
}

export async function getMenuCategories() {
    const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data as MenuCategory[];
}

export async function getMenuItems() {
    // Determine locale on client side, but here we just fetch all
    const { data, error } = await supabase
        .from('menu_items')
        .select(`
            *,
            category:menu_categories(*)
        `)
        .order('price'); // Or other sort order

    if (error) {
        console.error('Error fetching items:', error);
        return [];
    }

    return data as MenuItem[];
}
