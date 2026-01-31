import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentHousehold } from "./useHousehold";
import { supabase } from "../services/supabase";
import {
  CreateShoppingItem,
  ShoppingItem,
  UpdateShoppingItem,
} from "../types/schema";
import { requireAuth, requireAuthAndHousehold } from "../utils/mutation";

export const useShoppingList = () => {
  const { currentHousehold } = useCurrentHousehold();

  return useQuery<ShoppingItem[]>({
    queryKey: ["shopping_list", currentHousehold?.id],
    enabled: !!currentHousehold,
    queryFn: async () => {
      if (!currentHousehold) return [];

      const { data, error } = await supabase
        .from("shopping_list")
        .select("*")
        .eq("household_id", currentHousehold.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddShoppingItem = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (newItem: CreateShoppingItem) => {
      const { user, household } =
        await requireAuthAndHousehold(currentHousehold);

      const { data, error } = await supabase
        .from("shopping_list")
        .insert([{ ...newItem, user_id: user.id, household_id: household.id }])
        .select()
        .single();

      if (error) throw error;
      return data as ShoppingItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
    },
  });
};

export const useUpdateShoppingItem = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateShoppingItem;
    }) => {
      const { data, error } = await supabase
        .from("shopping_list")
        .update(updates)
        .match({ id })
        .select()
        .single();

      if (error) throw error;
      return data as ShoppingItem;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
      const previousItems = queryClient.getQueryData<ShoppingItem[]>([
        "shopping_list",
        currentHousehold?.id,
      ]);

      if (previousItems) {
        queryClient.setQueryData<ShoppingItem[]>(
          ["shopping_list", currentHousehold?.id],
          (old) =>
            old?.map((item) =>
              item.id === id ? { ...item, ...updates } : item,
            ),
        );
      }

      return { previousItems };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          ["shopping_list", currentHousehold?.id],
          context.previousItems,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
    },
  });
};

export const useDeleteShoppingItem = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .match({ id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
    },
  });
};

/**
 * Checkout all bought items from shopping list to pantry.
 * Uses an atomic RPC function to ensure data consistency -
 * either all items transfer successfully or none do.
 *
 * @returns Mutation hook for checkout operation
 */
export const useCheckoutShoppingList = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (): Promise<number> => {
      const { household } = await requireAuthAndHousehold(currentHousehold);

      // Call atomic RPC - handles fetch, insert, and delete in one transaction
      const { data, error } = await supabase.rpc("checkout_shopping_list", {
        p_household_id: household.id,
      });

      if (error) throw error;

      return data as number; // Returns count of transferred items
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["pantry", currentHousehold?.id],
      });
    },
  });
};

export const useAddShoppingItems = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (newItems: CreateShoppingItem[]) => {
      const { user, household } =
        await requireAuthAndHousehold(currentHousehold);

      const itemsWithUser = newItems.map((item) => ({
        ...item,
        user_id: user.id,
        household_id: household.id,
      }));

      const { data, error } = await supabase
        .from("shopping_list")
        .insert(itemsWithUser)
        .select();

      if (error) throw error;
      return data as ShoppingItem[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
    },
  });
};
export const useClearBoughtItems = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("bought", true);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
    },
  });
};

export const useDeleteAllShoppingItems = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async () => {
      const user = await requireAuth();

      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping_list", currentHousehold?.id],
      });
    },
  });
};
