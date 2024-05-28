/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Make sure to include your TypeScript files
  theme: {
    extend: {
      colors: {
        'primary': '#02030c',
        'secondary': '#171717'
      },
      fontFamily:{
        'sans': ['Lilita One', 'sans-serif'],
      }
    },
  },
  plugins: [],
};