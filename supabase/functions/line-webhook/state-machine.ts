// supabase/functions/line-webhook/state-machine.ts
import { SupabaseClient } from "@supabase/supabase-js";

export type ConversationState =
    | "idle"
    | "awaiting_phone"
    | "booking_date"
    | "booking_time"
    | "booking_guests"
    | "booking_name"
    | "booking_confirm";

export interface StateData {
    date?: string;
    time?: string;
    guests?: number;
    name?: string;
    phone?: string;
}

export interface Conversation {
    id: string;
    line_user_id: string;
    current_state: ConversationState;
    state_data: StateData;
    phone: string | null;
    language: "zh-TW" | "en";
    created_at: string;
    updated_at: string;
}

export async function getConversation(
    supabase: SupabaseClient,
    lineUserId: string
): Promise<Conversation> {
    const { data } = await supabase
        .from("line_conversations")
        .select("*")
        .eq("line_user_id", lineUserId)
        .single();

    if (!data) {
        // Create new conversation
        const { data: newConvo } = await supabase
            .from("line_conversations")
            .insert({ line_user_id: lineUserId })
            .select()
            .single();
        return newConvo as Conversation;
    }
    return data as Conversation;
}

export async function setState(
    supabase: SupabaseClient,
    lineUserId: string,
    state: ConversationState,
    stateData?: StateData
): Promise<void> {
    await supabase
        .from("line_conversations")
        .update({
            current_state: state,
            state_data: stateData || {},
            updated_at: new Date().toISOString(),
        })
        .eq("line_user_id", lineUserId);
}

export async function setPhone(
    supabase: SupabaseClient,
    lineUserId: string,
    phone: string
): Promise<void> {
    await supabase
        .from("line_conversations")
        .update({ phone })
        .eq("line_user_id", lineUserId);
}

export async function setLanguage(
    supabase: SupabaseClient,
    lineUserId: string,
    language: "zh-TW" | "en"
): Promise<void> {
    await supabase
        .from("line_conversations")
        .update({ language })
        .eq("line_user_id", lineUserId);
}
