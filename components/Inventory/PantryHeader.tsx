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
      <View className="flex-row items-center justify-between px-4 mb-8">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => supabase.auth.signOut()}
            className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden"
          >
            <View className="flex-1 items-center justify-center bg-gray-300">
              <Text className="text-[10px] text-gray-600 font-bold">USER</Text>
            </View>
          </Pressable>
          <View>
            <Text className="text-xs text-gray-500 font-medium">
              Culinary OS
            </Text>
            <Text className="text-lg font-bold text-gray-900">
              Kitchen Assistant
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onSearchPress}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm elevation-3"
        >
          <Search size={20} color="#111827" />
        </Pressable>
      </View>
    );
  },
);
