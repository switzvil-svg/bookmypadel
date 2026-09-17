import type { Config } from "tailwindcss";

/**
 * BookMyPadel — "Court Blue / Citron" design system.
 * See design-system/bookmypadel/MASTER.md for full rationale.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        court: {
          50: "#EEF3FF",
          100: "#DCE6FF",
          200: "#B9CDFF",
          300: "#8FACFF",
          400: "#5C82FF",
          500: "#2F5BFF",
          600: "#1E42E8",
          700: "#1633B8",
          800: "#142B8F",
          900: "#101F63",
          950: "#0A1440",
        },
        citron: {
          200: "#EFFFA8",
          300: "#E4FF6E",
          400: "#D2FA3E",
          500: "#C6F135",
          600: "#B3DC22",
          700: "#8FB017",
        },
        ink: {
          DEFAULT: "#0A0E1A",
          soft: "#121828",
          700: "#1C2338",
        },
        mist: {
          50: "#F7F8FC",
          100: "#EEF1F8",
          200: "#E1E5F0",
          400: "#97A0B8",
          600: "#5B6479",
          800: "#2B3145",
        },
        success: "#16A34A",
        warning: "#F59E0B",
        destructive: "#E11D48",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(16,20,38,0.06)",
        md: "0 8px 20px -4px rgba(16,20,38,0.12)",
        lg: "0 20px 40px -8px rgba(16,20,38,0.18)",
        xl: "0 30px 60px -12px rgba(16,20,38,0.25)",
      },
      transitionTimingFunction: {
        court: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-468px 0" },
          "100%": { backgroundPosition: "468px 0" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s ease infinite",
        "pop-in": "pop-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
