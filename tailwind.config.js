const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        calistoga: ["Calistoga", ...defaultTheme.fontFamily.serif],
        gothic: ["Gothic A1", ...defaultTheme.fontFamily.sans],
        nanum: ["nanum", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        pointer: "#3B48CC",
        pointer2: "#9DA3E5",
        main: "#2C2C2C",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
