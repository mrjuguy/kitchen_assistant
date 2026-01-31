import { useMemo } from "react";

import { usePantry } from "./usePantry";
import { useProfile } from "./useProfile";
import { useRecipes } from "./useRecipes";
import {
  PantryItem,
  RecipeIngredient,
  RecipeWithIngredients,
} from "../types/schema";
import { checkAllergen, normalizeName } from "../utils/matcher";

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

/**
 * Build a lookup map for O(1) ingredient matching.
 * Groups pantry items by their normalized name.
 */
const buildPantryLookup = (pantry: PantryItem[]): Map<string, PantryItem[]> => {
  const lookup = new Map<string, PantryItem[]>();
  for (const item of pantry) {
    const key = normalizeName(item.name);
    const existing = lookup.get(key);
    if (existing) {
      existing.push(item);
    } else {
      lookup.set(key, [item]);
    }
  }
  return lookup;
};

/**
 * Find matching pantry items for an ingredient using the pre-built lookup.
 * Checks exact normalized match first, then falls back to substring matching.
 */
const findMatchingItems = (
  ingredientName: string,
  pantryLookup: Map<string, PantryItem[]>,
): PantryItem[] => {
  const normalizedIngredient = normalizeName(ingredientName);

  // 1. Try exact normalized match (O(1) lookup)
  const exactMatches = pantryLookup.get(normalizedIngredient);
  if (exactMatches && exactMatches.length > 0) {
    return exactMatches;
  }

  // 2. Fall back to substring matching (only when exact match fails)
  // This handles cases like "Tomato Paste" matching "Tomato"
  const substringMatches: PantryItem[] = [];
  for (const [key, items] of pantryLookup) {
    if (
      key.includes(normalizedIngredient) ||
      normalizedIngredient.includes(key)
    ) {
      substringMatches.push(...items);
    }
  }
  return substringMatches;
};

export const useGapAnalysis = (recipeId?: string, servings?: number) => {
  const { data: recipes } = useRecipes();
  const { data: pantry } = usePantry();
  const { data: profile } = useProfile();

  return useMemo(() => {
    if (!recipes || !pantry) return null;

    // Build the pantry lookup map once per memo cycle
    const pantryLookup = buildPantryLookup(pantry);

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
        // Find ALL items that match using the optimized lookup
        const matchingItems = findMatchingItems(reqIng.name, pantryLookup);

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
          [...matchingItems].sort((a, b) => b.quantity - a.quantity)[0];

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
