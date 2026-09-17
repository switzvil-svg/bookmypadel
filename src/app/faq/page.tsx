import { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = { title: "FAQ" };

const PLAYER_FAQ = [
  { q: "Comment contacter un organisateur ?", a: "Créez un compte gratuit (nom + email), puis cliquez sur « Voir l'offre » sur la fiche du stage qui vous intéresse : vous êtes redirigé directement vers le site, le formulaire ou le WhatsApp de l'organisateur pour finaliser votre réservation avec lui." },
  { q: "Pourquoi dois-je créer un compte ?", a: "Un compte simple (nom + email, sans mot de passe) nous permet de vous mettre en relation avec l'organisateur. Aucune coordonnée bancaire n'est jamais demandée." },
  { q: "BookMyPadel prend-il un paiement ?", a: "Non. BookMyPadel ne traite aucun paiement : le prix affiché est indicatif, la réservation et le règlement se font exclusivement avec l'organisateur, selon ses propres modalités." },
  { q: "Puis-je annuler ma demande ?", a: "L'annulation se gère directement avec l'organisateur, chacun ayant sa propre politique. Voir la page « Politique d'annulation » pour en savoir plus." },
  { q: "Le matériel est-il fourni ?", a: "La plupart des stages incluent les balles. Les raquettes sont généralement à apporter, sauf mention contraire sur la fiche du stage." },
];

const ORGANIZER_FAQ = [
  { q: "Comment devenir organisateur sur BookMyPadel ?", a: "Créez votre compte organisateur, publiez votre stage en renseignant votre lien de contact (site, formulaire ou WhatsApp), et recevez des demandes qualifiées de joueurs directement dans votre tableau de bord." },
  { q: "Quelle commission est prélevée ?", a: "Aucun prélèvement automatique : une commission de 5% s'applique uniquement sur les réservations que vous déclarez confirmées depuis votre tableau de bord. Vous ne payez que sur ce qui se concrétise réellement." },
  { q: "Comment sont facturées les commissions ?", a: "Vous marquez chaque demande comme « réservation confirmée » en indiquant son montant ; la commission correspondante est calculée automatiquement et vous est facturée périodiquement, hors plateforme." },
  { q: "Comment fonctionne la mise en avant payante ?", a: "Vous pouvez booster un stage pour améliorer sa position dans les résultats de recherche et sa visibilité sur la page d'accueil, voir la page Tarifs." },
];

export default function FaqPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <Reveal>
        <h1 className="font-display text-3xl font-bold text-ink">Questions fréquentes</h1>
      </Reveal>

      <Reveal className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">Pour les joueurs</h2>
        <div className="mt-4">
          <Accordion items={PLAYER_FAQ} />
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">Pour les organisateurs</h2>
        <div className="mt-4">
          <Accordion items={ORGANIZER_FAQ} />
        </div>
      </Reveal>
    </div>
  );
}
