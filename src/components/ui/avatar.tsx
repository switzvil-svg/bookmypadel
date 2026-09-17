import { cn } from "@/lib/utils";
import { pickFromSeed } from "@/lib/hash";

const BG = [
  "bg-court-500",
  "bg-court-700",
  "bg-citron-500 text-ink",
  "bg-[#0F7A7A]",
  "bg-[#7C2D12]",
  "bg-[#2B1B5C]",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  seed,
  size = 40,
  className,
}: {
  name: string;
  seed: string;
  size?: number;
  className?: string;
}) {
  const bg = pickFromSeed(seed, BG);
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white",
        bg,
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </div>
  );
}
