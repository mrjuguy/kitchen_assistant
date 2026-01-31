import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentHousehold } from "./useHousehold";
import { supabase } from "../services/supabase";
import { RecipeWithIngredients } from "../types/schema";
import { requireAuthAndHousehold } from "../utils/mutation";

export const useRecipes = () => {
  const { currentHousehold } = useCurrentHousehold();

  return useQuery<RecipeWithIngredients[]>({
    queryKey: ["recipes", currentHousehold?.id],
    enabled: !!currentHousehold,
    queryFn: async () => {
      if (!currentHousehold) return [];

      const { data, error } = await supabase
        .from("recipes")
        .select("*, recipe_ingredients(*)")
        .eq("household_id", currentHousehold.id);

      if (error) throw error;
      return data.map((recipe) => ({
        ...recipe,
        ingredients: recipe.recipe_ingredients || [],
      }));
    },
  });
};

export const useAddRecipe = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (recipeData: {
      name: string;
      description?: string;
      prep_time?: number;
      cook_time?: number;
      servings?: number;
      ingredients: { name: string; quantity: number; unit: string }[];
      instructions: string[];
      author?: string;
      source_url?: string;
      tags: string[];
    }) => {
      const { user, household } =
        await requireAuthAndHousehold(currentHousehold);

      // 1. Create Recipe
      const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .insert([
          {
            name: recipeData.name,
            description: recipeData.description,
            prep_time: recipeData.prep_time,
            cook_time: recipeData.cook_time,
            servings: recipeData.servings,
            instructions: recipeData.instructions,
            tags: recipeData.tags,
            author: recipeData.author,
            source_url: recipeData.source_url,
            user_id: user.id,
            household_id: household.id,
          },
        ])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // 2. Add Ingredients
      if (recipeData.ingredients.length > 0) {
        const ingredients = recipeData.ingredients.map((ing) => ({
          recipe_id: recipe.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        }));

        const { error: ingError } = await supabase
          .from("recipe_ingredients")
          .insert(ingredients);

        if (ingError) throw ingError;
      }

      return recipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipes", currentHousehold?.id],
      });
    },
  });
};
export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("recipes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipes", currentHousehold?.id],
      });
    },
  });
};
