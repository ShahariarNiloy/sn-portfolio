/**
 * GET /api/guestbook/login — starts GitHub sign-in with state + PKCE (scope read:user),
 * always on the bare domain (www visitors are sent there first).
 * The state and verifier ride in a short-lived signed cookie.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { readConfig } from '@/lib/guestbook/config';
import { buildAuthorizeUrl } from '@/lib/guestbook/github';
import { signInError } from '@/lib/guestbook/http';
import { OAUTH_COOKIE, pkceChallenge, randomToken, sign } from '@/lib/guestbook/session';

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
	const state = randomToken();
	const codeVerifier = randomToken();
	cookies.set(OAUTH_COOKIE, await sign({ state, codeVerifier }, config.sessionSecret), {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/api/guestbook',
		maxAge: 600,
	});
	return redirect(buildAuthorizeUrl(config.app, { state, codeChallenge: await pkceChallenge(codeVerifier) }).href, 302);
};
