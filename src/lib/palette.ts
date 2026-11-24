/**
 * palette.ts — pure logic for the command palette: filtering entries by what
 * was typed and moving the selection. The island in components/islands uses it.
 */

/** The minimum an entry needs for filtering. */
export interface FilterableEntry {
	label: string;
	group: string;
}

/** Entries whose label or group contains the query, case-insensitively. Empty query keeps all. */
export function filterEntries<T extends FilterableEntry>(entries: readonly T[], query: string): T[] {
	const q = query.trim().toLowerCase();
	if (!q) return [...entries];
	return entries.filter((e) => `${e.label} ${e.group}`.toLowerCase().includes(q));
}

/** The selection after an arrow key, clamped to the list. */
export function moveSelection(current: number, key: 'ArrowUp' | 'ArrowDown', length: number): number {
	if (length === 0) return 0;
	const next = key === 'ArrowDown' ? current + 1 : current - 1;
	return Math.min(Math.max(next, 0), length - 1);
}
