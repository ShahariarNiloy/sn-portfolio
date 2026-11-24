// ESLint: TypeScript (type-aware) + Astro rules, plus the PRD's code rules
// (no any, no console, no ts-ignore). Run with `pnpm lint`.
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
	{ ignores: ['dist/', '.astro/', '.wrangler/', 'node_modules/', 'playwright-report/', 'test-results/', '.lighthouseci/'] },
	js.configs.recommended,
	...tseslint.configs.strict,
	...astro.configs.recommended,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-console': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': true, 'ts-expect-error': 'allow-with-description' }],
			'@typescript-eslint/consistent-type-imports': 'error',
		},
	},
	{
		// Ambient declaration files must stay scripts (no top-level imports), so they use import() types.
		files: ['**/*.d.ts'],
		rules: { '@typescript-eslint/consistent-type-imports': 'off' },
	},
);
