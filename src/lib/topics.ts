/**
 * topics.ts — display names for blog and essay topics, in the order the
 * mockup lists them. Used by /blog, posts' breadcrumbs and meta line, and Off the clock.
 */

/** Blog topics, as grouped on /blog. */
export const TOPICS = [
	{ id: 'performance', label: 'Performance' },
	{ id: 'lighter-ui', label: 'Lighter UI' },
	{ id: 'seo', label: 'SEO' },
	{ id: 'products', label: 'My products' },
	{ id: 'learning', label: 'Learning in public' },
] as const;

/** Essay topics on Off the clock. */
export const ESSAY_TOPICS = [
	{ id: 'self', label: 'Self' },
	{ id: 'people', label: 'People' },
	{ id: 'gratitude', label: 'Gratitude' },
	{ id: 'character', label: 'Character' },
] as const;
