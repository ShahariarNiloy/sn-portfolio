/**
 * http.ts — small response helpers for the Guestbook routes: JSON errors with the
 * right status (never a stack trace) and form-friendly redirects.
 */

/** JSON `{ error }` with a status code. */
export function jsonError(status: number, error: string): Response {
	return Response.json({ error }, { status });
}

/** True when the request came from a plain HTML form rather than the island's fetch. */
export function wantsHtml(request: Request): boolean {
	return !(request.headers.get('Accept') ?? '').includes('application/json');
}

/** Why a GitHub sign-in did not finish; each has its own message on /guestbook/sign-in-error. */
export const SIGN_IN_ERRORS = ['expired', 'denied', 'github', 'config'] as const;
export type SignInError = (typeof SIGN_IN_ERRORS)[number];

/**
 * Sends a browser that was mid sign-in to the friendly error page. The sign-in
 * routes are full-page navigations, so a JSON body would show up as raw text.
 */
export function signInError(reason: SignInError): Response {
	return new Response(null, {
		status: 302,
		headers: { Location: `/guestbook/sign-in-error?reason=${reason}`, 'Cache-Control': 'no-store' },
	});
}

/** A 303 redirect, so a form POST lands on a GET. */
export function seeOther(location: string, headers: HeadersInit = {}): Response {
	return new Response(null, { status: 303, headers: { Location: location, ...headers } });
}
