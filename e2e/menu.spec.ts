import { test, expect } from '@playwright/test';

test.describe('Menu Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/zh-TW/menu');
    });

    test('should display menu sections', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/菜單|Menu/);

        // Check sections
        // "特色飲品" or "Signature Drinks"
        const sectionHeader = page.getByRole('heading', { name: /特色飲品|Signature Drinks/ });
        await expect(sectionHeader).toBeVisible();
    });

    test('should display drink items', async ({ page }) => {
        // Ensure at least one drink card is visible
        // Drink cards usually have an image and a title
        // We can look for common drink names if known, or just article/div structure
        // Assuming Card component usage or image existence

        // Check for "Oolong High" or similar if static data exists
        // Or check general visibility of content
        const drinkImages = page.locator('img[alt]');
        await expect(drinkImages.first()).toBeVisible();
    });
});
