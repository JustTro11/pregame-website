// Unit tests for pure functions in line-webhook edge function
// Run with: /tmp/deno test --config ../deno.json unit.test.ts
import {
    assertEquals,
    assertExists,
    assertRejects,
} from "jsr:@std/assert";
import {
    parseDate,
    parseTime,
    isValidBookingTime,
    handleBookingFlow,
} from "../handlers/booking.ts";
import {
    matchFaq,
    autoDetectLanguage,
    detectLanguage,
} from "../handlers/faq.ts";
import { formatBookingConfirmation } from "../utils/messages.ts";

// ---------------------------------------------------------------------------
// parseDate
// ---------------------------------------------------------------------------
Deno.test("parseDate: returns null for invalid input", () => {
    assertEquals(parseDate("abc"), null);
    assertEquals(parseDate(""), null);
    assertEquals(parseDate("today"), null);
    assertEquals(parseDate("1800"), null);
});

Deno.test("parseDate: accepts MM/DD and M/D", () => {
    const year = new Date().getFullYear();
    assertEquals(parseDate("3/15"), `${year}-03-15`);
    assertEquals(parseDate("12/31"), `${year}-12-31`);
    assertEquals(parseDate("1/1"), `${year}-01-01`);
});

Deno.test("parseDate: accepts MM-DD with hyphen", () => {
    const year = new Date().getFullYear();
    assertEquals(parseDate("3-15"), `${year}-03-15`);
});

// ---------------------------------------------------------------------------
// parseTime
// ---------------------------------------------------------------------------
Deno.test("parseTime: returns null for invalid input", () => {
    assertEquals(parseTime("abc"), null);
    assertEquals(parseTime(""), null);
    assertEquals(parseTime("1800"), null);
    assertEquals(parseTime("18"), null);
});

Deno.test("parseTime: accepts HH:MM and H:MM", () => {
    assertEquals(parseTime("18:00"), "18:00");
    assertEquals(parseTime("9:30"), "09:30");
    assertEquals(parseTime("23:59"), "23:59");
    assertEquals(parseTime("0:00"), "00:00");
});

// ---------------------------------------------------------------------------
// isValidBookingTime (new function — will fail until implemented)
// ---------------------------------------------------------------------------
Deno.test("isValidBookingTime: rejects Wednesday", () => {
    // 2026-03-04 is a Wednesday
    assertEquals(isValidBookingTime("2026-03-04", "18:00"), false);
});

Deno.test("isValidBookingTime: rejects before opening hour", () => {
    // 2026-03-02 is a Monday
    assertEquals(isValidBookingTime("2026-03-02", "10:00"), false);
    assertEquals(isValidBookingTime("2026-03-02", "14:59"), false);
});

Deno.test("isValidBookingTime: accepts valid weekday slot", () => {
    // 2026-03-02 is a Monday (closes 23:00)
    assertEquals(isValidBookingTime("2026-03-02", "15:00"), true);
    assertEquals(isValidBookingTime("2026-03-02", "22:00"), true);
});

Deno.test("isValidBookingTime: rejects past-close on weekday", () => {
    // 2026-03-02 is a Monday (closes 23:00)
    assertEquals(isValidBookingTime("2026-03-02", "23:00"), false);
    assertEquals(isValidBookingTime("2026-03-02", "23:30"), false);
});

Deno.test("isValidBookingTime: accepts Fri/Sat late slots", () => {
    // 2026-03-06 is a Friday (closes 01:00)
    assertEquals(isValidBookingTime("2026-03-06", "23:30"), true);
    assertEquals(isValidBookingTime("2026-03-06", "00:00"), true);
    assertEquals(isValidBookingTime("2026-03-06", "00:30"), true);
});

Deno.test("isValidBookingTime: rejects past-close on Fri/Sat", () => {
    // 2026-03-06 is a Friday (closes 01:00)
    assertEquals(isValidBookingTime("2026-03-06", "01:00"), false);
    assertEquals(isValidBookingTime("2026-03-06", "02:00"), false);
});

// ---------------------------------------------------------------------------
// handleBookingFlow: awaiting_phone — will fail until implemented
// ---------------------------------------------------------------------------
Deno.test("handleBookingFlow: awaiting_phone returns reservation details", async () => {
    const mockReservations = [
        {
            date: "2026-03-10",
            time_slot: "19:00",
            party_size: 2,
            confirmation_code: "ABC123",
            status: "confirmed",
        },
    ];

    const mockSupabase = {
        from: (_table: string) => ({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        data: mockReservations,
                        error: null,
                    }),
                }),
            }),
        }),
    } as unknown as Parameters<typeof handleBookingFlow>[0];

    const result = await handleBookingFlow(
        mockSupabase,
        "user-123",
        "awaiting_phone",
        {},
        "0912345678",
        "zh-TW"
    );

    assertEquals(result.nextState, "idle");
    assertEquals(result.messages.length > 0, true);
    const text = (result.messages[0] as { type: string; text: string }).text;
    assertEquals(text.includes("ABC123"), true);
});

