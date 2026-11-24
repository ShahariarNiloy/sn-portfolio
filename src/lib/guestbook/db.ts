/**
 * db.ts — every D1 query the Guestbook makes: notes and rate-limit attempts.
 * Takes the D1 binding as an argument so routes and tests can pass their own.
 */
import type { D1Database } from '@cloudflare/workers-types/index.ts';

import type { NoteStatus } from './schema';

/** A note as stored. */
export interface Note {
	id: string;
	/** Never shown; only seeds the visitor's mosaic. */
	githubId: number;
	githubName: string;
	body: string;
	status: NoteStatus;
	createdAt: string;
}

interface NoteRow {
	id: string;
	github_id: number;
	github_name: string;
	body: string;
	status: NoteStatus;
	created_at: string;
}

const toNote = (row: NoteRow): Note => ({
	id: row.id,
	githubId: row.github_id,
	githubName: row.github_name,
	body: row.body,
	status: row.status,
	createdAt: row.created_at,
});

/** Notes in one state: waiting ones oldest first (a queue), the rest newest first. */
export async function listNotes(db: D1Database, status: NoteStatus): Promise<Note[]> {
	const { results } = await db
		.prepare(
			`SELECT id, github_id, github_name, body, status, created_at FROM notes WHERE status = ?1 ORDER BY created_at ${status === 'pending' ? 'ASC' : 'DESC'}`,
		)
		.bind(status)
		.all<NoteRow>();
	return results.map(toNote);
}

/** Saves a note as pending review. Returns false when the visitor already has `limit` notes waiting or approved. */
export async function insertPendingNote(db: D1Database, note: { githubId: number; githubName: string; body: string }, limit: number): Promise<boolean> {
	// Counted inside the insert, so two posts at once can't both slip under the limit.
	const result = await db
		.prepare(
			`INSERT INTO notes (id, github_id, github_name, body, status) SELECT ?1, ?2, ?3, ?4, 'pending'
			 WHERE (SELECT COUNT(*) FROM notes WHERE github_id = ?2 AND status <> 'rejected') < ?5`,
		)
		.bind(crypto.randomUUID(), note.githubId, note.githubName, note.body, limit)
		.run();
	return result.meta.changes > 0;
}

/** One note's state, or null when no note has that id. */
export async function getNoteStatus(db: D1Database, id: string): Promise<NoteStatus | null> {
	const row = await db.prepare('SELECT status FROM notes WHERE id = ?1').bind(id).first<{ status: NoteStatus }>();
	return row?.status ?? null;
}

/** Sets one note's status. */
export async function setNoteStatus(db: D1Database, id: string, status: NoteStatus): Promise<void> {
	await db.prepare('UPDATE notes SET status = ?1 WHERE id = ?2').bind(status, id).run();
}

/** Deletes a note for good. Only a rejected one: returns false for any other. */
export async function deleteRejectedNote(db: D1Database, id: string): Promise<boolean> {
	const result = await db.prepare("DELETE FROM notes WHERE id = ?1 AND status = 'rejected'").bind(id).run();
	return result.meta.changes > 0;
}

/** Records an attempt for each key and reports whether any key is over `limit` within `windowMs`. */
export async function isRateLimited(db: D1Database, options: { keys: string[]; limit: number; windowMs: number; now?: number }): Promise<boolean> {
	const now = options.now ?? Date.now();
	const since = now - options.windowMs;
	await db.prepare('DELETE FROM note_attempts WHERE at < ?1').bind(since).run();
	for (const key of options.keys) {
		const row = await db.prepare('SELECT COUNT(*) AS n FROM note_attempts WHERE key = ?1 AND at >= ?2').bind(key, since).first<{ n: number }>();
		if ((row?.n ?? 0) >= options.limit) return true;
	}
	await db.batch(options.keys.map((key) => db.prepare('INSERT INTO note_attempts (key, at) VALUES (?1, ?2)').bind(key, now)));
	return false;
}
