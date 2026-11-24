/**
 * github.ts — GitHub OAuth for Guestbook sign-in (authorization code + PKCE,
 * scope read:user). Written against GitHub's documented endpoints with fetch,
 * instead of the arctic library, which npm now marks as no longer supported.
 */

/** OAuth app credentials, from Cloudflare secrets. */
export interface GitHubApp {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

/** The GitHub user a sign-in resolves to. */
export interface GitHubUser {
	id: number;
	name: string;
}

/** The URL that starts sign-in on github.com. */
export function buildAuthorizeUrl(app: GitHubApp, options: { state: string; codeChallenge: string }): URL {
	const url = new URL('https://github.com/login/oauth/authorize');
	url.searchParams.set('client_id', app.clientId);
	url.searchParams.set('redirect_uri', app.redirectUri);
	url.searchParams.set('scope', 'read:user');
	url.searchParams.set('state', options.state);
	url.searchParams.set('code_challenge', options.codeChallenge);
	url.searchParams.set('code_challenge_method', 'S256');
	url.searchParams.set('allow_signup', 'false');
	return url;
}

/** Exchanges the callback's code for an access token; null when GitHub refuses. */
export async function exchangeCode(app: GitHubApp, options: { code: string; codeVerifier: string }): Promise<string | null> {
	const response = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: app.clientId,
			client_secret: app.clientSecret,
			code: options.code,
			redirect_uri: app.redirectUri,
			code_verifier: options.codeVerifier,
		}),
	});
	if (!response.ok) return null;
	const data = (await response.json()) as { access_token?: unknown };
	return typeof data.access_token === 'string' ? data.access_token : null;
}

/** Reads the signed-in user's id and display name. */
export async function fetchUser(accessToken: string): Promise<GitHubUser | null> {
	const response = await fetch('https://api.github.com/user', {
		headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json', 'User-Agent': 'shahariarniloy.com-guestbook' },
	});
	if (!response.ok) return null;
	const user = (await response.json()) as { id?: unknown; name?: unknown; login?: unknown };
	if (typeof user.id !== 'number' || typeof user.login !== 'string') return null;
	return { id: user.id, name: typeof user.name === 'string' && user.name.trim() ? user.name.trim() : user.login };
}
