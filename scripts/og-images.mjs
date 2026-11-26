/**
 * og-images.mjs — `pnpm og`: makes a 1200 × 630 share card for every project,
 * case study, post and essay, plus About. Starts an Astro dev server on a spare port,
 * photographs each /og-card/… page with Playwright, saves public/og/<path>.jpg
 * and lists the paths in src/lib/og-images.json. Run it after adding or
 * renaming content, then commit the images.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from '@playwright/test';
import { dev } from 'astro';

const PORT = 4340;
const ORIGIN = `http://localhost:${PORT}`;

// Astro's own API, so the server stops with this script.
const server = await dev({ server: { port: PORT }, devToolbar: { enabled: false }, logLevel: 'error' });

try {
	await waitFor(`${ORIGIN}/`);
	const paths = await listCards();
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	await mkdir('public/og', { recursive: true });
	for (const path of paths) {
		await page.goto(`${ORIGIN}/og-card${path}`, { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);
		const file = `public/og${path}.jpg`;
		await mkdir(dirname(file), { recursive: true });
		await page.locator('[data-card]').screenshot({ path: file, type: 'jpeg', quality: 86 });
		console.log('  ', file);
	}
	await browser.close();
	await writeFile('src/lib/og-images.json', `${JSON.stringify(paths, null, '\t')}\n`);
	console.log(`${paths.length} cards written.`);
} finally {
	await server.stop();
}

/** Waits until the dev server answers. */
async function waitFor(url) {
	for (let i = 0; i < 120; i++) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`Dev server did not start at ${url}`);
}

/** The card paths: every page llms.txt lists that has an /og-card twin. */
async function listCards() {
	const index = await (await fetch(`${ORIGIN}/llms.txt`)).text();
	const paths = [...index.matchAll(/\]\(https?:\/\/[^/)]+(\/[^)]*)\)/g)].map((m) => m[1]);
	const wanted = paths.filter((p) => /^\/(about|work\/|highlights\/|blog\/|off-the-clock\/)/.test(p));
	const found = [];
	for (const path of wanted) if ((await fetch(`${ORIGIN}/og-card${path}`)).ok) found.push(path);
	return found;
}
