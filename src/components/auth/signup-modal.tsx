"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserRound, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";

export function SignupModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json() as any;
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      setUser(data);
      setLoading(false);
      onSuccess();
    } catch {
      setError("Une erreur est survenue, réessayez.");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-lg border border-mist-200 bg-white p-6 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 text-mist-400 hover:bg-mist-100 hover:text-ink"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-court-50 text-court-600">
              <UserRound size={20} />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">Créer votre compte</h2>
            <p className="mt-1 text-sm text-mist-600">
              Un compte gratuit pour accéder à l’offre et être mis en relation avec l’organisateur.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <Input
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Création…" : "Continuer"}
              </Button>
            </form>

            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-mist-500">
              <ShieldCheck size={13} className="text-court-500" /> Aucun paiement en ligne, juste
              votre mise en relation avec l’organisateur.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
