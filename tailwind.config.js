const { tailwindColors } = require("./src/constants/color");
console.log(tailwindColors)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {...tailwindColors , yaqoob: 'var(--yaqoob)', } ,
    },
  },
  plugins: [],
};
