import { createRequire } from "module";
import { createRequire } from "module";

var require = createRequire(import.meta.url);
var module = { exports: {} };

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#66D978",
        primaryText: "#6A6D7C",
      },
    },
  },
  plugins: [],
};
