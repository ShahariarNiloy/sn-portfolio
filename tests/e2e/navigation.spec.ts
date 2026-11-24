/** Page navigation: links prefetch on hover, and islands still start on every page. */
import { expect, test } from '@playwright/test';

test('hovering a link prefetches its page', async ({ page, isMobile }) => {
	test.skip(isMobile, 'Hover prefetch needs a pointer.');
	await page.goto('/');
	const prefetched = page.waitForRequest((r) => new URL(r.url()).pathname === '/stack');
	await page.locator('main a[href="/stack"]').first().hover();
	await prefetched;
});

test('islands start after navigating to another page', async ({ page }) => {
	await page.goto('/');
	await page.goto('/work/utilyx');
	await page.locator('[data-json-input]').fill('{"a":1}');
	await expect(page.locator('[data-json-output]')).toHaveText('{\n  "a": 1\n}');
});
