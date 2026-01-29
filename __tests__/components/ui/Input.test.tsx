import { render, screen } from '@testing-library/react';
import Input from '@/app/components/ui/Input';
import '@testing-library/jest-dom';

describe('Input', () => {
    it('renders correctly', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(<Input label="Email Address" />);
        expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('renders error message and styling', () => {
        render(<Input error="Invalid email" />);
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    it('forwards refs correctly', () => {
        const ref = { current: null };
        render(<Input ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});
