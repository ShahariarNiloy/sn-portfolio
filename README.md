# shahariarniloy.com

Portfolio of Shahariar Niloy — a dark-only, near-zero-JavaScript Astro site that
follows the "Portfolio PRD — shahariarniloy.com (Astro build)" and the V2 mockup.

## Stack

Astro 7 (static, with on-demand rendering only for the Guestbook), Tailwind CSS v4
(theme in `src/styles/global.css`), MDX content collections, vanilla TypeScript
islands, Cloudflare Workers + D1 (Guestbook) + R2 (CV PDF). Node 24, pnpm.

## Scripts

| Script                   | Runs                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `pnpm dev`               | Astro dev server (local D1 through wrangler)                                             |
| `pnpm check`             | `astro check` + `tsc --noEmit`                                                           |
| `pnpm lint`              | ESLint + Prettier check                                                                  |
| `pnpm test`              | Vitest unit tests for `src/lib`                                                          |
| `pnpm e2e`               | Playwright + axe on every route at 390, 768 and 1440 px                                  |
| `pnpm lhci`              | Lighthouse CI budgets against the production build                                       |
| `pnpm build`             | Production build (`dist/client` static, `dist/server` worker)                            |
| `pnpm db:migrate:local`  | Apply D1 migrations locally                                                              |
| `pnpm db:migrate:remote` | Apply D1 migrations in production (the Cloudflare build does this)                       |
| `pnpm guestbook:pull`    | Copies live Guestbook notes into a fresh local D1 so the build can bake in approved ones |

`pnpm e2e` and `pnpm lhci` serve the build with `astro preview`; run `pnpm build` first.
Astro runs one preview server per project — if one is already running, set
`PREVIEW_PORT` to its port.

## Content

Everything visible lives in `src/content` and is validated by
`src/content.config.ts`:

- `blog/*.mdx` — posts (`status: draft` posts are never built in production)
- `projects/*.mdx`, `highlights/*.mdx` — case studies
- `essays/*.md` — Off the clock
- `data/*.json` — site, now, uses, stack, timeline, quotes

Adding a post, project or highlight is one new file.

## Guestbook setup

1. Create a GitHub OAuth app; callback `https://shahariarniloy.com/api/guestbook/callback`.
2. `wrangler d1 create guestbook` and put the id in `wrangler.jsonc`.
3. Set secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`,
   `OWNER_GITHUB_ID`, `DEPLOY_HOOK_URL` (`wrangler secret put …`). Locally, copy
   `.dev.vars.example` to `.dev.vars`.
4. Moderate at `/guestbook/admin`. Approving a note calls the deploy hook, which
   rebuilds the static `/guestbook` page.

## Deploying

Cloudflare Workers Builds deploys `main` (Settings → Builds of the Worker):

- Build command: `pnpm db:migrate:remote && pnpm guestbook:pull && pnpm build`
- Deploy command: `pnpm exec wrangler deploy --config dist/server/wrangler.json`
- API token: the default build permissions plus D1 Edit

A Deploy Hook for `main`, stored as `DEPLOY_HOOK_URL`, rebuilds after a note is approved.
