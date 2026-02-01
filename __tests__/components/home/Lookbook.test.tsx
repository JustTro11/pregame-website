import { render, screen, waitFor } from '@testing-library/react';
import Lookbook from '@/app/components/home/Lookbook';
// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, ...props }: any) => <img {...props} />,
}));

describe('Lookbook', () => {
    it('renders renderings static images by default', () => {
        render(<Lookbook />);
        expect(screen.getByText('lookbook_title')).toBeInTheDocument();
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
    });

    it('renders provided images', () => {
        const mockImages = ['/insta1.jpg', '/insta2.jpg'];
        render(<Lookbook initialImages={mockImages} />);

        const images = screen.getAllByRole('img');
        // Looks for images with src matching provided
        expect(images).toHaveLength(mockImages.length);
        expect(images[0]).toHaveAttribute('src', '/insta1.jpg');
        expect(images[1]).toHaveAttribute('src', '/insta2.jpg');
    });
});
