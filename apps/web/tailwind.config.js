/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0B0F14',
          card: '#0F141B',
        },
        neon: {
          cyan: '#00F0FF',
          magenta: '#FF00C8'
        },
        gold: '#D4AF37'
      },
      borderRadius: {
        xl: '16px'
      },
      boxShadow: {
        glow: '0 0 24px rgba(0, 240, 255, 0.25)',
        glowCyan: '0 0 14px rgba(0, 240, 255, 0.35), 0 0 2px rgba(0,240,255,0.6) inset',
        glowMagenta: '0 0 14px rgba(255, 0, 200, 0.30), 0 0 2px rgba(255,0,200,0.5) inset'
      },
      dropShadow: {
        neonCyan: '0 0 6px rgba(0,240,255,.6)',
        neonMagenta: '0 0 6px rgba(255,0,200,.55)'
      }
    }
  },
  plugins: [],
}
