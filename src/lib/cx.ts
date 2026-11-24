/**
 * cx.ts — joins class names, skipping falsy values. Used by components whose
 * classes change with props, so templates never concatenate strings.
 */

/** A class name, or a falsy value to skip. */
export type ClassValue = string | false | null | undefined;

/** Joins the truthy class names with single spaces. */
export function cx(...values: ClassValue[]): string {
	return values.filter(Boolean).join(' ');
}
