import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/PreGame/);
});

test('check featured section', async ({ page }) => {
    await page.goto('/');

    // Check if "Featured Drinks" heading is visible
    // Note: The text might be translated, so we look for the element structure or a known English fallback if default
    // Ideally we assume default locale (zh-TW or en)
    // Let's check for the element existence broadly
    const featuredSection = page.locator('section').filter({ hasText: /Featured Drinks|精選飲品/i });
    // Using regex for bilingual support in case default locale changes

    await expect(featuredSection.first()).toBeVisible();
});
