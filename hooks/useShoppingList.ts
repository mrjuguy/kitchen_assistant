import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { CreateShoppingItem, ShoppingItem, UpdateShoppingItem } from '../types/schema';

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

export const useAddShoppingItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newItem: CreateShoppingItem) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('shopping_list')
                .insert([{ ...newItem, user_id: user.id, bought: false }])
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
            const pantryItems = boughtItems.map(item => ({
                user_id: user.id,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                category: item.category,
                barcode: item.barcode,
                image_url: item.image_url,
            }));

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
