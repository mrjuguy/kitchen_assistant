import { GapAnalysis } from "../../hooks/useGapAnalysis";
import { RecipeWithIngredients } from "../../types/schema";
import { filterRecipes, getAvailableTags } from "../recipeFilters";

const mockRecipes: RecipeWithIngredients[] = [
  {
    id: "1",
    name: "Pasta Carbonara",
    description: "Classic Italian pasta",
    tags: ["Italian", "Dinner"],
    ingredients: [],
    instructions: [],
    user_id: "u1",
    household_id: "h1",
    created_at: "",
  } as any,
  {
    id: "2",
    name: "Fruit Salad",
    description: "Healthy breakfast",
    tags: ["Healthy", "Breakfast"],
    ingredients: [],
    instructions: [],
    user_id: "u1",
    household_id: "h1",
    created_at: "",
  } as any,
  {
    id: "3",
    name: "Keto Avocado Toast",
    description: "Low carb toast",
    tags: ["Keto", "Breakfast"],
    ingredients: [],
    instructions: [],
    user_id: "u1",
    household_id: "h1",
    created_at: "",
  } as any,
];

const mockAnalysis: Record<string, GapAnalysis> = {
  "1": { status: "Green" } as any, // Ready
  "2": { status: "Yellow" } as any, // Missing
  "3": { status: "Red" } as any, // Missing
};

describe("recipeFilters", () => {
  describe("filterRecipes", () => {
    it("filters by search query (name)", () => {
      const result = filterRecipes(mockRecipes, { searchQuery: "pasta" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Pasta Carbonara");
    });

    it("filters by status: ready", () => {
      const result = filterRecipes(mockRecipes, {
        statusFilter: "ready",
        analysisMap: mockAnalysis,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("filters by status: missing", () => {
      const result = filterRecipes(mockRecipes, {
        statusFilter: "missing",
        analysisMap: mockAnalysis,
      });
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.id)).toContain("2");
      expect(result.map((r) => r.id)).toContain("3");
    });

    it("filters by tags", () => {
      const result = filterRecipes(mockRecipes, { tags: ["Breakfast"] });
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.name)).toContain("Fruit Salad");
      expect(result.map((r) => r.name)).toContain("Keto Avocado Toast");
    });

    it("filters by multiple tags (OR logic)", () => {
      const result = filterRecipes(mockRecipes, {
        tags: ["Italian", "Healthy"],
      });
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.name)).toContain("Pasta Carbonara");
      expect(result.map((r) => r.name)).toContain("Fruit Salad");
    });

    it("filters by multiple criteria (Search + Tags)", () => {
      const result = filterRecipes(mockRecipes, {
        searchQuery: "toast",
        tags: ["Breakfast"],
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Keto Avocado Toast");
    });
  });

  describe("getAvailableTags", () => {
    it("extracts unique tags correctly", () => {
      const tags = getAvailableTags(mockRecipes);
      expect(tags).toEqual([
        "Breakfast",
        "Dinner",
        "Healthy",
        "Italian",
        "Keto",
      ]);
    });
  });
});
