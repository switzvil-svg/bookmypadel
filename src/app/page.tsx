import Link from "next/link";
import { ShieldCheck, RotateCcw, Award, Users2, ArrowRight, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { StageCard } from "@/components/stage/stage-card";
import { CoverArt } from "@/components/ui/cover-art";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { stages, cities } from "@/data/stages";

const STATS = [
  { icon: Award, value: "180+", label: "stages disponibles" },
  { icon: Users2, value: "6 200+", label: "joueurs accompagnés" },
  { icon: ShieldCheck, value: "4.8/5", label: "note moyenne" },
  { icon: Sparkles, value: "60+", label: "coachs certifiés" },
];

export default function HomePage() {
  const popular = stages.filter((s) => s.popular).slice(0, 4);
  const featured = stages.filter((s) => s.featured).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="court-lines absolute inset-0 opacity-[0.08]" />
        <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-court-600/40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full bg-citron-500/20 blur-3xl" />

        <div className="container-page relative py-20 sm:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-citron-300">
              <Sparkles size={14} /> La marketplace des stages de padel
            </span>
            <h1 className="text-balance mt-6 font-display text-4xl font-bold leading-[1.08] text-white sm:text-6xl">
              Progressez au padel, où que vous jouiez
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base text-mist-200 sm:text-lg">
              Comparez des centaines de stages encadrés par des coachs certifiés, du week-end
              découverte au séjour intensif tout compris.
            </p>
          </Reveal>

          <Reveal className="mx-auto mt-10 max-w-4xl">
            <SearchBar />
          </Reveal>

          <Reveal className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-mist-400">
            <span>Destinations populaires :</span>
            {cities.slice(0, 6).map((c, i) => (
              <span key={c}>
                <Link href={`/recherche?ville=${encodeURIComponent(c)}`} className="text-mist-200 underline-offset-4 hover:text-citron-300 hover:underline">
                  {c}
                </Link>
                {i < 5 ? "," : ""}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-mist-200 bg-white py-8">
        <RevealGroup className="container-page grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-court-50 text-court-600">
                <s.icon size={20} />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-ink">{s.value}</p>
                <p className="text-xs text-mist-500">{s.label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Stages populaires */}
      <section className="container-page py-16 sm:py-20">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Stages populaires</h2>
            <p className="mt-1 text-sm text-mist-600">Les stages les plus réservés en ce moment.</p>
          </div>
          <Link href="/recherche" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-court-600 hover:text-court-700 sm:inline-flex">
            Voir tout <ArrowRight size={16} />
          </Link>
        </Reveal>

        <RevealGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((s) => (
            <RevealItem key={s.id}>
              <StageCard stage={s} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Stages à la une */}
      <section className="bg-court-50/60 py-16 sm:py-20">
        <div className="container-page">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Stages à la une</h2>
              <p className="mt-1 text-sm text-mist-600">Sélectionnés et mis en avant par nos organisateurs partenaires.</p>
            </div>
          </Reveal>

          <RevealGroup className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featured.map((s) => (
              <RevealItem key={s.id}>
                <StageCard stage={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Par destination */}
      <section className="container-page py-16 sm:py-20">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Par destination</h2>
          <p className="mt-1 text-sm text-mist-600">Explorez les stages disponibles ville par ville.</p>
        </Reveal>

        <RevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cities.map((c) => {
            const count = stages.filter((s) => s.city === c).length;
            return (
              <RevealItem key={c}>
                <Link
                  href={`/recherche?ville=${encodeURIComponent(c)}`}
                  className="group relative block h-32 overflow-hidden rounded-lg"
                >
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                    <CoverArt seed={"city-" + c} className="h-full w-full" rounded="rounded-none" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="font-display text-sm font-bold text-white">{c}</p>
                    <p className="text-xs text-white/80">{count} stage{count > 1 ? "s" : ""}</p>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* Bandeau confiance */}
      <section className="border-y border-mist-200 bg-white py-14">
        <RevealGroup className="container-page grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Aucun paiement en ligne", desc: "BookMyPadel ne prend jamais vos coordonnées bancaires : vous réservez directement avec l'organisateur." },
            { icon: RotateCcw, title: "Conditions claires", desc: "Chaque organisateur communique ses propres conditions d'annulation au moment du contact." },
            { icon: Award, title: "Coachs vérifiés", desc: "Chaque coach est certifié et évalué par la communauté après chaque stage." },
          ].map((f) => (
            <RevealItem key={f.title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-citron-200 text-ink">
                <f.icon size={22} />
              </span>
              <div>
                <h3 className="font-display font-semibold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-mist-600">{f.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* CTA organisateur */}
      <section className="container-page py-16 sm:py-20">
        <Reveal className="relative overflow-hidden rounded-xl bg-ink px-8 py-14 text-center sm:px-16">
          <div className="court-lines absolute inset-0 opacity-[0.06]" />
          <h2 className="text-balance relative font-display text-2xl font-bold text-white sm:text-3xl">
            Vous êtes coach ou club de padel ?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-balance text-sm text-mist-300 sm:text-base">
            Publiez vos stages, gérez vos disponibilités et vos réservations, et touchez des
            milliers de joueurs à la recherche de leur prochain stage.
          </p>
          <div className="relative mt-7">
            <Link href="/organisateurs">
              <Button variant="cta" size="lg">
                Devenir organisateur <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
