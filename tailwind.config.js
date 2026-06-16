/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        forest: "#168d62",
        mint: "#e8f7ef",
        coral: "#f9735b",
        cloud: "#f6f7f9",
      },
      boxShadow: {
        panel: "0 10px 30px rgba(31, 41, 51, 0.08)",
      },
    },
  },
  plugins: [],
};
