/**
 * lifecycle.ts — the one way islands start. `onPageLoad(fn)` runs `fn` once the
 * page is ready, today on first load; if Astro's <ClientRouter /> is switched on
 * later, it also re-runs after every client-side navigation (astro:page-load),
 * so no island needs changing.
 */

/** True when Astro's client router is on the page (it fires astro:page-load itself, first load included). */
function hasClientRouter(): boolean {
	return document.querySelector('meta[name="astro-view-transitions-enabled"]') !== null;
}

/** Runs `fn` now and after each client-side navigation, if the router is ever enabled. */
export function onPageLoad(fn: () => void): void {
	document.addEventListener('astro:page-load', fn);
	// Without the router astro:page-load never fires, so run on this first load ourselves.
	if (!hasClientRouter()) fn();
}
