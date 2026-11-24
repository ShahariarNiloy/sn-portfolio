/**
 * GET /api/guestbook/login — starts GitHub sign-in with state + PKCE (scope read:user).
 * The state and verifier ride in a short-lived signed cookie.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { readConfig } from '@/lib/guestbook/config';
import { buildAuthorizeUrl } from '@/lib/guestbook/github';
import { jsonError } from '@/lib/guestbook/http';
import { OAUTH_COOKIE, pkceChallenge, randomToken, sign } from '@/lib/guestbook/session';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	const config = readConfig(env, url.origin);
	if (!config) return jsonError(500, 'Sign-in is not configured.');
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
