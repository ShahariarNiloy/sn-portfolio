-- db/migrations/0003_several_notes.sql
-- Several notes per GitHub account (the limit lives in lib/guestbook/schema.ts).
-- SQLite can't drop a UNIQUE column constraint, so the table is rebuilt.
CREATE TABLE notes_new (
  id          TEXT PRIMARY KEY,               -- crypto.randomUUID()
  github_id   INTEGER NOT NULL,
  github_name TEXT NOT NULL,                  -- display name at time of writing
  body        TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 140),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO notes_new (id, github_id, github_name, body, status, created_at)
  SELECT id, github_id, github_name, body, status, created_at FROM notes;
DROP TABLE notes;
ALTER TABLE notes_new RENAME TO notes;
CREATE INDEX notes_status_created ON notes (status, created_at DESC);
CREATE INDEX notes_github_id ON notes (github_id);
