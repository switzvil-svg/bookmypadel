import {
  DbBoost,
  createPendingBoost,
  confirmBoostPayment,
  getBoostById,
  countActiveBoosts,
  getActiveBoostForStage,
  listBoostsByOrganizer,
  listActiveBoostedStages,
  getStageByIdDb,
} from "@/lib/db";
import { enrichStage } from "@/lib/stages";
import { BOOST_CONFIG } from "@/lib/config";
import { Stage } from "@/types";

export interface SlotAvailability {
  active: number;
  max: number;
  remaining: number;
  full: boolean;
}

export async function getSlotAvailability(): Promise<SlotAvailability> {
  try {
    const active = await countActiveBoosts();
    const remaining = Math.max(0, BOOST_CONFIG.MAX_ACTIVE_SLOTS - active);
    return { active, max: BOOST_CONFIG.MAX_ACTIVE_SLOTS, remaining, full: remaining === 0 };
  } catch (err) {
    // Rendered on /organisateurs/tarifs and the boost purchase page — a DB
    // hiccup must degrade, and "no slots available" (blocks purchases) is
    // the safe direction to fail in, not "plenty available".
    console.error("[lib/boosts] getSlotAvailability failed:", err);
    return { active: BOOST_CONFIG.MAX_ACTIVE_SLOTS, max: BOOST_CONFIG.MAX_ACTIVE_SLOTS, remaining: 0, full: true };
  }
}

export async function hasActiveBoost(stageId: string): Promise<boolean> {
  try {
    const boost = await getActiveBoostForStage(stageId);
    return Boolean(boost);
  } catch (err) {
    console.error("[lib/boosts] hasActiveBoost(%s) failed:", stageId, err);
    return false;
  }
}

export interface EnrichedBoostHistoryEntry {
  id: string;
  stageId: string;
  stageTitle: string;
  createdAt: string;
  expiresAt: string;
  amountPaid: number;
  paymentStatus: DbBoost["payment_status"];
  active: boolean;
}

export async function getBoostHistoryForOrganizer(
  organizerId: string
): Promise<EnrichedBoostHistoryEntry[]> {
  try {
    const boosts = await listBoostsByOrganizer(organizerId);
    const now = Date.now();
    return await Promise.all(
      boosts.map(async (b) => {
        const stage = await getStageByIdDb(b.stage_id);
        return {
          id: b.id,
          stageId: b.stage_id,
          stageTitle: stage?.title ?? "Stage supprimé",
          createdAt: b.created_at,
          expiresAt: b.expires_at,
          amountPaid: b.amount_paid,
          paymentStatus: b.payment_status,
          active: b.payment_status === "paid" && new Date(b.expires_at).getTime() > now,
        };
      })
    );
  } catch (err) {
    // Rendered on the organizer dashboard — degrade to "no history" rather
    // than taking down the whole tableau de bord.
    console.error("[lib/boosts] getBoostHistoryForOrganizer(%s) failed:", organizerId, err);
    return [];
  }
}

export async function getBoostedStages(): Promise<Stage[]> {
  try {
    const rows = await listActiveBoostedStages();
    const stages = await Promise.all(rows.map(enrichStage));
    // The existing "À la une" badge (StageCard, stage detail page) reads
    // Stage.featured — a boosted stage should show it regardless of the
    // editorial `featured` flag in the DB row.
    return stages.map((s) => ({ ...s, featured: true }));
  } catch (err) {
    // Called unconditionally from the homepage on every request — same
    // rule as getAllStages()/getSessionUser(): a DB hiccup here (e.g. an
    // unmigrated `boosts` table) must degrade to "no active boosts", never
    // take down the entire site the way it just did in production.
    console.error("[lib/boosts] getBoostedStages failed:", err);
    return [];
  }
}

export async function startBoostCheckout(
  stageId: string,
  organizerId: string
): Promise<{ ok: true; boostId: string } | { ok: false; error: string }> {
  const stage = await getStageByIdDb(stageId);
  if (!stage || stage.organizer_id !== organizerId) {
    return { ok: false, error: "Stage introuvable." };
  }

  const alreadyBoosted = await hasActiveBoost(stageId);
  if (alreadyBoosted) {
    return { ok: false, error: "Ce stage a déjà une mise en avant active." };
  }

  const availability = await getSlotAvailability();
  if (availability.full) {
    return {
      ok: false,
      error: "Tous les slots sont actuellement occupés, réessayez plus tard.",
    };
  }

  const boost = await createPendingBoost(stageId, organizerId, BOOST_CONFIG.PRICE_EUR);
  return { ok: true, boostId: boost.id };
}

export async function confirmBoostFromWebhook(
  boostId: string,
  stripePaymentId: string
): Promise<void> {
  await confirmBoostPayment(boostId, stripePaymentId, BOOST_CONFIG.DURATION_DAYS);
}

export { getBoostById };
