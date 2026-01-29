import { getMenuCategories, getMenuItems } from '@/app/actions/menu';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Menu Actions', () => {
    const mockFrom = supabase.from as jest.Mock;
    const mockSelect = jest.fn();
    const mockOrder = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup chain: from -> select -> order
        mockFrom.mockReturnValue({
            select: mockSelect.mockReturnValue({
                order: mockOrder,
            }),
        });
    });

    describe('getMenuCategories', () => {
        it('returns categories on success', async () => {
            const mockData = [{ id: '1', name_en: 'Tea' }];
            mockOrder.mockResolvedValue({ data: mockData, error: null });

            const result = await getMenuCategories();
            expect(result).toEqual(mockData);
            expect(mockFrom).toHaveBeenCalledWith('menu_categories');
        });

        it('returns empty array on error', async () => {
            // Silence console.error for this test
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            mockOrder.mockResolvedValue({ data: null, error: { message: 'Error' } });

            const result = await getMenuCategories();
            expect(result).toEqual([]);
            consoleSpy.mockRestore();
        });
    });

    describe('getMenuItems', () => {
        it('returns items on success', async () => {
            const mockData = [{ id: '1', name_en: 'Tea' }];
            mockOrder.mockResolvedValue({ data: mockData, error: null });

            const result = await getMenuItems();
            expect(result).toEqual(mockData);
            expect(mockFrom).toHaveBeenCalledWith('menu_items');
        });

        it('returns empty array on error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            mockOrder.mockResolvedValue({ data: null, error: { message: 'Error' } });

            const result = await getMenuItems();
            expect(result).toEqual([]);
            consoleSpy.mockRestore();
        });
    });
});
