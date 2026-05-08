/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightish: "-0.015em",
      },
      colors: {
        brand: {
          cream: "#fffffb",
          surface: "#ffffff",
          subtle: "#f7faf8",
          panel: "#f5f5f2",
          border: "#e5e5e0",
          divider: "#eeeeea",
          ink: "#111111",
          muted: "#4b5563",
          soft: "#6b7280",
          faint: "#9ca3af",
          leaf: "#10b981",
          leafDark: "#059669",
          leafSoft: "#86c9a2",
          leafTint: "#c9ecd8",
          leafWash: "#e8f5ee",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,17,17,0.04), 0 1px 3px rgba(17,17,17,0.06)",
        cardHover:
          "0 12px 24px -12px rgba(16,185,129,0.18), 0 4px 8px rgba(17,17,17,0.06)",
        soft: "0 1px 2px rgba(17,17,17,0.04)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out",
        fadeUp: "fadeUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
