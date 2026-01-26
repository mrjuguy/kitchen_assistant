import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface AddItemHeaderProps {
  readonly onClose: () => void;
  readonly title?: string;
}

export const AddItemHeader: React.FC<AddItemHeaderProps> = ({
  onClose,
  title = "Add Item",
}) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
      <Pressable onPress={onClose} className="p-2 rounded-full">
        <Ionicons name="close" size={24} color="#64748b" />
      </Pressable>
      <Text className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </Text>
      <View className="w-10" />
    </View>
  );
};
