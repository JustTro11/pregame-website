// Shared LINE API utilities used across edge functions
const LINE_API_BASE = "https://api.line.me/v2/bot";

export async function pushMessage(
    to: string,
    messages: { type: string; text: string }[],
    accessToken: string
): Promise<void> {
    const response = await fetch(`${LINE_API_BASE}/message/push`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ to, messages }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("LINE push API error:", response.status, errorText);
    }
}
