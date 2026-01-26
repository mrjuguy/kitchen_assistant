import { GapAnalysis } from "../hooks/useGapAnalysis";
import { RecipeWithIngredients } from "../types/schema";

export type RecipeFilterType = "all" | "ready" | "missing";

export interface FilterOptions {
  searchQuery?: string;
  statusFilter?: RecipeFilterType;
  tags?: string[];
  analysisMap?: Record<string, GapAnalysis>;
}

export const filterRecipes = (
  recipes: RecipeWithIngredients[],
  options: FilterOptions,
): RecipeWithIngredients[] => {
  const { searchQuery, statusFilter = "all", tags = [], analysisMap } = options;

  return recipes.filter((recipe) => {
    // 1. Search Query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = (recipe.name?.toLowerCase() || "").includes(query);
      const matchesDesc = (recipe.description?.toLowerCase() || "").includes(
        query,
      );
      const matchesTags = (recipe.tags || []).some((t: string) =>
        t.toLowerCase().includes(query),
      );

      if (!matchesName && !matchesDesc && !matchesTags) {
        return false;
      }
    }

    // 2. Status Filter
    if (analysisMap) {
      const analysis = analysisMap[recipe.id];
      if (statusFilter === "ready" && analysis?.status !== "Green") {
        return false;
      }
      if (statusFilter === "missing" && analysis?.status === "Green") {
        return false;
      }
    }

    // 3. Tags Filter
    if (tags.length > 0) {
      const recipeTags = recipe.tags || [];
      const hasAnyTag = tags.some((t) => recipeTags.includes(t));
      if (!hasAnyTag) return false;
    }

    return true;
  });
};

export const getAvailableTags = (
  recipes: RecipeWithIngredients[],
): string[] => {
  const tagsSet = new Set<string>();
  recipes.forEach((recipe) => {
    (recipe.tags || []).forEach((tag: string) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};
