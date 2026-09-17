"use client";

import { useState } from "react";
import { ShieldCheck, ExternalLink, Loader2 } from "lucide-react";
import { Stage } from "@/types";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDateRange } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { SignupModal } from "@/components/auth/signup-modal";

export function OfferCTA({ stage }: { stage: Stage }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const sold = stage.spotsLeft === 0;

  async function goToOffer() {
    setRedirecting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId: stage.id }),
      });
      if (!res.ok) {
        setRedirecting(false);
        return;
      }
      const data = await res.json() as any;
      window.location.href = data.redirectUrl;
    } catch {
      setRedirecting(false);
    }
  }

  function handleClick() {
    if (sold || redirecting) return;
    if (!user) {
      setModalOpen(true);
      return;
    }
    goToOffer();
  }

  return (
    <div className="rounded-lg border border-mist-200 bg-white p-5 shadow-lg">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-display text-2xl font-bold text-ink">{formatPrice(stage.pricePerPerson)}</span>
          <span className="text-sm text-mist-500"> / personne</span>
        </div>
        {stage.spotsLeft > 0 && stage.spotsLeft <= 3 && (
          <span className="text-xs font-semibold text-warning">{stage.spotsLeft} places restantes</span>
        )}
      </div>

      <div className="mt-4 rounded-md border border-mist-200 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-mist-400">Dates</p>
        <p className="text-sm font-medium text-ink">{formatDateRange(stage.startDate, stage.endDate)}</p>
      </div>

      <div className="mt-3 rounded-md border border-mist-200 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-mist-400">Organisateur</p>
        <p className="text-sm font-medium text-ink">{stage.coach.club}</p>
      </div>

      <Button
        variant="cta"
        size="lg"
        className="mt-4 w-full"
        disabled={sold || redirecting}
        onClick={handleClick}
      >
        {sold ? (
          "Complet"
        ) : redirecting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Redirection…
          </>
        ) : (
          <>
            Voir l’offre <ExternalLink size={16} />
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-mist-500">
        Vous serez mis en relation directement avec {stage.coach.club}.
      </p>

      <div className="mt-4 space-y-2 text-xs text-mist-500">
        <p className="inline-flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-court-500" /> Aucun paiement en ligne sur BookMyPadel
        </p>
      </div>

      <SignupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          goToOffer();
        }}
      />
    </div>
  );
}
