import { NextResponse } from "next/server";
import { listLeadsByOrganizer } from "@/lib/db";
import { enrichLead, DEMO_ORGANIZER_ID } from "@/lib/leads";
import { formatDateLong } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Réservation confirmée",
  declined: "Pas donné suite",
};

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const raw = await listLeadsByOrganizer(DEMO_ORGANIZER_ID);
  const leads = await Promise.all(raw.map(enrichLead));

  const header = [
    "Date du clic",
    "Joueur",
    "Email",
    "Stage",
    "Statut",
    "Montant réservation (€)",
    "Commission (€)",
  ];

  const rows = leads.map((l) => [
    formatDateLong(l.createdAt),
    l.userName,
    l.userEmail,
    l.stageTitle,
    STATUS_LABEL[l.status] ?? l.status,
    l.bookingAmount != null ? l.bookingAmount.toFixed(2) : "",
    l.commissionAmount != null ? l.commissionAmount.toFixed(2) : "",
  ]);

  const csv = [header, ...rows].map((row) => row.map((v) => csvEscape(String(v))).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookmypadel-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
