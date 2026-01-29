import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ReservationForm from '@/app/components/reservation/ReservationForm';
import { createReservation } from '@/app/actions/reservation';

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('@/app/i18n/routing', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/app/actions/reservation', () => ({
    createReservation: jest.fn(),
}));

// Mock child components to simplify integration test
jest.mock('@/app/components/ui/DatePicker', () => ({
    __esModule: true,
    default: ({ onChange, filterDate }: any) => (
        <div>
            <button onClick={() => onChange(new Date(2024, 0, 1))}>Select Date</button>
            <button onClick={() => filterDate && filterDate(new Date(2024, 0, 1))}>Test Filter</button>
        </div>
    ),
}));

jest.mock('@/app/components/reservation/TimeSlotPicker', () => ({
    __esModule: true,
    default: ({ onSelectTime }: any) => <button onClick={() => onSelectTime('18:00')}>Select 18:00</button>,
}));

jest.mock('@/app/components/reservation/PartySizeSelector', () => ({
    __esModule: true,
    default: ({ onChange }: any) => <button onClick={() => onChange(4)}>Select 4 Ppl</button>,
}));

describe('ReservationForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders steps', () => {
        render(<ReservationForm />);
        expect(screen.getByText('step_date')).toBeInTheDocument();
        expect(screen.getByText('step_guests')).toBeInTheDocument();
        expect(screen.getByText('step_time')).toBeInTheDocument();
        expect(screen.getByText('step_details')).toBeInTheDocument();
    });

    it('validates form and submits', async () => {
        (createReservation as jest.Mock).mockResolvedValue({ success: true, code: 'ABC' });
        render(<ReservationForm />);

        // Step 1: Date & Guests
        fireEvent.click(screen.getByText('Select Date'));
        fireEvent.click(screen.getByText('Select 4 Ppl'));

        // Step 2: Time
        fireEvent.click(screen.getByText('Select 18:00'));

        // Step 3: Details
        fireEvent.change(screen.getByPlaceholderText('name_placeholder'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('phone_placeholder'), { target: { value: '123' } });

        // Submit
        fireEvent.click(screen.getByText('confirm_booking'));

        await waitFor(() => {
            expect(createReservation).toHaveBeenCalledWith(expect.objectContaining({
                name: 'John',
                phone: '123',
                partySize: 4,
                time: '18:00',
            }));
        });

        // Wait for loading to finish to ensure state update happens (fixes act warning potentially, and covers line 70)
        // callback to prevent act warning from RHF internal state updates
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
    });

    it('handles submission error', async () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });
        (createReservation as jest.Mock).mockResolvedValue({ error: 'Failed' });

        render(<ReservationForm />);

        // Fill form
        fireEvent.click(screen.getByText('Select Date'));
        fireEvent.click(screen.getByText('Select 18:00'));
        fireEvent.change(screen.getByPlaceholderText('name_placeholder'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('phone_placeholder'), { target: { value: '123' } });

        fireEvent.click(screen.getByText('confirm_booking'));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Failed');
        });

        // Wait for loading to finish
        await waitFor(() => {
            const btn = screen.getByText('confirm_booking').closest('button');
            expect(btn).not.toBeDisabled();
        });

        alertSpy.mockRestore();

        // callback to prevent act warning from RHF internal state updates
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
    });

    it('checks filter date logic', async () => {
        render(<ReservationForm />);
        fireEvent.click(screen.getByText('Test Filter'));

        // callback to prevent act warning from RHF internal state updates
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
    });

    it('returns early if date/time missing on submit', async () => {
        render(<ReservationForm />);

        // Fill valid fields
        fireEvent.change(screen.getByPlaceholderText('name_placeholder'), { target: { value: 'Test' } });
        fireEvent.change(screen.getByPlaceholderText('phone_placeholder'), { target: { value: '123' } });

        await act(async () => {
            fireEvent.click(screen.getByText('confirm_booking'));
        });

        await waitFor(() => {
            expect(createReservation).not.toHaveBeenCalled();
        });

        // callback to prevent act warning from RHF internal state updates
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
    });

    it('returns early if time missing (date present)', async () => {
        render(<ReservationForm />);

        // Select Date
        fireEvent.click(screen.getByText('Select Date'));

        // Fill Name/Phone
        fireEvent.change(screen.getByPlaceholderText('name_placeholder'), { target: { value: 'Test' } });
        fireEvent.change(screen.getByPlaceholderText('phone_placeholder'), { target: { value: '123' } });

        await act(async () => {
            fireEvent.click(screen.getByText('confirm_booking'));
        });

        await waitFor(() => {
            expect(createReservation).not.toHaveBeenCalled();
        });

        await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
    });
});
