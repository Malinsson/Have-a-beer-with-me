/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", 
    ],
    theme: {
      extend: {
        colors: {
          'yrgo-red': 'var(--yrgo-red)',
          'dark-blue': 'var(--dark-blue)',
        },
      },
    },
    plugins: [],
  }