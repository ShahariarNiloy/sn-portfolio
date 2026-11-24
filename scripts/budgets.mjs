/**
 * budgets.mjs — checks the PRD's size budgets on the built site and prints a
 * Markdown table (also written to budgets.md for the PR comment). Exits 1 when
 * any page's HTML, CSS or first-load JS is over budget, gzipped.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = 'dist/client';
const BUDGET = { html: 30 * 1024, css: 15 * 1024, js: 15 * 1024 };
const gz = (file) => gzipSync(readFileSync(file)).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

function htmlFiles(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) return htmlFiles(path);
		return name.endsWith('.html') ? [path] : [];
	});
}

let failed = false;
const rows = htmlFiles(ROOT).map((file) => {
	const html = readFileSync(file, 'utf8');
	const assets = (pattern) => [...html.matchAll(pattern)].map((m) => join(ROOT, m[1]));
	const css = assets(/<link[^>]+rel="stylesheet"[^>]+href="(\/[^"]+\.css)"/g).reduce((sum, f) => sum + gz(f), 0);
	const js = assets(/<script[^>]+type="module"[^>]+src="(\/[^"]+\.js)"/g).reduce((sum, f) => sum + gz(f), 0);
	const page = gz(file);
	const over = page > BUDGET.html || css > BUDGET.css || js > BUDGET.js;
	failed ||= over;
	return `| ${over ? '❌' : '✅'} /${relative(ROOT, file).replace(/(index)?\.html$/, '')} | ${kb(page)} | ${kb(css)} | ${kb(js)} |`;
});

const table = ['| Page | HTML | CSS | JS |', '| --- | --- | --- | --- |', ...rows].join('\n');
writeFileSync('budgets.md', `### Bundle sizes (gzipped)\n\n${table}\n`);
process.stdout.write(`${table}\n`);
process.exit(failed ? 1 : 0);
