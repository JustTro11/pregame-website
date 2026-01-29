import { render, screen } from '@testing-library/react';
import Card from '@/app/components/ui/Card';
import '@testing-library/jest-dom';

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card>Card Content</Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
        const { container, rerender } = render(<Card variant="glass">Glass</Card>);
        expect(container.firstChild).toHaveClass('glass-card');

        rerender(<Card variant="elevated">Elevated</Card>);
        expect(container.firstChild).toHaveClass('shadow-lg');
    });

    it('applies hover effect classes', () => {
        const { container } = render(<Card hoverEffect>Hover</Card>);
        expect(container.firstChild).toHaveClass('hover:translate-y-[-4px]');
    });
});
