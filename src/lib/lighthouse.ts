/**
 * lighthouse.ts — turns Lighthouse scores into what the rings show: a label,
 * a value and Lighthouse's own colour band. Used by RingSet and MDX bodies.
 */

/** Lighthouse's colour bands: 90–100 good, 50–89 warn, 0–49 bad. */
export type ScoreTone = 'good' | 'warn' | 'bad';

/** One ring: what it measures and its score. */
export interface Score {
	label: string;
	value: number;
}

/** The four category scores of one Lighthouse run. */
export interface LighthouseScores {
	performance: number;
	accessibility: number;
	bestPractices: number;
	seo: number;
}

/** The colour band Lighthouse itself uses for a score. */
export function getScoreTone(value: number): ScoreTone {
	if (value >= 90) return 'good';
	if (value >= 50) return 'warn';
	return 'bad';
}

/** The four rings of a run, in Lighthouse's order. */
export function lighthouseScores(run: LighthouseScores | undefined): Score[] {
	if (!run) return [];
	return [
		{ label: 'Performance', value: run.performance },
		{ label: 'Accessibility', value: run.accessibility },
		{ label: 'Best practices', value: run.bestPractices },
		{ label: 'SEO', value: run.seo },
	];
}
