import { render, screen } from '@testing-library/react';
import FeaturedDrinks from '@/app/components/home/FeaturedDrinks';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('@/app/i18n/routing', () => ({
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, ...props }: any) => <img {...props} />,
}));

describe('FeaturedDrinks', () => {
    it('renders section title and all drinks', () => {
        render(<FeaturedDrinks />);
        expect(screen.getByText('featured_title')).toBeInTheDocument();

        // Ensure all drinks from the hardcoded list are rendered
        expect(screen.getByText('Irish Coffee')).toBeInTheDocument();
        expect(screen.getByText('Signature Soda Float')).toBeInTheDocument();
        expect(screen.getByText('Craft Mocktail')).toBeInTheDocument();

        // Check for pairings
        expect(screen.getByText('Vintage Denim & Eames Seating')).toBeInTheDocument();
    });

    it('renders view menu buttons', () => {
        render(<FeaturedDrinks />);
        const buttons = screen.getAllByText('view_menu');
        expect(buttons.length).toBe(3); // Should match number of drinks
    });
});
