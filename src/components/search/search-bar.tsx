"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { MapPin, CalendarDays, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { cities } from "@/data/stages";
import { LEVEL_LABEL } from "@/types";

export function SearchBar({ compact = false, className }: { compact?: boolean; className?: string }) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("ville", city);
    if (level) params.set("niveau", level);
    if (date) params.set("date", date);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border border-mist-200 bg-white p-2 shadow-lg transition-all duration-300 ease-out lg:flex-row lg:items-center",
        compact ? "lg:p-1.5" : "lg:p-2.5",
        className
      )}
    >
      <label className="flex flex-1 items-center gap-3 rounded-md px-4 py-2.5 transition-colors hover:bg-mist-50 lg:border-r lg:border-mist-200">
        <MapPin size={18} className="shrink-0 text-court-500" />
        <div className="flex w-full flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-mist-400">Destination</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-medium text-ink outline-none"
          >
            <option value="">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className="flex flex-1 items-center gap-3 rounded-md px-4 py-2.5 transition-colors hover:bg-mist-50 lg:border-r lg:border-mist-200">
        <CalendarDays size={18} className="shrink-0 text-court-500" />
        <div className="flex w-full flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-mist-400">Dates</span>
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-medium text-ink outline-none"
          />
        </div>
      </label>

      <label className="flex flex-1 items-center gap-3 rounded-md px-4 py-2.5 transition-colors hover:bg-mist-50">
        <Users size={18} className="shrink-0 text-court-500" />
        <div className="flex w-full flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-mist-400">Niveau</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-medium text-ink outline-none"
          >
            <option value="">Tous niveaux</option>
            {Object.entries(LEVEL_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </label>

      <button
        type="submit"
        className="flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-citron-500 px-6 font-bold text-ink transition-all duration-200 hover:bg-citron-600 hover:shadow-md lg:h-auto lg:self-stretch"
      >
        <Search size={18} strokeWidth={2.5} />
        Rechercher
      </button>
    </form>
  );
}
