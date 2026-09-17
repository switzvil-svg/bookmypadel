"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isWithinInterval,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function AvailabilityCalendar({ start, end }: { start: string; end: string }) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const monthStart = startOfMonth(startDate);
  const monthEnd = endOfMonth(startDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="rounded-lg border border-mist-200 bg-white p-5">
      <p className="font-display text-sm font-semibold capitalize text-ink">
        {format(monthStart, "MMMM yyyy", { locale: fr })}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-mist-400">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inRange = isWithinInterval(day, { start: startDate, end: endDate });
          const inMonth = isSameMonth(day, monthStart);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex h-9 items-center justify-center rounded-md text-xs",
                inRange ? "bg-court-500 font-semibold text-white" : inMonth ? "text-ink" : "text-mist-300"
              )}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-mist-500">
        <span className="h-3 w-3 rounded-sm bg-court-500" /> Dates du stage
      </div>
    </div>
  );
}
