/** @type {import('tailwindcss').Config} */
module.exports = {
  // All TS/TSX that may contain className="..." must be listed (App Router has no `pages/` dir here).
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        handwriting: ['Pacifico', 'cursive'],
      },
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1e40af',
          accent: '#38bdf8',
          muted: '#93c5fd',
        },
      },
    },
  },
  plugins: [],
}

