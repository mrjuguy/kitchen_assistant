const brandPrimary = "#10b981"; // Mint-500 / Emerald-500
const brandSurface = "#18181b"; // Gunmetal / Zinc-900

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: brandPrimary,
    tabIconDefault: "#ccc",
    tabIconSelected: brandPrimary,
  },
  dark: {
    text: "#fff",
    background: brandSurface,
    tint: "#fff", // White tint on dark background for contrast
    tabIconDefault: "#71717a", // Zinc-400
    tabIconSelected: brandPrimary,
  },
};
