// supabase/functions/line-webhook/handlers/booking.ts
import { SupabaseClient } from "@supabase/supabase-js";
import {
    ConversationState,
    StateData,
    setState,
    setPhone,
} from "../state-machine.ts";
import { LineMessage, textMessage } from "../utils/line-api.ts";
import { msg, formatBookingConfirmation } from "../utils/messages.ts";

type Lang = "zh-TW" | "en";

// Business hours: day-of-week (0=Sun) → open/close in "HH:MM"
// null means closed that day
const BUSINESS_HOURS: Record<number, { open: string; close: string } | null> = {
    0: { open: "15:00", close: "23:00" }, // Sunday
    1: { open: "15:00", close: "23:00" }, // Monday
    2: { open: "15:00", close: "23:00" }, // Tuesday
    3: null,                               // Wednesday — closed
    4: { open: "15:00", close: "23:00" }, // Thursday
    5: { open: "15:00", close: "01:00" }, // Friday (closes next-day 01:00)
    6: { open: "15:00", close: "01:00" }, // Saturday (closes next-day 01:00)
};

interface BookingResult {
    messages: LineMessage[];
    nextState: ConversationState;
    nextData: StateData;
}

export async function handleBookingFlow(
    supabase: SupabaseClient,
    lineUserId: string,
    currentState: ConversationState,
    stateData: StateData,
    userInput: string,
    lang: Lang
): Promise<BookingResult> {
    switch (currentState) {
        case "awaiting_phone": {
            const phone = userInput.replace(/[^0-9]/g, "");
            if (phone.length < 9) {
                const errorMsg = lang === "zh-TW"
                    ? "請輸入有效的手機號碼："
                    : "Please enter a valid phone number:";
                return {
                    messages: [textMessage(errorMsg)],
                    nextState: "awaiting_phone",
                    nextData: stateData,
                };
            }

            const { data: reservations } = await supabase
                .from("reservations")
                .select("date, time_slot, party_size, confirmation_code, status")
                .eq("customer_phone", phone)
                .eq("status", "confirmed");

            if (!reservations || reservations.length === 0) {
                return {
                    messages: [textMessage(msg("phoneNotFound", lang))],
                    nextState: "idle",
                    nextData: {},
                };
            }

            const lines = reservations.map((r: {
                date: string;
                time_slot: string;
                party_size: number;
                confirmation_code: string;
            }) =>
                lang === "zh-TW"
                    ? `📅 ${r.date} ${r.time_slot}，${r.party_size}位\n確認碼: ${r.confirmation_code}`
                    : `📅 ${r.date} ${r.time_slot}, ${r.party_size} guests\nCode: ${r.confirmation_code}`
            );
            const header = lang === "zh-TW" ? "您的訂位記錄：\n\n" : "Your reservations:\n\n";
            return {
                messages: [textMessage(header + lines.join("\n\n"))],
                nextState: "idle",
                nextData: {},
            };
        }

        case "booking_date": {
            const date = parseDate(userInput);
            if (!date) {
                return {
                    messages: [textMessage(msg("invalidDate", lang))],
                    nextState: "booking_date",
                    nextData: stateData,
                };
            }
            const dateObj = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 7);

            if (dateObj < today || dateObj > maxDate) {
                const errorMsg = lang === "zh-TW"
                    ? "請選擇今天起7天內的日期："
                    : "Please select a date within the next 7 days:";
                return {
                    messages: [textMessage(errorMsg)],
                    nextState: "booking_date",
                    nextData: stateData,
                };
            }

            // Check if shop is open on that day (UTC to avoid timezone shifts)
            const dayOfWeek = new Date(date + "T00:00:00Z").getUTCDay();
            if (BUSINESS_HOURS[dayOfWeek] === null) {
                const errorMsg = lang === "zh-TW"
                    ? "抱歉，該日公休，請選擇其他日期："
                    : "Sorry, we're closed that day. Please choose another date:";
                return {
                    messages: [textMessage(errorMsg)],
                    nextState: "booking_date",
                    nextData: stateData,
                };
            }

            return {
                messages: [textMessage(msg("selectTime", lang))],
                nextState: "booking_time",
                nextData: { ...stateData, date },
            };
        }

        case "booking_time": {
            const time = parseTime(userInput);
            if (!time) {
                return {
                    messages: [textMessage(msg("invalidTime", lang))],
                    nextState: "booking_time",
                    nextData: stateData,
                };
            }

            if (!isValidBookingTime(stateData.date!, time)) {
                const errorMsg = lang === "zh-TW"
                    ? "該時段不在營業時間內，請重新選擇："
                    : "That time is outside business hours. Please choose again:";
                return {
                    messages: [textMessage(errorMsg)],
                    nextState: "booking_time",
                    nextData: stateData,
                };
            }

            return {
                messages: [textMessage(msg("selectGuests", lang))],
                nextState: "booking_guests",
                nextData: { ...stateData, time },
            };
        }

        case "booking_guests": {
            const guests = parseInt(userInput);
            if (isNaN(guests) || guests < 1 || guests > 8) {
                return {
                    messages: [textMessage(msg("invalidGuests", lang))],
                    nextState: "booking_guests",
                    nextData: stateData,
                };
            }
            return {
                messages: [textMessage(msg("enterName", lang))],
                nextState: "booking_name",
                nextData: { ...stateData, guests },
            };
        }

        case "booking_name": {
            const name = userInput.trim();
            if (!name || name.length < 1) {
                return {
                    messages: [textMessage(msg("enterName", lang))],
                    nextState: "booking_name",
                    nextData: stateData,
                };
            }
            return {
                messages: [textMessage(msg("enterPhone", lang))],
                nextState: "booking_confirm",
                nextData: { ...stateData, name },
            };
        }

        case "booking_confirm": {
            const phone = userInput.replace(/[^0-9]/g, "");
            if (phone.length < 9) {
                const errorMsg = lang === "zh-TW"
                    ? "請輸入有效的手機號碼："
                    : "Please enter a valid phone number:";
                return {
                    messages: [textMessage(errorMsg)],
                    nextState: "booking_confirm",
                    nextData: stateData,
                };
            }

            const code = await createReservation(supabase, {
                ...stateData,
                phone,
            });

            await setPhone(supabase, lineUserId, phone);
            await upsertCustomerProfile(supabase, phone, stateData.name!, lang);

            const confirmMsg = formatBookingConfirmation(
                {
                    date: stateData.date!,
                    time: stateData.time!,
                    guests: stateData.guests!,
                    code,
                },
                lang
            );

            return {
                messages: [textMessage(confirmMsg)],
                nextState: "idle",
                nextData: {},
            };
        }

        default:
            return {
                messages: [textMessage(msg("bookingStart", lang))],
                nextState: "booking_date",
                nextData: {},
            };
    }
}

