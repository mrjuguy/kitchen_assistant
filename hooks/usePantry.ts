import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { CreatePantryItem, PantryItem, UpdatePantryItem } from '../types/schema';

export const usePantry = () => {
    return useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('pantry_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        },
    });
};

export const useAddPantryItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newItem: CreatePantryItem) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('pantry_items')
                .insert([{ ...newItem, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data as PantryItem;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

export const useUpdatePantryItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: UpdatePantryItem }) => {
            const { data, error } = await supabase
                .from('pantry_items')
                .update(updates)
                .match({ id })
                .select()
                .single();

            if (error) throw error;
            return data as PantryItem;
        },
        // Optimistic Update
        onMutate: async ({ id, updates }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['pantry'] });

            // Add updated_at if not present
            const fullUpdates = { ...updates, updated_at: new Date().toISOString() };

            // Snapshot the previous value
            const previousItems = queryClient.getQueryData<PantryItem[]>(['pantry']);

            // Optimistically update to the new value
            if (previousItems) {
                queryClient.setQueryData<PantryItem[]>(['pantry'], (old) =>
                    old?.map((item) =>
                        item.id === id ? { ...item, ...fullUpdates } : item
                    )
                );
            }

            return { previousItems };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newTodo, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(['pantry'], context.previousItems);
            }
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

export const useDeletePantryItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('pantry_items')
                .delete()
                .match({ id });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

export const useConsumeIngredients = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updates: { id: string; newQuantity: number }[]) => {
            const promises = updates.map(({ id, newQuantity }) => {
                if (newQuantity <= 0) {
                    return supabase.from('pantry_items').delete().eq('id', id);
                } else {
                    return supabase.from('pantry_items').update({ quantity: newQuantity }).eq('id', id);
                }
            });

            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

export const useStalePantryItems = () => {
    const { data: pantryItems } = usePantry();

    if (!pantryItems) return [];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Sort by updated_at ascending (oldest first)
    // Filter items older than 7 days
    return pantryItems
        .filter(item => {
            const lastUpdate = item.updated_at || item.created_at;
            if (!lastUpdate) return false;
            const date = new Date(lastUpdate);
            // Ignore items created very recently (safety check, though created_at handles it)
            return date < sevenDaysAgo;
        })
        .sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at).getTime();
            const dateB = new Date(b.updated_at || b.created_at).getTime();
            return dateA - dateB;
        })
        .slice(0, 3);
};
