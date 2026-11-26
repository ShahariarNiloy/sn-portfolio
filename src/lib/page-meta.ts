/**
 * page-meta.ts — the <title> and meta description of every indexed page, written
 * out in full so nothing is cut. Titles ≤ 60 characters, descriptions 120–160;
 * a production build fails when a page is missing here or breaks those limits.
 */
import { MAX_TITLE_LENGTH } from './seo';

/** What search results and shared links show for one page. */
export interface PageMeta {
	/** The whole <title>, when "Page — Shahariar Niloy" would be too long or too plain. */
	title?: string;
	description: string;
}

const MIN_DESCRIPTION = 120;
const MAX_DESCRIPTION = 160;

/** Keyed by path, without a trailing slash. */
export const PAGE_META: Record<string, PageMeta> = {
	'/': {
		title: 'Shahariar Niloy — Senior Software Engineer',
		description: 'Shahariar Niloy makes software lighter and faster. Senior Software Engineer in Dhaka, leading frontend on a platform used by millions.',
	},
	'/work': {
		description:
			'Projects by Shahariar Niloy: a travel booking platform in 26 languages, one personal product, two co-built ones, and a 3D codebase explorer in progress.',
	},
	'/work/adventure-inc': {
		description:
			'adventure.inc is a travel booking platform in 26 languages. What Shahariar Niloy owned or drove there: performance, search, SEO and design system.',
	},
	'/work/utilyx': {
		description: 'utilyx.dev is a growing collection of 50+ developer tools that do their work in your browser, so what you paste stays on your device.',
	},
	'/work/truly-remote-work': {
		description:
			'Truly Remote Work is a job board that lists only roles you can do from anywhere in the world, with no hidden office days. Built with Astro and Go.',
	},
	'/work/georenus': {
		description: 'GeoRenus covers the hidden mechanics of money, markets and power in Bengali and English, with both sides of the story so you can decide.',
	},
	'/work/repo-galaxy': {
		description:
			'Repo Galaxy lets you explore any GitHub codebase as a 3D star map, with folders as clusters and files as stars, and ask an AI what each part does.',
	},
	'/highlights': {
		description: 'Problems Shahariar Niloy has worked through, each written up as a case study: what was wrong, what was tried, and what it fixed.',
	},
	'/highlights/design-system': {
		description: "A booking platform's design system, rebuilt from scratch: a drop-in replacement with the same APIs and about half the JavaScript.",
	},
	'/highlights/localization': {
		description: 'A multilingual Next.js app sent its whole translation dictionary in every page. How each page came to ship about 90% less text in its HTML.',
	},
	'/highlights/performance': {
		description:
			"On a large production app I measure first, then cut what the browser doesn't need right away. Mobile Lighthouse went from 46 to 95 on average.",
	},
	'/highlights/browser-first': {
		description:
			'utilyx.dev does its work in your browser and uses a server only where a browser can’t. How a browser-first design keeps the tools private and fast.',
	},
	'/highlights/seo': {
		description: 'Sitemaps, hreflang and structured data across a platform in 26 languages, and the plumbing that helps search engines understand every page.',
	},
	'/highlights/research': {
		description: 'A first-author IEEE paper on recognising Bangla handwritten characters with a convolutional neural network, from before software engineering took over.',
	},
	'/stack': { description: "The tools behind the speed: what I reach for every day, what I use for data and performance, and what I'm learning next." },
	'/timeline': {
		description:
			'The career of Shahariar Niloy, newest first: roles at Adventure Dhaka Limited and Sheba Technologies, research, recognition and the steps between.',
	},
	'/about': {
		description:
			'How Shahariar Niloy went from machine learning research to leading a frontend department in Dhaka: the path, the way of working, and what matters along it.',
	},
	'/contact': {
		description: 'How to reach Shahariar Niloy, a Senior Software Engineer in Dhaka: by email for roles, projects and questions, or on LinkedIn and GitHub.',
	},
	'/now': {
		description: 'What Shahariar Niloy is focused on now: leading frontend on adventure.inc, building Repo Galaxy, redesigning utilyx.dev and learning Rust.',
	},
	'/uses': {
		description: 'The hardware, software and small tools Shahariar Niloy uses every day to build lighter, faster software. People ask, so this is the list.',
	},
	'/guestbook': { description: 'Sign the guestbook: say hello, leave a thought, or say what you took from the notes. It stays here for whoever comes next.' },
	'/blog': {
		description:
			'Notes from work by Shahariar Niloy: making software lighter and faster, being found in search, and lessons from building independent products.',
	},
	'/blog/accessibility-default': {
		description:
			'Semantic HTML, full keyboard support and visible focus as defaults, and what it took to bring every text colour on this site to WCAG AAA contrast.',
	},
	'/blog/first-load': {
		description:
			'Most slow pages are slow because everything wants to run first. Deferring third-party scripts, idle-time work and rendering only what’s on screen.',
	},
	'/blog/honest-sitemaps': {
		description: 'A sitemap is a promise to search engines. Why canonical-first sitemaps work, and how listing fewer URLs can get more of your pages indexed.',
	},
	'/blog/hreflang': {
		description:
			'Dozens of languages, one URL per page, and every version pointing to its siblings: the hreflang rules that matter and the bugs that break them.',
	},
	'/blog/lighter-component-library': {
		title: 'A component library, half the JavaScript — Shahariar Niloy',
		description: 'Why bundle size is conversion, and how keeping the same API turned a move to a library with about half the JavaScript into an import swap.',
	},
	'/blog/measure-html': {
		description: 'We watch bundle size but not what’s inside the HTML. What I learned from sending each page only the translations it actually uses.',
	},
	'/blog/memory-limit': {
		title: 'Don’t raise the memory limit — Shahariar Niloy',
		description: 'How to trace “JavaScript heap out of memory” crashes in a Node or Next.js server: rank every suspect by impact, then find what’s holding on.',
	},
	'/blog/monthly-review': {
		title: 'A monthly performance review — Shahariar Niloy',
		description: 'Lighthouse on every page template, countermeasures each month and shipping in phases: turning bursts of performance work into a habit.',
	},
	'/blog/motion-with-manners': {
		description:
			'A calm motion system: transitions of 300 ms or less, no bounce, shared tokens instead of magic numbers, and reduced motion respected everywhere.',
	},
	'/blog/retries-leak': {
		description:
			'Retries feel like resilience until they hold on to memory. Per-attempt abort signals, timers that always clear, and actions that never retry.',
	},
	'/blog/zero-server': {
		description: 'Why utilyx.dev does its work in the browser, and when it still needs a server: pre-built pages, private by design, and fast as a result.',
	},
	'/off-the-clock': {
		description: 'Nothing here is about work. Short essays on the self, people, gratitude and character: the things I keep thinking about on long walks.',
	},
	'/off-the-clock/a-different-kind-of-gratitude': {
		description: 'A short essay on a different kind of gratitude, one that goes beyond being thankful for what we have to the people who cross our path.',
	},
	'/off-the-clock/choose-the-person-over-the-problem': {
		description: 'Don’t let your anger, your grudges or your ego win. A short essay on choosing the person over the problem before the last conversation.',
	},
	'/off-the-clock/stop-pulling-the-knot': {
		description: 'Perhaps the purpose of an argument was never to decide who was right. A short essay on listening, understanding and unravelling the knot.',
	},
	'/off-the-clock/what-people-remember': {
		description: 'We spend so much time perfecting our appearance that we forget what people remember: how we made them feel. A short essay on character.',
	},
	'/off-the-clock/words-last': {
		description: 'Words can last for a very long time, whether kind or cruel. A short essay on choosing them wisely, even in a brief moment with a stranger.',
	},
	'/off-the-clock/your-story-is-not-about-me': {
		description: 'A short essay on taking things personally, and why what people do is usually a reflection of who they are, not a definition of who we are.',
	},
};

/** Throws when an indexed page's title or description is missing or the wrong length. */
export function assertPageMeta(path: string, title: string, description: string): void {
	if (!PAGE_META[path]) throw new Error(`page-meta.ts has no entry for ${path}`);
	if (title.length > MAX_TITLE_LENGTH) throw new Error(`${path}: title is ${title.length} characters (max ${MAX_TITLE_LENGTH})`);
	if (description.length < MIN_DESCRIPTION || description.length > MAX_DESCRIPTION)
		throw new Error(`${path}: description is ${description.length} characters (${MIN_DESCRIPTION}–${MAX_DESCRIPTION})`);
}
