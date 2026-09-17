-- Adds real authentication: password hashing and role-based access
-- (player / organizer / admin) for the users table. Applied via:
-- wrangler d1 migrations apply bookmypadel-db [--local | --remote]

ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'player';
