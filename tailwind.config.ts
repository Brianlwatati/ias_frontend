import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Neutral slate base for chrome/surfaces
        surface: {
          DEFAULT: "#0B0F17",
          raised: "#111827",
          border: "#1F2937",
        },
        // Indigo = primary brand/action color for the IAS admin panel
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          300: "#A5B4FC",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          900: "#312E81",
        },
        // Status colors used across role/tenant/audit badges
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
