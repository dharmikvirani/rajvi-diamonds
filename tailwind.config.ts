import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rajvi: {
          black: "#171614",
          deepBlack: "#0D0C0A",
          graphite: "#141311",
          charcoal: "#24221E",
          cardDark: "#1A1916",
          borderDark: "#2A2722",
          gold: "#C6A46A",
          goldLight: "#E5D2AD",
          goldMuted: "#9C7F4E",
          offWhite: "#F8F7F4",
          ivory: "#F5F5F0",
          lightGrey: "#EAE8E3",
          borderLight: "#DDD9D0",
          textDark: "#24221E",
          textMuted: "#77736C",
          mutedGrey: "#8E8A82",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        luxuryDark: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        goldGlow: "0 0 25px -5px rgba(198, 164, 106, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
