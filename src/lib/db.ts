import { getCloudflareContext } from "@opennextjs/cloudflare";
import crypto from "node:crypto";

export const COMMISSION_RATE = 0.12;

export type LeadStatus = "pending" | "confirmed" | "declined";

export interface DbUser {
  id: string;
  name: string;
  email: string;
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

export async function upsertUser(name: string, email: string): Promise<DbUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  const db = await getDb();
  if (existing) {
    if (existing.name !== name) {
      await db.prepare("UPDATE users SET name = ? WHERE id = ?").bind(name, existing.id).run();
      return { ...existing, name };
    }
    return existing;
  }
  const user: DbUser = {
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    created_at: new Date().toISOString(),
  };
  await db
    .prepare("INSERT INTO users (id, name, email, created_at) VALUES (?, ?, ?, ?)")
    .bind(user.id, user.name, user.email, user.created_at)
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
