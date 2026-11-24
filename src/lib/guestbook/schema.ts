/**
 * schema.ts — Zod schemas for every Guestbook request body, and the note rules
 * (trimmed, 1–140 characters, no links). Used by the API routes and the form island.
 */
import { z } from 'astro/zod';

/** Most notes one person may have waiting or on the wall; rejected ones don't count. */
export const MAX_NOTES_PER_PERSON = 3;

/** Longest note a visitor may leave. */
export const MAX_NOTE_LENGTH = 140;

const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|dev|app|me|co|ly|xyz)\b)/i;

/** True when the text looks like it holds a link. */
export function hasLink(text: string): boolean {
	return LINK.test(text);
}

/** A note as submitted. */
export const noteBodySchema = z.object({
	body: z
		.string()
		.trim()
		.min(1, 'Write something first.')
		.max(MAX_NOTE_LENGTH, `Keep it to ${MAX_NOTE_LENGTH} characters.`)
		.refine((text) => !hasLink(text), 'Links are not allowed.'),
});

/** The owner's decision for one note; only a rejected note can be deleted. */
export const moderateBodySchema = z.object({
	id: z.uuid(),
	status: z.enum(['approved', 'rejected', 'deleted']),
});

/** What the owner can decide for a note. */
export type ModerationDecision = z.infer<typeof moderateBodySchema>['status'];

/** A note's moderation state. */
export type NoteStatus = 'pending' | 'approved' | 'rejected';
