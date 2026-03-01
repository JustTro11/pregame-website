# LINE Chatbot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-concierge LINE chatbot for PreGame that handles reservations, booking management, and FAQs.

**Architecture:** Supabase Edge Function webhook receives LINE events, routes through state machine, stores conversation state in PostgreSQL. Phone-based customer identification for future loyalty integration.

**Tech Stack:** Deno (Edge Functions), LINE Messaging API, Supabase PostgreSQL, TypeScript

---

## Prerequisites

> [!IMPORTANT]
> Before starting, you need:
> 1. **LINE Official Account** - Create at [LINE Developers Console](https://developers.line.biz/)
> 2. **Channel Access Token** and **Channel Secret** from LINE Developer Console
> 3. These will be stored as Supabase secrets

---

## Task 1: Database Schema - Customer Profiles

**Files:**
- Migration via Supabase MCP

**Step 1: Apply migration for customer_profiles table**

```sql
-- Customer profiles keyed by phone for future loyalty
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  preferred_language TEXT DEFAULT 'zh-TW' CHECK (preferred_language IN ('zh-TW', 'en')),
  line_user_id TEXT,
  total_visits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for phone lookups
CREATE INDEX idx_customer_profiles_phone ON customer_profiles(phone);

-- RLS: Allow service role only
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
```

**Step 2: Verify migration applied**

Run: Check Supabase dashboard → Tables → `customer_profiles` exists

---

## Task 2: Database Schema - Conversation State

**Files:**
- Migration via Supabase MCP

**Step 1: Apply migration for line_conversations table**

```sql
-- Conversation state for multi-turn flows
CREATE TABLE line_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT UNIQUE NOT NULL,
  current_state TEXT DEFAULT 'idle',
  state_data JSONB DEFAULT '{}',
  phone TEXT,
  language TEXT DEFAULT 'zh-TW',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for LINE user lookups
CREATE INDEX idx_line_conversations_user ON line_conversations(line_user_id);

-- RLS: Allow service role only  
ALTER TABLE line_conversations ENABLE ROW LEVEL SECURITY;
```

**Step 2: Verify migration applied**

Run: Check Supabase dashboard → Tables → `line_conversations` exists

---

## Task 3: Edge Function Scaffold

**Files:**
- Create: `supabase/functions/line-webhook/index.ts`
- Create: `supabase/functions/line-webhook/deno.json`

**Step 1: Create deno.json config**

```json
{
  "imports": {
    "@supabase/supabase-js": "jsr:@supabase/supabase-js@2"
  },
  "compilerOptions": {
    "strict": true
  }
}
```

**Step 2: Create minimal webhook handler**

```typescript
// supabase/functions/line-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const LINE_CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET")!;
const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN")!;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  
  // TODO: Verify LINE signature
  // TODO: Parse and handle events
  
  console.log("Received webhook:", body);
  
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

**Step 3: Deploy and test scaffold**

Run: Deploy via Supabase MCP → Verify returns 200

---

## Task 4: LINE Signature Verification

**Files:**
- Modify: `supabase/functions/line-webhook/index.ts`

**Step 1: Add signature verification function**

```typescript
async function verifySignature(body: string, signature: string): Promise<boolean> {
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
```

**Step 2: Use in handler**

```typescript
const signature = req.headers.get("x-line-signature") || "";
if (!await verifySignature(body, signature)) {
  return new Response("Invalid signature", { status: 401 });
}
```

**Step 3: Deploy and verify rejects bad signatures**

---

## Task 5: LINE Reply Helper

**Files:**
- Create: `supabase/functions/line-webhook/utils/line-api.ts`

**Step 1: Create LINE API wrapper**

```typescript
// supabase/functions/line-webhook/utils/line-api.ts
const LINE_API_BASE = "https://api.line.me/v2/bot";

export async function replyMessage(
  replyToken: string,
  messages: LineMessage[],
  accessToken: string
): Promise<void> {
  await fetch(`${LINE_API_BASE}/message/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

export type LineMessage = 
  | { type: "text"; text: string }
  | { type: "template"; altText: string; template: object };

export function textMessage(text: string): LineMessage {
  return { type: "text", text };
}
```

---

## Task 6: Bilingual Messages

**Files:**
- Create: `supabase/functions/line-webhook/utils/messages.ts`

**Step 1: Create message templates**

```typescript
// supabase/functions/line-webhook/utils/messages.ts
type Lang = "zh-TW" | "en";

export const messages = {
  welcome: {
    "zh-TW": "歡迎來到 PreGame！請問有什麼可以幫您的？",
    "en": "Welcome to PreGame! How can I help you?",
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
} as const;

export function msg(key: keyof typeof messages, lang: Lang): string {
  return messages[key][lang];
}
```

---

## Task 7: State Machine Core

**Files:**
- Create: `supabase/functions/line-webhook/state-machine.ts`

**Step 1: Define states and transitions**

```typescript
// supabase/functions/line-webhook/state-machine.ts
import { createClient } from "@supabase/supabase-js";

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

export async function getConversation(
  supabase: ReturnType<typeof createClient>,
  lineUserId: string
) {
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
    return newConvo;
  }
  return data;
}

export async function setState(
  supabase: ReturnType<typeof createClient>,
  lineUserId: string,
  state: ConversationState,
  stateData?: StateData
) {
  await supabase
    .from("line_conversations")
    .update({
      current_state: state,
      state_data: stateData || {},
      updated_at: new Date().toISOString(),
    })
    .eq("line_user_id", lineUserId);
}
```

---

## Task 8: FAQ Handler

**Files:**
- Create: `supabase/functions/line-webhook/handlers/faq.ts`

**Step 1: Create FAQ matcher**

```typescript
// supabase/functions/line-webhook/handlers/faq.ts
import { msg } from "../utils/messages.ts";
import { LineMessage, textMessage } from "../utils/line-api.ts";

type Lang = "zh-TW" | "en";

const FAQ_PATTERNS = [
  { patterns: ["營業", "時間", "開門", "幾點", "hours", "open", "when"], key: "hours" as const },
  { patterns: ["地址", "在哪", "位置", "怎麼去", "location", "address", "where"], key: "location" as const },
  { patterns: ["停車", "parking", "車位"], key: "parking" as const },
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
```

---

## Task 9: Booking Flow Handler

**Files:**
- Create: `supabase/functions/line-webhook/handlers/booking.ts`

**Step 1: Create booking flow handler**

```typescript
// supabase/functions/line-webhook/handlers/booking.ts
import { createClient } from "@supabase/supabase-js";
import { ConversationState, StateData, setState } from "../state-machine.ts";
import { LineMessage, textMessage } from "../utils/line-api.ts";

type Lang = "zh-TW" | "en";

const PROMPTS = {
  date: { "zh-TW": "請選擇日期 (格式: MM/DD)：", "en": "Please enter date (format: MM/DD):" },
  time: { "zh-TW": "請選擇時間 (如: 18:00)：", "en": "Please enter time (e.g., 18:00):" },
  guests: { "zh-TW": "請輸入人數 (1-8)：", "en": "Enter party size (1-8):" },
  name: { "zh-TW": "請輸入預訂姓名：", "en": "Enter name for reservation:" },
  phone: { "zh-TW": "請輸入手機號碼：", "en": "Enter phone number:" },
};

export async function handleBookingFlow(
  supabase: ReturnType<typeof createClient>,
  lineUserId: string,
  currentState: ConversationState,
  stateData: StateData,
  userInput: string,
  lang: Lang
): Promise<{ messages: LineMessage[]; nextState: ConversationState; nextData: StateData }> {
  
  switch (currentState) {
    case "booking_date": {
      // Validate and parse date
      const date = parseDate(userInput);
      if (!date) {
        return { 
          messages: [textMessage(lang === "zh-TW" ? "日期格式錯誤，請重新輸入" : "Invalid date, please try again")],
          nextState: "booking_date",
          nextData: stateData
        };
      }
      return {
        messages: [textMessage(PROMPTS.time[lang])],
        nextState: "booking_time",
        nextData: { ...stateData, date }
      };
    }
    
    case "booking_time": {
      const time = parseTime(userInput);
      if (!time) {
        return {
          messages: [textMessage(lang === "zh-TW" ? "時間格式錯誤" : "Invalid time")],
          nextState: "booking_time",
          nextData: stateData
        };
      }
      return {
        messages: [textMessage(PROMPTS.guests[lang])],
        nextState: "booking_guests",
        nextData: { ...stateData, time }
      };
    }
    
    case "booking_guests": {
      const guests = parseInt(userInput);
      if (isNaN(guests) || guests < 1 || guests > 8) {
        return {
          messages: [textMessage(lang === "zh-TW" ? "請輸入1-8的數字" : "Please enter 1-8")],
          nextState: "booking_guests",
          nextData: stateData
        };
      }
      return {
        messages: [textMessage(PROMPTS.name[lang])],
        nextState: "booking_name",
        nextData: { ...stateData, guests }
      };
    }
    
    case "booking_name": {
      return {
        messages: [textMessage(PROMPTS.phone[lang])],
        nextState: "booking_confirm",
        nextData: { ...stateData, name: userInput }
      };
    }
    
    case "booking_confirm": {
      // Save to database
      const code = await createReservation(supabase, { ...stateData, phone: userInput });
      const confirmMsg = lang === "zh-TW" 
        ? `✅ 訂位成功！\n日期: ${stateData.date}\n時間: ${stateData.time}\n人數: ${stateData.guests}\n確認碼: ${code}`
        : `✅ Reservation confirmed!\nDate: ${stateData.date}\nTime: ${stateData.time}\nGuests: ${stateData.guests}\nCode: ${code}`;
      return {
        messages: [textMessage(confirmMsg)],
        nextState: "idle",
        nextData: {}
      };
    }
    
    default:
      return {
        messages: [textMessage(PROMPTS.date[lang])],
        nextState: "booking_date",
        nextData: {}
      };
  }
}

function parseDate(input: string): string | null {
  const match = input.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;
  const year = new Date().getFullYear();
  return `${year}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

function parseTime(input: string): string | null {
  const match = input.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

async function createReservation(
  supabase: ReturnType<typeof createClient>,
  data: StateData & { phone: string }
): Promise<string> {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await supabase.from("reservations").insert({
    date: data.date,
    time_slot: data.time,
    party_size: data.guests,
    customer_name: data.name,
    customer_phone: data.phone,
    confirmation_code: code,
    status: "confirmed",
  });
  return code;
}
```

---

## Task 10: Main Handler Integration

**Files:**
- Modify: `supabase/functions/line-webhook/index.ts`

**Step 1: Wire up all handlers**

See full integration in deployment step.

---

## Task 11: Deploy and Configure LINE

**Step 1: Set Supabase secrets**

```bash
# Via Supabase Dashboard → Project Settings → Edge Functions → Secrets
LINE_CHANNEL_SECRET=<your-secret>
LINE_CHANNEL_ACCESS_TOKEN=<your-token>
```

**Step 2: Deploy Edge Function**

Via Supabase MCP: `deploy_edge_function`

**Step 3: Configure LINE webhook URL**

In LINE Developers Console → Messaging API → Webhook URL:
```
https://ebctnryujebfmewlczey.supabase.co/functions/v1/line-webhook
```

**Step 4: Test end-to-end**

1. Add bot as LINE friend
2. Send "營業時間" → Should get hours
3. Tap "預約" → Should start booking flow

---

## Resolved Questions

- ~~**Parking info?**~~ → "🚗 路邊停車，附近有收費停車格" / "🚗 Street parking available nearby"
- ~~**Reminders?**~~ → Yes, 24h before via LINE push

---

## Task 12: Reservation Reminders (Scheduled)

**Files:**
- Create: `supabase/functions/send-reminders/index.ts`

**Step 1: Create reminder Edge Function**

```typescript
// supabase/functions/send-reminders/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN")!;

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Find reservations for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDate = tomorrow.toISOString().split("T")[0];

  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("date", targetDate)
    .eq("status", "confirmed");

  // Find LINE user IDs via phone lookup
  for (const res of reservations || []) {
    const { data: convo } = await supabase
      .from("line_conversations")
      .select("line_user_id, language")
      .eq("phone", res.customer_phone)
      .single();

    if (!convo?.line_user_id) continue;

    const lang = convo.language || "zh-TW";
    const msg = lang === "zh-TW"
      ? `⏰ 預約提醒：您明天 ${res.time_slot} 有 ${res.party_size} 位的訂位，我們恭候您的光臨！`
      : `⏰ Reminder: You have a reservation tomorrow at ${res.time_slot} for ${res.party_size}. See you then!`;

    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ to: convo.line_user_id, messages: [{ type: "text", text: msg }] }),
    });
  }

  return new Response(JSON.stringify({ sent: reservations?.length || 0 }));
});
```

**Step 2: Enable pg_cron extension and schedule**

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily at 10:00 AM Taiwan time (02:00 UTC)
SELECT cron.schedule(
  'send-reservation-reminders',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ebctnryujebfmewlczey.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('supabase.service_role_key'))
  );
  $$
);
```

**Step 3: Deploy and verify**

Run: Deploy via Supabase MCP → Check cron job in Supabase Dashboard → SQL Editor → `SELECT * FROM cron.job;`

