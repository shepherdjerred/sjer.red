const colors = require("tailwindcss/colors");

// eslint-disable-next-line no-undef
module.exports = {
  theme: {
    extend: {
      colors: {
        black: colors.black,
        purple: colors.purple,
        white: colors.white,
        yellow: colors.yellow,
        rstudio: "#75aadb",
        posit: "#e47d3a",
        pink: colors.pink,
      },
    },
    fontFamily: {
      display: "'Nunito'",
      mono: "'Fira Code'",
    },
  },
  plugins: [],
};
