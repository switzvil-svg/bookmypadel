import { getCloudflareContext } from "@opennextjs/cloudflare";
import crypto from "node:crypto";

export const COMMISSION_RATE = 0.05;

export type LeadStatus = "pending" | "confirmed" | "declined";
export type UserRole = "player" | "organizer" | "admin";

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
  external_url: string;
  photos: string;
  featured: number;
  popular: number;
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
  };
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO leads (id, token, user_id, stage_id, organizer_id, created_at, redirect_url, status, booking_amount, commission_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      lead.commission_amount
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
  accommodationIncluded: boolean;
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
    accommodation_included: input.accommodationIncluded ? 1 : 0,
    external_url: input.externalUrl,
    photos: JSON.stringify(input.photos),
    featured: 0,
    popular: 0,
    created_at: new Date().toISOString(),
  };
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO stages (id, slug, organizer_id, title, city, region, country, level, description, price_per_person, duration_days, start_date, end_date, spots_total, spots_left, accommodation_included, external_url, photos, featured, popular, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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

export async function getStageByIdDb(id: string): Promise<DbStage | undefined> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM stages WHERE id = ?").bind(id).first<DbStage>();
  return row ?? undefined;
}

export async function stageSlugExists(slug: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.prepare("SELECT 1 FROM stages WHERE slug = ?").bind(slug).first();
  return row != null;
}
