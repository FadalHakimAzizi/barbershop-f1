import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#c9a24b',
        'accent-ink': '#14110a',
        bg: '#0e0e10',
        surface: '#161618',
        'surface-2': '#212124',
        ink: '#0a0a0b',
        text: { DEFAULT: '#ece8e1', dim: '#9c958b', faint: '#6d6760' },
        ok: '#5fb98a',
        info: '#6f9fd8',
        warn: '#d2a24e',
        danger: '#d96a5b',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: 'var(--r-card)',
        btn: 'var(--r-btn)',
        input: 'var(--r-input)',
        pill: '999px',
      },
    },
  },
  plugins: [],
}

export default config
