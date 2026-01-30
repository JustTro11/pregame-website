import { supabase } from './supabase';

export interface InstagramPost {
    id: string;
    shortcode: string;
    media_url: string;
    instagram_url: string;
    caption: string;
    created_at: string;
    is_featured: boolean;
}

export async function getInstagramPosts(limit = 12) {
    try {
        const { data, error } = await supabase
            .from('instagram_posts')
            .select('*')
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching Instagram posts:', error);
            return [];
        }

        return data as InstagramPost[];
    } catch (error) {
        console.error('Unexpected error fetching Instagram posts:', error);
        return [];
    }
}
