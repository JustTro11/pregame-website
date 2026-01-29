import { createReservation } from '@/app/actions/reservation';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Reservation Actions', () => {
    const mockFrom = supabase.from as jest.Mock;
    const mockInsert = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockReturnValue({
            insert: mockInsert,
        });
    });

    it('creates reservation successfully', async () => {
        mockInsert.mockResolvedValue({ error: null });

        const input = {
            name: 'John',
            phone: '123',
            email: 'test@test.com',
            date: '2024-01-01',
            time: '12:00',
            partySize: 2,
        };

        const result = await createReservation(input);

        expect(result.success).toBe(true);
        expect(result.code).toBeDefined();
        expect(mockFrom).toHaveBeenCalledWith('reservations');
        expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
            customer_name: 'John',
            status: 'confirmed',
        })]);
    });

    it('returns error if missing fields', async () => {
        const input: any = { name: 'John' }; // Missing others
        const result = await createReservation(input);
        expect(result.error).toBe('Missing required fields');
        expect(mockInsert).not.toHaveBeenCalled();
    });

    it('returns error on supabase failure', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockInsert.mockResolvedValue({ error: { message: 'Database error' } });

        const input = {
            name: 'John',
            phone: '123',
            date: '2024-01-01',
            time: '12:00',
            partySize: 2,
        };

        const result = await createReservation(input);
        expect(result.error).toContain('Failed to save');
        consoleSpy.mockRestore();
    });
});
