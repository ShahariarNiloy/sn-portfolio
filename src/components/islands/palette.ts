/**
 * palette.ts — the command palette's dialog logic (WAI-ARIA combobox + listbox).
 * Imported on first open by CommandPalette.astro; never part of first load.
 */
import { filterEntries, moveSelection } from '@/lib/palette';
import type { PaletteEntry } from '@/lib/content';

import { trapFocus } from './_shared/focus';

/** Builds the palette once and returns the function that opens it from a trigger. */
export function createPalette(): (trigger: Element | null) => void {
	const dialog = document.querySelector<HTMLDialogElement>('#palette');
	const input = dialog?.querySelector<HTMLInputElement>('[data-palette-input]');
	const list = dialog?.querySelector<HTMLUListElement>('[data-palette-list]');
	const data = dialog?.querySelector('[data-palette-entries]')?.textContent;
	if (!dialog || !input || !list || !data) return () => undefined;

	const entries = JSON.parse(data) as PaletteEntry[];
	let shown: PaletteEntry[] = entries;
	let selected = 0;
	let returnTo: Element | null = null;
	trapFocus(dialog);

	function render(): void {
		if (!list || !input) return;
		list.replaceChildren(
			...shown.map((entry, i) => {
				const li = document.createElement('li');
				li.id = `palette-${i}`;
				li.role = 'option';
				li.ariaSelected = String(i === selected);
				li.className =
					'flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm text-prose aria-selected:bg-card2 aria-selected:text-fg';
				const label = document.createElement('span');
				label.textContent = entry.label;
				const group = document.createElement('span');
				group.className = 'font-mono text-xs text-mut';
				group.textContent = entry.group;
				li.append(label, group);
				li.addEventListener('click', () => go(i));
				return li;
			}),
		);
		if (shown.length === 0) {
			const empty = document.createElement('li');
			empty.className = 'px-3.5 py-2.5 text-sm text-mut';
			empty.textContent = 'No page matches';
			list.append(empty);
		}
		input.setAttribute('aria-activedescendant', shown.length ? `palette-${selected}` : '');
		list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
	}

	function go(i: number): void {
		const entry = shown[i];
		if (!entry) return;
		dialog?.close();
		if (/^https?:/.test(entry.href)) window.open(entry.href, '_blank', 'noopener');
		else window.location.href = entry.href;
	}

	input.addEventListener('input', () => {
		selected = 0;
		shown = filterEntries(entries, input.value);
		render();
	});
	input.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			selected = moveSelection(selected, event.key, shown.length);
			render();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			go(selected);
		}
	});
	// A click on the backdrop (outside the panel) closes the dialog.
	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) dialog.close();
	});
	dialog.addEventListener('close', () => {
		if (returnTo instanceof HTMLElement) returnTo.focus();
	});

	return (trigger) => {
		if (dialog.open) {
			dialog.close();
			return;
		}
		returnTo = trigger;
		input.value = '';
		shown = entries;
		selected = 0;
		render();
		dialog.showModal();
		input.focus();
	};
}
