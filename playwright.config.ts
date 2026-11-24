// Playwright: every route at 390, 768 and 1440 px against the production
// build served by `astro preview`. Run with `pnpm e2e` after `pnpm build`.
import { defineConfig, devices } from '@playwright/test';

// `astro preview` runs one server per project; reuse it locally on PREVIEW_PORT.
const PORT = Number(process.env['PREVIEW_PORT'] ?? 4321);

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	reporter: process.env['CI'] ? 'github' : 'list',
	use: { baseURL: `http://localhost:${PORT}` },
	projects: [
		{ name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
		{ name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
		{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
	],
	expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001 } },
	webServer: { command: `pnpm astro preview --port ${PORT}`, port: PORT, reuseExistingServer: !process.env['CI'] },
});
