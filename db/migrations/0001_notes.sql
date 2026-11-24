-- db/migrations/0001_notes.sql
-- Guestbook notes: one per GitHub account, shown only once approved.
CREATE TABLE notes (
  id          TEXT PRIMARY KEY,               -- crypto.randomUUID()
  github_id   INTEGER NOT NULL UNIQUE,        -- one note per GitHub account
  github_name TEXT NOT NULL,                  -- display name at time of writing
  body        TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 140),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX notes_status_created ON notes (status, created_at DESC);
