const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        navy: "#206bc3",
        "dark-navy": "#354d69",
      },
      fontFamily: {
        serif: ["Domine"],
      },
      backgroundImage: {
        "navbar": "radial-gradient(100% 100% at 50% -10%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-stroke-color": (value) => ({
            "-webkit-text-stroke-color": value,
          }),
        },
        { values: theme("colors") }
      );
    }),
  ],
};
