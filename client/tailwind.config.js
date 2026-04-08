/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F0EFED',
          dark: '#E3E1DE',
        },
        charcoal: {
          DEFAULT: '#1C1C1A',
          mid: '#3D3A35',
          light: '#7A7670',
        },
        forest: {
          DEFAULT: '#2D4A3E',
          light: '#3D6B59',
          pale: '#E8EFEC',
        },
        burgundy: {
          DEFAULT: '#6B2D2D',
          light: '#8B4040',
          pale: '#F2E8E8',
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