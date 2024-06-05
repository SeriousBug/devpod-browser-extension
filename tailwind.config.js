/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      spacing: {
        DEFAULT: "1rem",
      },
    },
    colors: {
      primary: "#ba50ff",
      "primary-contrast": "#fff",
      text: "#000",
      background: "#fff",
    },
    borderRadius: {
      DEFAULT: ".5rem",
    },
    borderWidth: {
      DEFAULT: "2px",
      thick: "4px",
    },
  },
  plugins: [],
};
