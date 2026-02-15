/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "node_modules/preline/dist/*.js",
    ],
    safelist: [
      'bg-custom-blue',
      'hover:bg-custom-blue',
    ],
    theme: {
      extend: {
        colors: {
          'custom-blue': '#A5D8FF',
        },
      },
    },
  