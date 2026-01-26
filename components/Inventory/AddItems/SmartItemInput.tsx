import { ScanBarcode, Search } from "lucide-react-native";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface SmartItemInputProps {
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly onScanPress: () => void;
}

export const SmartItemInput: React.FC<SmartItemInputProps> = ({
  value,
  onChangeText,
  onScanPress,
}) => {
  return (
    <View className="mb-6 mt-4">
      <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
        What did you <Text className="text-blue-500">buy today?</Text>
      </Text>

      <View className="relative">
        <View className="absolute inset-y-0 left-0 pl-4 h-full justify-center z-10 p-4">
          <Search size={24} color="#94a3b8" />
        </View>

        <TextInput
          className="w-full pl-14 pr-14 py-4 text-xl font-semibold bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white"
          placeholder="e.g. Avocado, Milk"
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
        />

        <View className="absolute inset-y-0 right-0 pr-2 h-full justify-center">
          <Pressable onPress={onScanPress} className="p-2 mr-1 rounded-xl">
            <ScanBarcode size={24} color="#94a3b8" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
