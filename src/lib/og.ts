/**
 * og.ts — which pages have their own share card. The cards are JPEGs in
 * public/og/, made by `pnpm og` (scripts/og-images.mjs), which also rewrites
 * og-images.json. A page without one shares the site card.
 */
import cards from './og-images.json';

const WITH_CARD = new Set<string>(cards);

/** Share image path for a page path such as "/blog/retries-leak". */
export function shareImageFor(path: string): string {
	return WITH_CARD.has(path) ? `/og${path}.jpg` : '/og/default.png';
}

/** Absolute share image URL for a page path. */
export function shareImageUrl(path: string, origin: string): string {
	return new URL(shareImageFor(path), origin).href;
}
