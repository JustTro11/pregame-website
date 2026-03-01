// supabase/functions/line-webhook/utils/messages.ts
type Lang = "zh-TW" | "en";

export const messages = {
    welcome: {
        "zh-TW": "歡迎來到 PreGame！請問有什麼可以幫您的？\n\n🌐 Type 'English' for English",
        "en": "Welcome to PreGame! How can I help you?\n\n🌐 輸入「中文」切換語言",
    },
    askPhone: {
        "zh-TW": "請輸入您的手機號碼以查詢訂位：",
        "en": "Please enter your phone number to look up reservations:",
    },
    phoneNotFound: {
        "zh-TW": "找不到此號碼的訂位記錄。",
        "en": "No reservations found for this phone number.",
    },
    hours: {
        "zh-TW": "營業時間：\n週日～二、四：15:00-23:00\n週五六：15:00-01:00\n週三公休",
        "en": "Hours:\nSun-Tue, Thu: 3PM-11PM\nFri-Sat: 3PM-1AM\nClosed Wednesday",
    },
    location: {
        "zh-TW": "📍 台南市中西區中正路198號\nhttps://maps.google.com/?q=No.+198,+Jhongjheng+Rd,+Tainan",
        "en": "📍 198 Jhongjheng Rd, West Central, Tainan\nhttps://maps.google.com/?q=No.+198,+Jhongjheng+Rd,+Tainan",
    },
    parking: {
        "zh-TW": "🚗 路邊停車，附近有收費停車格",
        "en": "🚗 Street parking available nearby",
    },
    menu: {
        "zh-TW": "🍵 請參考我們的菜單：\nhttps://pregame.tw/menu",
        "en": "🍵 Check out our menu:\nhttps://pregame.tw/menu",
    },
    bookingStart: {
        "zh-TW": "好的！讓我們開始預訂。請選擇日期 (格式: MM/DD)：\n\n💡 隨時輸入「取消」可退出",
        "en": "Great! Let's book. Please enter date (format: MM/DD):\n\n💡 Type 'cancel' anytime to exit",
    },
    invalidDate: {
        "zh-TW": "日期格式錯誤，請重新輸入 (格式: MM/DD)：\n💡 輸入「取消」可退出",
        "en": "Invalid date format. Please try again (format: MM/DD):\n💡 Type 'cancel' to exit",
    },
    selectTime: {
        "zh-TW": "請選擇時間 (如: 18:00)：\n💡 輸入「取消」可退出",
        "en": "Please enter time (e.g., 18:00):\n💡 Type 'cancel' to exit",
    },
    invalidTime: {
        "zh-TW": "時間格式錯誤，請重新輸入：\n💡 輸入「取消」可退出",
        "en": "Invalid time format. Please try again:\n💡 Type 'cancel' to exit",
    },
    selectGuests: {
        "zh-TW": "請輸入人數 (1-8)：\n💡 輸入「取消」可退出",
        "en": "Enter party size (1-8):\n💡 Type 'cancel' to exit",
    },
    invalidGuests: {
        "zh-TW": "請輸入1-8的數字：\n💡 輸入「取消」可退出",
        "en": "Please enter a number between 1-8:\n💡 Type 'cancel' to exit",
    },
    enterName: {
        "zh-TW": "請輸入預訂姓名：\n💡 輸入「取消」可退出",
        "en": "Enter name for reservation:\n💡 Type 'cancel' to exit",
    },
    enterPhone: {
        "zh-TW": "請輸入手機號碼：\n💡 輸入「取消」可退出",
        "en": "Enter phone number:\n💡 Type 'cancel' to exit",
    },
    bookingConfirmed: {
        "zh-TW": "✅ 訂位成功！",
        "en": "✅ Reservation confirmed!",
    },
    unknownCommand: {
        "zh-TW": "抱歉，我不太理解。請使用下方選單或輸入「營業時間」、「地址」等關鍵字。",
        "en": "Sorry, I didn't understand. Please use the menu below or type keywords like 'hours' or 'address'.",
    },
} as const;

export type MessageKey = keyof typeof messages;

export function msg(key: MessageKey, lang: Lang): string {
    return messages[key][lang];
}

export function formatBookingConfirmation(
    data: { date: string; time: string; guests: number; code: string },
    lang: Lang
): string {
    if (lang === "zh-TW") {
        return `✅ 訂位成功！\n日期: ${data.date}\n時間: ${data.time}\n人數: ${data.guests}\n確認碼: ${data.code}`;
    }
    return `✅ Reservation confirmed!\nDate: ${data.date}\nTime: ${data.time}\nGuests: ${data.guests}\nCode: ${data.code}`;
}
