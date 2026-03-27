/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Avenir Next", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"],
      },
      colors: {
        canvas: "#f5f1e7",
        panel: "#fffdf8",
        ink: "#1f2430",
        accent: "#0f766e",
      },
      boxShadow: {
        card: "0 14px 30px -20px rgba(0, 0, 0, 0.35)",
      },
    },
  },
};
