import { ChefHat, Plus } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { MealPlan } from "../../types/schema";

interface MealCardProps {
  meal?: MealPlan;
  mealType: "breakfast" | "lunch" | "dinner";
  onPress: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  mealType,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-white rounded-2xl p-3 mb-3 border flex-row items-center ${
        meal ? "border-gray-200 border-solid" : "border-gray-100 border-dashed"
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        className={`w-12 h-12 rounded-xl items-center justify-center mr-3 overflow-hidden ${
          meal ? "bg-emerald-50" : "bg-gray-50"
        }`}
      >
        {meal?.recipe?.image_url ? (
          <Image
            source={{ uri: meal.recipe.image_url }}
            className="w-full h-full"
          />
        ) : (
          <ChefHat size={24} color={meal ? "#10b981" : "#d1d5db"} />
        )}
      </View>

      <View className="flex-1">
        <Text className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-0.5">
          {mealType}
        </Text>
        {meal ? (
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            {meal.recipe?.name}
          </Text>
        ) : (
          <Text className="text-base text-gray-400">Add Meal</Text>
        )}
      </View>

      {!meal && (
        <View className="bg-gray-100 p-2 rounded-full">
          <Plus size={16} color="#9ca3af" />
        </View>
      )}
    </Pressable>
  );
};
