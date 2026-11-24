/**
 * GET /api/guestbook/callback — GitHub redirects here. Verifies state, exchanges
 * the code (with the PKCE verifier), reads the user's id and name, and sets the
 * signed, HttpOnly, Secure, SameSite=Lax session cookie for 7 days.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { readConfig } from '@/lib/guestbook/config';
import { exchangeCode, fetchUser } from '@/lib/guestbook/github';
import { jsonError } from '@/lib/guestbook/http';
import { DISPLAY_COOKIE, OAUTH_COOKIE, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, sign, verify } from '@/lib/guestbook/session';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	const config = readConfig(env, url.origin);
	if (!config) return jsonError(500, 'Sign-in is not configured.');
	const saved = (await verify(cookies.get(OAUTH_COOKIE)?.value, config.sessionSecret)) as { state?: string; codeVerifier?: string } | null;
	cookies.delete(OAUTH_COOKIE, { path: '/api/guestbook' });
	const code = url.searchParams.get('code');
	if (!saved?.state || !saved.codeVerifier || !code || url.searchParams.get('state') !== saved.state) {
		return jsonError(400, 'Sign-in expired or was tampered with. Please try again.');
	}
	const token = await exchangeCode(config.app, { code, codeVerifier: saved.codeVerifier });
	const user = token ? await fetchUser(token) : null;
	if (!user) return jsonError(502, 'GitHub sign-in failed. Please try again.');
	const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
	const options = { secure: true, sameSite: 'lax', path: '/', maxAge: SESSION_MAX_AGE_SECONDS } as const;
	cookies.set(SESSION_COOKIE, await sign({ githubId: user.id, githubName: user.name, expiresAt }, config.sessionSecret), { ...options, httpOnly: true });
	// Readable by the page only to show "Signed in as …"; it grants nothing. Astro URL-encodes the value itself.
	cookies.set(DISPLAY_COOKIE, user.name, options);
	return redirect('/guestbook#sign', 302);
};
