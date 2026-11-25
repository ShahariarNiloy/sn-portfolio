/**
 * format.ts — the one place dates and inline text are formatted.
 * Dates are handled in UTC. Used by pages and components; no DOM, no Astro.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** "Nov 2026". */
export function formatMonth(date: Date): string {
	return `${MONTHS[date.getUTCMonth()] ?? ''} ${date.getUTCFullYear()}`;
}

/** "23 Nov 2026". */
export function formatDay(date: Date): string {
	return `${date.getUTCDate()} ${formatMonth(date)}`;
}

/** ISO date without time: "2026-11-23". */
export function formatIsoDay(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/** One piece of inline text after parsing. */
export type InlinePart =
	| { kind: 'text'; text: string }
	| { kind: 'strong'; text: string }
	| { kind: 'em'; text: string }
	| { kind: 'link'; text: string; href: string; strong: boolean }
	| { kind: 'break' };

const INLINE = /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|\\\n|\n/g;

/**
 * Parses the small inline Markdown subset used in data files: **bold**, *italic*,
 * [links](/path), **[bold links](/path)** and line breaks. Everything else is text,
 * so the result can be rendered without set:html.
 */
export function parseInline(source: string): InlinePart[] {
	const parts: InlinePart[] = [];
	let last = 0;
	for (const m of source.matchAll(INLINE)) {
		const index = m.index;
		if (index > last) parts.push({ kind: 'text', text: source.slice(last, index) });
		last = index + m[0].length;
		if (m[1] !== undefined && m[2] !== undefined) parts.push({ kind: 'link', text: m[1], href: m[2], strong: true });
		else if (m[3] !== undefined && m[4] !== undefined) parts.push({ kind: 'link', text: m[3], href: m[4], strong: false });
		else if (m[5] !== undefined) parts.push({ kind: 'strong', text: m[5] });
		else if (m[6] !== undefined) parts.push({ kind: 'em', text: m[6] });
		else parts.push({ kind: 'break' });
	}
	if (last < source.length) parts.push({ kind: 'text', text: source.slice(last) });
	return parts;
}

/** True for links that leave the site. */
export function isExternalHref(href: string): boolean {
	return /^https?:\/\//.test(href);
}

/** Two-digit index: 1 → "01". */
export function padIndex(n: number): string {
	return String(n).padStart(2, '0');
}

/** "This page" line in the footer: "38 KB · 0.42s to load". Bytes of 0 are left out. */
export function formatPageWeight(bytes: number, milliseconds: number): string {
	const size = bytes > 0 ? `${Math.round(bytes / 1024)} KB · ` : '';
	return `${size}${(milliseconds / 1000).toFixed(2)}s to load`;
}

/** "2023-10" → "Oct 2023". */
export function formatYearMonth(value: string): string {
	const [year = '', month = '1'] = value.split('-');
	return `${MONTHS[Number(month) - 1] ?? ''} ${year}`;
}

/** "Oct 2023 – Present" when `to` is null, else "May 2022 – Oct 2023" (en dash). */
export function formatRange(from: string, to: string | null): string {
	return `${formatYearMonth(from)} – ${to === null ? 'Present' : formatYearMonth(to)}`;
}

/** A D1 timestamp ("YYYY-MM-DD HH:MM:SS", always UTC) as a Date. */
export function parseUtcTimestamp(value: string): Date {
	return new Date(`${value.replace(' ', 'T')}Z`);
}
