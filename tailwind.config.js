/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      spacing: {
        DEFAULT: "1rem",
      },
      colors: {
        primary: {
          DEFAULT: "#DB0082", // Set 500 as the default primary color
          100: "#FFD5EE",
          200: "#FF97D5",
          300: "#FF59BD",
          400: "#FF1BA4",
          500: "#DB0082",
          600: "#AC0067",
          700: "#7D004B",
          800: "#4E002F",
          900: "#1F0013",
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
