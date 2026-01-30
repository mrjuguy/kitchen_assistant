import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Refrigerator,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InventoryHeader } from "../../components/Inventory/InventoryHeader";
import { KitchenHealthSection } from "../../components/Inventory/KitchenHealthSection";
import { PantryCard } from "../../components/Inventory/PantryCard";
import { PantryHeader } from "../../components/Inventory/PantryHeader";
import { ProductDetailModal } from "../../components/Inventory/ProductDetailModal";
import { PantryCardSkeleton } from "../../components/Inventory/Skeleton";
import { WastingSoonCarousel } from "../../components/Inventory/WastingSoonCarousel";
import { usePantry } from "../../hooks/usePantry";
import { PantryItem } from "../../types/schema";
import {
  groupItemsByExpiry,
  groupItemsByLocation,
} from "../../utils/inventory";
import { getItemHealth } from "../../utils/itemHealth";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PantryScreen() {
  const {
    data: items,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = usePantry();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"location" | "expiry">("location");
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  const toggleSection = useCallback((title: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const sections = useMemo(() => {
    if (!items) return [];

    let filtered = items;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = items.filter(
        (item) =>
          (item.name?.toLowerCase() || "").includes(query) ||
          (item.category?.toLowerCase() || "").includes(query),
      );
    }

    const grouped =
      sortBy === "location"
        ? groupItemsByLocation(filtered)
        : groupItemsByExpiry(filtered);

    // Filter out empty sections and inject item counts for optimization
    return grouped
      .filter((section) => section.data.length > 0)
      .map((section) => ({
        ...section,
        count: section.data.length,
        // If the section is collapsed, we provide an empty array to the SectionList
        // This is significantly faster than rendering null in renderItem
        data: collapsedSections[section.title] ? [] : section.data,
      }));
  }, [items, searchQuery, sortBy, collapsedSections]);

  const wastingSoon = useMemo(() => {
    if (!items) return [];
    return items
      .filter((item) => {
        const health = getItemHealth(item.expiry_date);
        return (
          health.status === "critical" ||
          health.status === "warning" ||
          health.status === "expired"
        );
      })
      .sort((a, b) => {
        const healthA = getItemHealth(a.expiry_date);
        const healthB = getItemHealth(b.expiry_date);
        return (healthA.daysRemaining ?? 999) - (healthB.daysRemaining ?? 999);
      })
      .slice(0, 5);
  }, [items]);

  const stats = useMemo(() => {
    if (!items || items.length === 0) return { total: 0, score: 100 };
    const healthyCount = items.filter((i) => {
      const health = getItemHealth(i.expiry_date);
      return health.status === "good";
    }).length;
    const scoreValue = Math.round((healthyCount / items.length) * 100);
    return { total: items.length, score: scoreValue };
  }, [items]);

  const listHeader = useMemo(
    () => (
      <View className="pt-6 pb-4">
        <PantryHeader onSearchPress={() => router.push("/modal")} />

        {!searchQuery && (
          <WastingSoonCarousel
            items={wastingSoon}
            onItemPress={setSelectedItem}
          />
        )}

        {!searchQuery && (
          <KitchenHealthSection
            totalItems={stats.total}
            freshnessScore={stats.score}
          />
        )}

        <InventoryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </View>
    ),
    [searchQuery, wastingSoon, stats.total, stats.score, sortBy, router],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string; count: number } }) => (
      <Pressable
        onPress={() => toggleSection(section.title)}
        className={`flex-row items-center justify-between bg-white px-4 py-4 mx-4 mt-2 rounded-2xl shadow-sm elevation-1 ${collapsedSections[section.title] ? "rounded-b-2xl" : "rounded-b-none"}`}
      >
        <View className="flex-row items-center">
          <View
            className={`p-2 rounded-xl mr-3 ${section.title === "Fridge"
                ? "bg-blue-500/10"
                : section.title === "Freezer"
                  ? "bg-sky-500/10"
                  : section.title === "Expired" || section.title === "Critical"
                    ? "bg-red-500/10"
                    : section.title === "Warning"
                      ? "bg-amber-500/10"
                      : section.title === "Good"
                        ? "bg-emerald-500/10"
                        : "bg-zinc-500/10"
              }`}
          >
            <Refrigerator
              size={18}
              color={
                section.title === "Fridge"
                  ? "#2563eb"
                  : section.title === "Freezer"
                    ? "#0284c7"
                    : section.title === "Expired" ||
                      section.title === "Critical"
                      ? "#ef4444"
                      : section.title === "Warning"
                        ? "#f59e0b"
                        : section.title === "Good"
                          ? "#10b981"
                          : "#71717a"
              }
            />
          </View>
          <Text className="text-base font-bold text-gray-900">
            {section.title}
          </Text>
          <View className="ml-2 bg-[#f3f4f6] px-2 py-0.5 rounded-full">
            <Text className="text-xs text-gray-500 font-bold">
              {section.count}
            </Text>
          </View>
        </View>
        {collapsedSections[section.title] ? (
          <ChevronDown size={20} color="#9ca3af" />
        ) : (
          <ChevronRight
            size={20}
            color="#9ca3af"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        )}
      </Pressable>
    ),
    [toggleSection, collapsedSections],
  );

  const renderItem = useCallback(
    ({ item }: { item: PantryItem }) => (
      <View className="bg-white mx-4 px-2">
        <PantryCard item={item} onPress={() => setSelectedItem(item)} />
      </View>
    ),
    [],
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f5f7f8]" edges={["top"]}>
        <View className="px-4 py-6">
          <View className="flex-row items-center gap-3 mb-8">
            <View className="h-10 w-10 rounded-full bg-gray-200" />
            <View>
              <View className="h-3 w-20 bg-gray-200 rounded mb-1" />
              <View className="h-4.5 w-15 bg-gray-200 rounded" />
            </View>
          </View>
          <View className="h-30 w-full bg-gray-200 rounded-3xl mb-6" />
          <View className="h-8 w-35 bg-gray-200 rounded-lg mb-4" />
          {[1, 2, 3].map((i) => (
            <PantryCardSkeleton key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-black p-6">
        <Text className="text-red-500 text-center text-lg mb-4">
          Failed to load pantry items.
        </Text>
        <Text
          className="text-gray-500 text-center font-semibold"
          onPress={() => refetch()}
        >
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={["top"]}>
      <View className="flex-1">
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={listHeader}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          SectionSeparatorComponent={() => <View className="h-px" />}
          renderSectionFooter={({ section }) =>
            !collapsedSections[section.title] ? (
              <View className="bg-white h-2 mx-4 mb-2 rounded-b-2xl" />
            ) : null
          }
          contentContainerClassName="pb-32 bg-[#f5f7f8]"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 p-8">
              <View className="bg-[#f3f4f6] p-6 rounded-full mb-4">
                <Refrigerator size={48} color="#9ca3af" strokeWidth={1} />
              </View>
              <Text className="text-gray-500 text-center text-lg font-medium">
                {searchQuery
                  ? "No items match your search."
                  : "Your pantry is empty."}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#10b981"
            />
          }
        />
      </View>

      <View className="absolute bottom-8 left-0 right-0 items-center">
        <Pressable
          onPress={() => router.push("/modal")}
          className="w-16 h-16 bg-[#10b981] rounded-full items-center justify-center shadow-lg elevation-8"
          style={{
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          }}
        >
          <Plus size={32} color="white" />
        </Pressable>
      </View>

      <ProductDetailModal
        item={selectedItem}
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </SafeAreaView>
  );
}
