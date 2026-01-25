'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type ReservationState = {
    success?: boolean;
    error?: string;
    code?: string;
};

export type CreateReservationInput = {
    name: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    partySize: number;
    notes?: string;
};

export async function createReservation(data: CreateReservationInput) {
    // 1. Extract and map data
    const dbData = {
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email,
        date: data.date,
        time_slot: data.time,
        party_size: data.partySize,
        special_requests: data.notes,
    };

    // 2. Validate (Basic)
    if (!dbData.date || !dbData.time_slot || !dbData.customer_name || !dbData.customer_phone) {
        return { error: 'Missing required fields' };
    }

    // 3. Generate Confirmation Code (Random 6 chars)
    const confirmation_code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 4. Insert into Supabase
    const { error } = await supabase
        .from('reservations')
        .insert([
            {
                ...dbData,
                confirmation_code,
                status: 'confirmed',
            },
        ]);

    if (error) {
        console.error('Supabase Error:', error);
        return { error: 'Failed to save reservation. Please try again.' };
    }

    return { success: true, code: confirmation_code };
}
