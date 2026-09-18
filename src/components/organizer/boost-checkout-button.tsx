"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BoostCheckoutButton({ stageId, disabled }: { stageId: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/organizer/boost/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId }),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.url) {
        setError(data?.error ?? "Une erreur est survenue, réessayez.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue, réessayez.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={disabled || loading} size="lg" className="w-full">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
        {loading ? "Redirection vers le paiement…" : "Booster ce stage"}
      </Button>
      {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
