/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Calistoga-Regular' : ['Calistoga-Regular' , 'sans-serif'],
        'Margarine-Regular': ['Margarine-Regular', 'sans-serif'],
        'RockSalt-Regular': ['RockSalt-Regular', 'sans-serif'],
        'Sora-VariableFont_wght': ['Sora-VariableFont-wght', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

