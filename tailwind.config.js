/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        cream: { 50: '#FEFDF9', 100: '#FDF8EC', 200: '#FAF0D0' },
        forest: { 400: '#52A165', 500: '#3D8B52', 600: '#2E6B3E', 700: '#1F4D2B' },
        coral:  { 400: '#E8785A', 500: '#D4613F', 600: '#BC4A2C' },
        ink: '#1C1814',
      },
      animation: {
        'float':     'float 3s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pencil':    'pencil 1.2s ease-in-out infinite',
        'fade-up':   'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float:   { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        pencil:  { '0%, 100%': { transform: 'rotate(-5deg) translateX(0)' }, '50%': { transform: 'rotate(5deg) translateX(6px)' } },
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
