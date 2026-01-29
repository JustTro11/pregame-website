import { test, expect } from '@playwright/test';

test.describe('Reservation Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Explicitly go to Chinese locale to ensure deterministic text
        await page.goto('/zh-TW/reserve');
    });

    test('should disable submit button until date/time selected', async ({ page }) => {
        const submitBtn = page.getByRole('button', { name: /確認預約|Confirm Reservation/i });

        // 1. Initial State: Button Disabled
        await expect(submitBtn).toBeDisabled();

        // 2. Select Date
        // React-datepicker input can be targeted by placeholder "選擇日期"
        const dateInput = page.getByPlaceholder('選擇日期');
        await dateInput.click();

        // Select the first available day (not disabled)
        // Wait for calendar to appear
        const dayLocator = page.locator('.react-datepicker__day:not(.react-datepicker__day--disabled)');
        await expect(dayLocator.first()).toBeVisible();
        await dayLocator.first().click();

        // 3. Select Time
        // After date selection, time slots should appear.
        // Wait for any button with time pattern (e.g. 18:00)
        // Or just wait for the container of times?
        // Let's target the button text containing ":"
        const timeSlot = page.getByRole('button', { name: /:\d\d/ }).first();
        await expect(timeSlot).toBeVisible();
        await timeSlot.click();

        // 4. Verify Button Enabled
        await expect(submitBtn).toBeEnabled();
    });

    test('should allow navigation to reservation page', async ({ page }) => {
        await expect(page).toHaveURL(/.*reserve/);
        await expect(page.locator('form')).toBeVisible();
    });
});
