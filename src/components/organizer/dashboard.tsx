"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  CalendarCheck,
  Wallet,
  Percent,
  Zap,
  Plus,
} from "lucide-react";
import { OrganizerStageRow } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { RevenueChart } from "./revenue-chart";
import { LeadsPanel } from "./leads-panel";
import { StageRowActions } from "./stage-row-actions";
import { formatPrice, formatDateLong } from "@/lib/utils";
import type { EnrichedBoostHistoryEntry } from "@/lib/boosts";

const BOOST_STATUS_TONE: Record<EnrichedBoostHistoryEntry["paymentStatus"], "court" | "warning" | "mist"> = {
  paid: "court",
  pending: "warning",
  failed: "mist",
};
const BOOST_STATUS_LABEL: Record<EnrichedBoostHistoryEntry["paymentStatus"], string> = {
  paid: "Payé",
  pending: "En attente",
  failed: "Échoué",
};

const TABS = ["Vue d'ensemble", "Mes stages", "Leads", "Statistiques"] as const;

const STATUS_TONE: Record<OrganizerStageRow["status"], "court" | "warning" | "mist"> = {
  publie: "court",
  brouillon: "mist",
  complet: "warning",
};
const STATUS_LABEL: Record<OrganizerStageRow["status"], string> = {
  publie: "Publié",
  brouillon: "Brouillon",
  complet: "Complet",
};

export function OrganizerDashboard({
  stages,
  revenueByMonth,
  boostHistory,
}: {
  stages: OrganizerStageRow[];
  revenueByMonth: { month: string; revenue: number; bookings: number }[];
  boostHistory: EnrichedBoostHistoryEntry[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Vue d'ensemble");
  const totalRevenue = stages.reduce((s, x) => s + x.revenue, 0);
  const totalBookings = stages.reduce((s, x) => s + x.bookings, 0);
  const totalViews = stages.reduce((s, x) => s + x.views, 0);
  const conversion = totalViews ? ((totalBookings / totalViews) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
      <aside>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "relative shrink-0 cursor-pointer rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors " +
                (tab === t ? "bg-court-50 text-court-700" : "text-mist-600 hover:bg-mist-100")
              }
            >
              {t}
            </button>
          ))}
        </nav>
        <Link href="/organisateurs/nouveau-stage" className="mt-4 hidden lg:block">
          <Button className="w-full">
            <Plus size={16} /> Nouveau stage
          </Button>
        </Link>
      </aside>

      <div>
        {tab === "Vue d'ensemble" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard icon={Wallet} label="CA déclaré" value={formatPrice(totalRevenue)} delta={18} />
              <StatCard icon={CalendarCheck} label="Réservations" value={String(totalBookings)} delta={9} />
              <StatCard icon={Eye} label="Vues totales" value={totalViews.toLocaleString("fr-FR")} delta={4} />
              <StatCard icon={Percent} label="Taux de conversion" value={`${conversion}%`} delta={-2} />
            </div>

            <div className="mt-6 rounded-lg border border-mist-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-ink">Revenus des 6 derniers mois</h3>
                <span className="text-xs text-mist-500">Net de commission</span>
              </div>
              <div className="mt-4">
                <RevenueChart data={revenueByMonth} />
              </div>
            </div>
          </motion.div>
        )}

        {tab === "Mes stages" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-ink">Mes stages publiés</h3>
              <Link href="/organisateurs/nouveau-stage">
                <Button size="sm">
                  <Plus size={15} /> Nouveau stage
                </Button>
              </Link>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-mist-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-mist-50 text-xs uppercase tracking-wide text-mist-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Stage</th>
                    <th className="px-4 py-3 font-semibold">Dates</th>
                    <th className="px-4 py-3 font-semibold">Places</th>
                    <th className="px-4 py-3 font-semibold">Statut</th>
                    <th className="px-4 py-3 font-semibold">Revenus</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {stages.map((s) => (
                    <tr key={s.id} className="border-t border-mist-100">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{s.title}</p>
                        <p className="text-xs text-mist-500">{s.city}</p>
                      </td>
                      <td className="px-4 py-3 text-mist-600">{s.dateRange}</td>
                      <td className="px-4 py-3 text-mist-600">
                        {s.spotsTotal - s.spotsLeft}/{s.spotsTotal}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Badge tone={STATUS_TONE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                          {s.boosted ? (
                            <Badge tone="citron">
                              <Zap size={11} /> Boosté
                            </Badge>
                          ) : (
                            <Link
                              href={`/organisateurs/stages/${s.id}/booster`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-court-600 hover:text-court-700"
                            >
                              <Zap size={12} /> Booster
                            </Link>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">{formatPrice(s.revenue)}</td>
                      <td className="px-4 py-3">
                        <StageRowActions stageId={s.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {boostHistory.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display font-semibold text-ink">Historique des mises en avant</h3>
                <div className="mt-4 overflow-hidden rounded-lg border border-mist-200 bg-white">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-mist-50 text-xs uppercase tracking-wide text-mist-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Stage</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Montant</th>
                        <th className="px-4 py-3 font-semibold">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boostHistory.map((b) => (
                        <tr key={b.id} className="border-t border-mist-100">
                          <td className="px-4 py-3 font-medium text-ink">{b.stageTitle}</td>
                          <td className="px-4 py-3 text-mist-600">{formatDateLong(b.createdAt)}</td>
                          <td className="px-4 py-3 text-mist-600">{formatPrice(b.amountPaid)}</td>
                          <td className="px-4 py-3">
                            <Badge tone={BOOST_STATUS_TONE[b.paymentStatus]}>
                              {b.active ? "Actif" : BOOST_STATUS_LABEL[b.paymentStatus]}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {tab === "Leads" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <LeadsPanel />
          </motion.div>
        )}

        {tab === "Statistiques" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h3 className="font-display font-semibold text-ink">Visibilité par stage</h3>
            <div className="mt-4 space-y-3">
              {stages.map((s) => {
                const conv = s.views ? ((s.bookings / s.views) * 100).toFixed(1) : "0";
                return (
                  <div key={s.id} className="rounded-lg border border-mist-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink">{s.title}</p>
                      {!s.boosted && (
                        <Link
                          href={`/organisateurs/stages/${s.id}/booster`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-court-600 hover:text-court-700"
                        >
                          <Zap size={12} /> Booster
                        </Link>
                      )}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs text-mist-500">
                      <div>
                        <p className="font-display text-base font-bold text-ink">{s.views}</p>
                        Vues
                      </div>
                      <div>
                        <p className="font-display text-base font-bold text-ink">{s.bookings}</p>
                        Réservations
                      </div>
                      <div>
                        <p className="font-display text-base font-bold text-ink">{conv}%</p>
                        Conversion
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
