/**
 * Visual snapshots of Home, one project, one highlight and one post at each width.
 * A diff over 0.1% fails until the owner approves the new snapshot (`--update-snapshots`).
 */
import { expect, test } from '@playwright/test';

for (const route of ['/', '/work/utilyx', '/highlights/performance', '/blog/memory-limit']) {
	test(`snapshot ${route}`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(route);
		await expect(page).toHaveScreenshot({ fullPage: true, mask: [page.locator('[data-page-weight]')] });
	});
}
