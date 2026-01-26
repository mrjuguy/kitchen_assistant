import { Search } from "lucide-react-native";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface InventoryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "location" | "expiry";
  setSortBy: (sort: "location" | "expiry") => void;
}

export const InventoryHeader = React.memo(
  ({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  }: InventoryHeaderProps) => {
    return (
      <View className="px-4 mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-extrabold text-gray-900">
            Live Inventory
          </Text>

          <View className="flex-row bg-[#f3f4f6] p-1 rounded-xl">
            <Pressable
              onPress={() => setSortBy("location")}
              className={`px-3 py-1.5 rounded-lg ${sortBy === "location" ? "bg-white shadow-sm elevation-1" : "bg-transparent"}`}
            >
              <Text
                className={`text-xs font-bold ${sortBy === "location" ? "text-emerald-500" : "text-gray-500"}`}
              >
                Location
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSortBy("expiry")}
              className={`px-3 py-1.5 rounded-lg ${sortBy === "expiry" ? "bg-white shadow-sm elevation-1" : "bg-transparent"}`}
            >
              <Text
                className={`text-xs font-bold ${sortBy === "expiry" ? "text-emerald-500" : "text-gray-500"}`}
              >
                Expiry
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl border border-gray-100">
          <Search size={18} color="#9ca3af" />
          <TextInput
            placeholder="Search your pantry..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-3 text-gray-900 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    );
  },
);
