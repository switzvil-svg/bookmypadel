-- Real stage storage: the "Publier un stage" form never wrote anywhere, and
-- the display pages (accueil, recherche, fiche stage) always read the
-- hardcoded src/data/stages.ts array — stages created by organizers could
-- never appear. This table is the source of truth for both, going forward.
--
-- Deliberately lean: fields like amenities/program/reviews stay derived at
-- read time (src/lib/stages.ts) from deterministic formulas keyed on `id`,
-- same as the old mock data did — no need to persist generated content.

CREATE TABLE IF NOT EXISTS stages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  organizer_id TEXT NOT NULL,
  title TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'France',
  level TEXT NOT NULL DEFAULT 'tous-niveaux',
  description TEXT NOT NULL DEFAULT '',
  price_per_person REAL NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 1,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  spots_total INTEGER NOT NULL DEFAULT 0,
  spots_left INTEGER NOT NULL DEFAULT 0,
  accommodation_included INTEGER NOT NULL DEFAULT 0,
  external_url TEXT NOT NULL DEFAULT '',
  photos TEXT NOT NULL DEFAULT '[]',
  featured INTEGER NOT NULL DEFAULT 0,
  popular INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
