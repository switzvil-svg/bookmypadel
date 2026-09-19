"use client";

import { Level, LEVEL_LABEL } from "@/types";
import { cities } from "@/data/stages";
import { cn } from "@/lib/utils";

export interface FilterState {
  city: string;
  levels: Level[];
  priceMax: number;
  durationMax: number;
  accommodationOnly: boolean;
  minParticipants: number;
}

export const DEFAULT_FILTERS: FilterState = {
  city: "",
  levels: [],
  priceMax: 900,
  durationMax: 30,
  accommodationOnly: false,
  minParticipants: 1,
};

export function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
}) {
  function toggleLevel(level: Level) {
    onChange({
      ...value,
      levels: value.levels.includes(level)
        ? value.levels.filter((l) => l !== level)
        : [...value.levels, level],
    });
  }

  return (
    <div className="space-y-7 rounded-lg border border-mist-200 bg-white p-5">
      <div>
        <h3 className="font-display text-sm font-semibold text-ink">Ville / région</h3>
        <select
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          className="mt-3 h-10 w-full cursor-pointer rounded-md border border-mist-200 bg-white px-3 text-sm outline-none focus:border-court-500"
        >
          <option value="">Toutes les villes</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold text-ink">Niveau</h3>
        <div className="mt-3 space-y-2">
          {(Object.keys(LEVEL_LABEL) as Level[]).map((level) => (
            <label key={level} className="flex cursor-pointer items-center gap-2.5 text-sm text-mist-700">
              <input
                type="checkbox"
                checked={value.levels.includes(level)}
                onChange={() => toggleLevel(level)}
                className="h-4 w-4 cursor-pointer rounded border-mist-300 text-court-500 focus:ring-court-500"
              />
              {LEVEL_LABEL[level]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-ink">Prix maximum</h3>
          <span className="text-sm font-semibold text-court-600">{value.priceMax} €</span>
        </div>
        <input
          type="range"
          min={50}
          max={900}
          step={10}
          value={value.priceMax}
          onChange={(e) => onChange({ ...value, priceMax: Number(e.target.value) })}
          className="mt-3 w-full cursor-pointer accent-court-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-ink">Durée maximum</h3>
          <span className="text-sm font-semibold text-court-600">{value.durationMax} j</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={value.durationMax}
          onChange={(e) => onChange({ ...value, durationMax: Number(e.target.value) })}
          className="mt-3 w-full cursor-pointer accent-court-500"
        />
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold text-ink">Participants</h3>
        <select
          value={value.minParticipants}
          onChange={(e) => onChange({ ...value, minParticipants: Number(e.target.value) })}
          className="mt-3 h-10 w-full cursor-pointer rounded-md border border-mist-200 bg-white px-3 text-sm outline-none focus:border-court-500"
        >
          {[1, 2, 4, 6].map((n) => (
            <option key={n} value={n}>
              {n}+ place{n > 1 ? "s" : ""} disponible{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-md border border-mist-200 p-3">
        <span className="text-sm font-medium text-ink">Hébergement proposé</span>
        <input
          type="checkbox"
          checked={value.accommodationOnly}
          onChange={(e) => onChange({ ...value, accommodationOnly: e.target.checked })}
          className={cn("h-4 w-4 cursor-pointer rounded border-mist-300 text-court-500 focus:ring-court-500")}
        />
      </label>

      <button
        type="button"
        onClick={() => onChange(DEFAULT_FILTERS)}
        className="w-full cursor-pointer text-center text-sm font-semibold text-mist-500 underline-offset-4 hover:text-court-600 hover:underline"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
