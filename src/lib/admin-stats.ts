import { listAllLeads } from "@/lib/db";
import { stages } from "@/data/stages";
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

  const perStage = stages
    .map((stage) => {
      const stageLeads = leads.filter((l) => l.stage_id === stage.id);
      return {
        stageId: stage.id,
        stageTitle: stage.title,
        organizerClub: stage.coach.club,
        clicks: stageLeads.length,
        confirmed: stageLeads.filter((l) => l.status === "confirmed").length,
        declined: stageLeads.filter((l) => l.status === "declined").length,
        pending: stageLeads.filter((l) => l.status === "pending").length,
      };
    })
    .filter((s) => s.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks);

  const perOrganizer = coaches
    .map((coach) => {
      const orgLeads = leads.filter((l) => l.organizer_id === coach.id);
      const orgConfirmed = orgLeads.filter((l) => l.status === "confirmed");
      const orgDeclared = orgConfirmed.length + orgLeads.filter((l) => l.status === "declined").length;
      return {
        organizerId: coach.id,
        club: coach.club,
        clicks: orgLeads.length,
        confirmed: orgConfirmed.length,
        declarationRate: orgLeads.length ? Math.round((orgDeclared / orgLeads.length) * 100) : 0,
        commission: orgConfirmed.reduce((sum, l) => sum + (l.commission_amount ?? 0), 0),
      };
    })
    .filter((o) => o.clicks > 0)
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
