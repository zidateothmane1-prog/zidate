/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0a",
        chalk: "#f7f6f2",
        paper: "#fffdf8",
        mist: "#ece9e1",
        dune: "#d8c7a1",
        gold: "#b89b58",
        smoke: "#77736a",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(11, 11, 10, 0.12)",
        gold: "0 18px 70px rgba(184, 155, 88, 0.22)",
      },
    },
  },
  plugins: [],
};
