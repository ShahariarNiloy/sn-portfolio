// @ts-check
/**
 * Astro config: integrations, adapter and site URL only.
 * Every page is prerendered; only the Guestbook endpoints and admin page opt out
 * with `export const prerender = false` and run on Cloudflare Workers.
 */
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { FONTS } from './fonts.config.mjs';
import nowFreshness from './scripts/now-freshness.mjs';

export default defineConfig({
	site: 'https://shahariarniloy.com',
	output: 'static',
	adapter: cloudflare({ imageService: 'compile' }),
	// Astro sessions are unused (the Guestbook signs its own cookie), so no KV namespace is needed.
	session: false,
	trailingSlash: 'never',
	// Pages load on hover, so navigating feels instant without a client router.
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	// Code samples are plain text: the highlighter would add inline styles.
	markdown: { syntaxHighlight: false },
	build: { format: 'directory' },
	fonts: FONTS,
	integrations: [
		nowFreshness(),
		mdx(),
		sitemap({
			// Admin and API routes are never public pages.
			filter: (page) =>
				!page.includes('/guestbook/admin') && !page.includes('/guestbook/sign-in-error') && !page.includes('/api/') && !page.includes('/og-card/'),
		}),
	],
	vite: { plugins: [tailwindcss()] },
});
