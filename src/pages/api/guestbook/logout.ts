/**
 * POST /api/guestbook/logout — clears the session cookies.
 */
import type { APIRoute } from 'astro';

import { seeOther, wantsHtml } from '@/lib/guestbook/http';
import { DISPLAY_COOKIE, SESSION_COOKIE } from '@/lib/guestbook/session';

export const prerender = false;

export const POST: APIRoute = ({ cookies, request }) => {
	cookies.delete(SESSION_COOKIE, { path: '/' });
	cookies.delete(DISPLAY_COOKIE, { path: '/' });
	return wantsHtml(request) ? seeOther('/guestbook') : Response.json({ ok: true });
};
