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

/** A 303 redirect, so a form POST lands on a GET. */
export function seeOther(location: string, headers: HeadersInit = {}): Response {
	return new Response(null, { status: 303, headers: { Location: location, ...headers } });
}
