const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      primary: "#15803d",
      secondary: "#22c55e",
    },
  },
  plugins: [flowbite.content()],
};
