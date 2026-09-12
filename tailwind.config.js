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
          yellow: '#FACC15', // GT3 RS Racing Yellow
          yellowHover: '#FFE033',
          yellowDark: '#D4A600',
          black: '#090A0F',   // Pure Deep Cockpit Obsidian
          cardDark: '#12151C', // Carbon Graphite Surface
          cardDarkHover: '#181D26',
          cardLight: '#FFFFFF',
          borderDark: '#1F2430', // Precision Hairline Border
          borderDarkSubtle: '#171B24',
          borderLight: '#E2E8F0',
          grayDark: '#161922',
          textMutedDark: '#8B949E',
          textMutedLight: '#64748B',
        },
        law: {
          snf1: '#10B981',     // 1. Sınıf (Amfi 8) - Racing Olive / Emerald
          snf2: '#94A3B8',     // 2. Sınıf (Amfi 1) - Ice Titanium / Slate Silver (Mavilik kaldırıldı!)
          lib: '#F59E0B',      // Merkez Kütüphane - Warm Amber / Bronze
          tech: '#8B5CF6',     // Deep Work & Proje - Amethyst Violet
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'gt3': '0 0 20px -3px rgba(250, 204, 21, 0.18)',
        'gt3-lg': '0 0 35px -5px rgba(250, 204, 21, 0.3)',
      }
    },
  },
  plugins: [],
}
