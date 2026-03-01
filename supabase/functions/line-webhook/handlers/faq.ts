// supabase/functions/line-webhook/handlers/faq.ts
import { msg } from "../utils/messages.ts";
import { LineMessage, textMessage } from "../utils/line-api.ts";

type Lang = "zh-TW" | "en";

const FAQ_PATTERNS = [
    {
        patterns: ["營業", "時間", "開門", "幾點", "hours", "open", "when"],
        key: "hours" as const,
    },
    {
        patterns: ["地址", "在哪", "位置", "怎麼去", "location", "address", "where"],
        key: "location" as const,
    },
    {
        patterns: ["停車", "parking", "車位"],
        key: "parking" as const,
    },
    {
        patterns: ["菜單", "menu", "飲料", "drink"],
        key: "menu" as const,
    },
];

export function matchFaq(text: string, lang: Lang): LineMessage | null {
    const lower = text.toLowerCase();
    for (const faq of FAQ_PATTERNS) {
        if (faq.patterns.some((p) => lower.includes(p))) {
            return textMessage(msg(faq.key, lang));
        }
    }
    return null;
}

// Detect language preference from text
export function detectLanguage(text: string): "zh-TW" | "en" | null {
    // Check for explicit language switch commands
    if (/english|英文/.test(text.toLowerCase())) {
        return "en";
    }
    if (/中文|chinese/.test(text.toLowerCase())) {
        return "zh-TW";
    }
    return null;
}

// Auto-detect language from message content (for new users)
export function autoDetectLanguage(text: string): "zh-TW" | "en" {
    // Count Chinese characters (CJK Unified Ideographs)
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    // Count English letters
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;

    // If more Chinese characters, use Chinese; otherwise English
    if (chineseChars > englishChars) {
        return "zh-TW";
    } else if (englishChars > 0) {
        return "en";
    }
    // Default to Chinese for Taiwan context
    return "zh-TW";
}
