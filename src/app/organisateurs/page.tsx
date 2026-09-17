import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, TrendingUp, CalendarCheck, Inbox, Megaphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CoverArt } from "@/components/ui/cover-art";

export const metadata: Metadata = { title: "Devenir organisateur" };

const BENEFITS = [
  { icon: TrendingUp, title: "Plus de visibilité", desc: "Vos stages exposés à des milliers de joueurs qui cherchent activement une offre comme la vôtre." },
  { icon: CalendarCheck, title: "Gestion simplifiée", desc: "Calendrier, disponibilités et réservations centralisés dans un seul tableau de bord." },
  { icon: Inbox, title: "Leads qualifiés", desc: "Recevez directement les demandes des joueurs intéressés, avec un suivi complet dans votre tableau de bord." },
  { icon: Megaphone, title: "Mise en avant payante", desc: "Boostez la visibilité de vos stages en tête de recherche quand vous en avez besoin." },
];

const STEPS = [
  "Créez votre compte organisateur et renseignez votre lien de contact",
  "Publiez votre premier stage en quelques minutes",
  "Recevez des leads qualifiés et gérez-les dans votre tableau de bord",
  "Déclarez vos réservations confirmées, facturées en commission",
];

export default function OrganizersLandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
        <div className="court-lines absolute inset-0 opacity-[0.08]" />
        <div className="container-page relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-citron-300">
              Espace organisateurs
            </span>
            <h1 className="text-balance mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
              Développez votre activité de coaching padel
            </h1>
            <p className="mt-5 max-w-lg text-balance text-mist-200">
              Rejoignez les clubs et coachs qui publient leurs stages sur BookMyPadel et
              transformez votre expertise en réservations, sans effort marketing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/organisateurs/tableau-de-bord">
                <Button variant="cta" size="lg">
                  Créer mon compte organisateur <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/organisateurs/tarifs">
                <Button variant="outline-light" size="lg">
                  Voir les commissions
                </Button>
              </Link>
            </div>
          </Reveal>
          <Reveal className="hidden lg:block">
            <div className="h-80 overflow-hidden rounded-xl shadow-xl">
              <CoverArt seed="organizers-hero" className="h-full w-full" rounded="rounded-none" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Pourquoi publier sur BookMyPadel</h2>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <RevealItem key={b.title} className="rounded-lg border border-mist-200 bg-white p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-court-50 text-court-600">
                <b.icon size={20} />
              </span>
              <h3 className="mt-4 font-display font-semibold text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm text-mist-600">{b.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-court-50/60 py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Comment ça marche</h2>
            <ol className="mt-6 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-court-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm text-mist-700">{s}</p>
                </li>
              ))}
            </ol>
            <Link href="/organisateurs/nouveau-stage" className="mt-7 inline-block">
              <Button variant="primary" size="lg">
                Publier mon premier stage <ArrowRight size={18} />
              </Button>
            </Link>
          </Reveal>
          <Reveal className="rounded-lg border border-mist-200 bg-white p-6">
            <h3 className="font-display font-semibold text-ink">Ce qui est inclus</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mist-700">
              {[
                "Page de stage optimisée avec photos, avis et calendrier",
                "Réception des demandes directement sur votre site, formulaire ou WhatsApp",
                "Statistiques de vues, taux de conversion et leads reçus",
                "Support dédié aux organisateurs 7j/7",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
