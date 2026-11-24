/**
 * json.ts — the JSON formatter behind the utilyx "Try one here" island.
 * Pure and synchronous so it can be unit-tested and timed.
 */

/** The result of formatting: pretty JSON, or the parser's error message. */
export type FormatResult = { ok: true; output: string } | { ok: false; error: string };

/** Pretty-prints JSON with two-space indentation. */
export function formatJson(source: string): FormatResult {
	try {
		return { ok: true, output: JSON.stringify(JSON.parse(source), null, 2) };
	} catch (error) {
		return { ok: false, error: error instanceof Error ? error.message : String(error) };
	}
}
