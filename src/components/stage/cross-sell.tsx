"use client";

import { ExternalLink } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const EQUIPMENT = [
  { name: "Raquette Bullpadel Vertex", price: "189 €", partner: "Padel Store", seed: "eq-1" },
  { name: "Pack 3 balles Head Padel Pro", price: "9,90 €", partner: "Padel Store", seed: "eq-2" },
  { name: "Sac de padel Nox ML10", price: "79 €", partner: "Padel Store", seed: "eq-3" },
];

const STAYS = [
  { name: "Hôtel Le Court, à 300m des terrains", price: "dès 89 €/nuit", partner: "Booking partenaire", seed: "stay-1" },
  { name: "Appart'hôtel Riviera Padel", price: "dès 64 €/nuit", partner: "Booking partenaire", seed: "stay-2" },
];

export function CrossSell({ city }: { city: string }) {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-display text-xl font-bold text-ink">Équipement recommandé</h2>
        <p className="mt-1 text-sm text-mist-600">Sélection de nos partenaires équipementiers.</p>
        <RevealGroup className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {EQUIPMENT.map((item) => (
            <RevealItem key={item.name}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="group block overflow-hidden rounded-lg border border-mist-200 bg-white transition-shadow hover:shadow-md"
              >
                <div className="h-32 overflow-hidden">
                  <CoverArt seed={item.seed} className="h-full w-full transition-transform duration-500 group-hover:scale-105" rounded="rounded-none" />
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-court-600">{item.price}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-mist-400">
                      {item.partner} <ExternalLink size={11} />
                    </span>
                  </div>
                </div>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-ink">Où dormir près de {city}</h2>
        <p className="mt-1 text-sm text-mist-600">Hébergements partenaires à proximité des terrains.</p>
        <RevealGroup className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STAYS.map((item) => (
            <RevealItem key={item.name}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="group flex items-center gap-4 overflow-hidden rounded-lg border border-mist-200 bg-white p-3 transition-shadow hover:shadow-md"
              >
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md">
                  <CoverArt seed={item.seed} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <span className="text-sm font-semibold text-court-600">{item.price}</span>
                  <p className="inline-flex items-center gap-1 text-[11px] text-mist-400">
                    {item.partner} <ExternalLink size={11} />
                  </p>
                </div>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
