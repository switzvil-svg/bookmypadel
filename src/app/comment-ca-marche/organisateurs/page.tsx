import Link from "next/link";
import { Metadata } from "next";
import { UserPlus, FilePlus2, Inbox, FileCheck2, ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Comment ça marche — Organisateurs" };

const STEPS = [
  { icon: UserPlus, title: "Créez votre compte", desc: "Inscription en ligne et renseignement de votre lien de contact (site, formulaire ou WhatsApp)." },
  { icon: FilePlus2, title: "Publiez votre stage", desc: "Formulaire multi-étapes : informations, dates, tarifs, photos. Publié en quelques minutes." },
  { icon: Inbox, title: "Recevez des demandes", desc: "Chaque joueur intéressé est redirigé vers vous directement, avec un suivi dans votre tableau de bord." },
  { icon: FileCheck2, title: "Déclarez vos réservations", desc: "Marquez les demandes converties en réservation confirmée ; la commission n'est due que sur ce qui se concrétise." },
];

export default function HowItWorksOrganizers() {
  return (
    <div className="container-page py-16">
      <Reveal className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Comment publier un stage</h1>
        <p className="mt-3 text-mist-600">Le parcours organisateur, de l’inscription à la première réservation déclarée.</p>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <RevealItem key={s.title} className="relative rounded-lg border border-mist-200 bg-white p-6">
            <span className="absolute right-4 top-4 font-display text-3xl font-bold text-mist-100">0{i + 1}</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-citron-200 text-ink">
              <s.icon size={20} />
            </span>
            <h3 className="mt-4 font-display font-semibold text-ink">{s.title}</h3>
            <p className="mt-1.5 text-sm text-mist-600">{s.desc}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mx-auto mt-14 max-w-md text-center">
        <Link href="/organisateurs/nouveau-stage">
          <Button variant="cta" size="lg">
            Publier mon premier stage <ArrowRight size={18} />
          </Button>
        </Link>
      </Reveal>
    </div>
  );
}
