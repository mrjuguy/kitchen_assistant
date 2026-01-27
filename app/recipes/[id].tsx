import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Flame,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Trash2,
  Utensils,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GapAnalysis, useGapAnalysis } from "../../hooks/useGapAnalysis";
import { useConsumeIngredients } from "../../hooks/usePantry";
import { useDeleteRecipe, useRecipes } from "../../hooks/useRecipes";
import { useAddShoppingItems } from "../../hooks/useShoppingList";
import { RecipeStackParamList } from "../../types/navigation";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<RecipeStackParamList["recipes/[id]"]>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: recipes, isLoading } = useRecipes();
  const [servings, setServings] = useState(4); // Default to generic 4, will update via useEffect
  const analysis = useGapAnalysis(id, servings) as GapAnalysis | null;

  const consumeMutation = useConsumeIngredients();
  const addShoppingMutation = useAddShoppingItems();
  const deleteMutation = useDeleteRecipe();
  // const addToPlanMutation = useAddToPlan(); // Kept for future use if we add Schedule button back

  // const [servings, setServings] = useState(4); // Moved up to use in hook
  const [showFullMethod, setShowFullMethod] = useState(false);

  const recipe = recipes?.find((r) => r.id === id);

  // Set initial servings from recipe on mount
  React.useEffect(() => {
    if (recipe?.servings) setServings(recipe.servings);
  }, [recipe?.servings]);

  if (isLoading || !recipe) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0d7ff2" />
      </View>
    );
  }

  const percentage = analysis ? Math.round(analysis.percentage * 100) : 0;
  const missingCount = analysis ? analysis.missingIngredients.length : 0;
  const hasItems = analysis ? analysis.totalIngredients - missingCount : 0;

  const handleCookNow = () => {
    if (!analysis) return;

    Alert.alert(
      "Cook this recipe?",
      "This will remove the used ingredients from your pantry.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Cook & Eat",
          onPress: () => {
            const updates = analysis.ingredientMatches
              .filter((m) => m.pantryItemId)
              .map((m) => ({
                id: m.pantryItemId!,
                newQuantity: Math.max(0, m.available - m.required),
              }));

            consumeMutation.mutate(updates, {
              onSuccess: () => {
                Alert.alert(
                  "Bon Appétit!",
                  "Ingredients removed from pantry.",
                  [{ text: "OK", onPress: () => router.back() }],
                );
              },
            });
          },
        },
      ],
    );
  };

  const handleAddMissing = () => {
    if (!analysis || missingCount === 0) return;

    const missingItems = analysis.ingredientMatches
      .filter((m) => !m.isInStock)
      .map((m) => ({
        name: m.name,
        quantity: Math.max(0, m.required - m.available),
        unit: m.unit,
        category: "produce", // Default category
      }));

    Alert.alert(
      "Add to Shopping List?",
      `Add ${missingItems.length} missing ingredients to your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add Items",
          onPress: () => {
            addShoppingMutation.mutate(missingItems, {
              onSuccess: () => {
                Alert.alert("Added!", "Items added to shopping list.", [
                  {
                    text: "Go to Shopping List",
                    onPress: () => router.push("/(tabs)/shopping"),
                  },
                  { text: "Stay" },
                ]);
              },
            });
          },
        },
      ],
    );
  };

  // Calculate scaled quantities are now handled by hooks
  // const scaleFactor = servings / (recipe.servings || 4);

  return (
    <View className="flex-1 bg-[#f5f7f8] dark:bg-[#101922]">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View className="w-full h-[45vh] relative shrink-0">
          {recipe.image_url ? (
            <Image
              source={{ uri: recipe.image_url }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="absolute inset-0 bg-gray-200 items-center justify-center">
              <Utensils size={64} color="#9ca3af" />
            </View>
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.4)"]}
            className="absolute inset-0"
          />

          {/* Header Navigation (Absolute) */}
          <View
            style={{ paddingTop: insets.top + 10 }}
            className="absolute top-0 left-0 right-0 z-50 px-4 flex-row justify-between items-center"
          >
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center backdrop-blur-md"
            >
              <ArrowLeft size={24} color="white" />
            </Pressable>
            <View className="flex-row gap-3">
              <Pressable className="w-10 h-10 rounded-full bg-white/20 items-center justify-center backdrop-blur-md">
                <Share2 size={20} color="white" />
              </Pressable>
              <Pressable
                onPress={() => {
                  Alert.alert("Delete Recipe", "Are you sure?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () =>
                        deleteMutation.mutate(id!, {
                          onSuccess: () => router.back(),
                        }),
                    },
                  ]);
                }}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center backdrop-blur-md"
              >
                <Trash2 size={20} color="white" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Main Content Card */}
        <View className="relative -mt-10 rounded-t-3xl bg-[#f5f7f8] dark:bg-[#101922] w-full flex-col px-5 pt-8 shadow-lg">
          {/* Title & Meta */}
          <View className="flex-col gap-3 mb-6">
            <Text className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {recipe.name}
            </Text>
            <View className="flex-row flex-wrap gap-2 items-center">
              <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 shadow-sm">
                <Clock size={16} color="#0d7ff2" />
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 shadow-sm">
                <Activity size={16} color="#0d7ff2" />
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {recipe.difficulty || "Easy"}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 shadow-sm">
                <Flame size={16} color="#0d7ff2" />
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {recipe.calories || "---"} kcal
                </Text>
              </View>
            </View>
          </View>

          <View className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full mb-6" />

          {/* Gap Analysis Section */}
          {analysis && (
            <View className="flex-col gap-4 mb-6">
              <View className="flex-row justify-between items-end">
                <View className="flex-col gap-1">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    Pantry Match
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    You have {hasItems} of {analysis.totalIngredients}{" "}
                    ingredients
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-green-500">
                  {percentage}%
                </Text>
              </View>

              <View className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-row">
                <View
                  className="h-full bg-green-500 rounded-l-full"
                  style={{ width: `${percentage}%` }}
                />
                <View
                  className="h-full bg-red-500/80 rounded-r-full"
                  style={{ width: `${100 - percentage}%` }}
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-green-500" />
                  <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    What you have
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-red-500" />
                  <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    What you need
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Portion Controller */}
          <View className="flex-row items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
            <View className="flex-col">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                Serving Size
              </Text>
              <Text className="text-xs text-gray-500">Adjusts quantities</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <Pressable
                onPress={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
              >
                <Minus size={16} color="#4b5563" />
              </Pressable>
              <Text className="font-bold text-lg min-w-[30px] text-center text-gray-900 dark:text-white">
                {servings}
              </Text>
              <Pressable
                onPress={() => setServings(servings + 1)}
                className="w-8 h-8 rounded-full bg-[#0d7ff2] items-center justify-center shadow-sm"
              >
                <Plus size={16} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Ingredients List */}
          <View className="flex-col gap-4 mb-8">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Ingredients
            </Text>
            <View className="flex-col gap-3">
              {analysis?.ingredientMatches.map((item, index) => {
                const isMissing = !item.isInStock;

                return (
                  <View
                    key={index}
                    className={`flex-row items-center gap-4 p-3 rounded-xl border shadow-sm ${
                      isMissing
                        ? "bg-white dark:bg-[#1a2632] border-red-100 dark:border-red-900/30"
                        : "bg-white dark:bg-[#1a2632] border-gray-100 dark:border-gray-800"
                    }`}
                  >
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        isMissing
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-emerald-50 dark:bg-emerald-900/20"
                      }`}
                    >
                      {isMissing ? (
                        <AlertCircle size={20} color="#ef4444" />
                      ) : (
                        <CheckCircle size={20} color="#10b981" />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="font-medium text-gray-900 dark:text-gray-200">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {parseFloat(item.required.toFixed(2))} {item.unit} ·
                        <Text
                          className={`text-xs font-bold uppercase tracking-wider ${isMissing ? "text-red-500" : "text-green-500"}`}
                        >
                          {isMissing ? " MISSING" : " IN PANTRY"}
                        </Text>
                      </Text>
                    </View>

                    {isMissing && (
                      <Pressable
                        onPress={() => {
                          addShoppingMutation.mutate(
                            [
                              {
                                name: item.name,
                                quantity: Math.max(
                                  0,
                                  item.required - item.available,
                                ),
                                unit: item.unit,
                                category: "pantry",
                              },
                            ],
                            {
                              onSuccess: () =>
                                Alert.alert(
                                  "Added",
                                  `${item.name} added to shopping list.`,
                                ),
                            },
                          );
                        }}
                        className="w-10 h-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 active:bg-red-100"
                      >
                        <Plus size={20} color="#ef4444" />
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Method */}
          <View className="flex-col gap-3 mb-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Method
              </Text>
              <Pressable onPress={() => setShowFullMethod(!showFullMethod)}>
                <Text className="text-[#0d7ff2] text-sm font-semibold">
                  {showFullMethod ? "View Less" : "View Full"}
                </Text>
              </Pressable>
            </View>
            <View className="p-4 bg-gray-50 dark:bg-[#1a2632] rounded-xl">
              {(recipe.instructions || [])
                .slice(0, showFullMethod ? undefined : 2)
                .map((step, idx) => (
                  <View key={idx} className="mb-3 flex-row gap-3">
                    <Text className="font-bold text-gray-400">{idx + 1}.</Text>
                    <Text className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step}
                    </Text>
                  </View>
                ))}
              {!showFullMethod && recipe.instructions?.length > 2 && (
                <Text className="text-gray-400 mt-2 italic">
                  ... {recipe.instructions.length - 2} more steps
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View
        style={{ paddingBottom: Math.max(24, insets.bottom + 8) }}
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#101922]/95 border-t border-gray-200 dark:border-gray-800 pt-4 px-5 shadow-2xl rounded-t-2xl backdrop-blur-lg"
      >
        <View className="flex-row gap-3 w-full">
          {missingCount === 0 || percentage === 100 ? (
            <Pressable
              className="flex-1 h-14 rounded-xl bg-[#0d7ff2] items-center justify-center flex-row gap-2 shadow-lg shadow-blue-500/30"
              onPress={handleCookNow}
            >
              <Utensils size={20} color="white" />
              <Text className="text-white font-bold text-base">
                Cook This Now
              </Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                className="flex-1 h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent items-center justify-center flex-row gap-2"
                onPress={handleCookNow}
              >
                <Utensils size={20} color="#111827" />
                <Text className="text-gray-900 dark:text-white font-bold text-base">
                  Cook ({percentage}%)
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 h-14 rounded-xl bg-[#0d7ff2] items-center justify-center flex-row gap-2 shadow-lg shadow-blue-500/30"
                onPress={handleAddMissing}
              >
                <ShoppingCart size={20} color="white" />
                <Text className="text-white font-bold text-base">
                  Shop {missingCount} Missing
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
