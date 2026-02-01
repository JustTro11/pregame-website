import { getInstagramPosts } from '@/lib/instagram';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Instagram Lib', () => {
    const mockFrom = supabase.from as jest.Mock;
    const mockSelect = jest.fn();
    const mockOrder = jest.fn();
    const mockLimit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup chain: select -> order -> order -> limit
        // We need the order mock to return an object that also has order (for chaining) and limit
        const queryBuilder = {
            order: mockOrder,
            limit: mockLimit
        };

        // When order is called, it returns the same builder to allow chaining
        mockOrder.mockReturnValue(queryBuilder);

        mockFrom.mockReturnValue({
            select: mockSelect.mockReturnValue(queryBuilder)
        });
    });

    it('returns posts on success', async () => {
        const mockData = [{ id: '1', media_url: 'http://test.com' }];
        mockLimit.mockResolvedValue({ data: mockData, error: null });

        const result = await getInstagramPosts(5);
        expect(result).toEqual(mockData);
        expect(mockFrom).toHaveBeenCalledWith('instagram_posts');
        expect(mockLimit).toHaveBeenCalledWith(5);
    });

    it('returns empty array on error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockLimit.mockResolvedValue({ data: null, error: { message: 'Api Error' } });

        const result = await getInstagramPosts();
        expect(result).toEqual([]);
        consoleSpy.mockRestore();
    });

    it('returns empty array on exception', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockLimit.mockRejectedValue(new Error('Network crash'));

        const result = await getInstagramPosts();
        expect(result).toEqual([]);
        consoleSpy.mockRestore();
    });
});
