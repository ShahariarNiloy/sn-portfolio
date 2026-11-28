/**
 * POST /api/guestbook/moderate — owner only. Approves, rejects or deletes one note
 * (only a rejected one can be deleted). When that changes the wall, it triggers a
 * rebuild, because /guestbook is static.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { readConfig } from '@/lib/guestbook/config';
import { deleteRejectedNote, getNoteStatus, setNoteStatus } from '@/lib/guestbook/db';
import { jsonError, seeOther, wantsHtml } from '@/lib/guestbook/http';
import { moderateBodySchema } from '@/lib/guestbook/schema';
import { readSession, SESSION_COOKIE } from '@/lib/guestbook/session';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, url }) => {
	const config = readConfig(env, url.origin);
	if (!config) return jsonError(500, 'The guestbook is not configured.');
	const session = await readSession(cookies.get(SESSION_COOKIE)?.value, config.sessionSecret);
	if (!session) return jsonError(401, 'Sign in with GitHub first.');
	if (session.githubId !== config.ownerGithubId) return jsonError(403, 'Only the owner can moderate notes.');

	const isForm = wantsHtml(request);
	const raw = isForm ? Object.fromEntries(await request.formData()) : await request.json().catch(() => null);
	const parsed = moderateBodySchema.safeParse(raw);
	if (!parsed.success) return jsonError(400, 'Choose a note and a decision.');

	const { id, status } = parsed.data;
	const before = await getNoteStatus(env.DB, id);
	if (!before) return jsonError(404, 'That note no longer exists.');
	if (status === 'deleted') {
		if (!(await deleteRejectedNote(env.DB, id))) return jsonError(409, 'Reject the note before deleting it.');
	} else {
		await setNoteStatus(env.DB, id, status);
	}

	const hasWallChanged = before !== status && (before === 'approved' || status === 'approved');
	// A missing hook counts as a failed rebuild, so the admin page says the wall is stale instead of staying quiet.
	const isRebuilding = !hasWallChanged || (config.deployHookUrl !== '' && (await startRebuild(config.deployHookUrl)));
	return isForm
		? seeOther(isRebuilding ? '/guestbook/admin' : '/guestbook/admin?rebuild=failed')
		: Response.json({ ok: true, rebuild: isRebuilding ? 'ok' : 'failed' });
};

/** Calls the Cloudflare deploy hook; false when it refuses or can't be reached. */
async function startRebuild(hookUrl: string): Promise<boolean> {
	const response = await fetch(hookUrl, { method: 'POST' }).catch(() => null);
	return response?.ok ?? false;
}
