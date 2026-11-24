/**
 * focus.ts — keyboard and focus helpers shared by the islands (the palette's
 * focus trap). Imported, never copied.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keeps Tab and Shift+Tab inside `container`. Returns a function that removes the trap. */
export function trapFocus(container: HTMLElement): () => void {
	function onKeydown(event: KeyboardEvent): void {
		if (event.key !== 'Tab') return;
		const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)];
		const first = items[0];
		const last = items.at(-1);
		if (!first || !last) return;
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
	container.addEventListener('keydown', onKeydown);
	return () => container.removeEventListener('keydown', onKeydown);
}

/** Runs `task` when the browser is idle, falling back to a timeout where idle callbacks don't exist. */
export function whenIdle(task: () => void): void {
	if ('requestIdleCallback' in window) window.requestIdleCallback(task, { timeout: 2000 });
	else setTimeout(task, 200);
}

/** Runs `task` once `element` scrolls into view (or immediately without IntersectionObserver). */
export function whenVisible(element: Element, task: () => void): void {
	if (!('IntersectionObserver' in window)) {
		task();
		return;
	}
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				observer.disconnect();
				task();
			}
		},
		{ threshold: 0.15 },
	);
	observer.observe(element);
}
