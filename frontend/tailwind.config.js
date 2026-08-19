/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F19',
          card: '#151C2C',
          hover: '#1E293B',
          border: '#2A364F'
        },
        brand: {
          50: '#EEF2FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA'
        },
        risk: {
          healthy: '#10B981', // Emerald
          tight: '#F59E0B',   // Amber
          stockout: '#EF4444',// Red
          margin: '#F97316'   // Orange
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
