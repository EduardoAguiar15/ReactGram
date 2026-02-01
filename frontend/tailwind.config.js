/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'scroll-thumb': '#919191',
        'scroll-track': '#313131',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};