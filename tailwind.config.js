/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'epg-bg': 'rgba(0, 0, 0, 0.75)',
        'epg-selected': 'rgba(255, 255, 255, 0.2)',
      },
      backdropBlur: {
        'epg': '8px',
      },
    },
  },
  plugins: [],
}

