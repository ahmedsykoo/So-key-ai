/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sokey: {
          bg: '#081017',
          surface: '#0d1218',
          card: '#141c26',
          elevated: '#1e2938',
          border: '#233042',
          highlight: '#2d3e54',
          
          // Orange palette matching design reference images
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f38f49', // Extracted exact orange
            600: '#e05a10', // Rich burnt orange
            700: '#c2480a',
            800: '#9a3412',
            900: '#7c2d12',
            glow: '#fa6e22',
          },
          
          gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Cascadia Code', 'monospace']
      },
      boxShadow: {
        'orange-glow': '0 0 20px -3px rgba(243, 143, 73, 0.35)',
        'orange-glow-sm': '0 0 10px -2px rgba(243, 143, 73, 0.25)',
        'orange-glow-lg': '0 0 30px -4px rgba(240, 90, 16, 0.45)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
