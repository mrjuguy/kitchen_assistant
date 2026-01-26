import { useMemo } from "react";

import { usePantry } from "./usePantry";
import { useProfile } from "./useProfile";
import { useRecipes } from "./useRecipes";
import { RecipeIngredient, RecipeWithIngredients } from "../types/schema";
import { checkAllergen, isMatch } from "../utils/matcher";

export type MatchStatus = "Green" | "Yellow" | "Red";

export interface IngredientMatch {
  name: string;
  pantryItemId?: string;
  required: number;
  available: number;
  unit: string;
  isInStock: boolean;
}

export interface GapAnalysis {
  status: MatchStatus;
  missingCount: number;
  ingredientMatches: IngredientMatch[];
  missingIngredients: IngredientMatch[];
  totalIngredients: number;
  percentage: number;
  allergenWarning: string | null;
  isSafe: boolean;
}

export const useGapAnalysis = (recipeId?: string, servings?: number) => {
  const { data: recipes } = useRecipes();
  const { data: pantry } = usePantry();
  const { data: profile } = useProfile();

  return useMemo(() => {
    if (!recipes || !pantry) return null;

    const processRecipe = (
      recipe: RecipeWithIngredients,
      targetServings?: number,
    ): GapAnalysis => {
      const ingredientMatches: IngredientMatch[] = [];
      let missingCount = 0;

      const scaleFactor =
        targetServings && recipe.servings
          ? targetServings / recipe.servings
          : 1;

      // 1. Check Allergens first
      const ingredientNames = recipe.ingredients.map(
        (i: RecipeIngredient) => i.name,
      );
      const userAllergens = profile?.allergens || [];

      const allergenWarning =
        userAllergens.length > 0
          ? checkAllergen(
              recipe.allergens || [],
              userAllergens,
              ingredientNames,
            )
          : null;

      const isSafe = !allergenWarning;

      recipe.ingredients.forEach((reqIng: RecipeIngredient) => {
        // Find ALL items that match
        const matchingItems = pantry.filter((p) =>
          isMatch(p.name, reqIng.name),
        );

        // Sum available quantity
        const available = matchingItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        // Scale the requirement
        const required = reqIng.quantity * scaleFactor;
        const isInStock = available >= required;

        // Pick the "best" match (exact match first, then most quantity) for the ID
        const exactMatch = matchingItems.find(
          (p) =>
            p.name.toLowerCase().trim() === reqIng.name.toLowerCase().trim(),
        );
        const bestMatch =
          exactMatch ||
          matchingItems.sort((a, b) => b.quantity - a.quantity)[0];

        if (!isInStock) {
          missingCount++;
        }

        ingredientMatches.push({
          name: reqIng.name,
          pantryItemId: bestMatch?.id,
          required,
          available,
          unit: reqIng.unit,
          isInStock,
        });
      });

      // 3. Determine Status
      let status: MatchStatus = "Green";
      if (!isSafe) {
        status = "Red"; // Explicit Danger (Allergens)
      } else if (missingCount > 0) {
        status = "Yellow"; // Needs Supplies (regardless of count)
      }

      const totalIngredients = recipe.ingredients.length;
      const percentage =
        totalIngredients > 0
          ? (totalIngredients - missingCount) / totalIngredients
          : 1;

      const missingIngredients = ingredientMatches.filter((m) => !m.isInStock);

      return {
        status,
        missingCount,
        ingredientMatches,
        missingIngredients,
        totalIngredients,
        percentage,
        allergenWarning,
        isSafe,
      };
    };

    if (recipeId) {
      const recipe = recipes.find((r) => r.id === recipeId);
      return recipe ? processRecipe(recipe, servings) : null;
    }

    // If no recipeId, return a map of all analyses (useful for lists)
    const analysisMap: Record<string, GapAnalysis> = {};
    recipes.forEach((r) => {
      analysisMap[r.id] = processRecipe(r);
    });

    return analysisMap;
  }, [recipeId, recipes, pantry, profile, servings]);
};
