/**
 * nav.ts — the site's primary sections, shared by the header nav (desktop) and
 * the mobile menu so the two can never list different pages.
 */

/** Which nav item is the current section. */
export type NavSection = 'work' | 'stack' | 'blog' | 'timeline' | 'about' | 'contact' | 'guestbook';

/** The primary links, in header order. */
export const NAV_LINKS: { key: NavSection; label: string; href: string }[] = [
	{ key: 'work', label: 'Work', href: '/work' },
	{ key: 'blog', label: 'Blog', href: '/blog' },
	{ key: 'timeline', label: 'Timeline', href: '/timeline' },
	{ key: 'about', label: 'About', href: '/about' },
	{ key: 'contact', label: 'Contact', href: '/contact' },
];
