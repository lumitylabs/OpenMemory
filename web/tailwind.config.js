/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Sarabun: ['"Sarabun"', ...defaultTheme.fontFamily.sans],
        Mada: ['"Mada"', ...defaultTheme.fontFamily.sans],

      },
      screens: {
        iphone5: "320px",
        iphone678x: "375px",
        iphone678p: "414px",
        st: "600px",
        ipad: "768px",
        ipadpro: "1024px",
        desktop: "1280px",
        hdtv: "1920px",
      },
    },
  },
  plugins: [],
};
