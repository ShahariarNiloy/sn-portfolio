/**
 * env.d.ts — types for the Cloudflare bindings and secrets the Guestbook reads
 * from `cloudflare:workers`. Imports the module flavour of the Workers types so
 * they don't replace the DOM types the islands use.
 */
type D1Database = import('@cloudflare/workers-types/index.ts').D1Database;
type R2Bucket = import('@cloudflare/workers-types/index.ts').R2Bucket;

declare namespace Cloudflare {
	interface Env {
		DB: D1Database;
		FILES: R2Bucket;
		GITHUB_CLIENT_ID: string;
		GITHUB_CLIENT_SECRET: string;
		SESSION_SECRET: string;
		OWNER_GITHUB_ID: string;
		DEPLOY_HOOK_URL: string;
	}
}

declare module 'cloudflare:workers' {
	export const env: Cloudflare.Env;
}

// Plain `tsc` (part of `pnpm check`) can't read .astro files; `astro check` types them precisely.
declare module '*.astro' {
	const Component: import('astro/runtime/server/index.js').AstroComponentFactory;
	export default Component;
}
