/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        flexBg: 'var(--color-flexBg)',
        flexPrimary: 'var(--color-flexPrimary)',
        flexText: 'var(--color-flexText)',
      },
      fontFamily: {
        sans: ['var(--font-family-sans)'],
      },
    },
  },
};
