/**
 * now-freshness.mjs — an Astro integration that warns, without failing the build,
 * when the Now page hasn't been updated for more than 90 days.
 */
import { readFileSync } from 'node:fs';

const MAX_AGE_DAYS = 90;
const DAY_MS = 86_400_000;

/** @returns {import('astro').AstroIntegration} */
export default function nowFreshness() {
	return {
		name: 'now-freshness',
		hooks: {
			'astro:build:start': ({ logger }) => {
				const [now] = JSON.parse(readFileSync(new URL('../src/content/data/now.json', import.meta.url), 'utf8'));
				const days = Math.floor((Date.now() - new Date(now.updatedOn).getTime()) / DAY_MS);
				if (days > MAX_AGE_DAYS) logger.warn(`Now page is ${days} days old`);
			},
		},
	};
}
