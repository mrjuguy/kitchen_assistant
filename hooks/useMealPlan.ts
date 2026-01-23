import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { CreateMealPlan, MealPlan, RecipeIngredient } from '../types/schema';
import { isMatch } from '../utils/matcher';
import { usePantry } from './usePantry';
import { useAddShoppingItems } from './useShoppingList';

export const useMealPlan = (startDate?: string, endDate?: string) => {
    return useQuery<MealPlan[]>({
        queryKey: ['meal_plans', startDate, endDate],
        queryFn: async () => {
            let query = supabase
                .from('meal_plans')
                .select('*, recipe:recipes(*, recipe_ingredients(*))');

            if (startDate) {
                query = query.gte('date', startDate);
            }
            if (endDate) {
                query = query.lte('date', endDate);
            }

            const { data, error } = await query.order('date', { ascending: true });

            if (error) throw error;

            // Map the data to include ingredients in the joined recipe
            return (data || []).map((plan) => ({
                ...plan,
                recipe: plan.recipe ? {
                    ...plan.recipe,
                    ingredients: plan.recipe.recipe_ingredients || []
                } : undefined
            }));
        },
    });
};

import { useCurrentHousehold } from './useHousehold';

export const useAddToPlan = () => {
    const queryClient = useQueryClient();
    const { currentHousehold } = useCurrentHousehold();

    return useMutation({
        mutationFn: async (plan: CreateMealPlan) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            if (!currentHousehold) throw new Error('No household selected');

            const { data, error } = await supabase
                .from('meal_plans')
                .upsert({
                    ...plan,
                    user_id: user.id,
                    household_id: currentHousehold.id
                }, {
                    onConflict: 'household_id,date,meal_type'
                })
                .select('*, recipe:recipes(*)')
                .single();

            if (error) throw error;
            return data as MealPlan;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meal_plans'] });
        },
    });
};

export const useRemoveFromPlan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('meal_plans')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meal_plans'] });
        },
    });
};

export const useWeeklyShoppingList = (startDate: string, endDate: string) => {
    const { data: plans } = useMealPlan(startDate, endDate);
    const { data: pantry } = usePantry();
    const addShoppingItemsMutation = useAddShoppingItems();

    const generateShoppingList = async () => {
        if (!plans || !pantry) return [];

        // 1. Aggregate ingredients from all recipes
        const aggregate: Record<string, { name: string; quantity: number; unit: string }> = {};

        plans.forEach(plan => {
            if (plan.recipe?.ingredients) {
                plan.recipe.ingredients.forEach((ing: RecipeIngredient) => {
                    const key = ing.name.toLowerCase().trim();
                    if (aggregate[key]) {
                        aggregate[key].quantity += ing.quantity;
                    } else {
                        aggregate[key] = {
                            name: ing.name,
                            quantity: ing.quantity,
                            unit: ing.unit
                        };
                    }
                });
            }
        });

        // 2. Subtract pantry items
        const missingItems: { name: string; quantity: number; unit: string; category: string }[] = [];

        Object.values(aggregate).forEach(req => {
            // Find ALL items that match
            const matchingItems = pantry.filter(p => isMatch(p.name, req.name));

            // Sum available quantity across ALL matching items
            const available = matchingItems.reduce((sum, item) => sum + item.quantity, 0);

            const needed = req.quantity - available;

            if (needed > 0) {
                // Find category from the best match
                const bestMatch = matchingItems.sort((a, b) => b.quantity - a.quantity)[0];

                missingItems.push({
                    name: req.name,
                    quantity: Math.ceil(needed),
                    unit: req.unit,
                    category: bestMatch?.category || 'produce'
                });
            }
        });

        return missingItems;
    };

    return {
        generateShoppingList,
        addMissingToShoppingList: async () => {
            const items = await generateShoppingList();
            if (items.length > 0) {
                return addShoppingItemsMutation.mutateAsync(items);
            }
            return null;
        },
        isPending: addShoppingItemsMutation.isPending
    };
};
