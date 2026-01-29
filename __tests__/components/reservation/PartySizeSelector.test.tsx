import { render, screen, fireEvent } from '@testing-library/react';
import PartySizeSelector from '@/app/components/reservation/PartySizeSelector';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

describe('PartySizeSelector', () => {
    const mockChange = jest.fn();

    it('renders options', () => {
        render(<PartySizeSelector value={2} onChange={mockChange} />);
        // Expect to see options like 1, 2, ..., 8 (from config)
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('shows selected state', () => {
        render(<PartySizeSelector value={2} onChange={mockChange} />);
        // Button with '2' should have primary class or similar
        const btn = screen.getByText('2').closest('button');
        expect(btn).toHaveClass('bg-accent-primary');
    });

    it('calls onChange', () => {
        render(<PartySizeSelector value={2} onChange={mockChange} />);
        fireEvent.click(screen.getByText('4'));
        expect(mockChange).toHaveBeenCalledWith(4);
    });
});
