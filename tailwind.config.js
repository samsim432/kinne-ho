/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1b7a53',
          'green-hover': '#156343',
          'green-light': '#edf7f2',
        }
      }
    },
  },
  plugins: [],
}