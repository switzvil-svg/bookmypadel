import { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = { title: "Conditions Générales de Vente" };

const SECTIONS = [
  {
    title: "1. Objet",
    body: "Les présentes conditions générales de vente régissent les réservations de stages de padel effectuées sur la plateforme BookMyPadel, qui agit en tant qu'intermédiaire entre les joueurs et les organisateurs (coachs, clubs) indépendants.",
  },
  {
    title: "2. Rôle de la plateforme",
    body: "BookMyPadel est un service de mise en relation : il permet aux joueurs de découvrir des stages et d'être mis en contact directement avec l'organisateur qui les propose. Chaque stage est organisé sous la seule responsabilité de l'organisateur qui l'a publié. BookMyPadel n'encaisse aucun paiement pour le compte des organisateurs et ne prélève pas de commission automatique sur les transactions entre le joueur et l'organisateur.",
  },
  {
    title: "3. Mise en relation et réservation",
    body: "La création d'un compte (nom et email) est nécessaire pour accéder aux coordonnées d'un organisateur. En cliquant sur « Voir l'offre », le joueur est redirigé vers le site, le formulaire ou le contact WhatsApp renseigné par l'organisateur. La réservation, ses modalités et son paiement sont ensuite gérés exclusivement entre le joueur et l'organisateur, en dehors de la plateforme BookMyPadel.",
  },
  {
    title: "4. Annulation et remboursement",
    body: "BookMyPadel n'étant pas partie à la réservation ni au paiement, les conditions d'annulation et de remboursement sont celles fixées par l'organisateur et communiquées directement au joueur au moment de la prise de contact. Voir la page « Politique d'annulation » pour plus de détails.",
  },
  {
    title: "5. Responsabilité",
    body: "BookMyPadel n'est pas organisateur des stages proposés sur la plateforme et ne saurait être tenu responsable de leur bon déroulement, du niveau d'encadrement ou de tout dommage survenu pendant le stage. Chaque organisateur certifie disposer des assurances et qualifications requises.",
  },
  {
    title: "6. Données personnelles",
    body: "Les données collectées lors de la réservation sont utilisées uniquement dans le cadre de la mise en relation entre joueurs et organisateurs et de la gestion des paiements, conformément à notre politique de confidentialité.",
  },
];

export default function CgvPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <Reveal>
        <h1 className="font-display text-3xl font-bold text-ink">Conditions Générales de Vente</h1>
        <p className="mt-2 text-sm text-mist-500">Dernière mise à jour : 1er septembre 2026</p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <Reveal key={s.title}>
            <h2 className="font-display text-lg font-semibold text-ink">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist-700">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
