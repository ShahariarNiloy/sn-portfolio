/**
 * content.ts — every content query on the site. Pages call these, never
 * getCollection directly. Drafts are filtered here, so no list, link or feed can
 * show one; in `astro dev` a draft still opens at its own URL for previewing.
 */
import { type CollectionEntry, getCollection, getEntry } from 'astro:content';

import stackFile from '@/content/data/stack.json';

import { formatMonth } from './format';
import { groupNewestFirst } from './timeline';

/** True only in production builds. */
const IS_PRODUCTION = import.meta.env.PROD;

/** Throws when a required single-entry data file is missing. */
async function getRequired<C extends 'site' | 'now' | 'uses'>(collection: C, id: string): Promise<CollectionEntry<C>> {
	const entry = await getEntry(collection, id);
	if (!entry) throw new Error(`Missing content: ${collection}/${id}`);
	return entry as CollectionEntry<C>;
}

/** Name, contact links and Home copy. */
export async function getSite(): Promise<CollectionEntry<'site'>['data']> {
	return (await getRequired('site', 'site')).data;
}

/** The Now page data. */
export async function getNow(): Promise<CollectionEntry<'now'>['data']> {
	return (await getRequired('now', 'now')).data;
}

/** The Uses page data. */
export async function getUses(): Promise<CollectionEntry<'uses'>['data']> {
	return (await getRequired('uses', 'uses')).data;
}

const byOrder = <T extends { data: { order: number } }>(a: T, b: T): number => a.data.order - b.data.order;

/** All projects, in display order. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
	return (await getCollection('projects')).sort(byOrder);
}

/** All highlights, in display order. */
export async function getHighlights(): Promise<CollectionEntry<'highlights'>[]> {
	return (await getCollection('highlights')).sort(byOrder);
}

/** Highlights shown on Home, in Home's order, each with its Home width. */
export async function getHomeHighlights(): Promise<{ highlight: CollectionEntry<'highlights'>; size: 2 | 4 | 6 }[]> {
	const featured = (await getHighlights()).flatMap((highlight) => {
		const { featuredOnHome } = highlight.data;
		return featuredOnHome ? [{ highlight, ...featuredOnHome }] : [];
	});
	return featured.sort((a, b) => a.order - b.order).map(({ highlight, size }) => ({ highlight, size }));
}

/** Published posts, in list order: the only posts that may be listed or linked. */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
	return (await getCollection('blog', (p) => p.data.status === 'published')).sort(byOrder);
}

/** Posts that get a page: published ones, plus unlinked drafts in `astro dev` for previewing. */
export async function getRoutablePosts(): Promise<CollectionEntry<'blog'>[]> {
	return IS_PRODUCTION ? getPublishedPosts() : (await getCollection('blog')).sort(byOrder);
}

/** The newest published posts, for Home. Ties keep list order. */
export async function getLatestPosts(limit: number): Promise<CollectionEntry<'blog'>[]> {
	const posts = (await getCollection('blog', (p) => p.data.status === 'published')).sort(byOrder);
	return posts.sort((a, b) => (b.data.publishedOn?.getTime() ?? 0) - (a.data.publishedOn?.getTime() ?? 0)).slice(0, limit);
}

/** Essays for Off the clock, in display order. */
export async function getEssays(): Promise<CollectionEntry<'essays'>[]> {
	return (await getCollection('essays')).sort(byOrder);
}

/** Quotes for the rotator, each with the title of the essay it came from. */
export async function getQuotes(): Promise<{ text: string; essayTitle: string; essaySlug: string }[]> {
	const [quotes, essays] = await Promise.all([getCollection('quotes'), getEssays()]);
	return quotes
		.sort((a, b) => a.id.localeCompare(b.id))
		.map((q) => {
			const essay = essays.find((e) => e.id === q.data.essay);
			if (!essay) throw new Error(`Quote ${q.id} points to a missing essay: ${q.data.essay}`);
			return {
				text: q.data.text,
				essayTitle: essay.data.title,
				essaySlug: essay.id,
			};
		});
}

// getCollection sorts by id; stack.json's own order is the display order.
const STACK_ORDER = stackFile.map((item) => item.id);

/** Stack items, in stack.json order. */
export async function getStack(): Promise<CollectionEntry<'stack'>[]> {
	return (await getCollection('stack')).sort((a, b) => STACK_ORDER.indexOf(a.id) - STACK_ORDER.indexOf(b.id));
}

/** Companies and their roles, newest first (career.json order). */
export async function getCareer(): Promise<CollectionEntry<'career'>['data'][]> {
	return (await getCollection('career')).sort((a, b) => a.id.localeCompare(b.id)).map((c) => c.data);
}

/** Timeline entries grouped by year, newest year first, and newest first inside each year ("Now" on top). */
export async function getTimeline(): Promise<{ year: string; entries: CollectionEntry<'timeline'>['data'][] }[]> {
	// File order (by id) is oldest first; groupNewestFirst uses it to break ties within a month.
	const entries = (await getCollection('timeline')).sort((a, b) => a.id.localeCompare(b.id)).map((e) => e.data);
	return groupNewestFirst(entries);
}

/** The item after `id` in `items`, wrapping to the first. */
export function getNext<T extends { id: string }>(items: T[], id: string): T | undefined {
	const i = items.findIndex((item) => item.id === id);
	return i === -1 ? undefined : items[(i + 1) % items.length];
}

/** One row in the command palette. */
export interface PaletteEntry {
	label: string;
	href: string;
	group: 'Page' | 'Personal' | 'Project' | 'Highlight' | 'Post' | 'Contact';
}

/** Every destination the command palette lists, generated from content at build time. */
export async function getPaletteEntries(): Promise<PaletteEntry[]> {
	const [site, projects, highlights, posts] = await Promise.all([getSite(), getProjects(), getHighlights(), getPublishedPosts()]);
	const pages: PaletteEntry[] = [
		{ label: 'Home', href: '/', group: 'Page' },
		{ label: 'Work', href: '/work', group: 'Page' },
		{ label: 'Highlights', href: '/highlights', group: 'Page' },
		{ label: 'Stack', href: '/stack', group: 'Page' },
		{ label: 'Blog', href: '/blog', group: 'Page' },
		{ label: 'Timeline', href: '/timeline', group: 'Page' },
		{ label: 'Now', href: '/now', group: 'Page' },
		{ label: 'Uses', href: '/uses', group: 'Page' },
		{ label: 'Guestbook — sign the wall', href: '/guestbook', group: 'Personal' },
		{
			label: 'Off the clock — thoughts',
			href: '/off-the-clock',
			group: 'Personal',
		},
	];
	return [
		...pages,
		...projects.map((p): PaletteEntry => ({
			label: p.data.name,
			href: `/work/${p.id}`,
			group: 'Project',
		})),
		...highlights.map((h): PaletteEntry => ({
			label: h.data.title,
			href: `/highlights/${h.id}`,
			group: 'Highlight',
		})),
		...posts.map((p): PaletteEntry => ({
			label: p.data.title,
			href: `/blog/${p.id}`,
			group: 'Post',
		})),
		{ label: 'Email me', href: `mailto:${site.email}`, group: 'Contact' },
		{ label: 'GitHub', href: site.github, group: 'Contact' },
		{ label: 'LinkedIn', href: site.linkedin, group: 'Contact' },
	];
}

/** "Lighthouse, mobile, Nov 2026" style label for a run's date. */
export function describeRun(run: { device: string; measuredOn: Date }): string {
	return `${run.device}, ${formatMonth(run.measuredOn)}`;
}
