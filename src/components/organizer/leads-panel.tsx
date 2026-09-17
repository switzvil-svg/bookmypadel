"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDateLong, formatPrice } from "@/lib/utils";

interface Lead {
  id: string;
  createdAt: string;
  status: "pending" | "confirmed" | "declined";
  bookingAmount: number | null;
  commissionAmount: number | null;
  userName: string;
  userEmail: string;
  stageTitle: string;
}

const STATUS_LABEL: Record<Lead["status"], string> = {
  pending: "En attente",
  confirmed: "Réservation confirmée",
  declined: "Pas donné suite",
};
const STATUS_TONE: Record<Lead["status"], "warning" | "success" | "mist"> = {
  pending: "warning",
  confirmed: "success",
  declined: "mist",
};

export function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/organizer/leads");
    const data = await res.json() as any;
    setLeads(data.leads);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Lead["status"]) {
    setSavingId(id);
    const bookingAmount =
      status === "confirmed" ? Number(drafts[id] ?? "") || undefined : undefined;
    await fetch(`/api/organizer/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, bookingAmount }),
    });
    await load();
    setSavingId(null);
  }

  if (!leads) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-mist-500">
        <Loader2 size={16} className="animate-spin" /> Chargement des leads…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink">Leads reçus</h3>
        <a href="/api/organizer/leads/export">
          <Button variant="secondary" size="sm">
            <Download size={15} /> Exporter en CSV
          </Button>
        </a>
      </div>

      {leads.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-mist-300 bg-white p-10 text-center text-sm text-mist-500">
          Aucun lead reçu pour le moment. Dès qu’un joueur clique sur « Voir l’offre » sur l’un de
          vos stages, sa demande apparaîtra ici.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-mist-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist-50 text-xs uppercase tracking-wide text-mist-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Joueur</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Date du clic</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Montant</th>
                <th className="px-4 py-3 font-semibold">Commission</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-mist-100 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{l.userName}</p>
                    <p className="text-xs text-mist-500">{l.userEmail}</p>
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-mist-600">{l.stageTitle}</td>
                  <td className="px-4 py-3 text-mist-600">{formatDateLong(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[l.status]}>{STATUS_LABEL[l.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {l.status === "confirmed" ? (
                      formatPrice(l.bookingAmount ?? 0)
                    ) : (
                      <Input
                        placeholder="€"
                        className="h-8 w-20 text-xs"
                        value={drafts[l.id] ?? ""}
                        onChange={(e) => setDrafts((d) => ({ ...d, [l.id]: e.target.value }))}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-mist-600">
                    {l.commissionAmount != null ? formatPrice(l.commissionAmount) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={savingId === l.id}
                        onClick={() => updateStatus(l.id, "confirmed")}
                      >
                        Confirmée
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={savingId === l.id}
                        onClick={() => updateStatus(l.id, "declined")}
                      >
                        Sans suite
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
