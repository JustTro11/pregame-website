/**
 * PreGame Coffee Shop - Business Configuration
 * 
 * This configuration file centralizes all business settings.
 * All values are easily editable in one place.
 */

export const businessConfig = {
    // Basic Info
    name: {
        zh: 'PreGame ★泡沫紅茶店★',
        en: 'PreGame Bubble Tea Shop',
    },
    tagline: {
        zh: '經典台式茶飲・現代風味',
        en: 'Classic Taiwanese Tea · Modern Vibes',
    },

    // Location
    address: {
        full: {
            zh: '700 台南市中西區中正路198號',
            en: 'No. 198, Jhongjheng Rd, West Central District, Tainan City, Taiwan 700',
        },
        short: {
            zh: '台南市中正路198號',
            en: '198 Jhongjheng Rd, Tainan',
        },
        googleMapsUrl: 'https://maps.google.com/?q=No.+198,+Jhongjheng+Rd,+West+Central+District,+Tainan+City,+Taiwan+700',
        coordinates: {
            lat: 22.9908,
            lng: 120.2023,
        },
    },

    // Contact
    contact: {
        instagram: '@pregame.tw',
        instagramUrl: 'https://www.instagram.com/pregame.tw/',
        // Add more as needed
        // phone: '+886-6-XXX-XXXX',
        // email: 'hello@pregame.tw',
        // line: '@pregame',
    },

    // Operating Hours
    // Day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    hours: {
        0: { open: '15:00', close: '23:00' }, // Sunday 3-11 PM
        1: { open: '15:00', close: '23:00' }, // Monday 3-11 PM
        2: { open: '15:00', close: '23:00' }, // Tuesday 3-11 PM
        3: null, // Wednesday - CLOSED
        4: { open: '15:00', close: '23:00' }, // Thursday 3-11 PM
        5: { open: '15:00', close: '01:00' }, // Friday 3 PM-1 AM
        6: { open: '15:00', close: '01:00' }, // Saturday 3 PM-1 AM
    } as Record<number, { open: string; close: string } | null>,

    // Day names for display
    dayNames: {
        zh: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },

    // Seating Configuration
    seating: {
        tables: [
            { id: 1, capacity: 4, type: 'table' },
            { id: 2, capacity: 4, type: 'table' },
            { id: 3, capacity: 2, type: 'table' },
            { id: 4, capacity: 2, type: 'table' },
            { id: 5, capacity: 2, type: 'table' },
            { id: 6, capacity: 2, type: 'table' },
            { id: 7, capacity: 4, type: 'table' },
            { id: 8, capacity: 6, type: 'bar' }, // Bar seating
        ],
        totalCapacity: 26, // Sum of all capacities
    },

    // Reservation Rules
    reservation: {
        slotDurationMinutes: 60, // 1 hour slots
        advanceBookingDays: 7, // Can book up to 7 days ahead
        maxPartySize: 8, // Maximum 8 people per reservation
        minPartySize: 1,
        minAdvanceMinutes: 60, // Must book at least 1 hour ahead
    },

    // Notification Channels (for future backend)
    notifications: {
        channels: ['email', 'sms', 'line'] as const,
        defaultChannel: 'line' as const,
    },
} as const;

// Type exports for use throughout the app
export type BusinessConfig = typeof businessConfig;
export type NotificationChannel = (typeof businessConfig.notifications.channels)[number];
export type DayHours = { open: string; close: string } | null;

// Helper functions
export function isOpenOnDay(day: number): boolean {
    return businessConfig.hours[day] !== null;
}

export function getHoursForDay(day: number): DayHours {
    return businessConfig.hours[day] ?? null;
}

export function formatHoursDisplay(hours: DayHours, locale: 'zh' | 'en'): string {
    if (!hours) {
        return locale === 'zh' ? '休息' : 'Closed';
    }

    // Convert 24h to 12h format for display
    const formatTime = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 || 12;
        return `${hour12}${m > 0 ? ':' + m.toString().padStart(2, '0') : ''} ${period}`;
    };

    return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
}
