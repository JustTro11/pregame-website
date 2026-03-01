// supabase/functions/line-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { replyMessage, textMessage, LineMessage } from "./utils/line-api.ts";
import { msg } from "./utils/messages.ts";
import {
    getConversation,
    setState,
    setLanguage,
    ConversationState,
} from "./state-machine.ts";
import { matchFaq, detectLanguage, autoDetectLanguage } from "./handlers/faq.ts";
import { handleBookingFlow } from "./handlers/booking.ts";

const LINE_CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET");
const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");

if (!LINE_CHANNEL_SECRET) throw new Error("LINE_CHANNEL_SECRET is required");
if (!LINE_CHANNEL_ACCESS_TOKEN) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is required");

// Main handler
Deno.serve(async (req: Request) => {
    try {
        if (req.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        const body = await req.text();

        // Verify LINE signature — always required
        const signature = req.headers.get("x-line-signature") || "";
        if (!(await verifySignature(body, signature))) {
            console.error("Invalid signature");
            return new Response("Invalid signature", { status: 401 });
        }

        // Parse request
        let events = [];
        try {
            const parsed = JSON.parse(body);
            events = parsed.events || [];
        } catch (e) {
            console.error("Failed to parse body:", e);
            return new Response(JSON.stringify({ status: "ok" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // LINE verification sends empty events - just return 200
        if (events.length === 0) {
            console.log("No events (verification request)");
            return new Response(JSON.stringify({ status: "ok" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create Supabase client
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Process each event
        for (const event of events) {
            try {
                if (event.type === "message" && event.message.type === "text") {
                    await handleTextMessage(supabase, event);
                } else if (event.type === "postback") {
                    await handlePostback(supabase, event);
                } else if (event.type === "follow") {
                    await replyMessage(
                        event.replyToken,
                        [textMessage(msg("welcome", "zh-TW"))],
                        LINE_CHANNEL_ACCESS_TOKEN
                    );
                }
            } catch (e) {
                console.error("Error processing event:", e);
            }
        }

        return new Response(JSON.stringify({ status: "ok" }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Unhandled error:", e);
        return new Response(JSON.stringify({ status: "error", message: String(e) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});

async function handleTextMessage(
    supabase: ReturnType<typeof createClient>,
    event: {
        replyToken: string;
        source: { userId: string };
        message: { text: string };
    }
) {
    const lineUserId = event.source.userId;
    const text = event.message.text.trim();
    const replyToken = event.replyToken;

    const convo = await getConversation(supabase, lineUserId);
    let lang = convo.language as "zh-TW" | "en";

    // Auto-detect language only on the very first message (created_at === updated_at)
    const isFirstMessage = convo.created_at === convo.updated_at;
    if (isFirstMessage) {
        const detectedLang = autoDetectLanguage(text);
        if (detectedLang !== lang) {
            await setLanguage(supabase, lineUserId, detectedLang);
            lang = detectedLang;
        }
    }

    // Check for explicit language switch command
    const newLang = detectLanguage(text);
    if (newLang && newLang !== lang) {
        await setLanguage(supabase, lineUserId, newLang);
        const confirmMsg =
            newLang === "en" ? "Language set to English" : "語言已切換為中文";
        await replyMessage(
            replyToken,
            [textMessage(confirmMsg)],
            LINE_CHANNEL_ACCESS_TOKEN
        );
        return;
    }

    let messages: LineMessage[] = [];

    // Check for cancel command (works in any state)
    const lowerText = text.toLowerCase();
    if (lowerText === "取消" || lowerText === "cancel" || lowerText === "exit" || lowerText === "quit") {
        if (convo.current_state !== "idle") {
            await setState(supabase, lineUserId, "idle", {});
            const cancelMsg = lang === "zh-TW"
                ? "已取消。有什麼可以幫您的嗎？"
                : "Cancelled. How can I help you?";
            await replyMessage(replyToken, [textMessage(cancelMsg)], LINE_CHANNEL_ACCESS_TOKEN);
            return;
        }
    }

    // Handle based on current state
    if (convo.current_state !== "idle") {
        const result = await handleBookingFlow(
            supabase,
            lineUserId,
            convo.current_state as ConversationState,
            convo.state_data,
            text,
            lang
        );
        messages = result.messages;
        await setState(supabase, lineUserId, result.nextState, result.nextData);
    } else {
        if (
            lowerText.includes("預約") ||
            lowerText.includes("訂位") ||
            lowerText.includes("book") ||
            lowerText.includes("reserve")
        ) {
            messages = [textMessage(msg("bookingStart", lang))];
            await setState(supabase, lineUserId, "booking_date", {});
        } else if (
            lowerText.includes("我的訂位") ||
            lowerText.includes("查詢") ||
            lowerText.includes("my booking") ||
            lowerText.includes("lookup")
        ) {
            messages = [textMessage(msg("askPhone", lang))];
            await setState(supabase, lineUserId, "awaiting_phone", {});
        } else {
            const faqResponse = matchFaq(text, lang);
            messages = faqResponse
                ? [faqResponse]
                : [textMessage(msg("unknownCommand", lang))];
        }
    }

    if (messages.length > 0) {
        await replyMessage(replyToken, messages, LINE_CHANNEL_ACCESS_TOKEN);
    }
}

async function handlePostback(
    supabase: ReturnType<typeof createClient>,
    event: { replyToken: string; source: { userId: string }; postback: { data: string } }
) {
    const lineUserId = event.source.userId;
    const data = event.postback.data;
    const replyToken = event.replyToken;

    const convo = await getConversation(supabase, lineUserId);
    const lang = convo.language as "zh-TW" | "en";

    const params = new URLSearchParams(data);
    const action = params.get("action");

    let messages: LineMessage[] = [];

    switch (action) {
        case "book":
            messages = [textMessage(msg("bookingStart", lang))];
            await setState(supabase, lineUserId, "booking_date", {});
            break;
        case "my_booking":
            messages = [textMessage(msg("askPhone", lang))];
            await setState(supabase, lineUserId, "awaiting_phone", {});
            break;
        case "hours":
            messages = [textMessage(msg("hours", lang))];
            break;
        case "location":
            messages = [textMessage(msg("location", lang))];
            break;
        default:
            messages = [textMessage(msg("unknownCommand", lang))];
    }

    if (messages.length > 0) {
        await replyMessage(replyToken, messages, LINE_CHANNEL_ACCESS_TOKEN);
    }
}

async function verifySignature(
    body: string,
    signature: string
): Promise<boolean> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(LINE_CHANNEL_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const digest = btoa(String.fromCharCode(...new Uint8Array(sig)));
    return digest === signature;
}
