import Link from "next/link";
import { Metadata } from "next";
import { Search, CalendarCheck, MessageCircle, Trophy, ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Comment ça marche — Joueurs" };

const STEPS = [
  { icon: Search, title: "Recherchez", desc: "Filtrez par ville, dates, niveau et budget pour trouver le stage qui vous correspond." },
  { icon: CalendarCheck, title: "Comparez", desc: "Consultez le programme, le profil du coach et les avis des anciens participants." },
  { icon: MessageCircle, title: "Entrez en contact", desc: "Créez un compte gratuit et cliquez sur « Voir l'offre » : vous êtes redirigé directement vers l'organisateur." },
  { icon: Trophy, title: "Progressez", desc: "Participez à votre stage et laissez un avis pour aider les futurs joueurs." },
];

export default function HowItWorksPlayers() {
  return (
    <div className="container-page py-16">
      <Reveal className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Comment trouver un stage</h1>
        <p className="mt-3 text-mist-600">De la recherche à la mise en relation, en quatre étapes simples.</p>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <RevealItem key={s.title} className="relative rounded-lg border border-mist-200 bg-white p-6">
            <span className="absolute right-4 top-4 font-display text-3xl font-bold text-mist-100">0{i + 1}</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-court-50 text-court-600">
              <s.icon size={20} />
            </span>
            <h3 className="mt-4 font-display font-semibold text-ink">{s.title}</h3>
            <p className="mt-1.5 text-sm text-mist-600">{s.desc}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mx-auto mt-14 max-w-md text-center">
        <Link href="/recherche">
          <Button size="lg">
            Trouver mon stage <ArrowRight size={18} />
          </Button>
        </Link>
      </Reveal>
    </div>
  );
}