Deno.test("handleBookingFlow: awaiting_phone with no results returns not-found", async () => {
    const mockSupabase = {
        from: (_table: string) => ({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        data: [],
                        error: null,
                    }),
                }),
            }),
        }),
    } as unknown as Parameters<typeof handleBookingFlow>[0];

    const result = await handleBookingFlow(
        mockSupabase,
        "user-123",
        "awaiting_phone",
        {},
        "0999999999",
        "en"
    );

    assertEquals(result.nextState, "idle");
    const text = (result.messages[0] as { type: string; text: string }).text;
    assertEquals(text.includes("No reservations"), true);
});

// ---------------------------------------------------------------------------
// createReservation error propagation — will fail until fixed
// ---------------------------------------------------------------------------
Deno.test("handleBookingFlow: booking_confirm throws on DB insert error", async () => {
    const mockSupabase = {
        from: (_table: string) => ({
            insert: () => ({
                data: null,
                error: { message: "unique constraint violation" },
            }),
            select: () => ({
                eq: () => ({
                    single: () => ({ data: null, error: null }),
                }),
            }),
        }),
        rpc: () => ({ data: null, error: null }),
    } as unknown as Parameters<typeof handleBookingFlow>[0];

    await assertRejects(
        () =>
            handleBookingFlow(
                mockSupabase,
                "user-123",
                "booking_confirm",
                { date: "2026-03-10", time: "19:00", guests: 2, name: "Test" },
                "0912345678",
                "zh-TW"
            ),
        Error,
        "Failed to create reservation"
    );
});

// ---------------------------------------------------------------------------
// matchFaq
// ---------------------------------------------------------------------------
Deno.test("matchFaq: returns null for unrecognised input", () => {
    assertEquals(matchFaq("hello", "zh-TW"), null);
    assertEquals(matchFaq("random text", "en"), null);
});

Deno.test("matchFaq: matches hours keywords", () => {
    assertExists(matchFaq("營業時間", "zh-TW"));
    assertExists(matchFaq("hours", "en"));
});

Deno.test("matchFaq: matches location keywords", () => {
    assertExists(matchFaq("地址", "zh-TW"));
    assertExists(matchFaq("address", "en"));
});

Deno.test("matchFaq: matches parking and menu keywords", () => {
    assertExists(matchFaq("停車", "zh-TW"));
    assertExists(matchFaq("menu", "en"));
});

// ---------------------------------------------------------------------------
// autoDetectLanguage
// ---------------------------------------------------------------------------
Deno.test("autoDetectLanguage: detects Chinese", () => {
    assertEquals(autoDetectLanguage("你好，我想預約"), "zh-TW");
});

Deno.test("autoDetectLanguage: detects English", () => {
    assertEquals(autoDetectLanguage("hello I want to book"), "en");
});

Deno.test("autoDetectLanguage: defaults to zh-TW for numbers/empty", () => {
    assertEquals(autoDetectLanguage("123"), "zh-TW");
    assertEquals(autoDetectLanguage(""), "zh-TW");
});

// ---------------------------------------------------------------------------
// detectLanguage
// ---------------------------------------------------------------------------
Deno.test("detectLanguage: detects English switch command", () => {
    assertEquals(detectLanguage("English"), "en");
});

Deno.test("detectLanguage: detects Chinese switch command", () => {
    assertEquals(detectLanguage("中文"), "zh-TW");
});

Deno.test("detectLanguage: returns null when no switch command", () => {
    assertEquals(detectLanguage("hello"), null);
    assertEquals(detectLanguage("你好"), null);
});

// ---------------------------------------------------------------------------
// formatBookingConfirmation
// ---------------------------------------------------------------------------
Deno.test("formatBookingConfirmation: includes all details in zh-TW", () => {
    const result = formatBookingConfirmation(
        { date: "2026-03-10", time: "19:00", guests: 2, code: "XYZ123" },
        "zh-TW"
    );
    assertEquals(result.includes("2026-03-10"), true);
    assertEquals(result.includes("19:00"), true);
    assertEquals(result.includes("XYZ123"), true);
});

Deno.test("formatBookingConfirmation: includes all details in English", () => {
    const result = formatBookingConfirmation(
        { date: "2026-03-10", time: "19:00", guests: 2, code: "XYZ123" },
        "en"
    );
    assertEquals(result.includes("2026-03-10"), true);
    assertEquals(result.includes("XYZ123"), true);
    assertEquals(result.includes("Reservation confirmed"), true);
});
