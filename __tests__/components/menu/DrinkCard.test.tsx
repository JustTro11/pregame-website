import { render, screen } from '@testing-library/react';
import DrinkCard from '@/app/components/menu/DrinkCard';
import { MenuItem } from '@/app/actions/menu';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
    useLocale: () => 'en', // Default en
}));

jest.mock('@/app/components/ui/Card', () => ({
    __esModule: true,
    default: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
}));

const mockItem: MenuItem = {
    id: '1',
    name_en: 'Test Drink',
    name_zh: '測試飲料',
    description_en: 'Tasty test drink',
    description_zh: '好喝的測試飲料',
    price: 100,
    image_url: '/test.jpg',
    is_available: true,
    category_id: 'cat1',
    category: { id: 'cat1', name_en: 'Tea', name_zh: '茶' },
    is_popular: true,
    is_new: false,
};

describe('DrinkCard', () => {
    it('renders drink info correctly in English', () => {
        render(<DrinkCard drink={mockItem} />);
        expect(screen.getByText('Test Drink')).toBeInTheDocument();
        expect(screen.getByText('測試飲料')).toBeInTheDocument(); // Subtitle
        expect(screen.getByText('Tasty test drink')).toBeInTheDocument();
        expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('renders badges', () => {
        render(<DrinkCard drink={mockItem} />);
        expect(screen.getByText('popular')).toBeInTheDocument();

        const newItem = { ...mockItem, is_popular: false, is_new: true };
        const { rerender } = render(<DrinkCard drink={newItem} />);
        expect(screen.getByText('new')).toBeInTheDocument();
    });

    it('renders placeholder if no image', () => {
        const noImageItem = { ...mockItem, image_url: undefined };
        render(<DrinkCard drink={noImageItem} />);
        // Should show first char of name_en
        expect(screen.getByText('T')).toBeInTheDocument();
    });
});
