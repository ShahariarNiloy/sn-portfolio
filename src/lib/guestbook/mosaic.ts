/**
 * mosaic.ts — turns a GitHub id into a small mirrored mosaic, the Guestbook's
 * stand-in for a profile picture: always the same for one person, needs no
 * download, and the id can't be read back from it. Pure; drawn by Mosaic.astro.
 */

/** Cells per side. */
export const MOSAIC_SIZE = 5;

/** The theme colours a mosaic may take. */
export const MOSAIC_TONES = ['acc', 'good', 'warn', 'bad', 'ill'] as const;

/** One of the mosaic colours. */
export type MosaicTone = (typeof MOSAIC_TONES)[number];

/** A mosaic ready to draw. */
export interface Mosaic {
	tone: MosaicTone;
	/** Filled cells as [column, row]. */
	cells: [number, number][];
}

/** Scrambles an integer so neighbouring ids look unrelated (the splitmix32 finaliser). */
function scramble(value: number): number {
	let x = (value + 0x9e3779b9) | 0;
	x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
	x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
	return (x ^ (x >>> 15)) >>> 0;
}

/** The mosaic for a GitHub id: 7 to 11 of the 15 left-half cells filled, then mirrored. */
export function buildMosaic(githubId: number): Mosaic {
	const half = Math.ceil(MOSAIC_SIZE / 2);
	const order = Array.from({ length: half * MOSAIC_SIZE }, (_, i) => ({ i, rank: scramble(githubId * 31 + i) })).sort((a, b) => a.rank - b.rank);
	const filled = order.slice(0, 7 + (scramble(githubId) % 5));
	const cells = filled.flatMap(({ i }): [number, number][] => {
		const column = i % half;
		const row = Math.floor(i / half);
		const mirror = MOSAIC_SIZE - 1 - column;
		return mirror === column
			? [[column, row]]
			: [
					[column, row],
					[mirror, row],
				];
	});
	return { tone: MOSAIC_TONES[scramble(githubId ^ 0x5bd1e995) % MOSAIC_TONES.length] ?? 'acc', cells };
}
