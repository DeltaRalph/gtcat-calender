/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gt3: {
          yellow: '#FFD000', // GT3 RS Racing Yellow
          yellowHover: '#FFE033',
          yellowDark: '#D4A600',
          black: '#0A0C10',   // Deep Obsidian Cockpit
          cardDark: '#12161F', // Carbon Slate
          cardLight: '#FFFFFF',
          borderDark: '#222938',
          borderLight: '#E2E8F0',
          grayDark: '#1A202C',
          textMutedDark: '#8A99AD',
          textMutedLight: '#64748B',
        },
        law: {
          snf1: '#10B981', // Amfi 8 - Emerald Racing Green
          snf2: '#3B82F6', // Amfi 1 - Shark Blue
          snf1Light: '#ECFDF5',
          snf2Light: '#EFF6FF',
          lib: '#F59E0B',  // Merkez Kütüphane Altın Blok
          tech: '#A855F7', // Deep Work & Proje Violet
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'gt3': '0 0 25px -5px rgba(255, 208, 0, 0.15)',
        'gt3-lg': '0 0 35px -5px rgba(255, 208, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
