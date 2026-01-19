import { useRouter } from 'expo-router';
import { Plus, Refrigerator, Search, ShoppingBasket } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PantryCard } from '../../components/Inventory/PantryCard';
import { usePantry } from '../../hooks/usePantry';
import { supabase } from '../../services/supabase';

import { PantryCardSkeleton } from '../../components/Inventory/Skeleton';

export default function PantryScreen() {
  const { data: items, isLoading, isError, refetch, isRefetching } = usePantry();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      (item.name?.toLowerCase() || '').includes(query) ||
      (item.category?.toLowerCase() || '').includes(query)
    );
  }, [items, searchQuery]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <View>
              <View style={{ height: 40, width: 128, backgroundColor: '#f3f4f6', borderRadius: 8, marginBottom: 8 }} />
              <View style={{ height: 16, width: 96, backgroundColor: '#f3f4f6', borderRadius: 8 }} />
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <View>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#111827' }}>Pantry</Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Inventory Core</Text>
          </View>
          <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderRadius: 99, flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => supabase.auth.signOut()}>
              <Text style={{ color: '#10b981', fontWeight: 'bold', fontSize: 12, marginRight: 8 }}>Log Out</Text>
            </Pressable>
            <ShoppingBasket size={24} color="#10b981" />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#f3f4f6' }}>
          <Search size={20} color="#999" />
          <TextInput
            placeholder="Search ingredients..."
            placeholderTextColor="#999"
            style={{ flex: 1, marginLeft: 12, color: '#111827', fontSize: 16 }}
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
              <Text className="text-gray-500 dark:text-zinc-300 text-center text-lg font-medium">
                {searchQuery ? 'No items match your search.' : 'Your pantry is empty.'}
              </Text>
              {!searchQuery && (
                <Pressable onPress={() => router.push('/modal')} className="mt-4 bg-emerald-500 px-6 py-3 rounded-xl">
                  <Text className="text-white font-bold">Add your first item</Text>
                </Pressable>
              )}
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#10b981" />
          }
        />
      </View>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push('/modal')}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          backgroundColor: '#10b981',
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 5
        }}
      >
        <Plus size={32} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
