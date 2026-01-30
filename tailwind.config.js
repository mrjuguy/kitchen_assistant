/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#10b981", // Emerald-500
          secondary: "#8b5cf6", // Violet-500
          surface: "#fafafa", // Zinc-50
          dark: "#18181b", // Zinc-950
        },
      },
    },
  },
  plugins: [],
}


