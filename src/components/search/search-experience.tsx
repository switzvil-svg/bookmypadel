"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Stage } from "@/types";
import { StageCard } from "@/components/stage/stage-card";
import { StageCardSkeleton } from "@/components/ui/skeleton";
import { Filters, FilterState, DEFAULT_FILTERS } from "./filters";
import { Button } from "@/components/ui/button";

export function SearchExperience({
  initialCity,
  initialLevel,
  allStages,
}: {
  initialCity?: string;
  initialLevel?: string;
  allStages: Stage[];
}) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    city: initialCity ?? "",
    levels: initialLevel ? [initialLevel as FilterState["levels"][number]] : [],
  });
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [filters]);

  const results = useMemo(() => {
    return allStages.filter((s) => {
      if (filters.city && s.city !== filters.city) return false;
      if (filters.levels.length && !filters.levels.includes(s.level)) return false;
      if (s.pricePerPerson > filters.priceMax) return false;
      if (s.durationDays > filters.durationMax) return false;
      if (filters.accommodationOnly && !s.accommodationIncluded) return false;
      if (s.spotsLeft < filters.minParticipants) return false;
      return true;
    });
  }, [allStages, filters]);

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">
            {loading ? "Recherche…" : `${results.length} stage${results.length !== 1 ? "s" : ""} disponible${results.length !== 1 ? "s" : ""}`}
          </h1>
          {filters.city && <p className="mt-0.5 text-sm text-mist-600">à {filters.city}</p>}
        </div>
        <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
          <SlidersHorizontal size={16} /> Filtres
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <Filters value={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <StageCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-dashed border-mist-300 bg-white p-16 text-center"
              >
                <p className="font-display text-lg font-semibold text-ink">Aucun stage ne correspond</p>
                <p className="mt-1 text-sm text-mist-600">Essayez d’élargir vos filtres pour voir plus de résultats.</p>
                <Button variant="secondary" className="mt-5" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {results.map((s) => (
                  <motion.div
                    key={s.id}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <StageCard stage={s} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-mist-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-semibold">Filtres</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="cursor-pointer rounded-full p-2 hover:bg-mist-200" aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>
              <Filters value={filters} onChange={setFilters} />
              <Button className="mt-4 w-full" onClick={() => setMobileFiltersOpen(false)}>
                Voir {results.length} résultat{results.length !== 1 ? "s" : ""}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
