"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarCheck, Heart, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const LINKS = [
  { href: "/compte", label: "Vue d'ensemble", icon: LayoutGrid },
  { href: "/compte/reservations", label: "Mes réservations", icon: CalendarCheck },
  { href: "/compte/favoris", label: "Favoris", icon: Heart },
  { href: "/compte/avis", label: "Mes avis", icon: MessageSquareText },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside>
      <div className="flex items-center gap-3 rounded-lg border border-mist-200 bg-white p-4">
        <Avatar name="Alexis Villette" seed="current-user" size={44} />
        <div>
          <p className="text-sm font-semibold text-ink">Alexis Villette</p>
          <p className="text-xs text-mist-500">Joueur BookMyPadel</p>
        </div>
      </div>
      <nav className="mt-3 flex gap-1 overflow-x-auto rounded-lg border border-mist-200 bg-white p-2 lg:flex-col lg:overflow-visible">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-court-50 text-court-700" : "text-mist-600 hover:bg-mist-100"
              )}
            >
              <l.icon size={16} /> {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
