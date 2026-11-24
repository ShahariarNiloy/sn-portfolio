/**
 * timeline.ts — pure helpers for the /timeline page: the newest-first order and
 * the "Mon · Kind" meta line. lib/content.ts sorts with these; Timeline.astro
 * formats with them.
 */

/** The fields of a timeline entry these helpers read. */
export interface TimelineFields {
	year: string;
	month?: string | undefined;
	kind: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The last year a year label covers: "1998 – 2017" → 2017, "2022" → 2022. */
export function getYearEnd(year: string): number {
	const years = year.match(/\d{4}/g) ?? [];
	return Number(years.at(-1) ?? 0);
}

/** Sort key inside a year: "Now" first, then months newest first, undated last. */
function getMonthRank(entry: TimelineFields): number {
	if (entry.kind === 'now') return 13;
	return entry.month ? MONTHS.indexOf(entry.month) + 1 : 0;
}

/**
 * Groups entries by year label, newest year first, and orders each year's
 * entries newest first with "Now" at the top. Entries with the same month keep
 * their file order reversed, so the later-listed one (the newer) comes first.
 */
export function groupNewestFirst<T extends TimelineFields>(entries: readonly T[]): { year: string; entries: T[] }[] {
	const groups = new Map<string, { entry: T; index: number }[]>();
	entries.forEach((entry, index) => {
		const list = groups.get(entry.year) ?? [];
		list.push({ entry, index });
		groups.set(entry.year, list);
	});
	return [...groups.entries()]
		.sort(([a], [b]) => getYearEnd(b) - getYearEnd(a))
		.map(([year, list]) => ({
			year,
			entries: list.sort((a, b) => getMonthRank(b.entry) - getMonthRank(a.entry) || b.index - a.index).map((x) => x.entry),
		}));
}

/** "Mon · Kind", without repeating a word: a "Now" entry reads "Now", not "Now · Now". */
export function formatTimelineMeta(month: string | undefined, kindLabel: string): string {
	if (!month || month === kindLabel) return kindLabel;
	return `${month} · ${kindLabel}`;
}
