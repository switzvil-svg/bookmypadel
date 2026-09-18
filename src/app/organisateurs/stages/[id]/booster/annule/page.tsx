import { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Paiement annulé" };
export const dynamic = "force-dynamic";

export default function BoostCancelPage({ params }: { params: { id: string } }) {
  return (
    <div className="container-page flex flex-col items-center py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist-100 text-mist-500">
        <XCircle size={28} />
      </span>
      <h1 className="mt-5 font-display text-2xl font-bold text-ink">Paiement annulé</h1>
      <p className="mt-2 max-w-sm text-sm text-mist-600">
        Aucun montant n’a été débité. Vous pouvez réessayer quand vous voulez.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href={`/organisateurs/stages/${params.id}/booster`}>
          <Button variant="secondary">Réessayer</Button>
        </Link>
        <Link href="/organisateurs/tableau-de-bord">
          <Button>Retour au tableau de bord</Button>
        </Link>
      </div>
    </div>
  );
}
