"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, CalendarCheck, Heart, MessageSquareText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/auth-provider";

const LINKS = [
  { href: "/compte", label: "Vue d'ensemble", icon: LayoutGrid },
  { href: "/compte/reservations", label: "Mes réservations", icon: CalendarCheck },
  { href: "/compte/favoris", label: "Favoris", icon: Heart },
  { href: "/compte/avis", label: "Mes avis", icon: MessageSquareText },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <aside>
      <div className="flex items-center gap-3 rounded-lg border border-mist-200 bg-white p-4">
        <Avatar name={user?.name ?? "Joueur"} seed={user?.id ?? "current-user"} size={44} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user?.name ?? "Joueur"}</p>
          <p className="truncate text-xs text-mist-500">{user?.email ?? "Joueur BookMyPadel"}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-2 flex w-full items-center gap-2.5 rounded-md border border-mist-200 bg-white px-3 py-2.5 text-sm font-medium text-mist-600 transition-colors hover:bg-mist-100"
      >
        <LogOut size={16} /> Se déconnecter
      </button>
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
