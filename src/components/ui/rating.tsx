import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star size={size} className="fill-citron-500 text-citron-500" />
      <span className="font-semibold text-ink">{value.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-mist-600">({count})</span>}
    </span>
  );
}
