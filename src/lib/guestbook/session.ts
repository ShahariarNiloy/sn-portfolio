/**
 * session.ts — the signed Guestbook session cookie (HMAC-SHA256 over a small
 * JSON payload) and the short-lived OAuth state cookie. Pure WebCrypto, so it
 * runs on Workers and in unit tests.
 */

/** Who is signed in. */
export interface Session {
	githubId: number;
	githubName: string;
	/** Expiry, Unix time in milliseconds. */
	expiresAt: number;
}

/** Name of the HttpOnly session cookie. */
export const SESSION_COOKIE = 'gb_session';
/** Name of the readable cookie that only tells the page whose name to show. */
export const DISPLAY_COOKIE = 'gb_name';
/** Name of the OAuth state + PKCE verifier cookie. */
export const OAUTH_COOKIE = 'gb_oauth';
/** Session lifetime: 7 days. */
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
	let binary = '';
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> {
	const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
	return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getKey(secret: string): Promise<CryptoKey> {
	return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

/** Signs any JSON value into "<payload>.<signature>". */
export async function sign(value: unknown, secret: string): Promise<string> {
	const payload = toBase64Url(encoder.encode(JSON.stringify(value)));
	const signature = await crypto.subtle.sign('HMAC', await getKey(secret), encoder.encode(payload));
	return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Verifies a token from `sign` and returns its value, or null if it was tampered with. */
export async function verify(token: string | undefined, secret: string): Promise<unknown> {
	if (!token) return null;
	const [payload, signature] = token.split('.');
	if (!payload || !signature) return null;
	try {
		const ok = await crypto.subtle.verify('HMAC', await getKey(secret), fromBase64Url(signature), encoder.encode(payload));
		return ok ? (JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as unknown) : null;
	} catch {
		return null;
	}
}

/** Reads a session token; null when missing, forged or expired. */
export async function readSession(token: string | undefined, secret: string, now = Date.now()): Promise<Session | null> {
	const value = await verify(token, secret);
	if (!value || typeof value !== 'object') return null;
	const s = value as Partial<Session>;
	if (typeof s.githubId !== 'number' || typeof s.githubName !== 'string' || typeof s.expiresAt !== 'number') return null;
	return s.expiresAt > now ? { githubId: s.githubId, githubName: s.githubName, expiresAt: s.expiresAt } : null;
}

/** Random URL-safe string, for OAuth state and PKCE verifiers. */
export function randomToken(bytes = 32): string {
	return toBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/** The PKCE S256 challenge for a verifier. */
export async function pkceChallenge(verifier: string): Promise<string> {
	return toBase64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(verifier))));
}
