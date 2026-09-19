"use client";

import Image from "next/image";
import { CircleDot, Sun, Trophy, Waves, Zap, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { hashSeed, pickFromSeed } from "@/lib/hash";

const GRADIENTS = [
  "from-court-700 via-court-500 to-citron-400",
  "from-ink via-court-800 to-court-500",
  "from-court-600 via-court-400 to-citron-300",
  "from-[#0E4F4F] via-[#0F7A7A] to-citron-300",
  "from-[#2B1B5C] via-court-600 to-citron-400",
  "from-[#C2410C] via-[#7C2D12] to-ink",
  "from-court-900 via-[#1E3A8A] to-court-400",
];

const ICONS = [CircleDot, Trophy, Waves, Zap, Sun, MapPin];

interface CoverArtProps {
  seed: string;
  className?: string;
  rounded?: string;
  /** A real uploaded photo, when one exists — takes over the whole tile instead of the generated art. */
  photoUrl?: string;
}

export function CoverArt({ seed, className, rounded = "rounded-lg", photoUrl }: CoverArtProps) {
  if (photoUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-mist-100", rounded, className)}>
        <Image src={photoUrl} alt="" fill sizes="50vw" className="object-cover" unoptimized />
      </div>
    );
  }

  const gradient = pickFromSeed(seed, GRADIENTS);
  const Icon = pickFromSeed(seed + "icon", ICONS);
  const rotate = (hashSeed(seed) % 24) - 12;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        gradient,
        rounded,
        className
      )}
    >
      <div className="court-lines absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 text-white/15"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <Icon strokeWidth={1.25} className="h-32 w-32 sm:h-40 sm:w-40" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  );
}
