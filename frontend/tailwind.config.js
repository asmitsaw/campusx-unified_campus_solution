/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "accent-yellow": "#fbef23",
        "background-light": "#f0f0f0",
        "background-dark": "#101922",
        // Extended Neo Palette
        "neo-bg": "#f0f0f0",
        "neo-yellow": "#FFDE59",
        "neo-purple": "#A259FF",
        "neo-green": "#5CE65C",
        "neo-red": "#FF5959",
        "neo-blue": "#59A5FF",
        "neo-black": "#1a1a1a",
        "neo-white": "#ffffff",
        "neo-secondary": "#ff6b6b",
        "neo-accent": "#feca57",
        "neo-primary": "#FF6B6B",
        // Additional Profile/Dashboard Palette
        "neo-card": "#FFFFFF",
        "neo-border": "#000000",
        "neo-shadow": "#000000",
        "neo-pink": "#ff90e8",
        "neo-cyan": "#23f0c7",
        "neo-orange": "#ff7675",
        "neo-blue": "#74b9ff", // Updated specific shade if needed, but keeping consistent
        // Tracker/Analytics/Hostel Palette Extensions
        "neo-cream": "#fffdf5", // neo-bg for Tracker
        "neo-success": "#00E054",
        "neo-danger": "#FF4D4D",
        "neo-warning": "#FFA500",
        "neo-accent-yellow": "#FFC900", // Hostel accent3
        "neo-accent-orange": "#FF5C00", // Hostel accent5
        "neo-accent-pink": "#FF90E8", // Hostel accent1
        "neo-accent-blue": "#23A6F0", // Hostel accent2
        "neo-accent-green": "#00E08E", // Hostel accent4
        // Profile Palette
        "neo-lavender": "#E0E7FF",
        "neo-teal": "#4ECDC4",
        "neo-strong-blue": "#5465FF",
        "neo-strong-purple": "#9B5DE5",
        "neo-yellow-accent": "#FFE66D",
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px #000000',
        'neo-sm': '3px 3px 0px 0px #000000',
        'neo-hover': '2px 2px 0px 0px #000000',
        "neo-lg": "8px 8px 0px 0px #000000",
        "neo-inner": "inset 2px 2px 0px 0px #000000",
      },
      borderRadius: {
        "none": "0",
        "sm": "0",
        "DEFAULT": "0",
        "md": "0",
        "lg": "0",
        "xl": "0",
        "2xl": "0",
        "full": "9999px",
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        "display": ["Public Sans", "sans-serif"],
        "sans": ["Public Sans", "sans-serif"], // Also update default sans to match
      },
    },
  },
  plugins: [],
}

