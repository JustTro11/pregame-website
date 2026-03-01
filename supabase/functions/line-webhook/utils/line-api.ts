// supabase/functions/line-webhook/utils/line-api.ts
const LINE_API_BASE = "https://api.line.me/v2/bot";

export async function replyMessage(
    replyToken: string,
    messages: LineMessage[],
    accessToken: string
): Promise<void> {
    const response = await fetch(`${LINE_API_BASE}/message/reply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ replyToken, messages }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("LINE API error:", response.status, errorText);
    }
}

export async function pushMessage(
    to: string,
    messages: LineMessage[],
    accessToken: string
): Promise<void> {
    await fetch(`${LINE_API_BASE}/message/push`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ to, messages }),
    });
}

export type LineMessage =
    | { type: "text"; text: string }
    | { type: "template"; altText: string; template: object };

export function textMessage(text: string): LineMessage {
    return { type: "text", text };
}

export function quickReplyMessage(
    text: string,
    items: { label: string; text: string }[]
): LineMessage {
    return {
        type: "text",
        text,
        quickReply: {
            items: items.map((item) => ({
                type: "action",
                action: {
                    type: "message",
                    label: item.label,
                    text: item.text,
                },
            })),
        },
    } as LineMessage;
}
