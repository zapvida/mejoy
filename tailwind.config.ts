import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      // tokens mobile-first
      screens: { sm: "360px", md: "768px", lg: "1024px", xl: "1280px" },
      // Design System Tokens - LPAC v3
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        card: "var(--card)",
        popover: "var(--popover)",
        muted: "var(--muted)",
        text: "var(--text)",
        "text-soft": "var(--text-soft)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        border: "var(--border)",
        primary: "var(--brand-600)",
        primaryDark: "var(--brand-700)",
        accent: "var(--accent-600)",
        accentDark: "var(--accent-700)",
        // Legacy support
        subtle: "var(--subtle)",
      },
      borderRadius: {
        xl: "var(--radius)",
        "2xl": "18px",
      },
      boxShadow: {
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        brand: "0 8px 24px var(--shadow)",
        lpac: "0 10px 24px rgba(2,6,23,.10)",
      },
      backgroundImage: {
        'lpac-emerald': 'linear-gradient(135deg,var(--lpac-emerald-from),var(--lpac-emerald-to))',
        'lpac-teal': 'linear-gradient(135deg,var(--lpac-teal-from),var(--lpac-teal-to))',
        'lpac-blue': 'linear-gradient(135deg,var(--lpac-blue-from),var(--lpac-blue-to))',
        'lpac-indigo': 'linear-gradient(135deg,var(--lpac-indigo-from),var(--lpac-indigo-to))',
        'lpac-violet': 'linear-gradient(135deg,var(--lpac-violet-from),var(--lpac-violet-to))',
        'lpac-fuchsia': 'linear-gradient(135deg,var(--lpac-fuchsia-from),var(--lpac-fuchsia-to))',
        'lpac-rose': 'linear-gradient(135deg,var(--lpac-rose-from),var(--lpac-rose-to))',
        'lpac-orange': 'linear-gradient(135deg,var(--lpac-orange-from),var(--lpac-orange-to))',
        'lpac-amber': 'linear-gradient(135deg,var(--lpac-amber-from),var(--lpac-amber-to))',
        'lpac-cyan': 'linear-gradient(135deg,var(--lpac-cyan-from),var(--lpac-cyan-to))',
      },
      keyframes: {
        'lpac-shine': {
          '0%': { opacity: '.6' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'lpac-shine': 'lpac-shine 1.2s ease-in-out',
      },
    }
  },
  safelist: [
    // ✅ Pattern para todas as variantes (evita purge)
    {
      pattern: /^lpac-gcard-/,
      variants: ['hover', 'focus'],
    },
    // Classes específicas
    'lpac-gcard',
    'lpac-gcard-emerald',
    'lpac-gcard-blue',
    'lpac-gcard-violet',
    'lpac-gcard-rose',
    'lpac-gcard-amber',
    'lpac-gcard-indigo',
    'lpac-gcard-cyan',
    'lpac-gcard-orange',
    'lpac-aurora',
    'lpac-hover',
    'lpac-chip',
    'hero-stats-grid',
  ],
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ]
} satisfies Config;
