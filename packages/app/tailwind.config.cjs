/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      transitionProperty: {
        position: 'top, left, right, bottom',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [],
}
