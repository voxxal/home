import twTypography from "@tailwindcss/typography"
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        navy: "#206bc3",
        "dark-navy": "#354d69",
        blot: "#1A1A1D",
      },
      fontFamily: {
        serif: ["Domine", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["Iosevka", "monospace"],
      },
      backgroundImage: {
        navbar: "radial-gradient(100% 100% at 50% -10%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [twTypography({ className: "tw-prose" })],
};
