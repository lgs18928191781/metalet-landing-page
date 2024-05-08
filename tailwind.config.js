/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'black-primary': '#303133',
        'gray-primary': '#909399',
        'blue-primary': '#1719FF'
      },
      height: {
        15: '3.75rem',
      },
      lineHeight: {
        14: '3.5rem'
      },
    },
  },
  plugins: [],
}

