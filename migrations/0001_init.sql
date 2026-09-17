-- Same schema previously created at runtime by src/lib/db.ts (node:sqlite).
-- Applied via: wrangler d1 migrations apply bookmypadel-db [--local | --remote]

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  organizer_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  redirect_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  booking_amount REAL,
  commission_amount REAL
);
