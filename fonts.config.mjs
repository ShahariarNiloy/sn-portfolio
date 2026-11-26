// @ts-check
/**
 * fonts.config.mjs — the site's three families for Astro's Fonts API. Each
 * weight has two files from scripts/subset-fonts.py: the full Latin file, then a
 * small "core" file with only the characters the copy uses. Browsers match the
 * last face first and download a file only when a page needs it, so the full
 * file loads only for characters outside the core (an accented name, say).
 * Astro also generates fallback faces sized to match, so nothing shifts on swap.
 */
import { fontProviders } from 'astro/config';

/** Every character the site's copy uses; keep in step with CORE in scripts/subset-fonts.py. */
const CORE =
	'U+0020-007E, U+00A0, U+00A9, U+00B7, U+00BD, U+00D7, U+2013, U+2014, U+2018, U+2019, U+201C, U+201D, U+2026, U+2033, U+2153, U+2190-2193, U+2197, U+21B5, U+2212, U+2318, U+2715';
/** Fontsource's Latin range: what the full files cover. */
const LATIN =
	'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

/** @typedef {{ src: [string], weight: number, style: 'normal', unicodeRange: [string] }} Face */

/**
 * The full file then the core file for each weight of one family.
 * @param {string} name File name prefix in src/styles/fonts/.
 * @param {number[]} weights
 * @returns {[Face, ...Face[]]}
 */
const variants = (name, weights) => {
	/** @type {Face[]} */
	const list = weights.flatMap((weight) => [
		{ src: [`./src/styles/fonts/${name}-${weight}.woff2`], weight, style: 'normal', unicodeRange: [LATIN] },
		{ src: [`./src/styles/fonts/${name}-${weight}.core.woff2`], weight, style: 'normal', unicodeRange: [CORE] },
	]);
	const [first, ...rest] = list;
	if (!first) throw new Error(`No weights for ${name}`);
	return [first, ...rest];
};

export const FONTS = [
	{
		provider: fontProviders.local(),
		name: 'Geist',
		cssVariable: '--font-geist',
		fallbacks: ['system-ui', 'sans-serif'],
		options: { variants: variants('geist', [400, 500, 600]) },
	},
	{
		provider: fontProviders.local(),
		name: 'Geist Mono',
		cssVariable: '--font-geist-mono',
		fallbacks: ['ui-monospace', 'monospace'],
		options: { variants: variants('geist-mono', [400, 500]) },
	},
	{
		provider: fontProviders.local(),
		name: 'Instrument Serif',
		cssVariable: '--font-instrument-serif',
		fallbacks: ['Georgia', 'serif'],
		options: { variants: variants('instrument-serif', [400]) },
	},
];
