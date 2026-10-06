/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      //Colors used in the project
      colors:{
        primary:"#6B60F6",
        secondary:"#EF863E"
      }
    },
  },
  plugins: [],
}

