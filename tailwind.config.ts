import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        ocean: {
          900: "#135A86", // Primary
          700: "#1B729F", // Primary hover/active
          500: "#2E8FBE", // Primary state on dark bg
        },
        sky: {
          400: "#38BDF8", // Accent
          200: "#B7E6FB", // Accent soft bg / badge
          50: "#EAF8FE",  // Very soft section bg
        },
        ink: {
          900: "#0E2530", // Primary text
          700: "#375363", // Secondary text
          400: "#7C93A0", // Tertiary / placeholder
          200: "#D6E2E7", // Border
          100: "#EDF3F5", // Alt card bg
        },
        "off-white": "#F7FAFB", // Main background
        success: {
          600: "#1F8A5F",
          100: "#DFF4EA",
        },
        warning: {
          600: "#C77B15",
          100: "#FBEBD3",
        },
        danger: {
          600: "#C0392B",
          100: "#F8DDD9",
        },
        cold: {
          cool: "#38BDF8",
          warn: "#C77B15",
        },

        /* shadcn mapping to Design System tokens */
        border: "var(--ink-200)",
        input: "var(--ink-200)",
        ring: "var(--ocean-900)",
        background: "var(--off-white)",
        foreground: "var(--ink-900)",
        primary: {
          DEFAULT: "var(--ocean-900)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "var(--ink-100)",
          foreground: "var(--ink-900)",
        },
        destructive: {
          DEFAULT: "var(--danger-600)",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "var(--ink-100)",
          foreground: "var(--ink-700)",
        },
        accent: {
          DEFAULT: "var(--sky-400)",
          foreground: "var(--ink-900)",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "var(--ink-900)",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "var(--ink-900)",
        },
      },
      fontFamily: {
        heading: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "10px",
        md: "8px",
        sm: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
