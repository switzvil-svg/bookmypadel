"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/store/favorites";

export function FavoriteButton({ id, className }: { id: string; className?: string }) {
  const has = useFavorites((s) => s.has(id));
  const toggle = useFavorites((s) => s.toggle);
  const [pop, setPop] = useState(false);

  return (
    <button
      type="button"
      aria-label={has ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={has}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
        if (!has) {
          setPop(true);
          setTimeout(() => setPop(false), 400);
        }
      }}
      className={cn(
        "relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-court-500",
        className
      )}
    >
      <Heart
        size={18}
        className={cn(
          "transition-colors",
          has ? "fill-destructive text-destructive" : "text-ink"
        )}
      />
      <AnimatePresence>
        {pop && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 1.9, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 rounded-full bg-destructive/40"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
