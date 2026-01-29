import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  MoreVertical,
  Plus,
  ScanBarcode,
  Search,
  ShoppingBag,
  ShoppingBasket,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FrequentlyExpiredList } from "../../components/Inventory/FrequentlyExpiredList";
import { ProductDetailModal } from "../../components/Inventory/ProductDetailModal";
import { ShoppingItemCard } from "../../components/Shopping/ShoppingItemCard";
import {
  useAddShoppingItem,
  useCheckoutShoppingList,
  useClearBoughtItems,
  useDeleteAllShoppingItems,
  useShoppingList,
} from "../../hooks/useShoppingList";
import { posthog } from "../../services/analytics";
import { ProductData, searchProducts } from "../../services/openFoodFacts";
import { ShoppingItem } from "../../types/schema";

export default function ShoppingScreen() {
  const {
    data: items,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useShoppingList();
  const addMutation = useAddShoppingItem();
  const checkoutMutation = useCheckoutShoppingList();
  const clearBoughtMutation = useClearBoughtItems();
  const deleteAllMutation = useDeleteAllShoppingItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const router = useRouter();

  // Debounced search for OpenFoodFacts
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        (item.name?.toLowerCase() || "").includes(query) ||
        (item.category?.toLowerCase() || "").includes(query),
    );
  }, [items, searchQuery]);

  const boughtCount = useMemo(() => {
    return items?.filter((item) => item.bought).length || 0;
  }, [items]);

  const handleCheckout = () => {
    if (boughtCount === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    posthog.capture("shopping_list_checked_out", {
      itemCount: boughtCount,
    });
    checkoutMutation.mutate();
  };

  const handleMorePress = () => {
    Alert.alert("List Actions", "Take action on your shopping list items.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear Bought Items",
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          clearBoughtMutation.mutate();
        },
      },
      {
        text: "Delete All Items",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteAllMutation.mutate();
        },
      },
    ]);
  };

  const handleProductSelect = (product: ProductData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addMutation.mutate({
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: "pc",
      image_url: product.image_url,
      brand: product.brand,
      barcode: product.barcode,
      nutritional_info: product.nutritional_info,
      ingredients_text: product.ingredients_text,
      allergens: product.allergens,
      labels: product.labels,
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleGenericAdd = () => {
    if (!searchQuery.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addMutation.mutate({
      name: searchQuery.trim(),
      category: "Uncategorized",
      quantity: 1,
      unit: "pc",
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const groupedItems = useMemo(() => {
    if (!filteredItems.length) return [];

    const groups: Record<string, typeof filteredItems> = {};
    filteredItems.forEach((item) => {
      const category = item.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    const categoryOrder = [
      "Produce",
      "Dairy",
      "Protein",
      "Pantry",
      "Spices",
      "Frozen",
      "Beverages",
      "Snacks",
      "Bakery",
      "Household",
      "Uncategorized",
    ];

    return Object.keys(groups)
      .sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
      })
      .map((category) => ({
        title: category,
        data: groups[category],
      }));
  }, [filteredItems]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="px-5 py-6">
          <Text className="text-3xl font-bold text-gray-900">Shopping</Text>
          <View className="h-4 w-32 bg-gray-100 rounded-lg mt-2 mb-8" />
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              className="h-24 bg-gray-50 rounded-2xl mb-3 animate-pulse"
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <ShoppingBag size={48} color="#ef4444" className="mb-4" />
        <Text className="text-red-500 text-center text-lg mb-4">
          Failed to load shopping list.
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-emerald-500 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const showSearchResults =
    searchQuery.length >= 3 && (searchResults.length > 0 || isSearching);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 px-5 pt-6">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Shopping</Text>
            <Text className="text-sm text-gray-500">Replenish & Restock</Text>
          </View>
          <View className="flex-row items-center">
            <Pressable onPress={handleMorePress} className="p-2.5 rounded-full">
              <MoreVertical size={24} color="#111827" />
            </Pressable>
            <View className="bg-emerald-50 p-2.5 rounded-full ml-1">
              <ShoppingBasket size={24} color="#10b981" />
            </View>
          </View>
        </View>

        {/* Quick Add Search Bar */}
        <View className="z-10 relative">
          <View
            className={`flex-row items-center bg-gray-50 px-4 py-3 border border-gray-100 ${showSearchResults ? "rounded-t-2xl mb-0" : "rounded-2xl mb-6"}`}
          >
            <Search size={20} color="#9ca3af" />
            <TextInput
              placeholder="Add item or search products..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-3 text-gray-900 text-base"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleGenericAdd}
              returnKeyType="done"
            />
            {isSearching && <ActivityIndicator size="small" color="#10b981" />}
          </View>

          {showSearchResults && (
            <View
              className="bg-white border-x border-b border-gray-100 rounded-b-2xl shadow-xl absolute top-[50px] left-0 right-0 overflow-hidden"
              style={{ elevation: 5, maxHeight: 300 }}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                {searchResults.map((product, index) => (
                  <Pressable
                    key={`${product.barcode}-${index}`}
                    onPress={() => handleProductSelect(product)}
                    className={`flex-row items-center p-3 border-b border-gray-50 bg-white ${index === searchResults.length - 1 ? "border-b-0" : ""}`}
                  >
                    <View className="w-10 h-10 bg-gray-100 rounded-lg mr-3 overflow-hidden items-center justify-center">
                      {product.image_url ? (
                        <Image
                          source={{ uri: product.image_url }}
                          className="w-full h-full"
                        />
                      ) : (
                        <Search size={20} color="#9ca3af" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-gray-900"
                        numberOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {product.brand || product.category}
                      </Text>
                    </View>
                    <Plus size={18} color="#10b981" />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <SectionList
          sections={groupedItems}
          ListHeaderComponent={
            <View className="mt-4">
              <FrequentlyExpiredList />
            </View>
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ShoppingItemCard
              item={item}
              onPress={() => setSelectedItem(item)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View className="bg-white py-3 mt-2">
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-[1.5px]">
                {title}
              </Text>
            </View>
          )}
          contentContainerClassName="pb-[120px]"
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 p-8">
              <View className="bg-gray-50 p-6 rounded-full mb-4">
                <ShoppingBag size={48} color="#9ca3af" strokeWidth={1} />
              </View>
              <Text className="text-gray-500 text-center text-lg font-medium leading-6">
                {searchQuery
                  ? "No items match your search."
                  : "Your shopping list is empty."}
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

      {/* Bottom Actions */}
      <View className="absolute bottom-6 left-5 right-5 flex-row items-center">
        {boughtCount > 0 && (
          <Pressable
            onPress={handleCheckout}
            disabled={checkoutMutation.isPending}
            className={`flex-1 h-14 bg-gray-900 rounded-2xl items-center justify-center mr-4 shadow-xl shadow-black/20 ${checkoutMutation.isPending ? "opacity-50" : "opacity-100"}`}
            style={{ elevation: 5 }}
          >
            <Text className="text-white font-bold text-lg">
              {checkoutMutation.isPending
                ? "Moving to Pantry..."
                : `Add ${boughtCount} Items to Pantry`}
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/modal",
              params: { scanner: "true", target: "shopping" },
            })
          }
          className={`w-14 h-14 bg-emerald-500 rounded-2xl items-center justify-center shadow-xl shadow-emerald-500/40 ${boughtCount === 0 ? "ml-auto" : ""}`}
          style={{ elevation: 5 }}
        >
          <ScanBarcode size={28} color="white" />
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
