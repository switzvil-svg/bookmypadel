import { getCloudflareContext } from "@opennextjs/cloudflare";
import crypto from "node:crypto";

export const COMMISSION_RATE = 0.05;

export type LeadStatus = "pending" | "confirmed" | "declined";
export type UserRole = "player" | "organizer" | "admin";
export type BoostPaymentStatus = "pending" | "paid" | "failed";
export type AccommodationMode = "none" | "included" | "optional";
export type AccommodationChoice = "without" | "with";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
}

export interface DbStage {
  id: string;
  slug: string;
  organizer_id: string;
  title: string;
  city: string;
  region: string;
  country: string;
  level: string;
  description: string;
  price_per_person: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  spots_total: number;
  spots_left: number;
  accommodation_included: number;
  accommodation_mode: AccommodationMode;
  price_without_accommodation: number | null;
  price_with_accommodation: number | null;
  external_url: string;
  photos: string;
  featured: number;
  popular: number;
  created_at: string;
}

export interface DbBoost {
  id: string;
  stage_id: string;
  organizer_id: string;
  started_at: string;
  expires_at: string;
  amount_paid: number;
  payment_status: BoostPaymentStatus;
  stripe_payment_id: string | null;
  created_at: string;
}

export interface DbLead {
  id: string;
  token: string;
  user_id: string;
  stage_id: string;
  organizer_id: string;
  created_at: string;
  redirect_url: string;
  status: LeadStatus;
  booking_amount: number | null;
  commission_amount: number | null;
  accommodation_choice: AccommodationChoice | null;
}

async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

// ---- users ----

export async function findUserByEmail(email: string): Promise<DbUser | undefined> {
  const db = await getDb();
  const row = await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email.trim().toLowerCase())
    .first<DbUser>();
  return row ?? undefined;
}

export async function findUserById(id: string): Promise<DbUser | undefined> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<DbUser>();
  return row ?? undefined;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
  role: UserRole
): Promise<DbUser> {
  const user: DbUser = {
    id: crypto.randomUUID(),
    name,
    email: email.trim().toLowerCase(),
    password_hash: passwordHash,
    role,
    created_at: new Date().toISOString(),
  };
  const db = await getDb();
  await db
    .prepare(
      "INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(user.id, user.name, user.email, user.password_hash, user.role, user.created_at)
    .run();
  return user;
}

// ---- sessions ----

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const db = await getDb();
  await db
    .prepare("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)")
    .bind(token, userId, new Date().toISOString())
    .run();
  return token;
}

export async function getUserBySessionToken(token: string): Promise<DbUser | undefined> {
  const db = await getDb();
  const session = await db
    .prepare("SELECT user_id FROM sessions WHERE token = ?")
    .bind(token)
    .first<{ user_id: string }>();
  if (!session) return undefined;
  return findUserById(session.user_id);
}

export async function deleteSession(token: string): Promise<void> {
  const db = await getDb();
  await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
}

// ---- leads ----

export async function createLead(input: {
  userId: string;
  stageId: string;
  organizerId: string;
  redirectUrl: string;
  accommodationChoice?: AccommodationChoice | null;
}): Promise<DbLead> {
  const lead: DbLead = {
    id: crypto.randomUUID(),
    token: crypto.randomBytes(16).toString("hex"),
    user_id: input.userId,
    stage_id: input.stageId,
    organizer_id: input.organizerId,
    created_at: new Date().toISOString(),
    redirect_url: input.redirectUrl,
    status: "pending",
    booking_amount: null,
    commission_amount: null,
    accommodation_choice: input.accommodationChoice ?? null,
  };
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO leads (id, token, user_id, stage_id, organizer_id, created_at, redirect_url, status, booking_amount, commission_amount, accommodation_choice)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      lead.id,
      lead.token,
      lead.user_id,
      lead.stage_id,
      lead.organizer_id,
      lead.created_at,
      lead.redirect_url,
      lead.status,
      lead.booking_amount,
      lead.commission_amount,
      lead.accommodation_choice
    )
    .run();
  return lead;
}

export async function getLeadByToken(token: string): Promise<DbLead | undefined> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM leads WHERE token = ?").bind(token).first<DbLead>();
  return row ?? undefined;
}

export async function getLeadById(id: string): Promise<DbLead | undefined> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first<DbLead>();
  return row ?? undefined;
}

