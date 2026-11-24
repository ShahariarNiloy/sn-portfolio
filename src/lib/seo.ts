/**
 * seo.ts — builds every <title>, meta description and JSON-LD block from
 * content, so no page sets them by hand. Pure functions; used by BaseLayout
 * and the pages that pass it structured data.
 */

/** Site-wide identity, as stored in content/data/site.json. */
export interface SiteIdentity {
	name: string;
	role: string;
	email: string;
	location: string;
	github: string;
	linkedin: string;
}

/** Longest allowed <title>. */
export const MAX_TITLE_LENGTH = 60;
/** Longest allowed meta description. */
export const MAX_DESCRIPTION_LENGTH = 155;

/** Shortens text to `max` characters at a word boundary, adding an ellipsis. */
export function truncate(text: string, max: number): string {
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 0)).replace(/[\s,.;:—-]+$/, '')}…`;
}

/** "Page — Shahariar Niloy", or the site name alone for Home; never over 60 characters. */
export function buildTitle(siteName: string, page?: string): string {
	if (!page) return truncate(`${siteName}`, MAX_TITLE_LENGTH);
	const suffix = ` — ${siteName}`;
	return `${truncate(page, MAX_TITLE_LENGTH - suffix.length)}${suffix}`;
}

/** A meta description of at most 155 characters. */
export function buildDescription(text: string): string {
	return truncate(text.replace(/\s+/g, ' ').trim(), MAX_DESCRIPTION_LENGTH);
}

/** Strips the inline Markdown used in data files, for plain-text contexts. */
export function stripInline(text: string): string {
	return text
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\*\*?([^*]+)\*\*?/g, '$1')
		.replace(/\\\n/g, ' ');
}

/** JSON-LD Person, for Home. */
export function buildPersonJsonLd(site: SiteIdentity, url: string): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.name,
		jobTitle: site.role,
		url,
		email: `mailto:${site.email}`,
		address: { '@type': 'PostalAddress', addressLocality: site.location },
		sameAs: [site.github, site.linkedin],
	};
}

/** Options for a BlogPosting. */
export interface PostingOptions {
	title: string;
	summary: string;
	url: string;
	publishedOn: Date;
	authorName: string;
	authorUrl: string;
}

/** JSON-LD BlogPosting, for published posts. */
export function buildPostingJsonLd(options: PostingOptions): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: options.title,
		description: options.summary,
		url: options.url,
		datePublished: options.publishedOn.toISOString(),
		author: { '@type': 'Person', name: options.authorName, url: options.authorUrl },
	};
}

/** One step of a breadcrumb trail; the current page has no href. */
export interface Crumb {
	label: string;
	href?: string;
}

/** JSON-LD BreadcrumbList, for inner pages. `origin` is the site URL. */
export function buildBreadcrumbJsonLd(items: Crumb[], currentUrl: string, origin: string): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.label,
			item: item.href ? new URL(item.href, origin).href : currentUrl,
		})),
	};
}
