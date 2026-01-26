import React from "react";
import { Text, View } from "react-native";

interface NutritionLabelProps {
  data: {
    calories?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
    sugar?: number;
    fiber?: number;
  };
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({ data }) => {
  const rows = [
    { label: "Calories", value: data.calories, unit: "kcal" },
    { label: "Total Fat", value: data.fat, unit: "g" },
    { label: "Carbohydrates", value: data.carbohydrates, unit: "g" },
    { label: "  Sugars", value: data.sugar, unit: "g" },
    { label: "  Fiber", value: data.fiber, unit: "g" },
    { label: "Protein", value: data.proteins, unit: "g" },
  ];

  return (
    <View className="bg-white p-4 rounded-xl border border-gray-200">
      <Text className="text-2xl font-black mb-1 text-gray-900">
        Nutrition Facts
      </Text>
      <View className="h-px bg-gray-200 mb-1" />
      <Text className="text-sm text-gray-500 mb-2">Values per 100g</Text>
      <View className="h-1.5 bg-gray-900 mb-2" />

      {rows.map((row, index) => (
        <React.Fragment key={row.label}>
          <View className="flex-row justify-between py-2">
            <Text
              className={`text-base text-gray-700 ${row.label.startsWith(" ") ? "font-normal pl-4" : "font-bold"}`}
            >
              {row.label.trim()}
            </Text>
            <Text className="text-base font-bold text-gray-900">
              {row.value !== undefined
                ? `${Math.round(row.value * 10) / 10}${row.unit}`
                : "—"}
            </Text>
          </View>
          {index < rows.length - 1 && <View className="h-px bg-gray-100" />}
        </React.Fragment>
      ))}
    </View>
  );
};
