import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Users2, Briefcase } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export const metadata: Metadata = { title: "Comment ça marche" };

export default function HowItWorksHub() {
  return (
    <div className="container-page py-16">
      <Reveal className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Comment ça marche</h1>
        <p className="mt-3 text-mist-600">BookMyPadel fonctionne différemment selon que vous cherchez un stage ou que vous en organisez.</p>
      </Reveal>

      <RevealGroup className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <RevealItem>
          <Link href="/comment-ca-marche/joueurs" className="group block h-full rounded-lg border border-mist-200 bg-white p-7 transition-shadow hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-court-50 text-court-600">
              <Users2 size={22} />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">Pour les joueurs</h2>
            <p className="mt-2 text-sm text-mist-600">Trouver, comparer et réserver un stage de padel en quelques minutes.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-court-600 group-hover:gap-2">
              Découvrir <ArrowRight size={15} />
            </span>
          </Link>
        </RevealItem>
        <RevealItem>
          <Link href="/comment-ca-marche/organisateurs" className="group block h-full rounded-lg border border-mist-200 bg-white p-7 transition-shadow hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-citron-200 text-ink">
              <Briefcase size={22} />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">Pour les organisateurs</h2>
            <p className="mt-2 text-sm text-mist-600">Publier vos stages, gérer vos réservations et être payé automatiquement.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-court-600 group-hover:gap-2">
              Découvrir <ArrowRight size={15} />
            </span>
          </Link>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
