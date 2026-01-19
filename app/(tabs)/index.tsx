import { Link } from 'expo-router';
import { Plus, Refrigerator, Search, ShoppingBasket } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PantryCard } from '../../components/Inventory/PantryCard';
import { usePantry } from '../../hooks/usePantry';

import { PantryCardSkeleton } from '../../components/Inventory/Skeleton';

export default function PantryScreen() {
  const { data: items, isLoading, isError, refetch, isRefetching } = usePantry();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black" edges={['top']}>
        <View className="px-4 py-6">
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <View className="h-10 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-2" />
              <View className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
            </View>
          </View>
          {[1, 2, 3, 4, 5].map((i) => (
            <PantryCardSkeleton key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-black p-6">
        <Text className="text-red-500 text-center text-lg mb-4">Failed to load pantry items.</Text>
        <Text className="text-gray-500 text-center font-semibold" onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black" edges={['top']}>
      <View className="flex-1 px-4 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">Pantry</Text>
            <Text className="text-gray-500 dark:text-gray-400">Inventory Core</Text>
          </View>
          <View className="bg-emerald-500/10 p-3 rounded-full">
            <ShoppingBasket size={24} color="#10b981" />
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white dark:bg-zinc-900 px-4 py-3 rounded-2xl mb-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <Search size={20} color="#999" />
          <TextInput
            placeholder="Search ingredients..."
            placeholderTextColor="#999"
            className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PantryCard item={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 p-8">
              <View className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-full mb-4">
                <Refrigerator size={48} color="#999" strokeWidth={1} />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-center text-lg font-medium">
                {searchQuery ? 'No items match your search.' : 'Your pantry is empty.'}
              </Text>
              {!searchQuery && (
                <Link href="/modal" asChild>
                  <Pressable className="mt-4 bg-emerald-500 px-6 py-3 rounded-xl">
                    <Text className="text-white font-bold">Add your first item</Text>
                  </Pressable>
                </Link>
              )}
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#10b981" />
          }
        />
      </View>

      {/* Floating Action Button */}
      <Link href="/modal" asChild>
        <Pressable
          className="absolute bottom-6 right-6 w-16 h-16 bg-emerald-500 rounded-full items-center justify-center shadow-xl shadow-emerald-500/40"
          style={{ elevation: 5 }}
        >
          <Plus size={32} color="white" />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
