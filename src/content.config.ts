/**
 * content.config.ts — the single source of truth for every content type.
 * A build fails if any file breaks its schema. Fields marked "owner approval
 * pending" are not in the PRD schema yet; the mockup needs them.
 */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { ILLUSTRATION_NAMES } from '@/components/illustrations/names';

/** Lighthouse scores, 0–100, from a real run. Never estimated. */
const lighthouse = z.object({
	device: z.enum(['mobile', 'desktop']),
	measuredOn: z.coerce.date(),
	performance: z.number().int().min(0).max(100),
	accessibility: z.number().int().min(0).max(100),
	bestPractices: z.number().int().min(0).max(100),
	seo: z.number().int().min(0).max(100),
});

const illustration = z.enum(ILLUSTRATION_NAMES);

/** "Label: value" pairs; values may hold inline Markdown links, or show as a chip. */
const metaItem = z.object({ label: z.string(), value: z.string(), chip: z.boolean().optional() });

const blog = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
	schema: z
		.object({
			title: z.string().max(90),
			summary: z.string().max(180),
			topic: z.enum(['performance', 'lighter-ui', 'seo', 'products', 'learning']),
			status: z.enum(['draft', 'published']),
			publishedOn: z.coerce.date().optional(),
			illustration,
			related: z.object({ href: z.string(), label: z.string() }).optional(),
			/** Owner approval pending: list and "Next post" order. */
			order: z.number().int(),
		})
		.refine((p) => p.status === 'draft' || p.publishedOn, 'publishedOn is required when published'),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			group: z.enum(['company', 'product', 'building']),
			lede: z.string(),
			url: z.url().optional(),
			sourceUrl: z.url().optional(),
			meta: z.array(metaItem),
			lighthouse: lighthouse.optional(),
			order: z.number().int(),
			/** False keeps it off Home; it stays on /work. */
			showOnHome: z.boolean().optional(),
			/** Screenshot shown beside it on /work; without one, its badge fills the frame. */
			thumbnail: image().optional(),
			/** Owner approval pending: pill next to the name ("Company project", "In progress"). */
			badge: z.string().optional(),
			/** Owner approval pending: one-line description on /work. */
			summary: z.string(),
			/** Owner approval pending: shorter description on Home, when it differs. */
			homeSummary: z.string().optional(),
			/** Owner approval pending: the right-hand label in a work row ("Live", "2023 –"). */
			period: z.string(),
			/** Owner approval pending: that label on Home, when it differs. */
			homePeriod: z.string().optional(),
		}),
});

/** Columns a highlight card takes out of 6. */
const highlightSize = z.union([z.literal(2), z.literal(4), z.literal(6)]);

const highlights = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/highlights' }),
	schema: z.object({
		title: z.string(),
		lede: z.string(),
		card: z.string().max(140),
		illustration,
		/** Order on /highlights, in the palette and in "Next highlight". */
		order: z.number().int(),
		/** Mono line at the top of its card. */
		kicker: z.string(),
		/** Columns out of 6 on /highlights. Rows must fill: 4+2, 2+4 or 6. */
		size: highlightSize,
		/** Its place and width on Home, if it is shown there. */
		featuredOnHome: z.object({ order: z.number().int(), size: highlightSize }).optional(),
		/** For a published paper: its DOI, where it's published and when, for ScholarlyArticle JSON-LD. */
		paper: z.object({ title: z.string(), doi: z.string(), url: z.url(), venue: z.string(), publishedOn: z.string() }).optional(),
	}),
});

const essays = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		topic: z.enum(['self', 'people', 'gratitude', 'character']),
		publishedOn: z.coerce.date(),
		order: z.number().int(),
	}),
});

const timeline = defineCollection({
	loader: file('./src/content/data/timeline.json'),
	schema: z.object({
		year: z.string(),
		month: z.string().optional(),
		title: z.string(),
		kind: z.enum(['life', 'education', 'role', 'research', 'certificate', 'award', 'now']),
		body: z.string(),
	}),
});

/** "YYYY-MM". */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');

const career = defineCollection({
	loader: file('./src/content/data/career.json'),
	schema: z.object({
		company: z.string(),
		href: z.string().optional(),
		from: yearMonth,
		/** null while it is the current company. */
		to: yearMonth.nullable(),
		/** Newest first. */
		roles: z
			.array(z.object({ title: z.string(), /** Label on Home's career ladder. */ short: z.string().optional(), from: yearMonth, to: yearMonth.nullable() }))
			.min(1),
	}),
});

const stack = defineCollection({
	loader: file('./src/content/data/stack.json'),
	schema: z.object({
		name: z.string(),
		group: z.enum(['every-day', 'state-and-data', 'runtime-build-delivery', 'learning']),
		/** What it is for, on /stack. */
		description: z.string(),
		icon: z.string(),
		/** Chip and grid accent; a CSS colour used only as a custom property. */
		colour: z.string(),
		/** The logo's own brand colour, also only a custom property. */
		logoColour: z.string(),
		/** "col,row" on the 9 × 6 Stack grid, if it appears there. */
		grid: z
			.string()
			.regex(/^\d,\d$/)
			.optional(),
		symbol: z.string().optional(),
		category: z.string().optional(),
		/** Its group and place in Home's Stack section. */
		home: z.object({ group: z.enum(['languages', 'frameworks', 'libraries', 'data', 'runtime-hosting', 'tooling']), order: z.number().int() }).optional(),
	}),
});

const uses = defineCollection({
	loader: file('./src/content/data/uses.json'),
	schema: z.object({
		updatedOn: z.coerce.date(),
		groups: z.array(z.object({ id: z.string(), title: z.string(), rows: z.array(metaItem) })),
		credit: z.string(),
	}),
});

const now = defineCollection({
	loader: file('./src/content/data/now.json'),
	schema: z.object({
		updatedOn: z.coerce.date(),
		place: z.string(),
		items: z.array(z.object({ label: z.string(), body: z.string() })),
		/** The lines in Home's "Now" section. */
		home: z.array(z.string()),
	}),
});

const quotes = defineCollection({
	loader: file('./src/content/data/quotes.json'),
	schema: z.object({ text: z.string(), essay: z.string() }),
});

const site = defineCollection({
	loader: file('./src/content/data/site.json'),
	schema: z.object({
		name: z.string(),
		role: z.string(),
		domain: z.string(),
		email: z.email(),
		location: z.string(),
		github: z.url(),
		linkedin: z.url(),
		description: z.string().max(155),
		home: z.object({
			title: z.tuple([z.string(), z.string()]),
			intro: z.string(),
			facts: z.array(metaItem),
			/** The sentence under the intro, and its LinkedIn pill. */
			cta: z.object({ text: z.string(), label: z.string() }),
			experience: z.array(z.object({ period: z.string(), title: z.string(), body: z.string() })),
			recognition: z.array(z.object({ title: z.string(), detail: z.string() })),
			/** Sentence with `{email}`, `{github}` and `{linkedin}` tokens. */
			contact: z.string(),
			offTheClock: z.string(),
		}),
	}),
});

export const collections = { blog, projects, highlights, essays, timeline, career, stack, uses, now, quotes, site };
