/**
 * Tailwind configuration (ESM)
 * Includes index.html and all src files.
 */
import typography from '@tailwindcss/typography';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [typography],
};

module.exports = {
  darkMode: "class", // enables dark mode with a "dark" class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
