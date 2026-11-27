/**
 * stack.ts — the Stack groups, shared by /stack and Home so both say the same thing:
 * what I use every day, what else I have shipped to production, and what I'm learning.
 */

/** The groups, in display order, with their headings. */
export const STACK_GROUPS = [
	{ id: 'core', label: 'Core, every day' },
	{ id: 'production', label: 'Shipped with' },
	{ id: 'learning', label: 'Learning' },
] as const;
