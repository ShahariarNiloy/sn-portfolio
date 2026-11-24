/** Unit tests for the Guestbook's validation and signed sessions. */
import { describe, expect, it } from 'vitest';

import { MAX_NOTE_LENGTH, moderateBodySchema, noteBodySchema } from '@/lib/guestbook/schema';
import { pkceChallenge, readSession, sign } from '@/lib/guestbook/session';

const SECRET = 'test-secret-that-is-long-enough-123456';

describe('note validation', () => {
	it('trims and accepts up to 140 characters', () => {
		expect(noteBodySchema.parse({ body: '  hello  ' }).body).toBe('hello');
		expect(noteBodySchema.safeParse({ body: 'x'.repeat(MAX_NOTE_LENGTH) }).success).toBe(true);
	});
	it('rejects empty, over-long and linked notes', () => {
		expect(noteBodySchema.safeParse({ body: '   ' }).success).toBe(false);
		expect(noteBodySchema.safeParse({ body: 'x'.repeat(MAX_NOTE_LENGTH + 1) }).success).toBe(false);
		expect(noteBodySchema.safeParse({ body: 'visit https://spam.example' }).success).toBe(false);
		expect(noteBodySchema.safeParse({ body: 'see spam.com now' }).success).toBe(false);
	});
	it('only accepts approve or reject for a uuid', () => {
		expect(moderateBodySchema.safeParse({ id: crypto.randomUUID(), status: 'approved' }).success).toBe(true);
		expect(moderateBodySchema.safeParse({ id: 'nope', status: 'approved' }).success).toBe(false);
		expect(moderateBodySchema.safeParse({ id: crypto.randomUUID(), status: 'pending' }).success).toBe(false);
	});
});

describe('sessions', () => {
	const session = { githubId: 1, githubName: 'Ada', expiresAt: Date.now() + 60_000 };
	it('round-trips a signed session', async () => {
		expect(await readSession(await sign(session, SECRET), SECRET)).toEqual(session);
	});
	it('rejects tampered, wrongly signed and expired tokens', async () => {
		const token = await sign(session, SECRET);
		const forged = `${btoa(JSON.stringify({ ...session, githubId: 2 })).replace(/=+$/, '')}.${token.split('.')[1]}`;
		expect(await readSession(forged, SECRET)).toBeNull();
		expect(await readSession(token, `${SECRET}x`)).toBeNull();
		expect(await readSession(await sign({ ...session, expiresAt: 1 }, SECRET), SECRET)).toBeNull();
		expect(await readSession(undefined, SECRET)).toBeNull();
	});
	it('builds an S256 PKCE challenge (base64url SHA-256, no padding)', async () => {
		// Expected value computed independently with Python's hashlib + base64.urlsafe_b64encode.
		expect(await pkceChallenge('dBjftJeZ4CVP-mJ92K1qhLRcaqrjR1aIFMw8l1Mh0Ss')).toBe('mCMdgvy8Ma0ZuRUlAk1WICPIgK4bdN-koX7iZ4B9LWE');
	});
});
