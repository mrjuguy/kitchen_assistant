// Force refresh
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentHousehold } from "./useHousehold";
import { supabase } from "../services/supabase";
import { CreateUsageLog, UsageLog } from "../types/schema";
import { computeExpiredStats } from "../utils/analytics";

export const useLogUsage = () => {
  const queryClient = useQueryClient();
  const { currentHousehold } = useCurrentHousehold();

  return useMutation({
    mutationFn: async (
      log: Omit<CreateUsageLog, "user_id" | "household_id">,
    ) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      if (!currentHousehold) throw new Error("No household selected");

      const { data, error } = await supabase
        .from("usage_logs")
        .insert([
          {
            ...log,
            user_id: user.id,
            household_id: currentHousehold.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as UsageLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usage_stats", "expired", currentHousehold?.id],
      });
    },
  });
};

export const useFrequentlyExpiredStats = () => {
  const { currentHousehold } = useCurrentHousehold();

  return useQuery({
    queryKey: ["usage_stats", "expired", currentHousehold?.id],
    enabled: !!currentHousehold,
    queryFn: async () => {
      if (!currentHousehold) return [];

      // Fetch all expired logs for this household
      const { data, error } = await supabase
        .from("usage_logs")
        .select("item_name, quantity, action, logged_at")
        .eq("household_id", currentHousehold.id)
        .eq("action", "expired")
        .order("logged_at", { ascending: false });

      if (error) throw error;

      // Transform raw data to match interface (Supabase returns slightly looser types typically)
      const logs = data.map((item) => ({
        ...item,
        action: item.action as "consumed" | "expired" | "discarded" | "donated",
      }));

      return computeExpiredStats(logs);
    },
  });
};
