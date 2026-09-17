"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Code incorrect.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-mist-200 bg-white p-7">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
          <Lock size={18} />
        </span>
        <h1 className="mt-4 font-display text-lg font-bold text-ink">Accès admin</h1>
        <p className="mt-1 text-sm text-mist-600">Réservé à l’équipe BookMyPadel.</p>
        <Input
          type="password"
          placeholder="Code d'accès"
          className="mt-5"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="mt-4 w-full" disabled={loading}>
          {loading ? "Vérification…" : "Entrer"}
        </Button>
      </form>
    </div>
  );
}
