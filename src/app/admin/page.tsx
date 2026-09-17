import { Metadata } from "next";
import { MousePointerClick, FileCheck2, Percent, Wallet } from "lucide-react";
import { isAdmin } from "@/lib/session";
import { computeAdminStats } from "@/lib/admin-stats";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdmin()) {
    return <AdminLoginForm />;
  }

  const stats = await computeAdminStats();

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Dashboard admin</h1>
      <p className="mt-1 text-sm text-mist-600">Vue globale des leads générés sur BookMyPadel.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-mist-200 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-court-50 text-court-600">
            <MousePointerClick size={18} />
          </span>
          <p className="mt-3 font-display text-2xl font-bold text-ink">{stats.totalClicks}</p>
          <p className="text-sm text-mist-500">Clics générés</p>
        </div>
        <div className="rounded-lg border border-mist-200 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-court-50 text-court-600">
            <FileCheck2 size={18} />
          </span>
          <p className="mt-3 font-display text-2xl font-bold text-ink">{stats.declared}</p>
          <p className="text-sm text-mist-500">Leads déclarés</p>
        </div>
        <div className="rounded-lg border border-mist-200 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-court-50 text-court-600">
            <Percent size={18} />
          </span>
          <p className="mt-3 font-display text-2xl font-bold text-ink">{stats.declarationRate}%</p>
          <p className="text-sm text-mist-500">Taux de déclaration</p>
        </div>
        <div className="rounded-lg border border-mist-200 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-citron-200 text-ink">
            <Wallet size={18} />
          </span>
          <p className="mt-3 font-display text-2xl font-bold text-ink">{formatPrice(stats.totalCommission)}</p>
          <p className="text-sm text-mist-500">Commissions à réclamer</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display font-semibold text-ink">Clics par offre</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-mist-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist-50 text-xs uppercase tracking-wide text-mist-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th className="px-4 py-3 font-semibold">Clics</th>
                  <th className="px-4 py-3 font-semibold">Confirmés</th>
                </tr>
              </thead>
              <tbody>
                {stats.perStage.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-mist-500">
                      Aucun clic pour le moment.
                    </td>
                  </tr>
                ) : (
                  stats.perStage.map((s) => (
                    <tr key={s.stageId} className="border-t border-mist-100">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{s.stageTitle}</p>
                        <p className="text-xs text-mist-500">{s.organizerClub}</p>
                      </td>
                      <td className="px-4 py-3 text-mist-600">{s.clicks}</td>
                      <td className="px-4 py-3 text-mist-600">{s.confirmed}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-ink">Clics par organisateur</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-mist-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist-50 text-xs uppercase tracking-wide text-mist-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Organisateur</th>
                  <th className="px-4 py-3 font-semibold">Clics</th>
                  <th className="px-4 py-3 font-semibold">Déclaration</th>
                </tr>
              </thead>
              <tbody>
                {stats.perOrganizer.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-mist-500">
                      Aucun clic pour le moment.
                    </td>
                  </tr>
                ) : (
                  stats.perOrganizer.map((o) => (
                    <tr key={o.organizerId} className="border-t border-mist-100">
                      <td className="px-4 py-3 font-medium text-ink">{o.club}</td>
                      <td className="px-4 py-3 text-mist-600">{o.clicks}</td>
                      <td className="px-4 py-3">
                        <Badge tone={o.declarationRate >= 60 ? "success" : o.declarationRate >= 30 ? "warning" : "mist"}>
                          {o.declarationRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-mist-500">
            Un taux de déclaration bas peut signaler un organisateur qui ne joue pas le jeu.
          </p>
        </div>
      </div>
    </div>
  );
}
