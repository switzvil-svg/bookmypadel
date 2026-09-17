"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, MoreHorizontal, Trash2, Loader2 } from "lucide-react";

export function StageRowActions({ stageId }: { stageId: string }) {
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeMenu() {
    setOpen(false);
    setConfirming(false);
    setError(null);
  }

  function toggleMenu() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((v) => !v);
  }

  // The menu is portaled out of the table (which clips overflow for its
  // rounded corners), so it no longer auto-repositions with the trigger —
  // close it instead of leaving it floating in the wrong place.
  useEffect(() => {
    if (!open) return;
    const close = () => closeMenu();
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/organizer/stages/${stageId}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(data?.error ?? "Erreur, réessayez.");
        setDeleting(false);
        setConfirming(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Erreur, réessayez.");
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/organisateurs/stages/${stageId}/modifier`}
        className="cursor-pointer rounded-md p-1.5 text-mist-500 hover:bg-mist-100 hover:text-ink"
        aria-label="Modifier"
      >
        <Pencil size={15} />
      </Link>
      <button
        ref={triggerRef}
        onClick={toggleMenu}
        className="cursor-pointer rounded-md p-1.5 text-mist-500 hover:bg-mist-100 hover:text-ink"
        aria-label="Plus d'options"
      >
        <MoreHorizontal size={15} />
      </button>

      {open &&
        position &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={closeMenu} />
            <div
              style={{ top: position.top, right: position.right }}
              className="fixed z-50 w-56 rounded-md border border-mist-200 bg-white p-1.5 shadow-lg"
            >
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-destructive hover:bg-mist-100"
                >
                  <Trash2 size={14} /> Supprimer ce stage
                </button>
              ) : (
                <div className="p-1">
                  <p className="px-1.5 text-xs text-mist-600">Supprimer définitivement ce stage ?</p>
                  {error && <p className="mt-1 px-1.5 text-xs text-destructive">{error}</p>}
                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-destructive px-2 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                    >
                      {deleting && <Loader2 size={12} className="animate-spin" />}
                      {deleting ? "Suppression…" : "Confirmer"}
                    </button>
                    <button
                      onClick={closeMenu}
                      disabled={deleting}
                      className="flex-1 cursor-pointer rounded-md px-2 py-1.5 text-xs font-semibold text-mist-600 hover:bg-mist-100"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
