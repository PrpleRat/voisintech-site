import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7FBFF",
        foreground: "#1a2b3c",
        primary: {
          DEFAULT: "#1E6FA5",
          dark: "#155a87",
          light: "#2a8bc4",
        },
        accent: "#8DD4F8",
        success: "#2E9E6B",
      },
      fontSize: {
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.5" }],
        "2xl": ["1.5rem", { lineHeight: "1.4" }],
        "3xl": ["1.875rem", { lineHeight: "1.3" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(30, 111, 165, 0.08)",
        card: "0 2px 12px rgba(30, 111, 165, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
