/**
 * GET /api/guestbook/login — starts GitHub sign-in with state + PKCE (scope read:user),
 * always on the bare domain (www visitors are sent there first). Repeat requests within
 * 10 minutes reuse the same state, so a link preload racing the real tap can't break it.
 * The state and verifier ride in a short-lived signed cookie.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { readConfig } from '@/lib/guestbook/config';
import { buildAuthorizeUrl } from '@/lib/guestbook/github';
import { signInError } from '@/lib/guestbook/http';
import { OAUTH_COOKIE, pkceChallenge, randomToken, sign, verify } from '@/lib/guestbook/session';

/** How long a started sign-in stays valid: the cookie's life and the reuse window. */
const OAUTH_MAX_AGE_SECONDS = 600;

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	// GitHub only accepts the callback registered for the bare domain. A visitor on www
	// would send a www callback and be refused, so restart sign-in on the bare domain,
	// where the state cookie and the session will live.
	if (url.hostname.startsWith('www.')) {
		const bare = new URL(url);
		bare.hostname = url.hostname.slice('www.'.length);
		return redirect(bare.href, 302);
	}
	const config = readConfig(env, url.origin);
	if (!config) return signInError('config', url.hostname);
	// Reuse a sign-in this browser started in the last 10 minutes. On phones a link
	// preload and the real tap can reach this route at the same moment; with a fresh
	// state each time, the later cookie overwrote the one GitHub's callback expected,
	// and sign-in failed as "expired". Reusing keeps both requests on one state.
	const pending = (await verify(cookies.get(OAUTH_COOKIE)?.value, config.sessionSecret)) as
		| { state?: unknown; codeVerifier?: unknown; startedAt?: unknown }
		| null;
	const reusable =
		typeof pending?.state === 'string' &&
		typeof pending.codeVerifier === 'string' &&
		typeof pending.startedAt === 'number' &&
		Date.now() - pending.startedAt < OAUTH_MAX_AGE_SECONDS * 1000;
	const state = reusable ? (pending.state as string) : randomToken();
	const codeVerifier = reusable ? (pending.codeVerifier as string) : randomToken();
	const startedAt = reusable ? (pending.startedAt as number) : Date.now();
	cookies.set(OAUTH_COOKIE, await sign({ state, codeVerifier, startedAt }, config.sessionSecret), {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/api/guestbook',
		maxAge: OAUTH_MAX_AGE_SECONDS,
	});
	return redirect(buildAuthorizeUrl(config.app, { state, codeChallenge: await pkceChallenge(codeVerifier) }).href, 302);
};
