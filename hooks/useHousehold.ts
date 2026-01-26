import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../services/supabase";
import { Household } from "../types/schema";

export const useHousehold = () => {
  return useQuery<Household[]>({
    queryKey: ["households"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("households")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCurrentHousehold = () => {
  const { data: households, ...rest } = useHousehold();
  // For now, simple logic: first household is the active one.
  // In the future, we can store the active ID in AsyncStorage or context.
  const currentHousehold = households?.[0] || null;

  return {
    currentHousehold,
    households,
    ...rest,
  };
};

export const useHouseholdMembers = (householdId?: string) => {
  return useQuery({
    queryKey: ["household_members", householdId],
    queryFn: async () => {
      if (!householdId) return [];

      // Get members and their profiles.
      // Note: 'profiles' table join.
      const { data, error } = await supabase
        .from("household_members")
        .select("*, profile:profiles(*)")
        .eq("household_id", householdId);

      if (error) throw error;
      return data;
    },
    enabled: !!householdId,
  });
};

export const useJoinHousehold = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data, error } = await supabase.rpc("join_household_via_code", {
        invite_code_input: inviteCode,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["households"] });
    },
  });
};
