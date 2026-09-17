import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Tone = "court" | "citron" | "ink" | "warning" | "success" | "mist";

const toneClasses: Record<Tone, string> = {
  court: "bg-court-50 text-court-700",
  citron: "bg-citron-200 text-ink",
  ink: "bg-ink text-white",
  warning: "bg-amber-50 text-amber-700",
  success: "bg-emerald-50 text-emerald-700",
  mist: "bg-mist-100 text-mist-600",
};

export function Badge({
  tone = "mist",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
