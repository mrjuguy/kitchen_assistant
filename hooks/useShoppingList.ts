import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { CreateShoppingItem, ShoppingItem, UpdateShoppingItem } from '../types/schema';
import { normalizeToUS, UnitKey } from '../utils/units';

export const useShoppingList = () => {
    return useQuery<ShoppingItem[]>({
        queryKey: ['shopping_list'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('shopping_list')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        },
    });
};

import { useCurrentHousehold } from './useHousehold';

export const useAddShoppingItem = () => {
    const queryClient = useQueryClient();
    const { currentHousehold } = useCurrentHousehold();

    return useMutation({
        mutationFn: async (newItem: CreateShoppingItem) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            if (!currentHousehold) throw new Error('No household selected');

            const { data, error } = await supabase
                .from('shopping_list')
                .insert([{ ...newItem, user_id: user.id, household_id: currentHousehold.id }])
                .select()
                .single();

            if (error) throw error;
            return data as ShoppingItem;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_list'] });
        },
    });
};

export const useUpdateShoppingItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: UpdateShoppingItem }) => {
            const { data, error } = await supabase
                .from('shopping_list')
                .update(updates)
                .match({ id })
                .select()
                .single();

            if (error) throw error;
            return data as ShoppingItem;
        },
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['shopping_list'] });
            const previousItems = queryClient.getQueryData<ShoppingItem[]>(['shopping_list']);

            if (previousItems) {
                queryClient.setQueryData<ShoppingItem[]>(['shopping_list'], (old) =>
                    old?.map((item) =>
                        item.id === id ? { ...item, ...updates } : item
                    )
                );
            }

            return { previousItems };
        },
        onError: (err, variables, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(['shopping_list'], context.previousItems);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_list'] });
        },
    });
};

export const useDeleteShoppingItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('shopping_list')
                .delete()
                .match({ id });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_list'] });
        },
    });
};

export const useCheckoutShoppingList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // 1. Get all bought items
            const { data: boughtItems, error: fetchError } = await supabase
                .from('shopping_list')
                .select('*')
                .eq('bought', true);

            if (fetchError) throw fetchError;
            if (!boughtItems || boughtItems.length === 0) return;

            // 2. Transfer to pantry
            const pantryItems = boughtItems.map(item => {
                // Ensure unit from DB matches UnitKey, fallback to 'unit' if unknown
                const safeUnit = (item.unit as UnitKey) || 'unit';
                const { value: normalizedQty, unit: normalizedUnit } = normalizeToUS(item.quantity, safeUnit);

                return {
                    user_id: user.id,
                    household_id: item.household_id, // Copy household_id
                    name: item.name,
                    quantity: normalizedQty,
                    unit: normalizedUnit,
                    total_capacity: normalizedQty, // Capture original full amount for progress tracking
                    category: item.category,
                    barcode: item.barcode,
                    image_url: item.image_url,
                    brand: item.brand,
                    nutritional_info: item.nutritional_info,
                    ingredients_text: item.ingredients_text,
                    allergens: item.allergens,
                    labels: item.labels,
                };
            });

            const { error: insertError } = await supabase
                .from('pantry_items')
                .insert(pantryItems);

            if (insertError) throw insertError;

            // 3. Delete from shopping list
            const { error: deleteError } = await supabase
                .from('shopping_list')
                .delete()
                .eq('bought', true);

            if (deleteError) throw deleteError;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_list'] });
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

export const useAddShoppingItems = () => {
    const queryClient = useQueryClient();
    const { currentHousehold } = useCurrentHousehold();

    return useMutation({
        mutationFn: async (newItems: CreateShoppingItem[]) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            if (!currentHousehold) throw new Error('No household selected');

            const itemsWithUser = newItems.map(item => ({
                ...item,
                user_id: user.id,
                household_id: currentHousehold.id
            }));

            const { data, error } = await supabase
                .from('shopping_list')
                .insert(itemsWithUser)
                .select();

            if (error) throw error;
            return data as ShoppingItem[];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_list'] });
        },
    });
};
export const useClearBoughtItems = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from('shopping_list')
                .delete()
                .eq('bought', true);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_list'] });
        },
    });
};

export const useDeleteAllShoppingItems = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('shopping_list')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_list'] });
        },
    });
};