export async function listLeadsByOrganizer(organizerId: string): Promise<DbLead[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM leads WHERE organizer_id = ? ORDER BY created_at DESC")
    .bind(organizerId)
    .all<DbLead>();
  return results;
}

export async function listAllLeads(): Promise<DbLead[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM leads ORDER BY created_at DESC")
    .all<DbLead>();
  return results;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  bookingAmount: number | null
): Promise<DbLead | undefined> {
  const commissionAmount =
    status === "confirmed" && bookingAmount != null
      ? Math.round(bookingAmount * COMMISSION_RATE * 100) / 100
      : null;
  const db = await getDb();
  await db
    .prepare("UPDATE leads SET status = ?, booking_amount = ?, commission_amount = ? WHERE id = ?")
    .bind(status, bookingAmount, commissionAmount, id)
    .run();
  return getLeadById(id);
}

// ---- stages ----

export async function createStage(input: {
  slug: string;
  organizerId: string;
  title: string;
  city: string;
  region: string;
  country: string;
  level: string;
  description: string;
  pricePerPerson: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  spotsTotal: number;
  accommodationMode: AccommodationMode;
  priceWithoutAccommodation: number | null;
  priceWithAccommodation: number | null;
  externalUrl: string;
  photos: string[];
}): Promise<DbStage> {
  const stage: DbStage = {
    id: crypto.randomUUID(),
    slug: input.slug,
    organizer_id: input.organizerId,
    title: input.title,
    city: input.city,
    region: input.region,
    country: input.country,
    level: input.level,
    description: input.description,
    price_per_person: input.pricePerPerson,
    duration_days: input.durationDays,
    start_date: input.startDate,
    end_date: input.endDate,
    spots_total: input.spotsTotal,
    spots_left: input.spotsTotal,
    accommodation_included: input.accommodationMode !== "none" ? 1 : 0,
    accommodation_mode: input.accommodationMode,
    price_without_accommodation: input.priceWithoutAccommodation,
    price_with_accommodation: input.priceWithAccommodation,
    external_url: input.externalUrl,
    photos: JSON.stringify(input.photos),
    featured: 0,
    popular: 0,
    created_at: new Date().toISOString(),
  };
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO stages (id, slug, organizer_id, title, city, region, country, level, description, price_per_person, duration_days, start_date, end_date, spots_total, spots_left, accommodation_included, accommodation_mode, price_without_accommodation, price_with_accommodation, external_url, photos, featured, popular, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      stage.id,
      stage.slug,
      stage.organizer_id,
      stage.title,
      stage.city,
      stage.region,
      stage.country,
      stage.level,
      stage.description,
      stage.price_per_person,
      stage.duration_days,
      stage.start_date,
      stage.end_date,
      stage.spots_total,
      stage.spots_left,
      stage.accommodation_included,
      stage.accommodation_mode,
      stage.price_without_accommodation,
      stage.price_with_accommodation,
      stage.external_url,
      stage.photos,
      stage.featured,
      stage.popular,
      stage.created_at
    )
    .run();
  return stage;
}

export async function listStages(): Promise<DbStage[]> {
  const db = await getDb();
  const { results } = await db.prepare("SELECT * FROM stages ORDER BY created_at ASC").all<DbStage>();
  return results;
}

export async function getStageBySlugDb(slug: string): Promise<DbStage | undefined> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM stages WHERE slug = ?").bind(slug).first<DbStage>();
  return row ?? undefined;
}

export async function listStagesByOrganizer(organizerId: string): Promise<DbStage[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM stages WHERE organizer_id = ? ORDER BY created_at DESC")
    .bind(organizerId)
    .all<DbStage>();
  return results;
}

export async function getStageByIdDb(id: string): Promise<DbStage | undefined> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM stages WHERE id = ?").bind(id).first<DbStage>();
  return row ?? undefined;
}

