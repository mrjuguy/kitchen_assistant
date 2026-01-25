import { useRouter } from 'expo-router';
import { ChevronDown, ChevronRight, Plus, Refrigerator, Search, ShoppingBasket } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, RefreshControl, ScrollView, SectionList, Text, TextInput, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KitchenHealthStat } from '../../components/Inventory/KitchenHealthStat';
import { PantryCard } from '../../components/Inventory/PantryCard';
import { ProductDetailModal } from '../../components/Inventory/ProductDetailModal';
import { PantryCardSkeleton } from '../../components/Inventory/Skeleton';
import { WastingSoonCard } from '../../components/Inventory/WastingSoonCard';
import { usePantry } from '../../hooks/usePantry';
import { supabase } from '../../services/supabase';
import { PantryItem } from '../../types/schema';
import { groupItemsByExpiry, groupItemsByLocation } from '../../utils/inventory';
import { getItemHealth } from '../../utils/itemHealth';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PantryScreen() {
  const { data: items, isLoading, isError, refetch, isRefetching } = usePantry();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'location' | 'expiry'>('location');
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const toggleSection = (title: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const sections = useMemo(() => {
    if (!items) return [];

    let filtered = items;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = items.filter(item =>
        (item.name?.toLowerCase() || '').includes(query) ||
        (item.category?.toLowerCase() || '').includes(query)
      );
    }

    const grouped = sortBy === 'location'
      ? groupItemsByLocation(filtered)
      : groupItemsByExpiry(filtered);

    return grouped.filter(section => section.data.length > 0 || !searchQuery.trim());
  }, [items, searchQuery, sortBy]);

  const wastingSoon = useMemo(() => {
    if (!items) return [];
    return items
      .filter(item => {
        const health = getItemHealth(item.expiry_date);
        return health.status === 'critical' || health.status === 'warning' || health.status === 'expired';
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
    const healthyCount = items.filter(i => {
      const health = getItemHealth(i.expiry_date);
      return health.status === 'good';
    }).length;
    const scoreValue = Math.round((healthyCount / items.length) * 100);
    return { total: items.length, score: scoreValue };
  }, [items]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f5f7f8]" edges={['top']}>
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
          {[1, 2, 3].map((i) => <PantryCardSkeleton key={i} />)}
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
    <SafeAreaView className="flex-1 bg-[#f5f7f8]" edges={['top']}>
      <View className="flex-1">
        <SectionList
          sections={sections.filter(s => s.data.length > 0)}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="pt-6 pb-4">
              {/* Header */}
              <View className="flex-row items-center justify-between px-4 mb-8">
                <View className="flex-row items-center gap-3">
                  <Pressable
                    onPress={() => supabase.auth.signOut()}
                    className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden"
                  >
                    <View className="flex-1 items-center justify-center bg-gray-300">
                      <Text className="text-[10px] text-gray-600 font-bold">USER</Text>
                    </View>
                  </Pressable>
                  <View>
                    <Text className="text-xs text-gray-500 font-medium">Culinary OS</Text>
                    <Text className="text-lg font-bold text-gray-900">Kitchen Assistant</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push('/modal')}
                  className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm elevation-3"
                >
                  <Search size={20} color="#111827" />
                </Pressable>
              </View>

              {/* Wasting Soon */}
              {wastingSoon.length > 0 && !searchQuery && (
                <View className="mb-8">
                  <View className="flex-row items-center justify-between px-4 mb-4">
                    <Text className="text-xl font-extrabold text-gray-900">Wasting Soon</Text>
                    <Pressable><Text className="text-blue-600 font-semibold text-sm">View All</Text></Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="px-4 pb-1"
                  >
                    {wastingSoon.map((item) => (
                      <WastingSoonCard
                        key={item.id}
                        item={item}
                        onPress={() => setSelectedItem(item)}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Kitchen Health */}
              {!searchQuery && (
                <View className="px-4 mb-8">
                  <Text className="text-xl font-extrabold text-gray-900 mb-4">Kitchen Health</Text>
                  <View className="flex-row gap-3">
                    <KitchenHealthStat
                      label="Total Items"
                      value={stats.total}
                      trend="+2 new"
                      Icon={Refrigerator}
                      color="#0d7ff2"
                      bgColor="#eff6ff"
                    />
                    <KitchenHealthStat
                      label="Freshness Score"
                      value={`${stats.score}%`}
                      trend={stats.score > 90 ? "Optimal" : "Check list"}
                      Icon={ShoppingBasket}
                      color="#8b5cf6"
                      bgColor="#f5f3ff"
                    />
                  </View>
                </View>
              )}

              {/* Search Bar */}
              <View className="px-4 mb-4">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-extrabold text-gray-900">Live Inventory</Text>

                  <View className="flex-row bg-[#f3f4f6] p-1 rounded-xl">
                    <Pressable
                      onPress={() => setSortBy('location')}
                      className={`px-3 py-1.5 rounded-lg ${sortBy === 'location' ? 'bg-white shadow-sm elevation-1' : 'bg-transparent'}`}
                    >
                      <Text className={`text-xs font-bold ${sortBy === 'location' ? 'text-emerald-500' : 'text-gray-500'}`}>Location</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setSortBy('expiry')}
                      className={`px-3 py-1.5 rounded-lg ${sortBy === 'expiry' ? 'bg-white shadow-sm elevation-1' : 'bg-transparent'}`}
                    >
                      <Text className={`text-xs font-bold ${sortBy === 'expiry' ? 'text-emerald-500' : 'text-gray-500'}`}>Expiry</Text>
                    </Pressable>
                  </View>
                </View>

                <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl border border-gray-100">
                  <Search size={18} color="#9ca3af" />
                  <TextInput
                    placeholder="Search your pantry..."
                    placeholderTextColor="#9ca3af"
                    className="flex-1 ml-3 text-gray-900 text-base"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>
            </View>
          }
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Pressable
              onPress={() => toggleSection(title)}
              className={`flex-row items-center justify-between bg-white px-4 py-4 mx-4 mt-2 rounded-2xl shadow-sm elevation-1 ${collapsedSections[title] ? 'rounded-b-2xl' : 'rounded-b-none'}`}
            >
              <View className="flex-row items-center">
                <View className={`p-2 rounded-xl mr-3 ${title === 'Fridge' ? 'bg-blue-100' :
                    title === 'Freezer' ? 'bg-sky-100' :
                      title === 'Expired' || title === 'Critical' ? 'bg-red-100' :
                        title === 'Warning' ? 'bg-amber-100' :
                          title === 'Good' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                  <Refrigerator size={18} color={
                    title === 'Fridge' ? '#2563eb' :
                      title === 'Freezer' ? '#0284c7' :
                        title === 'Expired' || title === 'Critical' ? '#ef4444' :
                          title === 'Warning' ? '#f59e0b' :
                            title === 'Good' ? '#22c55e' : '#6b7280'
                  } />
                </View>
                <Text className="text-base font-bold text-gray-900">{title}</Text>
                <View className="ml-2 bg-[#f3f4f6] px-2 py-0.5 rounded-full">
                  <Text className="text-xs text-gray-500 font-bold">
                    {sections.find(s => s.title === title)?.data.length || 0}
                  </Text>
                </View>
              </View>
              {collapsedSections[title] ? <ChevronDown size={20} color="#9ca3af" /> : <ChevronRight size={20} color="#9ca3af" style={{ transform: [{ rotate: '90deg' }] }} />}
            </Pressable>
          )}
          renderItem={({ item, section }) => {
            if (collapsedSections[section.title]) return null;
            return (
              <View className="bg-white mx-4 px-2">
                <PantryCard
                  item={item}
                  onPress={() => setSelectedItem(item)}
                />
              </View>
            );
          }}
          SectionSeparatorComponent={() => <View className="h-px" />}
          renderSectionFooter={({ section }) => (
            !collapsedSections[section.title] ? <View className="bg-white h-2 mx-4 mb-2 rounded-b-2xl" /> : null
          )}
          contentContainerClassName="pb-32 bg-[#f5f7f8]"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 p-8">
              <View className="bg-[#f3f4f6] p-6 rounded-full mb-4">
                <Refrigerator size={48} color="#9ca3af" strokeWidth={1} />
              </View>
              <Text className="text-gray-500 text-center text-lg font-medium">
                {searchQuery ? 'No items match your search.' : 'Your pantry is empty.'}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0d7ff2" />
          }
        />
      </View>

      <View className="absolute bottom-8 left-0 right-0 items-center">
        <Pressable
          onPress={() => router.push('/modal')}
          className="w-16 h-16 bg-[#0d7ff2] rounded-full items-center justify-center shadow-lg elevation-8"
          style={{
            shadowColor: '#0d7ff2',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12
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
