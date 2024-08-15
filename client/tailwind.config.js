/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
        grey: "#d4d4d4",
      },
      fontFamily: {
        libre: ["'Libre Baskerville'", "serif"],
      },
    },
  },
  plugins: [],
};
