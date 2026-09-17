"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, User, Heart, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/recherche", label: "Trouver un stage" },
  { href: "/organisateurs", label: "Pour les organisateurs" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mist-200/80 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" priority />
          BookMyPadel
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-mist-600 transition-colors hover:bg-mist-100 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/compte/favoris">
            <Button variant="ghost" size="icon" aria-label="Favoris">
              <Heart size={18} />
            </Button>
          </Link>
          <Link href="/compte">
            <Button variant="secondary" size="sm">
              <User size={16} /> Mon compte
            </Button>
          </Link>
          <Link href="/organisateurs/tableau-de-bord">
            <Button variant="primary" size="sm">
              <LayoutDashboard size={16} /> Espace pro
            </Button>
          </Link>
        </div>

        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-mist-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border-t border-mist-200 bg-white lg:hidden"
        >
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium text-mist-700 hover:bg-mist-100"
                )}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/compte" onClick={() => setOpen(false)}>
                <Button variant="secondary" className="w-full">
                  <User size={16} /> Mon compte
                </Button>
              </Link>
              <Link href="/organisateurs/tableau-de-bord" onClick={() => setOpen(false)}>
                <Button variant="primary" className="w-full">
                  <LayoutDashboard size={16} /> Espace pro
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
