"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/store/favorites";
import { myWishlist } from "@/data/account";
import { StageCard } from "@/components/stage/stage-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Stage } from "@/types";

export function FavoritesClient({ allStages }: { allStages: Stage[] }) {
  const ids = useFavorites((s) => s.ids);
  const toggle = useFavorites((s) => s.toggle);

  useEffect(() => {
    const seeded = localStorage.getItem("bookmypadel-favorites-seeded");
    if (!seeded) {
      myWishlist.forEach((s) => toggle(s.id));
      localStorage.setItem("bookmypadel-favorites-seeded", "1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favorited = allStages.filter((s) => ids.includes(s.id));

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">Mes favoris</h2>
      {favorited.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-mist-300 bg-white p-12 text-center">
          <Heart size={28} className="mx-auto text-mist-300" />
          <p className="mt-3 text-sm text-mist-600">
            Vous n’avez pas encore de stage favori. Cliquez sur le cœur d’un stage pour l’ajouter ici.
          </p>
        </div>
      ) : (
        <RevealGroup className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {favorited.map((s) => (
            <RevealItem key={s.id}>
              <StageCard stage={s} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
