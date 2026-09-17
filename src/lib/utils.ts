import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth();
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const startStr = new Intl.DateTimeFormat("fr-FR", sameMonth ? { day: "numeric" } : opts).format(s);
  const endStr = new Intl.DateTimeFormat("fr-FR", opts).format(e);
  return `${startStr} – ${endStr}`;
}

export function formatDateLong(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(date)
  );
}
