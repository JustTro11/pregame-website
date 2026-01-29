import { render, screen } from '@testing-library/react';
import Hero from '@/app/components/home/Hero';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('@/app/i18n/routing', () => ({
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Hero', () => {
    it('renders hero content', () => {
        render(<Hero />);
        expect(screen.getByText('title')).toBeInTheDocument();
        expect(screen.getByText('subtitle')).toBeInTheDocument();
        expect(screen.getByText('tagline')).toBeInTheDocument();
    });

    it('renders CTA buttons', () => {
        render(<Hero />);
        expect(screen.getByText('cta_reserve')).toBeInTheDocument();
        expect(screen.getByText('cta_menu')).toBeInTheDocument();
    });
});
