export const SITE = {
	name: 'Shahariar Niloy',
	fullName: 'Shahariar Alam Niloy',
	title: 'Shahariar Niloy — Frontend engineer',
	description:
		'Frontend engineer in Dhaka. Building software that is lighter, faster and scalable with React and Next.js.',
	email: 'shahariarniloyblv@gmail.com',
	github: 'https://github.com/ShahariarNiloy',
	linkedin: 'https://linkedin.com/in/shahariarniloy',
	utilyx: 'https://utilyx.dev',
	trw: 'https://trulyremotework.com/',
	georenus: 'https://georenus.com/',
};

export const NAV = [
	{ href: '/', label: 'Home' },
	{ href: '/work', label: 'Work' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
] as const;

export type ProjectTag = 'pro' | 'product' | 'wip';

export interface Project {
	key: string;
	name: string;
	desc: string;
	status: string;
	tag: ProjectTag;
	dot: string;
	stack: string;
	mark: string;
	size: string;
	mono: boolean;
	href?: string;
}

const MONO = true;
const SANS = false;

export const PROJECTS: Project[] = [
	{
		key: 'adv',
		name: 'Adventure Inc',
		desc: "My employer's travel booking platform for Japan. A company project where I'm one of the main frontend engineers: performance, search and SEO.",
		status: 'Company project',
		tag: 'pro',
		dot: 'var(--acc)',
		stack: 'Next.js · TypeScript · React',
		mark: 'adventure.inc',
		size: '28px',
		mono: SANS,
		href: '/work/adventure-inc',
	},
	{
		key: 'util',
		name: 'utilyx.dev',
		desc: '50+ developer tools that run fully in your browser. No servers, nothing uploaded.',
		status: 'Live',
		tag: 'product',
		dot: 'var(--ok)',
		stack: 'Client-side · Zero server',
		mark: 'utilyx',
		size: '30px',
		mono: MONO,
		href: 'https://utilyx.dev',
	},
	{
		key: 'trw',
		name: 'Truly Remote Work',
		desc: 'A job board for roles that are remote for real, with no hidden office days.',
		status: 'Live',
		tag: 'product',
		dot: 'var(--ok)',
		stack: 'Job board',
		mark: 'TRW',
		size: '34px',
		mono: SANS,
		href: 'https://trulyremotework.com/',
	},
	{
		key: 'geo',
		name: 'GeoRenus',
		desc: 'A Bengali-language knowledge platform on finance, economics and business.',
		status: 'Live',
		tag: 'product',
		dot: 'var(--ok)',
		stack: 'Content platform · Bengali',
		mark: 'GeoRenus',
		size: '28px',
		mono: SANS,
		href: 'https://georenus.com/',
	},
	{
		key: 'gal',
		name: 'Repo Galaxy',
		desc: 'Explore any GitHub codebase as a 3D star map and ask AI what each part does.',
		status: 'Building',
		tag: 'wip',
		dot: '#E8A33D',
		stack: '3D · AI',
		mark: 'repo ✦ galaxy',
		size: '24px',
		mono: MONO,
	},
	{
		key: 'flags',
		name: '[FLAG PLATFORM NAME]',
		desc: 'A lightweight feature-flag platform: a tiny SDK and no added latency.',
		status: 'Building',
		tag: 'wip',
		dot: '#E8A33D',
		stack: 'Dev infrastructure',
		mark: 'flags',
		size: '30px',
		mono: MONO,
	},
];
