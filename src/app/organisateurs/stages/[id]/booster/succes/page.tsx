import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Paiement réussi" };
export const dynamic = "force-dynamic";

export default function BoostSuccessPage() {
  return (
    <div className="container-page flex flex-col items-center py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 size={28} />
      </span>
      <h1 className="mt-5 font-display text-2xl font-bold text-ink">Paiement reçu !</h1>
      <p className="mt-2 flex max-w-sm items-center justify-center gap-1.5 text-sm text-mist-600">
        <Clock size={14} className="shrink-0" />
        Votre stage sera mis en avant dès que Stripe aura confirmé le paiement (généralement
        quelques secondes).
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/organisateurs/tableau-de-bord">
          <Button>Retour au tableau de bord</Button>
        </Link>
      </div>
    </div>
  );
}
