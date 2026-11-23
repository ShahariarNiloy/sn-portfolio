export const SITE = {
	name: 'Shahariar Niloy',
	title: 'Shahariar Niloy — Senior Software Engineer',
	description:
		"Shahariar Niloy builds software that's lighter, faster and scalable. Senior Software Engineer in Dhaka focused on performance and SEO.",
	email: 'shahariarniloyblv@gmail.com',
	github: 'https://github.com/ShahariarNiloy',
	linkedin: 'https://linkedin.com/in/shahariarniloy',
};

export const NAV = [
	{ href: '/work', label: 'Work' },
	{ href: '/stack', label: 'Stack' },
	{ href: '/writing', label: 'Writing' },
	{ href: '/experience', label: 'Experience' },
	{ href: '/#contact', label: 'Contact' },
];

export type Project = {
	slug: string;
	name: string;
	group: 'Company' | 'Products' | 'Building';
	pill?: string;
	when: string;
	short: string; // home list
	desc: string; // work list
};

export const PROJECTS: Project[] = [
	{
		slug: 'adventure-inc',
		name: 'Adventure Inc',
		group: 'Company',
		pill: 'Company project',
		when: '2023 —',
		short: "My employer's travel booking platform. I work on its frontend: performance, search and SEO.",
		desc: "My employer's travel booking platform. I work on its frontend: performance, search and SEO.",
	},
	{
		slug: 'utilyx',
		name: 'utilyx.dev',
		group: 'Products',
		when: 'Live',
		short: '50+ developer tools that run entirely in your browser. Zero servers.',
		desc: 'Developer tools that run entirely in your browser. Zero servers, nothing uploaded.',
	},
	{
		slug: 'truly-remote-work',
		name: 'Truly Remote Work',
		group: 'Products',
		when: 'Live',
		short: 'A job board for roles that are remote for real.',
		desc: 'A job board for roles that are remote for real, anywhere in the world.',
	},
	{
		slug: 'georenus',
		name: 'GeoRenus',
		group: 'Products',
		when: 'Live',
		short: 'The hidden mechanics of money, markets & power — both sides of the story, so you can decide for yourself.',
		desc: 'The hidden mechanics of money, markets & power — both sides of the story, so you can decide for yourself.',
	},
	{
		slug: 'repo-galaxy',
		name: 'Repo Galaxy',
		group: 'Building',
		pill: 'In progress',
		when: 'Building',
		short: 'Explore a GitHub codebase as a 3D star map and ask AI about it.',
		desc: 'Explore a GitHub codebase as a 3D star map and ask AI what each part does.',
	},
];

export const HIGHLIGHTS = [
	{ slug: 'taming-memory', title: 'Taming memory', ill: 'mem', w: 320, h: 180, short: 'Found and fixed heap out-of-memory issues in a large Next.js app.' },
	{ slug: 'performance', title: 'Performance is a feature', ill: 'perf', w: 520, h: 220, short: 'Code-splitting, lazy loading and lean bundles on a large production app.' },
	{ slug: 'zero-server', title: 'Zero-server tools', ill: 'zero', w: 320, h: 180, short: 'A growing set of developer tools that run entirely in your browser.' },
	{ slug: 'seo', title: 'Found in every language', ill: 'seo', w: 420, h: 180, short: 'Sitemaps, hreflang and structured data across a multilingual platform.' },
	{ slug: 'research', title: 'Published research', ill: 'research', w: 420, h: 180, short: 'First-author IEEE paper on Bangla handwritten character recognition.' },
] as const;

/** Stack grid (9 × 5), keyed "col,row": [symbol, name, color, category, learning?] */
export const STACK_GRID: Record<string, [string, string, string, string, boolean?]> = {
	'2,0': ['Js', 'JavaScript', '#E8CB3A', 'lang'],
	'4,0': ['No', 'Node.js', '#6CC24A', 'runtime'],
	'6,0': ['S3', 'AWS S3', '#F29D38', 'cloud'],
	'1,1': ['Rs', 'Rust', '#DEA584', 'learning', true],
	'3,1': ['Re', 'React', '#61DAFB', 'library'],
	'5,1': ['Nx', 'Next.js', 'var(--fg)', 'framework'],
	'7,1': ['Pg', 'PostgreSQL', '#7FA7DB', 'database'],
	'0,2': ['Rq', 'React Query', '#F472B6', 'data'],
	'2,2': ['Ts', 'TypeScript', '#5B9BEA', 'lang'],
	'4,2': ['Dz', 'Drizzle', '#C5F74F', 'orm'],
	'6,2': ['Zu', 'Zustand', '#D4A373', 'state'],
	'8,2': ['Wa', 'WebAssembly', '#7C8CFF', 'learning', true],
	'1,3': ['Vi', 'Vite', '#B07CFF', 'build'],
	'3,3': ['Go', 'Go', '#29BEB0', 'learning', true],
	'5,3': ['Tw', 'Tailwind CSS', '#38BDF8', 'css'],
	'7,3': ['Lh', 'Lighthouse', '#FF7A66', 'audit'],
	'4,4': ['Rd', 'Redis', '#FF4D4D', 'cache'],
};
