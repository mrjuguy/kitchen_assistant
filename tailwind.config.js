/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#10b981", // Emerald-500 equivalent
          surface: "#18181b", // Zinc-900 equivalent
        },
      },
    },
  },
  plugins: [],
}


