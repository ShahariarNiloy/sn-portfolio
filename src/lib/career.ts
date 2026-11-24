/**
 * career.ts — the Career card's summary line, computed from career.json:
 * "In production since Feb 2022 · 2 companies · 5 roles". Pure, unit-tested.
 */
import { formatYearMonth } from './format';

/** The parts of a company entry the summary reads. */
export interface CareerCompany {
	from: string;
	roles: { from: string }[];
}

/** The earliest start (YYYY-MM) and the company and role counts. */
export function summarizeCareer(companies: readonly CareerCompany[]): { since: string | undefined; companies: number; roles: number } {
	const starts = companies.flatMap((c) => [c.from, ...c.roles.map((r) => r.from)]).sort();
	return { since: starts[0], companies: companies.length, roles: companies.reduce((n, c) => n + c.roles.length, 0) };
}

/** "1 company" / "2 companies". */
function plural(n: number, one: string, many: string): string {
	return `${n} ${n === 1 ? one : many}`;
}

/** The summary as shown on the card. */
export function formatCareerSummary(companies: readonly CareerCompany[]): string {
	const { since, companies: count, roles } = summarizeCareer(companies);
	const parts = [plural(count, 'company', 'companies'), plural(roles, 'role', 'roles')];
	return since ? [`In production since ${formatYearMonth(since)}`, ...parts].join(' · ') : parts.join(' · ');
}
