/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx', './src/**/*.tsx']
}