export async function updateStage(
  id: string,
  input: {
    title: string;
    city: string;
    region: string;
    country: string;
    level: string;
    description: string;
    pricePerPerson: number;
    durationDays: number;
    startDate: string;
    endDate: string;
    spotsTotal: number;
    accommodationMode: AccommodationMode;
    priceWithoutAccommodation: number | null;
    priceWithAccommodation: number | null;
    externalUrl: string;
    photos: string[];
  }
): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      `UPDATE stages SET title = ?, city = ?, region = ?, country = ?, level = ?, description = ?,
       price_per_person = ?, duration_days = ?, start_date = ?, end_date = ?, spots_total = ?,
       spots_left = ?, accommodation_included = ?, accommodation_mode = ?,
       price_without_accommodation = ?, price_with_accommodation = ?, external_url = ?, photos = ?
       WHERE id = ?`
    )
    .bind(
      input.title,
      input.city,
      input.region,
      input.country,
      input.level,
      input.description,
      input.pricePerPerson,
      input.durationDays,
      input.startDate,
      input.endDate,
      input.spotsTotal,
      input.spotsTotal,
      input.accommodationMode !== "none" ? 1 : 0,
      input.accommodationMode,
      input.priceWithoutAccommodation,
      input.priceWithAccommodation,
      input.externalUrl,
      JSON.stringify(input.photos),
      id
    )
    .run();
}

export async function deleteStage(id: string): Promise<void> {
  const db = await getDb();
  await db.prepare("DELETE FROM stages WHERE id = ?").bind(id).run();
}

export async function stageSlugExists(slug: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.prepare("SELECT 1 FROM stages WHERE slug = ?").bind(slug).first();
  return row != null;
}

// ---- boosts ----

// SQLite's datetime('now') and our ISO-formatted (toISOString()) columns use
// different separators ("T" vs " ") — comparing them as strings would put
// "T" (0x54) ahead of " " (0x20) for same-day timestamps and could read an
// already-expired boost as still active. strftime with the ISO format string
// keeps "now" in the exact same shape as every stored timestamp.
const SQL_NOW_ISO = "strftime('%Y-%m-%dT%H:%M:%fZ','now')";

export async function createPendingBoost(
  stageId: string,
  organizerId: string,
  amountPaid: number
): Promise<DbBoost> {
  const now = new Date().toISOString();
  const boost: DbBoost = {
    id: crypto.randomUUID(),
    stage_id: stageId,
    organizer_id: organizerId,
    // Placeholders — meaningless while pending (excluded from every "active"
    // query below), overwritten with real values by confirmBoostPayment().
    started_at: now,
    expires_at: now,
    amount_paid: amountPaid,
    payment_status: "pending",
    stripe_payment_id: null,
    created_at: now,
  };
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO boosts (id, stage_id, organizer_id, started_at, expires_at, amount_paid, payment_status, stripe_payment_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      boost.id,
      boost.stage_id,
      boost.organizer_id,
      boost.started_at,
      boost.expires_at,
      boost.amount_paid,
      boost.payment_status,
      boost.stripe_payment_id,
      boost.created_at
    )
    .run();
  return boost;
}

export async function confirmBoostPayment(
  boostId: string,
  stripePaymentId: string,
  durationDays: number
): Promise<void> {
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const db = await getDb();
  await db
    .prepare(
      `UPDATE boosts SET payment_status = 'paid', started_at = ?, expires_at = ?, stripe_payment_id = ?
       WHERE id = ? AND payment_status != 'paid'`
    )
    .bind(startedAt.toISOString(), expiresAt.toISOString(), stripePaymentId, boostId)
    .run();
}

export async function getBoostById(id: string): Promise<DbBoost | undefined> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM boosts WHERE id = ?").bind(id).first<DbBoost>();
  return row ?? undefined;
}

export async function countActiveBoosts(): Promise<number> {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT COUNT(*) as n FROM boosts WHERE payment_status = 'paid' AND expires_at > ${SQL_NOW_ISO}`
    )
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function getActiveBoostForStage(stageId: string): Promise<DbBoost | undefined> {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT * FROM boosts WHERE stage_id = ? AND payment_status = 'paid' AND expires_at > ${SQL_NOW_ISO}
       ORDER BY expires_at DESC LIMIT 1`
    )
    .bind(stageId)
    .first<DbBoost>();
  return row ?? undefined;
}

export async function listBoostsByOrganizer(organizerId: string): Promise<DbBoost[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM boosts WHERE organizer_id = ? ORDER BY created_at DESC")
    .bind(organizerId)
    .all<DbBoost>();
  return results;
}

export async function listActiveBoostedStages(): Promise<DbStage[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT stages.* FROM stages
       JOIN boosts ON boosts.stage_id = stages.id
       WHERE boosts.payment_status = 'paid' AND boosts.expires_at > ${SQL_NOW_ISO}
       ORDER BY boosts.expires_at DESC`
    )
    .all<DbStage>();
  return results;
}
