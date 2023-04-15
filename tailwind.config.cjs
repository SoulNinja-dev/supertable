const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bg: "#1e1d1e",
        accent: "#00af86",
      }
    },
  },
  plugins: [],
};

module.exports = config;
