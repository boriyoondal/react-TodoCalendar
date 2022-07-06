/** @type {import('tailwindcss').Config} */
module.exports = {
   plugins: [require('flowbite/plugin')],
   content: ['./node_modules/flowbite/**/*.js'],
   purge: ['./src/**/*.{js,jsx,ts,tsx}'],
   darkMode: false, // or 'media' or 'class'
   theme: {
      extend: {},
   },
   variants: {},
   plugins: [],
};
