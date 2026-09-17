"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_STEPS = ["Sélection", "Participants", "Paiement", "Confirmation"];

export function StepIndicator({ step, labels = DEFAULT_STEPS }: { step: number; labels?: string[] }) {
  return (
    <div className="flex items-center">
      {labels.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                  backgroundColor: done || active ? "#2F5BFF" : "#EEF1F8",
                  color: done || active ? "#FFFFFF" : "#5B6479",
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
              >
                {done ? <Check size={16} /> : i + 1}
              </motion.div>
              <span className={cn("hidden text-xs font-medium sm:block", active ? "text-ink" : "text-mist-400")}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-mist-200 sm:mx-3">
                <motion.div
                  className="h-full bg-court-500"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
