/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        secondary: {
          50: "#f0f9ff",
          500: "#14b8a6",
        },
        neutral: {
          50: "#f9fafb",
          200: "#e5e7eb",
          400: "#9ca3af",
          700: "#374151",
        },
      },
    },
  },
  plugins: [],
};
