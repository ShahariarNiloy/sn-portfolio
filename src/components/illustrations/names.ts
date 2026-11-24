/**
 * names.ts — every illustration name, as plain data so the content schema can
 * validate `illustration` fields without importing components.
 */

/** Illustration names, in the order the registry lists them. */
export const ILLUSTRATION_NAMES = [
	'design-system',
	'localization',
	'accessibility-default',
	'aeo-geo',
	'bilingual-bengali',
	'building-repo-galaxy',
	'first-load',
	'honest-sitemaps',
	'hreflang',
	'learning-rust',
	'lighter-component-library',
	'measure-html',
	'memory-limit',
	'monthly-review',
	'motion-with-manners',
	'pseo',
	'remote-pipeline',
	'retries-leak',
	'right-framework',
	'zero-server-post',
	'memory',
	'performance',
	'zero-server',
	'seo',
	'research',
] as const;

/** A valid `illustration` name. */
export type IllustrationName = (typeof ILLUSTRATION_NAMES)[number];
