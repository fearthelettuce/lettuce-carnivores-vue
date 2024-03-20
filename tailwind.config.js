/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  important: true,
  corePlugins: {
      preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'media',
}   