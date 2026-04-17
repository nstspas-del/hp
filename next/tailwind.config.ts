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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
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
