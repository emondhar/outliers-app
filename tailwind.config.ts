import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        'top-nav-height': '56px',
      }
    },
  },
  plugins: [],
} satisfies Config
