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

/** Optional facts that enrich the Person entry (Home and About). */
export interface PersonExtras {
	image?: string | undefined;
	worksFor?: { name: string; url?: string | undefined } | undefined;
	alumniOf?: string | undefined;
	knowsAbout?: string[] | undefined;
	award?: string[] | undefined;
}

/** JSON-LD Person, for Home and About. `url` is the site's root URL, which also serves as its id. */
export function buildPersonJsonLd(site: SiteIdentity, url: string, extras: PersonExtras = {}): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${url}#person`,
		name: site.name,
		jobTitle: site.role,
		url,
		email: `mailto:${site.email}`,
		address: { '@type': 'PostalAddress', addressLocality: site.location, addressCountry: 'BD' },
		sameAs: [site.github, site.linkedin],
		...(extras.image && { image: extras.image }),
		...(extras.worksFor && { worksFor: { '@type': 'Organization', ...extras.worksFor } }),
		...(extras.alumniOf && { alumniOf: { '@type': 'CollegeOrUniversity', name: extras.alumniOf } }),
		...(extras.knowsAbout?.length && { knowsAbout: extras.knowsAbout }),
		...(extras.award?.length && { award: extras.award }),
	};
}

/** JSON-LD WebSite, for Home: the site's name, for search results. */
export function buildWebSiteJsonLd(name: string, url: string): Record<string, unknown> {
	return { '@context': 'https://schema.org', '@type': 'WebSite', name, url, author: { '@id': `${url}#person` } };
}

/** JSON-LD ProfilePage, for About: the page is about the Person. */
export function buildProfilePageJsonLd(person: Record<string, unknown>, url: string): Record<string, unknown> {
	const { '@context': context, ...entity } = person;
	return { '@context': context, '@type': 'ProfilePage', url, mainEntity: entity };
}

/** Options for an article-like entry: posts, essays, case studies and the paper. */
export interface PostingOptions {
	/** BlogPosting for posts and essays, Article for case studies. */
	type?: 'BlogPosting' | 'Article' | 'ScholarlyArticle' | undefined;
	title: string;
	summary: string;
	url: string;
	publishedOn?: Date | string | undefined;
	authorName: string;
	authorUrl: string;
	/** Absolute URL of the share image. */
	image?: string | undefined;
	/** Extra properties, e.g. a paper's DOI. */
	extra?: Record<string, unknown> | undefined;
}

/** JSON-LD for one article-like page. The author is also the publisher. */
export function buildPostingJsonLd(options: PostingOptions): Record<string, unknown> {
	const date = options.publishedOn instanceof Date ? options.publishedOn.toISOString() : options.publishedOn;
	const author = { '@type': 'Person', '@id': `${options.authorUrl}#person`, name: options.authorName, url: options.authorUrl };
	return {
		'@context': 'https://schema.org',
		'@type': options.type ?? 'BlogPosting',
		headline: options.title,
		description: options.summary,
		url: options.url,
		mainEntityOfPage: options.url,
		...(date && { datePublished: date, dateModified: date }),
		author,
		publisher: author,
		...(options.image && { image: options.image }),
		...options.extra,
	};
}

/** JSON-LD CreativeWork, for a project page. */
export function buildProjectJsonLd(options: {
	name: string;
	description: string;
	pageUrl: string;
	siteUrl?: string | undefined;
	authorUrl: string;
	image?: string | undefined;
}): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: options.name,
		description: options.description,
		url: options.siteUrl ?? options.pageUrl,
		mainEntityOfPage: options.pageUrl,
		creator: { '@id': `${options.authorUrl}#person` },
		...(options.image && { image: options.image }),
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
