import { Trash2 } from "lucide-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";

import { useFrequentlyExpiredStats } from "../../hooks/useUsageLogs";

export const FrequentlyExpiredList = () => {
  const { data: items, isLoading, isError } = useFrequentlyExpiredStats();

  if (isLoading) {
    return (
      <View className="mb-6">
        <View className="flex-row items-center px-4 mb-3">
          <View className="w-5 h-5 bg-gray-100 rounded-full animate-pulse" />
          <View className="w-32 h-6 bg-gray-100 rounded-md ml-2 animate-pulse" />
        </View>
        <View className="flex-row px-4 gap-3">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="bg-gray-50 p-3 rounded-2xl min-w-[120px] items-center border border-gray-100 h-[120px] animate-pulse"
            />
          ))}
        </View>
      </View>
    );
  }

  if (isError) return null; // Silent fail for errors in this insight widget is often better for UX than a big error box

  if (!items || items.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row items-center px-4 mb-3">
        <Trash2 size={20} color="#ef4444" />
        <Text className="text-lg font-bold text-gray-900 ml-2">
          Waste Watch
        </Text>
      </View>
      <FlatList
        horizontal
        data={items}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3"
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded-2xl min-w-[120px] items-center border border-gray-100 shadow-sm">
            <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mb-2">
              <Text className="text-lg">🗑️</Text>
            </View>
            <Text
              className="font-bold text-gray-900 text-center mb-1"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">
              {item.count}x
            </Text>
            <Text className="text-[10px] text-gray-400 mt-1">
              Last: {new Date(item.lastExpired).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};
