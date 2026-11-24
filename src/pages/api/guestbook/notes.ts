/**
 * POST /api/guestbook/notes — a signed-in visitor adds a note (1–140
 * characters, no links, up to three each), saved as pending review. Rate limited to 5 requests per
 * 10 minutes per GitHub id and per IP. Accepts the island's JSON or a plain form.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { readConfig } from '@/lib/guestbook/config';
import { insertPendingNote, isRateLimited } from '@/lib/guestbook/db';
import { jsonError, seeOther, wantsHtml } from '@/lib/guestbook/http';
import { MAX_NOTES_PER_PERSON, noteBodySchema } from '@/lib/guestbook/schema';
import { readSession, SESSION_COOKIE } from '@/lib/guestbook/session';

export const prerender = false;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export const POST: APIRoute = async ({ request, cookies, url, clientAddress }) => {
	const config = readConfig(env, url.origin);
	if (!config) return jsonError(500, 'The guestbook is not configured.');
	const session = await readSession(cookies.get(SESSION_COOKIE)?.value, config.sessionSecret);
	const isForm = wantsHtml(request);
	if (!session) return isForm ? seeOther('/api/guestbook/login') : jsonError(401, 'Sign in with GitHub first.');

	const raw = isForm ? Object.fromEntries(await request.formData()) : await request.json().catch(() => null);
	const parsed = noteBodySchema.safeParse(raw);
	if (!parsed.success) return jsonError(400, parsed.error.issues[0]?.message ?? 'That note could not be saved.');

	const limited = await isRateLimited(env.DB, { keys: [`gh:${session.githubId}`, `ip:${clientAddress}`], limit: RATE_LIMIT, windowMs: RATE_WINDOW_MS });
	if (limited) return jsonError(429, 'Too many notes at once. Try again in a few minutes.');

	const isSaved = await insertPendingNote(env.DB, { githubId: session.githubId, githubName: session.githubName, body: parsed.data.body }, MAX_NOTES_PER_PERSON);
	if (!isSaved) return jsonError(409, `You've already left ${MAX_NOTES_PER_PERSON} notes. Thank you!`);

	return isForm ? seeOther('/guestbook?note=pending#sign') : Response.json({ status: 'pending' }, { status: 201 });
};
