import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-mist-200 bg-white px-4 text-sm text-ink placeholder:text-mist-400 transition-all duration-200 focus:border-court-500 focus:outline-none focus:ring-2 focus:ring-court-500/15",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
