import { isOpenOnDay, getHoursForDay, formatHoursDisplay, businessConfig } from '@/app/config/business';

describe('Business Logic Config', () => {
    describe('isOpenOnDay', () => {
        it('should return true for open days', () => {
            expect(isOpenOnDay(0)).toBe(true); // Sunday
            expect(isOpenOnDay(1)).toBe(true); // Monday
            expect(isOpenOnDay(5)).toBe(true); // Friday
        });

        it('should return false for closed days', () => {
            expect(isOpenOnDay(3)).toBe(false); // Wednesday
        });
    });

    describe('getHoursForDay', () => {
        it('should return hours object for open days', () => {
            expect(getHoursForDay(0)).toEqual({ open: '15:00', close: '23:00' });
            expect(getHoursForDay(5)).toEqual({ open: '15:00', close: '01:00' });
        });

        it('should return null for closed days', () => {
            expect(getHoursForDay(3)).toBeNull();
        });
    });

    describe('formatHoursDisplay', () => {
        it('should format closed days correctly', () => {
            expect(formatHoursDisplay(null, 'en')).toBe('Closed');
            expect(formatHoursDisplay(null, 'zh')).toBe('休息');
        });

        it('should format open hours correctly in 12h format', () => {
            const hours = { open: '15:00', close: '23:00' };
            expect(formatHoursDisplay(hours, 'en')).toBe('3 PM - 11 PM');

            const lateHours = { open: '15:00', close: '01:00' };
            expect(formatHoursDisplay(lateHours, 'en')).toBe('3 PM - 1 AM');
        });

        it('should handle noon and midnight correctly', () => {
            const noon = { open: '12:00', close: '13:00' };
            expect(formatHoursDisplay(noon, 'en')).toBe('12 PM - 1 PM');

            const midnight = { open: '18:00', close: '00:00' };
            expect(formatHoursDisplay(midnight, 'en')).toBe('6 PM - 12 AM');
        });

        it('should handle non-zero minutes', () => {
            const halfPast = { open: '14:30', close: '15:45' };
            expect(formatHoursDisplay(halfPast, 'en')).toBe('2:30 PM - 3:45 PM');
        });
    });

    describe('Configuration Integrity', () => {
        it('should have basic business info', () => {
            expect(businessConfig.name.en).toBeDefined();
            expect(businessConfig.name.zh).toBeDefined();
            expect(businessConfig.contact.instagram).toBeDefined();
        });

        it('should have valid seating config', () => {
            expect(businessConfig.seating.tables.length).toBeGreaterThan(0);
            expect(businessConfig.seating.totalCapacity).toBeGreaterThan(0);
        });
    });
});
