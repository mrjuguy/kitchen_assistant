import { AlertTriangle, ChefHat, Info, Timer } from "lucide-react-native";
import React from "react";
import { Image, Text, View } from "react-native";

import { GapAnalysis } from "../../hooks/useGapAnalysis";
import { RecipeWithIngredients } from "../../types/schema";

interface RecipeCardProps {
  recipe: RecipeWithIngredients;
  analysis?: GapAnalysis;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, analysis }) => {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "Green":
        return {
          bg: "bg-emerald-500",
          text: "text-white",
          lightBg: "bg-emerald-500/10",
          lightText: "text-emerald-600",
          border: "border-emerald-500/20",
        };
      case "Yellow":
        return {
          bg: "bg-amber-500",
          text: "text-white",
          lightBg: "bg-amber-500/10",
          lightText: "text-amber-600",
          border: "border-amber-500/20",
        };
      case "Red":
        return {
          bg: "bg-red-500",
          text: "text-white",
          lightBg: "bg-red-500/10",
          lightText: "text-red-600",
          border: "border-red-500/20",
        };
      default:
        return {
          bg: "bg-zinc-400",
          text: "text-white",
          lightBg: "bg-zinc-500/10",
          lightText: "text-zinc-600",
          border: "border-zinc-500/20",
        };
    }
  };

  const statusStyles = getStatusStyles(analysis?.status);

  return (
    <View
      className="bg-white rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm"
      style={{ elevation: 2 }}
    >
      {/* Header Image */}
      <View className="h-44 bg-gray-50 items-center justify-center relative">
        {recipe.image_url ? (
          <Image source={{ uri: recipe.image_url }} className="w-full h-full" />
        ) : (
          <ChefHat size={48} color="#10b981" strokeWidth={1} />
        )}

        {/* Availability Badge */}
        {analysis && (
          <View
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-full ${statusStyles.bg}`}
          >
            <Text className="text-white text-[10px] font-black uppercase tracking-wider">
              {analysis.status === "Green"
                ? "Ready to Cook"
                : analysis.status === "Yellow"
                  ? analysis.missingCount > 3
                    ? "Need Supplies"
                    : `${analysis.missingCount} Missing`
                  : analysis.allergenWarning
                    ? "UNSAFE"
                    : "Unsafe"}
            </Text>
          </View>
        )}
      </View>

      <View className="p-4">
        <Text
          className="text-xl font-bold text-gray-900 mb-1"
          numberOfLines={1}
        >
          {recipe.name}
        </Text>

        <View className="flex-row items-center mb-4">
          <View className="flex-row items-center mr-4">
            <Timer size={14} color="#10b981" />
            <Text className="text-gray-500 text-xs ml-1">{totalTime} mins</Text>
          </View>
          <View className="flex-row items-center">
            <Info size={14} color="#10b981" />
            <Text className="text-gray-500 text-xs ml-1">
              {recipe.ingredients.length} ingredients
            </Text>
          </View>
        </View>

        {/* Allergen Warning */}
        {analysis?.allergenWarning && (
          <View className="bg-red-50 p-3 rounded-2xl border border-red-100 mb-3 flex-row items-center">
            <AlertTriangle size={16} color="#ef4444" className="mr-2" />
            <Text className="text-red-800 text-xs font-bold">
              Contains {analysis.allergenWarning}
            </Text>
          </View>
        )}

        {/* Gap Analysis Summary */}
        {analysis &&
          analysis.status !== "Green" &&
          !analysis.allergenWarning && (
            <View
              className={`${statusStyles.lightBg} p-3 rounded-2xl border ${statusStyles.border}`}
            >
              <Text
                className={`${statusStyles.lightText} text-[10px] font-black uppercase tracking-widest mb-1`}
              >
                {analysis.status === "Yellow"
                  ? "Missing:"
                  : "Missing ingredients:"}
              </Text>
              <Text
                className={`${statusStyles.lightText} text-xs font-medium`}
                numberOfLines={1}
              >
                {analysis.ingredientMatches
                  .filter((i) => !i.isInStock)
                  .map((i) => i.name)
                  .join(", ")}
              </Text>
            </View>
          )}

        {analysis?.status === "Green" && (
          <View className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <Text className="text-emerald-700 text-xs font-semibold">
              You have everything you need!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
