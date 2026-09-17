import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Users2, RotateCcw } from "lucide-react";

const COLUMNS = [
  {
    title: "Joueurs",
    links: [
      { href: "/recherche", label: "Trouver un stage" },
      { href: "/comment-ca-marche/joueurs", label: "Comment ça marche" },
      { href: "/compte/favoris", label: "Mes favoris" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Organisateurs",
    links: [
      { href: "/organisateurs", label: "Devenir organisateur" },
      { href: "/organisateurs/tableau-de-bord", label: "Espace pro" },
      { href: "/comment-ca-marche/organisateurs", label: "Comment ça marche" },
      { href: "/organisateurs/tarifs", label: "Commissions & mise en avant" },
    ],
  },
  {
    title: "Confiance",
    links: [
      { href: "/cgv", label: "CGV" },
      { href: "/annulation", label: "Politique d'annulation" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-mist-200">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-horizontal-dark.png"
              alt="BookMyPadel"
              width={300}
              height={80}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-mist-400">
            Le comparateur des stages de padel. Trouvez, comparez et entrez en contact
            directement avec l’organisateur, partout en Europe.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-mist-400">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-citron-400" /> Aucun paiement en ligne
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw size={14} className="text-citron-400" /> Conditions fixées par l’organisateur
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users2 size={14} className="text-citron-400" /> Mise en relation directe
            </span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-mist-400 transition-colors hover:text-citron-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-mist-400 sm:flex-row">
          <p>© 2026 BookMyPadel. Tous droits réservés.</p>
          <p>Conçu pour la communauté padel.</p>
        </div>
      </div>
    </footer>
  );
}
