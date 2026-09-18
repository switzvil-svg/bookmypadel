-- Real "mise en avant" (boost) purchases, replacing the static +29€ card on
-- /organisateurs/tarifs that never connected to anything. A boost is only
-- considered active once payment_status = 'paid' (set by the Stripe webhook
-- after payment confirmation, never before) and expires_at is in the future.

CREATE TABLE IF NOT EXISTS boosts (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL,
  organizer_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  amount_paid REAL NOT NULL DEFAULT 29.99,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at TEXT NOT NULL
);
