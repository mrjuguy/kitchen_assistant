import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../services/supabase";
import { UpdateUserProfile, UserProfile } from "../types/schema";
import { requireAuth } from "../utils/mutation";

export const useProfile = () => {
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await requireAuth().catch(() => null);
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateUserProfile) => {
      const user = await requireAuth();

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "delete-account",
        {
          method: "POST",
        },
      );

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await supabase.auth.signOut();
    },
  });
};
