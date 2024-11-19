const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        calistoga: ['Calistoga', ...defaultTheme.fontFamily.serif],
        gothic: ['Gothic A1', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        pointer: '#3B48CC',
        main: '#2C2C2C',
      },
    },
  },
  plugins: [],
};
