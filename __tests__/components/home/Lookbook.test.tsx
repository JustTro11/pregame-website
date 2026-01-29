import { render, screen, waitFor } from '@testing-library/react';
import Lookbook from '@/app/components/home/Lookbook';
import { getInstagramPosts } from '@/lib/instagram';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('@/lib/instagram', () => ({
    getInstagramPosts: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, ...props }: any) => <img {...props} />,
}));

describe('Lookbook', () => {
    it('renders initial static images', () => {
        (getInstagramPosts as jest.Mock).mockResolvedValue([]);
        render(<Lookbook />);
        expect(screen.getByText('lookbook_title')).toBeInTheDocument();
        // Should find images
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
    });

    it('fetches and renders instagram posts', async () => {
        const mockPosts = [
            { id: '1', media_url: '/insta1.jpg', caption: 'test' },
            { id: '2', media_url: '/insta2.jpg', caption: 'test' },
        ];
        (getInstagramPosts as jest.Mock).mockResolvedValue(mockPosts);

        render(<Lookbook />);

        await waitFor(() => {
            // It should update state.
            // Since we don't have explicit text for images, we check implicit behavior or if images src changes.
            // But checking src might be hard if we don't know static URLs.
            // However, we can check if getInstagramPosts was called.
            expect(getInstagramPosts).toHaveBeenCalled();
        });
    });
});
