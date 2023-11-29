import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      flex: {
        "2": "2 2 0%",
        "3": "3 3 0%",
        "4": "4 4 0%",
      },
      maxWidth: {
        "8xl": "1920px",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["cursor"],
    },
  },
  plugins: [],
};
export default config;
