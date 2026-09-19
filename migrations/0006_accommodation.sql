-- Accommodation options per stage: none / included in the single price /
-- optional (two prices, player picks at lead time).

ALTER TABLE stages ADD COLUMN accommodation_mode TEXT NOT NULL DEFAULT 'none';
-- 'none' | 'included' | 'optional'
ALTER TABLE stages ADD COLUMN price_without_accommodation REAL;
ALTER TABLE stages ADD COLUMN price_with_accommodation REAL;

ALTER TABLE leads ADD COLUMN accommodation_choice TEXT;
-- 'without' | 'with' | NULL
