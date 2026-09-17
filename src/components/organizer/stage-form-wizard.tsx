"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StepIndicator } from "@/components/booking/step-indicator";
import { LEVEL_LABEL } from "@/types";
import { CoverArt } from "@/components/ui/cover-art";
import { PhotoUploader } from "./photo-uploader";

const LABELS = ["Informations", "Dates & places", "Tarifs", "Photos", "Publication"];

const variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function StageFormWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    city: "",
    level: "tous-niveaux",
    description: "",
    start: "",
    end: "",
    spots: 10,
    price: 300,
    accommodation: false,
    externalUrl: "",
    photos: [] as string[],
  });
  const published = step === 4;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div>
      <StepIndicator step={Math.min(step, 4)} labels={LABELS} />

      <div className="relative mt-10 min-h-[380px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="font-display text-xl font-bold text-ink">Informations générales</h2>
              <div className="mt-5 max-w-xl space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Titre du stage</label>
                  <Input className="mt-1.5" placeholder="Ex : Stage intensif débutant — Côte d'Azur" value={form.title} onChange={(e) => update("title", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Ville</label>
                  <Input className="mt-1.5" placeholder="Ex : Nice" value={form.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Niveau</label>
                  <select
                    value={form.level}
                    onChange={(e) => update("level", e.target.value)}
                    className="mt-1.5 h-11 w-full cursor-pointer rounded-md border border-mist-200 bg-white px-4 text-sm outline-none focus:border-court-500"
                  >
                    {Object.entries(LEVEL_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Décrivez le contenu et les objectifs du stage…"
                    className="mt-1.5 w-full rounded-md border border-mist-200 bg-white p-3 text-sm outline-none focus:border-court-500"
                  />
                </div>
              </div>
              <Button className="mt-6" onClick={() => setStep(1)}>
                Continuer
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="font-display text-xl font-bold text-ink">Dates & places disponibles</h2>
              <div className="mt-5 grid max-w-xl grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Date de début</label>
                  <Input type="date" className="mt-1.5" value={form.start} onChange={(e) => update("start", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Date de fin</label>
                  <Input type="date" className="mt-1.5" value={form.end} onChange={(e) => update("end", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Nombre de places</label>
                  <Input type="number" min={1} className="mt-1.5" value={form.spots} onChange={(e) => update("spots", Number(e.target.value))} />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(0)}>Retour</Button>
                <Button onClick={() => setStep(2)}>Continuer</Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="font-display text-xl font-bold text-ink">Tarifs & hébergement</h2>
              <div className="mt-5 max-w-xl space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">Prix par personne (€)</label>
                  <Input type="number" min={0} className="mt-1.5" value={form.price} onChange={(e) => update("price", Number(e.target.value))} />
                </div>
                <label className="flex cursor-pointer items-center justify-between rounded-md border border-mist-200 p-3">
                  <span className="text-sm font-medium text-ink">Hébergement inclus</span>
                  <input
                    type="checkbox"
                    checked={form.accommodation}
                    onChange={(e) => update("accommodation", e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-mist-300 text-court-500 focus:ring-court-500"
                  />
                </label>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-mist-500">
                    Lien de contact (site, formulaire ou WhatsApp)
                  </label>
                  <Input
                    className="mt-1.5"
                    placeholder="https://... ou https://wa.me/33…"
                    value={form.externalUrl}
                    onChange={(e) => update("externalUrl", e.target.value)}
                  />
                  <p className="mt-1.5 text-xs text-mist-500">
                    C’est vers ce lien que les joueurs intéressés seront redirigés en cliquant sur
                    « Voir l’offre ».
                  </p>
                </div>
                <div className="rounded-md bg-court-50 p-3 text-sm text-court-700">
                  Aucun paiement en ligne : commission de 5% due uniquement sur les réservations
                  que vous déclarez confirmées depuis votre tableau de bord.
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>Retour</Button>
                <Button onClick={() => setStep(3)}>Continuer</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="font-display text-xl font-bold text-ink">Photos du stage</h2>
              <p className="mt-1 text-sm text-mist-600">Ajoutez des photos immersives : terrains, groupe, hébergement.</p>
              <div className="mt-5 max-w-xl">
                <PhotoUploader value={form.photos} onChange={(photos) => update("photos", photos)} />
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)}>Retour</Button>
                <Button onClick={() => setStep(4)}>Publier le stage</Button>
              </div>
            </motion.div>
          )}

          {published && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center rounded-lg border border-mist-200 bg-white p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success"
              >
                <CheckCircle2 size={36} />
              </motion.div>
              <h2 className="mt-5 font-display text-xl font-bold text-ink">Stage publié !</h2>
              <p className="mt-2 max-w-sm text-sm text-mist-600">
                Votre stage {form.title ? `« ${form.title} » ` : ""}est maintenant visible par les joueurs.
                Vous pouvez suivre ses performances depuis votre tableau de bord.
              </p>
              <div className="relative mt-5 h-32 w-full max-w-sm overflow-hidden rounded-lg">
                {form.photos[0] ? (
                  <Image src={form.photos[0]} alt="" fill sizes="384px" className="object-cover" unoptimized />
                ) : (
                  <CoverArt seed={form.title || "new-stage"} className="h-full w-full" />
                )}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/organisateurs/tableau-de-bord">
                  <Button>Aller au tableau de bord</Button>
                </a>
                <a href="/organisateurs/tarifs">
                  <Button variant="secondary">
                    <Sparkles size={15} /> Booster ce stage
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