export function parseDate(input: string): string | null {
    const match = input.match(/(\d{1,2})[\/\-](\d{1,2})/);
    if (!match) return null;
    const year = new Date().getFullYear();
    const month = match[1].padStart(2, "0");
    const day = match[2].padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function parseTime(input: string): string | null {
    const match = input.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const hour = match[1].padStart(2, "0");
    const minute = match[2];
    return `${hour}:${minute}`;
}

// Returns true if the given time is a valid booking slot on the given date.
// date: "YYYY-MM-DD", time: "HH:MM"
export function isValidBookingTime(date: string, time: string): boolean {
    // Parse as UTC midnight to avoid timezone-dependent day shifts
    const dateObj = new Date(date + "T00:00:00Z");
    const dayOfWeek = dateObj.getUTCDay();
    const hours = BUSINESS_HOURS[dayOfWeek];
    if (!hours) return false; // closed day

    const [timeHour, timeMin] = time.split(":").map(Number);
    const [openHour, openMin] = hours.open.split(":").map(Number);
    const [closeHour] = hours.close.split(":").map(Number);

    // Late-night close: close hour is next-day (e.g. open 15:00, close 01:00)
    const closeIsNextDay = closeHour < openHour;
    if (closeIsNextDay) {
        // Valid window: [15:00–23:59] OR [00:00–00:59] (strictly before close)
        return timeHour >= openHour || timeHour < closeHour;
    } else {
        // Regular close: must be within [open, close)
        const timeMinutes = timeHour * 60 + timeMin;
        const openMinutes = openHour * 60 + openMin;
        return timeMinutes >= openMinutes && timeMinutes < closeHour * 60;
    }
}

async function createReservation(
    supabase: SupabaseClient,
    data: StateData & { phone: string }
): Promise<string> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { error } = await supabase.from("reservations").insert({
        date: data.date,
        time_slot: data.time,
        party_size: data.guests,
        customer_name: data.name,
        customer_phone: data.phone,
        confirmation_code: code,
        status: "confirmed",
    });
    if (error) throw new Error(`Failed to create reservation: ${error.message}`);
    return code;
}

async function upsertCustomerProfile(
    supabase: SupabaseClient,
    phone: string,
    name: string,
    lang: "zh-TW" | "en"
): Promise<void> {
    const { data: existing } = await supabase
        .from("customer_profiles")
        .select("id")
        .eq("phone", phone)
        .single();

    if (existing) {
        const { error } = await supabase.rpc("increment_visits", { phone_number: phone });
        if (error) console.error("increment_visits failed:", error.message);
    } else {
        await supabase.from("customer_profiles").insert({
            phone,
            name,
            preferred_language: lang,
        });
    }
}
