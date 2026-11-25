/** Unit tests for lib/format.ts. */
import { describe, expect, it } from 'vitest';

import { formatDay, formatMonth, formatPageWeight, parseInline } from '@/lib/format';

describe('dates', () => {
	it('formats in UTC', () => {
		const date = new Date('2026-11-23T23:30:00Z');
		expect(formatMonth(date)).toBe('Nov 2026');
		expect(formatDay(date)).toBe('23 Nov 2026');
	});
});

describe('parseInline', () => {
	it('parses bold, italics, links, bold links and breaks', () => {
		expect(parseInline('a **b** *c* [d](/d) **[e](/e)**\\\nf')).toEqual([
			{ kind: 'text', text: 'a ' },
			{ kind: 'strong', text: 'b' },
			{ kind: 'text', text: ' ' },
			{ kind: 'em', text: 'c' },
			{ kind: 'text', text: ' ' },
			{ kind: 'link', text: 'd', href: '/d', strong: false },
			{ kind: 'text', text: ' ' },
			{ kind: 'link', text: 'e', href: '/e', strong: true },
			{ kind: 'break' },
			{ kind: 'text', text: 'f' },
		]);
	});
	it('leaves HTML as text', () => {
		expect(parseInline('<b>x</b>')).toEqual([{ kind: 'text', text: '<b>x</b>' }]);
	});
});

describe('formatPageWeight', () => {
	it('prints size and time', () => {
		expect(formatPageWeight(38 * 1024, 420)).toBe('38 KB · 0.42s to load');
		expect(formatPageWeight(0, 1000)).toBe('1.00s to load');
	});
});
