"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/image-compress";

interface PhotoItem {
  id: string;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  finalUrl?: string;
  error?: string;
}

const MAX_PHOTOS = 8;
const MAX_SIZE = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function PhotoUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [items, setItems] = useState<PhotoItem[]>(
    value.map((url) => ({ id: url, previewUrl: url, status: "done", finalUrl: url }))
  );
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function emitChange(next: PhotoItem[]) {
    onChange(next.filter((i) => i.status === "done" && i.finalUrl).map((i) => i.finalUrl!));
  }

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const room = MAX_PHOTOS - items.length;
    if (room <= 0) return;

    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of files.slice(0, room)) {
      if (!ACCEPTED.includes(file.type)) {
        rejected.push(`${file.name} : format non supporté`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        rejected.push(`${file.name} : dépasse 8 Mo`);
        continue;
      }
      accepted.push(file);
    }

    const newItems: PhotoItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
    }));

    setItems((prev) => [...prev, ...newItems]);

    if (rejected.length) {
      // Surface rejected files as inline error items so the user sees why they were skipped.
      setItems((prev) => [
        ...prev,
        ...rejected.map((message) => ({
          id: crypto.randomUUID(),
          previewUrl: "",
          status: "error" as const,
          error: message,
        })),
      ]);
    }

    for (let i = 0; i < accepted.length; i++) {
      const file = accepted[i];
      const item = newItems[i];
      const optimized = await compressImage(file);
      const formData = new FormData();
      formData.append("files", optimized);
      try {
        const res = await fetch("/api/organizer/upload", { method: "POST", body: formData });
        const data = await res.json() as any;
        if (!res.ok) throw new Error(data.error ?? "Échec de l'envoi.");
        setItems((prev) => {
          const next = prev.map((it) =>
            it.id === item.id ? { ...it, status: "done" as const, finalUrl: data.urls[0] } : it
          );
          emitChange(next);
          return next;
        });
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: "error" as const, error: err instanceof Error ? err.message : "Échec de l'envoi." }
              : it
          )
        );
      }
    }
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      emitChange(next);
      return next;
    });
  }

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      const target = idx + dir;
      if (idx === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      emitChange(next);
      return next;
    });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  }

  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        <AnimatePresence initial={false}>
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "group relative flex h-28 items-center justify-center overflow-hidden rounded-md border",
                item.status === "error" ? "border-destructive/40 bg-destructive/5" : "border-mist-200 bg-mist-100"
              )}
            >
              {item.status === "error" ? (
                <div className="flex flex-col items-center gap-1 p-2 text-center text-destructive">
                  <AlertCircle size={16} />
                  <span className="text-[10px] leading-tight">{item.error}</span>
                </div>
              ) : (
                <>
                  <Image
                    src={item.previewUrl}
                    alt=""
                    fill
                    sizes="150px"
                    className="object-cover"
                    unoptimized
                  />
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                      <Loader2 size={18} className="animate-spin text-white" />
                    </div>
                  )}
                  {idx === 0 && item.status === "done" && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-citron-500 px-2 py-0.5 text-[10px] font-bold text-ink">
                      Couverture
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => move(item.id, -1)}
                      className="cursor-pointer rounded p-1 text-white disabled:opacity-30"
                      aria-label="Déplacer à gauche"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => move(item.id, 1)}
                      className="cursor-pointer rounded p-1 text-white disabled:opacity-30"
                      aria-label="Déplacer à droite"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white"
                aria-label="Retirer la photo"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length < MAX_PHOTOS && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed text-mist-400 transition-colors hover:border-court-400 hover:text-court-500",
              dragOver && "border-court-500 bg-court-50 text-court-600"
            )}
          >
            <ImagePlus size={20} />
            <span className="text-center text-xs leading-tight">Glisser-déposer
              <br />ou cliquer</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      <p className="mt-2 text-xs text-mist-500">
        {doneCount}/{MAX_PHOTOS} photos · JPG, PNG, WebP ou GIF, 8 Mo max chacune. La première
        photo sert de couverture.
      </p>
    </div>
  );
}
