import { Metadata } from "next";
import { Check, Zap } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Commissions & mise en avant" };

export default function PricingPage() {
  return (
    <div className="container-page py-14">
      <Reveal className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Commissions & mise en avant</h1>
        <p className="mt-3 text-mist-600">
          Un modèle simple et transparent, aligné sur votre réussite : nous ne gagnons de l’argent
          que lorsque vous en gagnez.
        </p>
      </Reveal>

      <RevealGroup className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        <RevealItem className="rounded-lg border border-mist-200 bg-white p-7">
          <h2 className="font-display text-lg font-bold text-ink">Commission standard</h2>
          <p className="mt-2 font-display text-4xl font-bold text-court-600">5%</p>
          <p className="text-sm text-mist-500">par réservation confirmée</p>
          <ul className="mt-6 space-y-2.5 text-sm text-mist-700">
            {[
              "Publication illimitée de stages",
              "Aucun prélèvement automatique : vous déclarez, on facture",
              "Réception des leads directement sur votre site, formulaire ou WhatsApp",
              "Support organisateur 7j/7",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-success" /> {f}
              </li>
            ))}
          </ul>
        </RevealItem>

        <RevealItem className="relative rounded-lg border-2 border-citron-400 bg-white p-7">
          <Badge tone="citron" className="absolute -top-3 left-6">
            Recommandé
          </Badge>
          <h2 className="font-display text-lg font-bold text-ink">Mise en avant (boost)</h2>
          <p className="mt-2 font-display text-4xl font-bold text-court-600">
            +29€ <span className="text-base font-medium text-mist-500">/ stage / semaine</span>
          </p>
          <p className="text-sm text-mist-500">en plus de la commission standard</p>
          <ul className="mt-6 space-y-2.5 text-sm text-mist-700">
            {[
              "Position prioritaire dans les résultats de recherche",
              "Badge « À la une » sur la page d'accueil",
              "Mise en avant dans la section « par destination »",
              "Statistiques de performance détaillées",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Zap size={16} className="mt-0.5 shrink-0 text-citron-500" /> {f}
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>

      <Reveal className="mx-auto mt-10 max-w-2xl text-center text-sm text-mist-500">
        BookMyPadel ne prend aucun paiement en ligne. Vous déclarez vous-même chaque réservation
        confirmée (et son montant) depuis votre tableau de bord ; la commission de 5% n’est due
        que sur ces réservations déclarées, et vous est facturée périodiquement hors plateforme.
      </Reveal>
    </div>
  );
}
