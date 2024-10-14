import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

export default {
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
        serif: ["Lora Variable", "Charter", "Bitstream Charter", "Sitka Text", "Cambria", "serif"],
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        mono: ["CommitMono", ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
    },
  },
  plugins: [typography, forms],
};
