import * as Haptics from "expo-haptics";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  unit?: string;
}

export const QuantityControl = React.memo(
  ({ quantity, onIncrease, onDecrease, unit }: QuantityControlProps) => {
    const handleIncrease = () => {
      Haptics.selectionAsync();
      onIncrease();
    };

    const handleDecrease = () => {
      if (quantity > 0) {
        Haptics.selectionAsync();
        onDecrease();
      }
    };

    return (
      <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
        <Pressable onPress={handleDecrease} className="p-1 rounded-full">
          <Minus size={18} color="#10b981" />
        </Pressable>

        <View className="flex-row items-baseline px-2 min-w-[40px] justify-center">
          <Text className="text-base font-semibold text-black">{quantity}</Text>
          {unit && <Text className="text-xs text-gray-500 ml-1">{unit}</Text>}
        </View>

        <Pressable onPress={handleIncrease} className="p-1 rounded-full">
          <Plus size={18} color="#10b981" />
        </Pressable>
      </View>
    );
  },
);
