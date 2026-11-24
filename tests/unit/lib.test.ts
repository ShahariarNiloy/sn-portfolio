/** Unit tests for the small pure modules: palette, json, lighthouse, seo. */
import { describe, expect, it } from 'vitest';

import { formatJson } from '@/lib/json';
import { getScoreTone, lighthouseScores } from '@/lib/lighthouse';
import { filterEntries, moveSelection } from '@/lib/palette';
import { buildDescription, buildTitle, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, stripInline } from '@/lib/seo';

describe('palette', () => {
	const entries = [
		{ label: 'Home', group: 'Page' },
		{ label: 'utilyx.dev', group: 'Project' },
	];
	it('filters by label or group, case-insensitively', () => {
		expect(filterEntries(entries, 'PROJ')).toEqual([entries[1]]);
		expect(filterEntries(entries, '  ')).toEqual(entries);
	});
	it('clamps the selection', () => {
		expect(moveSelection(0, 'ArrowUp', 2)).toBe(0);
		expect(moveSelection(1, 'ArrowDown', 2)).toBe(1);
		expect(moveSelection(0, 'ArrowDown', 0)).toBe(0);
	});
});

describe('formatJson', () => {
	it('pretty-prints or reports the error', () => {
		expect(formatJson('{"a":1}')).toEqual({ ok: true, output: '{\n  "a": 1\n}' });
		expect(formatJson('{').ok).toBe(false);
	});
});

describe('lighthouse', () => {
	it('uses Lighthouse colour bands', () => {
		expect([getScoreTone(90), getScoreTone(89), getScoreTone(49)]).toEqual(['good', 'warn', 'bad']);
	});
	it('lists the four categories in order', () => {
		expect(lighthouseScores({ performance: 1, accessibility: 2, bestPractices: 3, seo: 4 }).map((s) => s.value)).toEqual([1, 2, 3, 4]);
		expect(lighthouseScores(undefined)).toEqual([]);
	});
});

describe('seo', () => {
	it('builds titles within 60 characters', () => {
		expect(buildTitle('Shahariar Niloy', 'Work')).toBe('Work — Shahariar Niloy');
		expect(buildTitle('Shahariar Niloy', 'x'.repeat(100)).length).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
	});
	it('builds descriptions within 155 characters', () => {
		expect(buildDescription('word '.repeat(80)).length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
	});
	it('strips inline Markdown', () => {
		expect(stripInline('See **[Work](/work)** and *this*')).toBe('See Work and this');
	});
});
