/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tunetix: {
          // Brand Colors
          primary: "#6C5CE7",
          primaryHover: "#5A4BCF",
          accent: "#F43F5E",
          
          // Backgrounds (Dark Theme)
          bg: "#020617",       // App outer background
          surface: "#0F172A",  // Cards, Modals
          surfaceLight: "#1E293B", // Hover states on cards
          border: "#334155",
          
          // Text Colors
          textMain: "#F8FAFC",
          textMuted: "#94A3B8",
          
          // Status
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444"
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #6C5CE7, #8B78FF)',
        'gradient-accent': 'linear-gradient(to right, #F43F5E, #FB7185)',
      }
    },
  },
  plugins: [],
}