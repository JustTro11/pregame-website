import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LanguageSwitcher from '@/app/components/ui/LanguageSwitcher';
import '@testing-library/jest-dom';

// Mocks
jest.mock('next-intl', () => ({
    useLocale: () => 'en', // Default to English
}));

const mockReplace = jest.fn();
jest.mock('@/app/i18n/routing', () => ({
    useRouter: () => ({
        replace: mockReplace,
    }),
    usePathname: () => '/current-path',
}));

describe('LanguageSwitcher', () => {
    beforeEach(() => {
        mockReplace.mockClear();
    });

    it('renders current language correctly', () => {
        render(<LanguageSwitcher />);
        expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
        render(<LanguageSwitcher />);
        const button = screen.getByRole('button', { name: /select language/i });
        fireEvent.click(button);

        // Check if options appear
        expect(screen.getByText('繁體中文')).toBeInTheDocument();
        expect(screen.getByText('日本語')).toBeInTheDocument();
    });

    it('switches language on selection', async () => {
        render(<LanguageSwitcher />);
        fireEvent.click(screen.getByRole('button', { name: /select language/i }));

        fireEvent.click(screen.getByText('繁體中文'));

        expect(mockReplace).toHaveBeenCalledWith('/current-path', { locale: 'zh-TW' });
    });

    it('closes dropdown when clicking outside', async () => {
        render(
            <div>
                <LanguageSwitcher />
                <div data-testid="outside">Outside</div>
            </div>
        );

        // Open
        fireEvent.click(screen.getByRole('button', { name: /select language/i }));
        expect(screen.getByText('繁體中文')).toBeVisible();

        // Click outside
        fireEvent.mouseDown(screen.getByTestId('outside'));

        // Verify closed (it might not disappear immediately if generic, but usually re-rendering removes it.
        // In the component, it's {isOpen && (...)}. So it should be removed from DOM.
        await waitFor(() => {
            expect(screen.queryByText('繁體中文')).not.toBeInTheDocument();
        });
    });
});
