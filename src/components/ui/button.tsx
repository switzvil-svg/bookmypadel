"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "cta" | "secondary" | "ghost" | "outline-light";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-court-500 text-white hover:bg-court-600 shadow-sm hover:shadow-md focus-visible:ring-court-500",
  cta: "bg-citron-500 text-ink hover:bg-citron-600 shadow-sm hover:shadow-md focus-visible:ring-citron-500 font-bold",
  secondary:
    "bg-white text-ink border border-mist-200 hover:border-court-400 hover:text-court-600 focus-visible:ring-court-500",
  ghost: "bg-transparent text-ink hover:bg-mist-100 focus-visible:ring-court-500",
  "outline-light":
    "bg-white/10 text-white border border-white/40 backdrop-blur-sm hover:bg-white/20 focus-visible:ring-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-6 text-sm rounded-full",
  lg: "h-14 px-8 text-base rounded-full",
  icon: "h-10 w-10 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
