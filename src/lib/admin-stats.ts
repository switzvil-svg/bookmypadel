import { listAllLeads, getStageByIdDb, findUserById } from "@/lib/db";
import { coaches } from "@/data/coaches";

export async function computeAdminStats() {
  const leads = await listAllLeads();

  const totalClicks = leads.length;
  const confirmed = leads.filter((l) => l.status === "confirmed");
  const declined = leads.filter((l) => l.status === "declined");
  const declared = confirmed.length + declined.length;
  const declarationRate = totalClicks ? Math.round((declared / totalClicks) * 100) : 0;
  const totalCommission = confirmed.reduce((sum, l) => sum + (l.commission_amount ?? 0), 0);
  const totalConfirmedRevenue = confirmed.reduce((sum, l) => sum + (l.booking_amount ?? 0), 0);

  const stageIds = Array.from(new Set(leads.map((l) => l.stage_id)));
  const stageTitles = new Map<string, string>();
  await Promise.all(
    stageIds.map(async (id) => {
      const stage = await getStageByIdDb(id);
      stageTitles.set(id, stage?.title ?? id);
    })
  );

  const organizerIds = Array.from(new Set(leads.map((l) => l.organizer_id)));
  const organizerClubs = new Map<string, string>();
  await Promise.all(
    organizerIds.map(async (id) => {
      const mockCoach = coaches.find((c) => c.id === id);
      if (mockCoach) {
        organizerClubs.set(id, mockCoach.club);
        return;
      }
      const user = await findUserById(id);
      organizerClubs.set(id, user?.name ?? id);
    })
  );

  const perStage = stageIds
    .map((stageId) => {
      const stageLeads = leads.filter((l) => l.stage_id === stageId);
      const organizerId = stageLeads[0]?.organizer_id ?? "";
      return {
        stageId,
        stageTitle: stageTitles.get(stageId) ?? stageId,
        organizerClub: organizerClubs.get(organizerId) ?? organizerId,
        clicks: stageLeads.length,
        confirmed: stageLeads.filter((l) => l.status === "confirmed").length,
        declined: stageLeads.filter((l) => l.status === "declined").length,
        pending: stageLeads.filter((l) => l.status === "pending").length,
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  const perOrganizer = organizerIds
    .map((organizerId) => {
      const orgLeads = leads.filter((l) => l.organizer_id === organizerId);
      const orgConfirmed = orgLeads.filter((l) => l.status === "confirmed");
      const orgDeclared = orgConfirmed.length + orgLeads.filter((l) => l.status === "declined").length;
      return {
        organizerId,
        club: organizerClubs.get(organizerId) ?? organizerId,
        clicks: orgLeads.length,
        confirmed: orgConfirmed.length,
        declarationRate: orgLeads.length ? Math.round((orgDeclared / orgLeads.length) * 100) : 0,
        commission: orgConfirmed.reduce((sum, l) => sum + (l.commission_amount ?? 0), 0),
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks,
    declared,
    declarationRate,
    totalCommission,
    totalConfirmedRevenue,
    perStage,
    perOrganizer,
  };
}
