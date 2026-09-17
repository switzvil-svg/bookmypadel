import { Metadata } from "next";
import { OrganizerDashboard } from "@/components/organizer/dashboard";
import { organizerStages, revenueByMonth } from "@/data/account";

export const metadata: Metadata = { title: "Tableau de bord organisateur" };

export default function OrganizerDashboardPage() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Tableau de bord</h1>
      <p className="mt-1 text-sm text-mist-600">Gérez vos stages, réservations et revenus.</p>
      <div className="mt-8">
        <OrganizerDashboard stages={organizerStages} revenueByMonth={revenueByMonth} />
      </div>
    </div>
  );
}
