/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*!(test.|spec.).{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      spacing: {
        DEFAULT: "1rem",
      },
      colors: {
        primary: {
          DEFAULT: "#BA50FF",
          100: "#1D0030",
          200: "#480078",
          300: "#7300C0",
          400: "#9D09FF",
          500: "#BA50FF",
          600: "#C977FF",
          700: "#D79CFF",
          800: "#E6C1FF",
          900: "#F5E6FF",
          contrast: "#fff",
        },
        text: "#000",
        background: "#fff",
      },
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
