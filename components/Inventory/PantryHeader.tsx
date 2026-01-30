import { Search } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { supabase } from "../../services/supabase";

interface PantryHeaderProps {
  onSearchPress: () => void;
}

export const PantryHeader = React.memo(
  ({ onSearchPress }: PantryHeaderProps) => {
    return (
      <View className="flex-row items-center justify-between px-6 py-2 mb-6">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => supabase.auth.signOut()}
            className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white overflow-hidden shadow-sm shadow-zinc-200"
          >
            <View className="flex-1 items-center justify-center bg-zinc-200">
              <Text className="text-[10px] text-zinc-600 font-bold">USER</Text>
            </View>
          </Pressable>
          <View>
            <Text className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Culinary OS
            </Text>
            <Text className="text-xl font-bold text-zinc-900 tracking-tight">
              Kitchen Assistant
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onSearchPress}
          className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-lg shadow-zinc-200/50 border border-zinc-100"
        >
          <Search size={22} color="#18181b" />
        </Pressable>
      </View>
    );
  },
);
