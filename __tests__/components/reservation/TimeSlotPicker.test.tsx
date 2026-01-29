import { render, screen, fireEvent } from '@testing-library/react';
import TimeSlotPicker from '@/app/components/reservation/TimeSlotPicker';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

// We need to mock business logic or ensure it works with null date
describe('TimeSlotPicker', () => {
    const mockSelect = jest.fn();

    it('renders empty state if no date', () => {
        render(<TimeSlotPicker selectedDate={null} selectedTime={null} onSelectTime={mockSelect} />);
        expect(screen.getByText('step_date')).toBeInTheDocument();
    });

    // To test slots, we need a date that is open.
    // Ideally we mock getHoursForDay or isOpenOnDay from config, 
    // or pick a known open day (e.g. any Monday).
    // But since it depends on `app/config/business` which is real code, we can trust it.
    // Monday (day 1) is open 15:00 - 23:00.
    // We must pass a date that is Monday. Jan 1 2024 was Monday.
    it('renders slots for open day', () => {
        const monday = new Date(2024, 0, 1);
        render(<TimeSlotPicker selectedDate={monday} selectedTime={null} onSelectTime={mockSelect} />);

        // Should verify some slots appear
        // Slots: 15:00, 16:00 ...
        // Check for at least one button logic
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('calls onSelectTime when clicked', () => {
        const monday = new Date(2024, 0, 1);
        render(<TimeSlotPicker selectedDate={monday} selectedTime={null} onSelectTime={mockSelect} />);
        const firstSlot = screen.getAllByRole('button')[0];
        fireEvent.click(firstSlot);
        expect(mockSelect).toHaveBeenCalled();
    });
});
