import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#09090b',
          elevated: '#111113',
          card: '#18181b',
        },
        accent: {
          DEFAULT: '#39FF14',
          hover: '#2ee00f',
          dim: 'rgba(57,255,20,0.4)',
          glow: 'rgba(57,255,20,0.15)',
        },
        text: {
          DEFAULT: '#fafafa',
          muted: '#a1a1aa',
          subtle: '#71717a',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          hover: 'rgba(57,255,20,0.4)',
        },
      },
      fontFamily: {
        // display — Oswald (загружаем через next/font в layout.tsx)
        sans:    ['var(--font-inter)',  'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-oswald)', 'Oswald', 'Bebas Neue', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2)',
        'glow-sm':     '0 0 10px rgba(57,255,20,0.4)',
        'glow-box':    '0 0 20px rgba(57,255,20,0.15), inset 0 0 20px rgba(57,255,20,0.05)',
      },
      dropShadow: {
        'glow':    ['0 0 12px rgba(57,255,20,0.7)', '0 0 30px rgba(57,255,20,0.3)'],
        'glow-sm': '0 0 6px rgba(57,255,20,0.6)',
      },
      animation: {
        'in': 'in 0.15s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-from-top-2': 'slideInFromTop 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideInFromTop: {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          md: '2.5rem',
        },
        screens: {
          '2xl': '1280px',
        },
      },
    },
  },
  plugins: [],
}

export default config
