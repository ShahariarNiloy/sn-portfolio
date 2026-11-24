/** Command palette: ⌘K, Ctrl K and Menu open it; arrows move; Enter goes; Esc closes and returns focus. */
import { expect, test } from '@playwright/test';

test('opens with Ctrl K and ⌘K, filters, navigates', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Control+k');
	const dialog = page.getByRole('dialog', { name: 'Jump to a page' });
	await expect(dialog).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();

	await page.keyboard.press('Meta+k');
	await expect(dialog).toBeVisible();
	await page.keyboard.type('stack');
	await expect(page.getByRole('option').first()).toHaveAttribute('aria-selected', 'true');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('ArrowUp');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/stack$/);
});

test('the Menu / ⌘K button opens it and Esc returns focus to the button', async ({ page }) => {
	await page.goto('/work');
	const trigger = page.getByRole('link', { name: 'Open the page menu' });
	await trigger.click();
	await expect(page.getByRole('dialog', { name: 'Jump to a page' })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(trigger).toBeFocused();
});
