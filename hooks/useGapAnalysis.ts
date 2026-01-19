import { useMemo } from 'react';
import { RecipeIngredient } from '../types/schema';
import { checkAllergen, isMatch } from '../utils/matcher';
import { usePantry } from './usePantry';
import { useProfile } from './useProfile';
import { RecipeWithIngredients, useRecipes } from './useRecipes';

export type MatchStatus = 'Green' | 'Yellow' | 'Red';

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
    allergenWarning: string | null;
    isSafe: boolean;
}

export const useGapAnalysis = (recipeId?: string) => {
    const { data: recipes } = useRecipes();
    const { data: pantry } = usePantry();
    const { data: profile } = useProfile();

    return useMemo(() => {
        if (!recipes || !pantry) return null;

        const processRecipe = (recipe: RecipeWithIngredients): GapAnalysis => {
            const ingredientMatches: IngredientMatch[] = [];
            let missingCount = 0;

            // 1. Check Allergens first
            const ingredientNames = recipe.ingredients.map((i: RecipeIngredient) => i.name);
            const allergenWarning = checkAllergen(
                recipe.allergens || [],
                profile?.allergens || [],
                ingredientNames
            );
            const isSafe = !allergenWarning;

            // 2. Check Ingredients
            recipe.ingredients.forEach((reqIng: RecipeIngredient) => {
                const pantryMatch = pantry.find(p => isMatch(p.name, reqIng.name));
                const available = pantryMatch ? pantryMatch.quantity : 0;
                const isInStock = available >= reqIng.quantity;

                if (!isInStock) {
                    missingCount++;
                }

                ingredientMatches.push({
                    name: reqIng.name,
                    pantryItemId: pantryMatch?.id,
                    required: reqIng.quantity,
                    available,
                    unit: reqIng.unit,
                    isInStock
                });
            });

            // 3. Determine Status
            let status: MatchStatus = 'Green';
            if (!isSafe || missingCount > 2) {
                status = 'Red';
            } else if (missingCount > 0) {
                status = 'Yellow';
            }

            return {
                status,
                missingCount,
                ingredientMatches,
                allergenWarning,
                isSafe
            };
        };

        if (recipeId) {
            const recipe = recipes.find(r => r.id === recipeId);
            return recipe ? processRecipe(recipe) : null;
        }

        // If no recipeId, return a map of all analyses (useful for lists)
        const analysisMap: Record<string, GapAnalysis> = {};
        recipes.forEach(r => {
            analysisMap[r.id] = processRecipe(r);
        });

        return analysisMap;
    }, [recipeId, recipes, pantry, profile]);
};
