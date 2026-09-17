import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: number;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-lg border border-mist-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-court-50 text-court-600">
          <Icon size={18} />
        </span>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold",
              positive ? "text-success" : "text-destructive"
            )}
          >
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-sm text-mist-500">{label}</p>
    </div>
  );
}
