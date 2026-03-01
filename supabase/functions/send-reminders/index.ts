// supabase/functions/send-reminders/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { pushMessage } from "../_shared/line-api.ts";

const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
if (!LINE_CHANNEL_ACCESS_TOKEN) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is required");

Deno.serve(async (_req: Request) => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Scheduled at 02:00 UTC = 10:00 AM Taiwan (UTC+8).
    // new Date() in UTC gives the correct "tomorrow" from Taiwan's perspective.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const targetDate = tomorrow.toISOString().split("T")[0];

    console.log(`Looking for reservations on ${targetDate}`);

    const { data: reservations, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("date", targetDate)
        .eq("status", "confirmed");

    if (error) {
        console.error("Error fetching reservations:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }

    let sentCount = 0;

    for (const res of reservations || []) {
        const { data: convo } = await supabase
            .from("line_conversations")
            .select("line_user_id, language")
            .eq("phone", res.customer_phone)
            .single();

        if (!convo?.line_user_id) {
            console.log(`No LINE user found for phone ${res.customer_phone}`);
            continue;
        }

        const lang = (convo.language as "zh-TW" | "en") || "zh-TW";
        const text =
            lang === "zh-TW"
                ? `⏰ 預約提醒：您明天 ${res.time_slot} 有 ${res.party_size} 位的訂位，我們恭候您的光臨！\n確認碼: ${res.confirmation_code}`
                : `⏰ Reminder: You have a reservation tomorrow at ${res.time_slot} for ${res.party_size}. See you then!\nCode: ${res.confirmation_code}`;

        try {
            await pushMessage(
                convo.line_user_id,
                [{ type: "text", text }],
                LINE_CHANNEL_ACCESS_TOKEN
            );
            sentCount++;
            console.log(`Sent reminder to ${convo.line_user_id}`);
        } catch (e) {
            console.error(`Error sending to ${convo.line_user_id}:`, e);
        }
    }

    return new Response(
        JSON.stringify({
            date: targetDate,
            found: reservations?.length || 0,
            sent: sentCount,
        }),
        { headers: { "Content-Type": "application/json" } }
    );
});
