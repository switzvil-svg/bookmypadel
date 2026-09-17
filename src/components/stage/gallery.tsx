"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";

export function Gallery({ seeds, title }: { seeds: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="grid h-[280px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-lg sm:h-[420px]">
        <button onClick={() => setOpen(0)} className="col-span-2 row-span-2 cursor-pointer">
          <CoverArt seed={seeds[0]} className="h-full w-full transition-opacity hover:opacity-90" />
        </button>
        {seeds.slice(1, 5).map((s, i) => (
          <button key={s} onClick={() => setOpen(i + 1)} className="relative cursor-pointer">
            <CoverArt seed={s} className="h-full w-full transition-opacity hover:opacity-90" />
            {i === 3 && seeds.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink/50 text-sm font-semibold text-white">
                <Images size={16} /> +{seeds.length - 5}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 text-white">
              <p className="font-display text-sm font-semibold">{title}</p>
              <button onClick={() => setOpen(null)} className="cursor-pointer rounded-full p-2 hover:bg-white/10" aria-label="Fermer">
                <X size={22} />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-6 pb-6">
              <button
                onClick={() => setOpen((o) => (o === null ? 0 : (o - 1 + seeds.length) % seeds.length))}
                className="absolute left-4 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                aria-label="Précédent"
              >
                <ChevronLeft size={22} />
              </button>
              <motion.div
                key={open}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="h-full max-h-[70vh] w-full max-w-3xl"
              >
                <CoverArt seed={seeds[open]} className="h-full w-full" rounded="rounded-lg" />
              </motion.div>
              <button
                onClick={() => setOpen((o) => (o === null ? 0 : (o + 1) % seeds.length))}
                className="absolute right-4 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                aria-label="Suivant"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
