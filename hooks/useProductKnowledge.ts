import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentHousehold } from "./useHousehold";
import { supabase } from "../services/supabase";
import {
  CreateHouseholdProductSettings,
  HouseholdProductSettings,
} from "../types/schema";
import { requireHousehold } from "../utils/mutation";

export const useHouseholdProductSettings = (productName?: string) => {
  const { currentHousehold } = useCurrentHousehold();

  return useQuery<HouseholdProductSettings[]>({
    queryKey: ["product-settings", currentHousehold?.id, productName],
    queryFn: async () => {
      if (!currentHousehold) return [];

      let query = supabase
        .from("household_product_settings")
        .select("*")
        .eq("household_id", currentHousehold.id);

      if (productName) {
        query = query.ilike("product_name", productName);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentHousehold,
  });
};

export const useUpdateProductSettings = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (settings: CreateHouseholdProductSettings) => {
      const household = requireHousehold(currentHousehold);

      // Upsert based on natural key (household_id, product_name)
      const { data, error } = await supabase
        .from("household_product_settings")
        .upsert(
          {
            ...settings,
            household_id: household.id,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "household_id,product_name",
          },
        )
        .select()
        .single();

      if (error) throw error;
      return data as HouseholdProductSettings;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-settings", currentHousehold?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "product-settings",
          currentHousehold?.id,
          variables.product_name,
        ],
      });
    },
  });
};

/**
 * Hook to get the best estimated expiry for a product based on household knowledge
 */
export const useProductKnowledge = (productName: string) => {
  const { data: settings, isLoading } =
    useHouseholdProductSettings(productName);

  const getEstimatedExpiryDate = () => {
    if (!settings || settings.length === 0) return null;

    const productSetting = settings[0];
    if (!productSetting.default_expiry_days) return null;

    const expiryDate = new Date();
    expiryDate.setDate(
      expiryDate.getDate() + productSetting.default_expiry_days,
    );
    return expiryDate.toISOString().split("T")[0];
  };

  return {
    estimatedExpiryDate: getEstimatedExpiryDate(),
    isLoading,
    productSetting: settings?.[0] || null,
  };
};
