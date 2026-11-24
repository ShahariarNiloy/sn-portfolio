/**
 * Every route: 200, one h1, canonical + description, no sideways scroll, zero
 * axe violations, and every internal link resolves.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { ROUTES } from './routes';

for (const route of ROUTES) {
	test(`${route} is sound`, async ({ page, request }) => {
		const response = await page.goto(route);
		expect(response?.status()).toBe(200);
		await expect(page.locator('h1')).toHaveCount(1);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/shahariarniloy\.com/);
		await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/);

		const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
		expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

		// Contrast is judged on the settled page, not mid fade-in.
		await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity));
		const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21aa', 'wcag22aa']).analyze();
		expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);

		// API routes are actions (sign-in, posting), not pages.
		const hrefs = await page.locator('a[href^="/"]:not([href^="/api/"])').evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href') ?? ''))]);
		for (const href of hrefs) {
			const target = href.split('#')[0] || '/';
			expect((await request.get(target)).status(), `${route} links to ${href}`).toBe(200);
		}
	});
}

test('drafts are not linked or in the sitemap', async ({ page, request }) => {
	await page.goto('/blog');
	await expect(page.getByText('Draft', { exact: true })).toHaveCount(0);
	expect((await request.get('/blog/pseo')).status()).toBe(404);
	const sitemap = await (await request.get('/sitemap-0.xml')).text();
	expect(sitemap).not.toContain('/blog/pseo');
});

test('unknown pages return the 404 page', async ({ page }) => {
	const response = await page.goto('/no-such-page');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Nothing here.');
});

test('/experience moves permanently to /timeline', async ({ request }) => {
	const response = await request.get('/experience', { maxRedirects: 0 });
	expect(response.status()).toBe(301);
	expect(response.headers()['location']).toMatch(/\/timeline$/);
});
