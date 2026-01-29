import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/app/components/layout/Header';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('@/app/i18n/routing', () => ({
    Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, ...props }: any) => <img {...props} />,
}));

jest.mock('@/app/components/ui/LanguageSwitcher', () => ({
    __esModule: true,
    default: () => <div data-testid="language-switcher" />,
}));

describe('Header', () => {
    it('renders logo and company name', () => {
        render(<Header />);
        expect(screen.getByText('PreGame')).toBeInTheDocument();
        expect(screen.getByAltText('PreGame Official Logo')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Header />);
        expect(screen.getByText('home')).toBeInTheDocument();
        expect(screen.getByText('menu')).toBeInTheDocument();
        expect(screen.getByText('reserve')).toBeInTheDocument();
        expect(screen.getByText('about')).toBeInTheDocument();
    });

    it('toggles mobile menu', () => {
        render(<Header />);

        // Initial state: menu hidden (on desktop it's visible, but mobile menu div is hidden)
        // Since we render in JSDOM, default width is usually desktop-ish unless configured, 
        // but the mobile menu logic depends on state `isMenuOpen` and `hidden` classes.
        // We can check if "Language" (from mobile menu footer) is NOT visible.
        const mobileToggle = screen.getByLabelText('Toggle menu');

        // Open
        fireEvent.click(mobileToggle);
        expect(screen.getByText('Language:')).toBeInTheDocument();

        // Close
        fireEvent.click(mobileToggle);
        expect(screen.queryByText('Language:')).not.toBeInTheDocument();
    });
});
