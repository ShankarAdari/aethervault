import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans:    ["var(--font-inter)", "Inter", "sans-serif"],
        mono:    ["var(--font-grotesk)", "Space Grotesk", "sans-serif"],
      },
      colors: {
        vault: {
          bg:     "#06080d",
          card:   "rgba(18, 26, 45, 0.45)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#8b5cf6",
          cyan:   "#06b6d4",
          amber:  "#f59e0b",
          rose:   "#f43f5e",
        },
        theme: {
          bg:     "var(--bg-primary)",
          card:   "var(--bg-secondary)",
          border: "var(--border-color)",
          text:   "var(--text-primary)",
          muted:  "var(--text-muted)",
          accent: "var(--accent-color)",
          glow:   "var(--accent-glow)",
        },
      },
      boxShadow: {
        glow:    "0 0 35px -5px var(--accent-glow)",
        card:    "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulseGlow 4s infinite alternate",
        "float":      "float 6s ease-in-out infinite",
        "spin-slow":  "spin 10s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%":   { opacity: "0.4", transform: "scale(1)" },
          "100%": { opacity: "0.78", transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
