"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "./auth-provider";

export function AuthForm({
  role,
  next,
  loggedInRedirect,
}: {
  role: "player" | "organizer";
  next: string;
  loggedInRedirect: string;
}) {
  const { setUser } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = mode === "login" ? { email, password } : { name, email, password, role };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(data?.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      if (data.role !== role) {
        setError(
          role === "organizer"
            ? "Ce compte est un compte joueur, pas un compte organisateur."
            : "Ce compte est un compte organisateur, pas un compte joueur."
        );
        setLoading(false);
        return;
      }
      setUser(data);
      router.push(next || loggedInRedirect);
      router.refresh();
    } catch {
      setError("Une erreur est survenue, réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex rounded-lg border border-mist-200 bg-mist-50 p-1">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-semibold transition-colors",
              mode === m ? "bg-white text-ink shadow-sm" : "text-mist-500 hover:text-ink"
            )}
          >
            {m === "login" ? "Connexion" : "Créer un compte"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {mode === "signup" && (
          <Input
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={mode === "signup" ? "Mot de passe (8 caractères min.)" : "Mot de passe"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={mode === "signup" ? 8 : undefined}
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
          {loading ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </Button>
      </form>
    </div>
  );
}
