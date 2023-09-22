/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        blue: colors.blue,
        black: colors.black,
        purple: colors.purple,
        white: colors.white,
        yellow: colors.yellow,
        pink: colors.pink,
        orange: colors.orange,
        slate: colors.slate,
      },
      fontFamily: {
        serif: ["IBM Plex Serif", ...defaultTheme.fontFamily.serif],
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        mono: ["CommitMono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
