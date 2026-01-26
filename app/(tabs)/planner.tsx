import { useRouter } from "expo-router";
import { CalendarDays, ShoppingBasket } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MealCard } from "../../components/Planner/MealCard";
import { WeekStrip } from "../../components/Planner/WeekStrip";
import { useMealPlan, useWeeklyShoppingList } from "../../hooks/useMealPlan";
import { RecipeStackParamList } from "../../types/navigation";
import { formatDate, getWeekDays } from "../../utils/date";

export default function PlannerScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekDays = useMemo(() => getWeekDays(new Date()), []);

  const startDate = formatDate(weekDays[0]);
  const endDate = formatDate(weekDays[6]);

  const {
    data: mealPlans,
    isLoading,
    refetch,
    isRefetching,
  } = useMealPlan(startDate, endDate);
  const { addMissingToShoppingList, isPending: isShoppingPending } =
    useWeeklyShoppingList(startDate, endDate);

  const selectedDateStr = formatDate(selectedDate);

  const dayPlans = useMemo(() => {
    if (!mealPlans) return {};
    const plans = mealPlans.filter((p) => p.date === selectedDateStr);
    return {
      breakfast: plans.find((p) => p.meal_type === "breakfast"),
      lunch: plans.find((p) => p.meal_type === "lunch"),
      dinner: plans.find((p) => p.meal_type === "dinner"),
    };
  }, [mealPlans, selectedDateStr]);

  const handleAddMeal = (
    type: RecipeStackParamList["(tabs)/recipes"]["meal_type"],
  ) => {
    router.push({
      pathname: "/(tabs)/recipes",
      params: {
        mode: "select",
        date: selectedDateStr,
        meal_type: type,
      },
    });
  };

  const handleShopForWeek = async () => {
    try {
      const results = await addMissingToShoppingList();
      if (results && results.length > 0) {
        Alert.alert(
          "Success!",
          `Added ${results.length} items to your shopping list.`,
          [
            {
              text: "Go to Shopping List",
              onPress: () => router.push("/(tabs)/shopping"),
            },
            { text: "OK" },
          ],
        );
      } else {
        Alert.alert(
          "All Set!",
          "You already have all the ingredients for this week's plan.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate shopping list.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f7f8]" edges={["top"]}>
      <View className="flex-1 pt-6">
        <View className="px-5 flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-3xl font-bold text-gray-900">
              Meal Planner
            </Text>
            <Text className="text-sm text-gray-500">The "Chef's Weekly"</Text>
          </View>
          <View className="bg-emerald-50 p-3 rounded-full">
            <CalendarDays size={24} color="#10b981" />
          </View>
        </View>

        <WeekStrip
          days={weekDays}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-24"
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#10b981"
            />
          }
        >
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Meals for{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>

            <MealCard
              meal={dayPlans.breakfast}
              mealType="breakfast"
              onPress={() => handleAddMeal("breakfast")}
            />
            <MealCard
              meal={dayPlans.lunch}
              mealType="lunch"
              onPress={() => handleAddMeal("lunch")}
            />
            <MealCard
              meal={dayPlans.dinner}
              mealType="dinner"
              onPress={() => handleAddMeal("dinner")}
            />
          </View>

          {/* Quick Shopping Button */}
          <Pressable
            className={`bg-gray-900 p-5 rounded-2xl flex-row items-center justify-center shadow-lg shadow-black/20 ${isShoppingPending ? "opacity-70" : "opacity-100"}`}
            onPress={handleShopForWeek}
            disabled={isShoppingPending}
            style={{ elevation: 4 }}
          >
            {isShoppingPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <ShoppingBasket size={20} color="white" className="mr-3" />
                <Text className="text-white font-bold text-base">
                  Shop for Week
                </Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
