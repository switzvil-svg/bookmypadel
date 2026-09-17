import { Metadata } from "next";
import { Info, MessageCircleQuestion, ShieldAlert } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export const metadata: Metadata = { title: "Politique d'annulation" };

const POINTS = [
  {
    icon: Info,
    title: "BookMyPadel ne gère ni paiement ni remboursement",
    detail:
      "La plateforme met en relation les joueurs et les organisateurs, mais n'intervient à aucun moment dans la transaction : ni prise de paiement, ni remboursement. La réservation se fait directement entre vous et l'organisateur.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Chaque organisateur fixe ses propres conditions",
    detail:
      "Les modalités d'annulation (délais, pourcentage remboursé, acompte éventuel) sont propres à chaque club ou coach. Demandez-les directement à l'organisateur au moment de la prise de contact, avant de confirmer votre présence.",
  },
  {
    icon: ShieldAlert,
    title: "Un litige avec un organisateur ?",
    detail:
      "Si un organisateur ne respecte pas ce qui a été convenu, vous pouvez nous le signaler via la page Contact : nous ne sommes pas partie à la transaction, mais nous prenons en compte les signalements pour la qualité des organisateurs référencés sur BookMyPadel.",
  },
];

export default function CancellationPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <Reveal>
        <h1 className="font-display text-3xl font-bold text-ink">Politique d’annulation</h1>
        <p className="mt-3 text-mist-600">
          BookMyPadel est un service de mise en relation, pas un site de réservation avec
          paiement en ligne : voici comment fonctionnent les annulations dans ce modèle.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 space-y-4">
        {POINTS.map((p) => (
          <RevealItem key={p.title} className="flex items-start gap-4 rounded-lg border border-mist-200 bg-white p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-50 text-court-600">
              <p.icon size={18} />
            </span>
            <div>
              <h2 className="font-display font-semibold text-ink">{p.title}</h2>
              <p className="mt-1 text-sm text-mist-600">{p.detail}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
