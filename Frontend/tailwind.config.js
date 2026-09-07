/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hh: {
          dark: '#071d13',
          card: '#0c2e1f',
          panel: '#092418',
          border: '#145334',
          green: '#0b6839',
          lightgreen: '#15803d',
          yellow: '#fee101',
          pink: '#ff0080',
          accent: '#fee101'
        },
        cyber: {
          dark: '#071d13',
          card: '#0c2e1f',
          border: '#145334',
          accent: '#fee101',
          neon: '#10b981',
          purple: '#ff0080',
          emerald: '#0b6839'
        }
      },
      fontFamily: {
        mono: ['"Victor Mono"', 'JetBrains Mono', 'monospace'],
        sans: ['"Victor Mono"', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        }
      }
    },
  },
  plugins: [],
}
