import { render, screen } from '@testing-library/react';
import Footer from '@/app/components/layout/Footer';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('@/app/i18n/routing', () => ({
    Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('Footer', () => {
    it('renders branding and address', () => {
        render(<Footer />);
        expect(screen.getByText('PreGame')).toBeInTheDocument();
        expect(screen.getByText('address')).toBeInTheDocument();
    });

    it('renders social links', () => {
        render(<Footer />);
        expect(screen.getByText('follow_us')).toBeInTheDocument();
        const instagramLink = screen.getByRole('link', { name: '' }); // lucide icon inside, might be generic
        // Or check href
        // expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute('href', 'https://instagram.com/pregame.tw');
        // Let's rely on checking the anchor generic
        const socialLinks = screen.getAllByRole('link');
        const insta = socialLinks.find(l => l.getAttribute('href') === 'https://instagram.com/pregame.tw');
        expect(insta).toBeInTheDocument();
    });

    it('renders copyright', () => {
        render(<Footer />);
        expect(screen.getByText('copyright')).toBeInTheDocument();
    });
});
