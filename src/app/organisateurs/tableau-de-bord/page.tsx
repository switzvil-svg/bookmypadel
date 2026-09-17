import { Metadata } from "next";
import { redirect } from "next/navigation";
import { OrganizerDashboard } from "@/components/organizer/dashboard";
import { getOrganizerStageRows } from "@/lib/stages";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Tableau de bord organisateur" };
export const dynamic = "force-dynamic";

export default async function OrganizerDashboardPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    redirect("/organisateurs/connexion?next=/organisateurs/tableau-de-bord");
  }

  const stages = await getOrganizerStageRows(user.id);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Tableau de bord</h1>
      <p className="mt-1 text-sm text-mist-600">Gérez vos stages, réservations et revenus.</p>
      <div className="mt-8">
        <OrganizerDashboard stages={stages} revenueByMonth={[]} />
      </div>
    </div>
  );
}
