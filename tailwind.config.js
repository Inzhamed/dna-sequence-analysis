/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nucleotide colors (standard biological convention)
        nucleotide: {
          A: '#22c55e', // Adenine - Green
          T: '#ef4444', // Thymine - Red
          C: '#3b82f6', // Cytosine - Blue
          G: '#f59e0b', // Guanine - Orange/Yellow
        },
        // Amino acid colors (hydrophobicity-based)
        amino: {
          hydrophobic: '#fbbf24', // Yellow
          polar: '#60a5fa', // Blue
          positive: '#f87171', // Red
          negative: '#a78bfa', // Purple
          special: '#34d399', // Green
        },
        // UI colors
        bio: {
          primary: '#0d9488', // Teal
          secondary: '#6366f1', // Indigo
          accent: '#f472b6', // Pink
          dark: '#0f172a',
          light: '#f8fafc',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
