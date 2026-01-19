import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '../services/supabase';
import { Recipe, RecipeIngredient } from '../types/schema';
import { usePantry } from './usePantry';

export interface RecipeWithIngredients extends Recipe {
    ingredients: RecipeIngredient[];
}

export interface GapAnalysisResult {
    recipeId: string;
    missingIngredients: {
        name: string;
        required: number;
        available: number;
        unit: string;
    }[];
    percentAvailable: number;
    canCook: boolean;
}

export const useRecipes = () => {
    return useQuery<RecipeWithIngredients[]>({
        queryKey: ['recipes'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('recipes')
                .select('*, recipe_ingredients(*)');

            if (error) throw error;
            return data.map((recipe: any) => ({
                ...recipe,
                ingredients: recipe.recipe_ingredients || [],
            }));
        },
    });
};

export const useGapAnalysis = () => {
    const { data: recipes } = useRecipes();
    const { data: pantry } = usePantry();

    return useMemo(() => {
        if (!recipes || !pantry) return [];

        return recipes.map(recipe => {
            const analysis: GapAnalysisResult = {
                recipeId: recipe.id,
                missingIngredients: [],
                percentAvailable: 0,
                canCook: false,
            };

            let matchedCount = 0;

            recipe.ingredients.forEach(reqIng => {
                // Simple string matching for now (can be improved with fuzzy search or aliases)
                const pantryMatch = pantry.find(p =>
                    p.name.toLowerCase().includes(reqIng.name.toLowerCase()) ||
                    reqIng.name.toLowerCase().includes(p.name.toLowerCase())
                );

                if (pantryMatch && pantryMatch.quantity >= reqIng.quantity) {
                    matchedCount++;
                } else {
                    analysis.missingIngredients.push({
                        name: reqIng.name,
                        required: reqIng.quantity,
                        available: pantryMatch?.quantity || 0,
                        unit: reqIng.unit,
                    });
                }
            });

            analysis.percentAvailable = recipe.ingredients.length > 0
                ? (matchedCount / recipe.ingredients.length) * 100
                : 100;
            analysis.canCook = matchedCount === recipe.ingredients.length;

            return analysis;
        });
    }, [recipes, pantry]);
};
