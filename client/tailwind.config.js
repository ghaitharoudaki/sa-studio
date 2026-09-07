/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: 'var(--bg-elevated)',
          dark: 'var(--surface-muted)',
        },
        charcoal: {
          DEFAULT: 'var(--text-primary)',
          mid: 'var(--text-secondary)',
          light: 'var(--text-secondary)',
        },
        forest: {
          DEFAULT: 'var(--green)',
          light: 'var(--green)',
          pale: 'var(--accent-soft)',
        },
        burgundy: {
          DEFAULT: 'var(--burgundy)',
          light: 'var(--burgundy)',
          pale: 'var(--bg-accent-block)',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}