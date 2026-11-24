/** /timeline: the Career card leads the page. */
import { expect, test } from '@playwright/test';

test('the Career card is above the fold at 1440 px', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop', 'Checked at 1440 px.');
	await page.goto('/timeline');
	const card = page.locator('#career-h + div');
	await expect(card).toBeInViewport();
	await expect(card).toContainText('In production since Feb 2022 · 2 companies · 5 roles');
});

test('the Career card comes before "Year by year" at 390 px', async ({ page }, info) => {
	test.skip(info.project.name !== 'mobile', 'Checked at 390 px.');
	await page.goto('/timeline');
	const card = await page.locator('#career-h + div').boundingBox();
	const years = await page.getByRole('heading', { name: 'Year by year' }).boundingBox();
	expect(card && years && card.y + card.height <= years.y).toBe(true);
});
