import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/app/components/ui/Button';
import '@testing-library/jest-dom';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles onClick events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders loading state correctly', () => {
        render(<Button isLoading>Click me</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        // Check for loader icon presence (Loader2 usually renders an SVG)
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders variants correctly', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-accent-primary');

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-bg-elevated');

        rerender(<Button variant="danger">Danger</Button>);
        expect(screen.getByRole('button')).toHaveClass('text-red-500');
    });

    it('renders sizes correctly', () => {
        render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('text-xs');
    });

    it('renders icons correctly', () => {
        render(<Button leftIcon={<span data-testid="left-icon">L</span>}>Icon</Button>);
        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });
});
