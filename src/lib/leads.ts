import { DbLead, findUserById, getStageByIdDb } from "@/lib/db";
import { coaches } from "@/data/coaches";

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
  accommodationChoice: DbLead["accommodation_choice"];
}

export async function enrichLead(lead: DbLead): Promise<EnrichedLead> {
  const [user, stage] = await Promise.all([
    findUserById(lead.user_id),
    getStageByIdDb(lead.stage_id),
  ]);
  const mockCoach = coaches.find((c) => c.id === lead.organizer_id);
  let organizerClub = lead.organizer_id;
  if (mockCoach) {
    organizerClub = mockCoach.club;
  } else {
    const organizerUser = await findUserById(lead.organizer_id);
    if (organizerUser) organizerClub = organizerUser.name;
  }

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
    organizerClub,
    accommodationChoice: lead.accommodation_choice,
  };
}
