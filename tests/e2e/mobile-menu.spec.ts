/** Mobile menu: the Menu button opens a full-screen menu that marks the current page, closes cleanly and hands off to search. */
import { expect, test } from '@playwright/test';

test.skip(({ viewport }) => (viewport?.width ?? 0) >= 640, 'The Menu button only shows below sm.');

test('opens without a focused text field, marks the current page, and Close returns focus', async ({ page }) => {
	await page.goto('/about');
	const trigger = page.getByRole('link', { name: 'Menu', exact: true });
	await trigger.click();
	const menu = page.getByRole('dialog', { name: 'Menu' });
	await expect(menu).toBeVisible();
	await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();
	await expect(menu.getByRole('link', { name: /^About/ })).toHaveAttribute('aria-current', 'page');
	await menu.getByRole('button', { name: 'Close' }).click();
	await expect(menu).toBeHidden();
	await expect(trigger).toBeFocused();
});

test('Esc closes it and a link navigates', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Menu', exact: true }).click();
	const menu = page.getByRole('dialog', { name: 'Menu' });
	await page.keyboard.press('Escape');
	await expect(menu).toBeHidden();
	await page.getByRole('link', { name: 'Menu', exact: true }).click();
	await menu.getByRole('link', { name: 'Blog' }).click();
	await expect(page).toHaveURL(/\/blog$/);
});

test('"Search everything" opens the palette with the search field focused', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Menu', exact: true }).click();
	await page.getByRole('button', { name: /Search everything/ }).click();
	await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
	await expect(page.getByRole('dialog', { name: 'Jump to a page' })).toBeVisible();
	await expect(page.getByRole('combobox', { name: 'Search pages' })).toBeFocused();
});
