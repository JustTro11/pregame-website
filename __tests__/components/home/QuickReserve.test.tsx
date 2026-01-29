import { render, screen } from '@testing-library/react';
import QuickReserve from '@/app/components/home/QuickReserve';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('@/app/i18n/routing', () => ({
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('QuickReserve', () => {
    it('renders content', () => {
        render(<QuickReserve />);
        expect(screen.getByText('about_description')).toBeInTheDocument();
        expect(screen.getByText('reserve_now')).toBeInTheDocument();
    });
});
