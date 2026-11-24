-- db/migrations/0002_note_attempts.sql
-- Rate limiting for POST /api/guestbook/notes: one row per attempt, keyed by
-- "gh:<github id>" and "ip:<address>". Rows older than the window are pruned.
CREATE TABLE note_attempts (
  key TEXT NOT NULL,
  at  INTEGER NOT NULL                        -- Unix time in milliseconds
);
CREATE INDEX note_attempts_key_at ON note_attempts (key, at);
