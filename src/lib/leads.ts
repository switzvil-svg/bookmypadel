import { DbLead, findUserById } from "@/lib/db";
import { stages } from "@/data/stages";
import { coaches } from "@/data/coaches";

/**
 * Any authenticated `role = "organizer"` account can manage leads, but they
 * all still map to this one demo organizer (see README) — organizers aren't
 * multi-tenant yet since `src/data/account.ts`'s `organizerStages` is mock.
 */
export const DEMO_ORGANIZER_ID = "c1";

export interface EnrichedLead {
  id: string;
  token: string;
  createdAt: string;
  status: DbLead["status"];
  bookingAmount: number | null;
  commissionAmount: number | null;
  userName: string;
  userEmail: string;
  stageTitle: string;
  stageId: string;
  organizerId: string;
  organizerClub: string;
}

export async function enrichLead(lead: DbLead): Promise<EnrichedLead> {
  const user = await findUserById(lead.user_id);
  const stage = stages.find((s) => s.id === lead.stage_id);
  const organizer = coaches.find((c) => c.id === lead.organizer_id);

  return {
    id: lead.id,
    token: lead.token,
    createdAt: lead.created_at,
    status: lead.status,
    bookingAmount: lead.booking_amount,
    commissionAmount: lead.commission_amount,
    userName: user?.name ?? "Utilisateur supprimé",
    userEmail: user?.email ?? "—",
    stageTitle: stage?.title ?? lead.stage_id,
    stageId: lead.stage_id,
    organizerId: lead.organizer_id,
    organizerClub: organizer?.club ?? lead.organizer_id,
  };
}
