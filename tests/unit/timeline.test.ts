/** Unit tests for the Timeline page: the career summary and the newest-first order. */
import { describe, expect, it } from 'vitest';

import { formatCareerSummary, summarizeCareer } from '@/lib/career';
import { formatRange, formatYearMonth } from '@/lib/format';
import { formatTimelineMeta, groupNewestFirst } from '@/lib/timeline';

const companies = [
	{
		from: '2023-10',
		roles: [{ from: '2025-10' }, { from: '2024-10' }, { from: '2023-10' }],
	},
	{ from: '2022-02', roles: [{ from: '2022-05' }, { from: '2022-02' }] },
];

describe('career summary', () => {
	it('counts companies and roles and finds the earliest start', () => {
		expect(summarizeCareer(companies)).toEqual({ since: '2022-02', companies: 2, roles: 5 });
	});
	it('finds the earliest start even when a role predates its company entry', () => {
		expect(summarizeCareer([{ from: '2024-01', roles: [{ from: '2023-06' }] }]).since).toBe('2023-06');
	});
	it('formats the line, with singular forms', () => {
		expect(formatCareerSummary(companies)).toBe('In production since Feb 2022 · 2 companies · 5 roles');
		expect(formatCareerSummary([{ from: '2020-01', roles: [{ from: '2020-01' }] }])).toBe('In production since Jan 2020 · 1 company · 1 role');
	});
	it('formats date ranges', () => {
		expect(formatYearMonth('2023-10')).toBe('Oct 2023');
		expect(formatRange('2023-10', null)).toBe('Oct 2023 – Present');
		expect(formatRange('2022-05', '2023-10')).toBe('May 2022 – Oct 2023');
	});
});

describe('timeline order', () => {
	const entries = [
		{ year: '1998 – 2017', kind: 'life', title: 'childhood' },
		{ year: '1998 – 2017', month: 'Sep', kind: 'education', title: 'bsc start' },
		{ year: '2022', month: 'Feb', kind: 'education', title: 'graduated' },
		{ year: '2022', month: 'Feb', kind: 'role', title: 'intern' },
		{ year: '2022', month: 'Dec', kind: 'research', title: 'paper' },
		{ year: '2026', month: 'Jan', kind: 'award', title: 'award' },
		{ year: '2026', kind: 'now', title: 'now' },
	];
	const grouped = groupNewestFirst(entries);

	it('puts years newest first, with the range label last', () => {
		expect(grouped.map((g) => g.year)).toEqual(['2026', '2022', '1998 – 2017']);
	});
	it('puts entries newest first, Now at the top, undated last, later-listed first on ties', () => {
		expect(grouped.map((g) => g.entries.map((e) => e.title))).toEqual([
			['now', 'award'],
			['paper', 'intern', 'graduated'],
			['bsc start', 'childhood'],
		]);
	});
	it('never repeats the meta word', () => {
		expect(formatTimelineMeta('Now', 'Now')).toBe('Now');
		expect(formatTimelineMeta(undefined, 'Life')).toBe('Life');
		expect(formatTimelineMeta('Feb', 'Role')).toBe('Feb · Role');
	});
});
