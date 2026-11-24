/**
 * approved.ts — the approved notes as static pages read them at build time.
 * Used by /guestbook and Home; a build without a reachable database (a fresh
 * checkout, CI without bindings) gets an empty wall instead of failing.
 */
import { env } from 'cloudflare:workers';

import { listNotes, type Note } from './db';

/** Approved notes, newest first. */
export async function getApprovedNotes(): Promise<Note[]> {
	return listNotes(env.DB, 'approved').catch(() => []);
}
