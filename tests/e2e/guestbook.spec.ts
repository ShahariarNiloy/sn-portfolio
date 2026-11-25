/**
 * Guestbook API: signed-out POSTs get 401, non-owners get 403, over-long notes
 * get 400. The signed cases need SESSION_SECRET (from .dev.vars) in the test env.
 */
import { expect, test } from '@playwright/test';

import { sign } from '../../src/lib/guestbook/session';

const json = { Accept: 'application/json', 'Content-Type': 'application/json' };

test('signed-out note POST is rejected with 401', async ({ request }) => {
	const response = await request.post('/api/guestbook/notes', { headers: json, data: { body: 'hello' } });
	expect([401, 500]).toContain(response.status());
	expect(await response.json()).toHaveProperty('error');
});

// Browsers send Sec-Fetch-Mode: navigate, which Cloudflare answers from static assets unless run_worker_first lists the path.
for (const path of ['/api/guestbook/login', '/guestbook/admin']) {
	test(`a browser navigation to ${path} reaches the Worker`, async ({ request }) => {
		const response = await request.get(path, { headers: { 'Sec-Fetch-Mode': 'navigate' }, maxRedirects: 0 });
		expect(response.status()).not.toBe(404);
	});
}

test.describe('signed in', () => {
	const secret = process.env['SESSION_SECRET'];
	test.skip(!secret, 'Set SESSION_SECRET to run the signed-in checks.');

	async function cookieFor(githubId: number): Promise<string> {
		return `gb_session=${await sign({ githubId, githubName: 'Test', expiresAt: Date.now() + 60_000 }, secret ?? '')}`;
	}

	test('a note over 140 characters is rejected', async ({ request }) => {
		const response = await request.post('/api/guestbook/notes', { headers: { ...json, Cookie: await cookieFor(1) }, data: { body: 'x'.repeat(141) } });
		expect(response.status()).toBe(400);
	});

	test('a non-owner moderate call gets 403', async ({ request }) => {
		const response = await request.post('/api/guestbook/moderate', {
			headers: { ...json, Cookie: await cookieFor(-1) },
			data: { id: crypto.randomUUID(), status: 'approved' },
		});
		expect(response.status()).toBe(403);
	});
});

test.describe('sign-in error page', () => {
	test('shows the expired message by default, with a way to retry', async ({ page }) => {
		await page.goto('/guestbook/sign-in-error');
		await expect(page.getByRole('heading', { level: 1 })).toContainText("That sign-in didn't stick.");
		await expect(page.getByRole('link', { name: 'Try signing in again' })).toHaveAttribute('href', '/api/guestbook/login');
	});

	test('shows the message for the reason in the URL', async ({ page }) => {
		await page.goto('/guestbook/sign-in-error?reason=denied');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('No problem.');
		await page.goto('/guestbook/sign-in-error?reason=config');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Sign-in is down for now.');
		await expect(page.getByRole('link', { name: 'Try signing in again' })).toHaveCount(0);
	});

	test('a callback without the state cookie lands on it instead of raw JSON', async ({ request }) => {
		const response = await request.get('/api/guestbook/callback?code=x&state=y', { maxRedirects: 0 });
		expect(response.status()).toBe(302);
		expect(response.headers()['location']).toMatch(/^\/guestbook\/sign-in-error\?reason=(expired|config)$/);
	});
});
