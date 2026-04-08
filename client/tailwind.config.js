/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE1',
        },
        charcoal: {
          DEFAULT: '#1A1814',
          mid: '#3D3A35',
          light: '#6B6560',
        },
        gold: {
          DEFAULT: '#B8955A',
          light: '#D4B07A',
          pale: '#F0E8D8',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}