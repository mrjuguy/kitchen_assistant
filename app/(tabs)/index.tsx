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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7f8' }} edges={['top']}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#e5e7eb' }} />
            <View>
              <View style={{ height: 12, width: 80, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 4 }} />
              <View style={{ height: 18, width: 60, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
            </View>
          </View>
          <View style={{ height: 120, width: '100%', backgroundColor: '#e5e7eb', borderRadius: 20, marginBottom: 24 }} />
          <View style={{ height: 32, width: 140, backgroundColor: '#e5e7eb', borderRadius: 8, marginBottom: 16 }} />
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7f8' }} edges={['top']}>
      <View style={{ flex: 1 }}>
        <SectionList
          sections={sections.filter(s => s.data.length > 0)}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={{ paddingTop: 24, paddingBottom: 16 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Pressable
                    onPress={() => supabase.auth.signOut()}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb', borderWidth: 2, borderColor: 'white', overflow: 'hidden' }}
                  >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d1d5db' }}>
                      <Text style={{ fontSize: 10, color: '#4b5563', fontWeight: 'bold' }}>USER</Text>
                    </View>
                  </Pressable>
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>Culinary OS</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Kitchen Assistant</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push('/modal')}
                  style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                >
                  <Search size={20} color="#111827" />
                </Pressable>
              </View>

              {/* Wasting Soon */}
              {wastingSoon.length > 0 && !searchQuery && (
                <View style={{ marginBottom: 32 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Wasting Soon</Text>
                    <Pressable><Text style={{ color: '#0d7ff2', fontWeight: '600', fontSize: 14 }}>View All</Text></Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
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
                <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 16 }}>Kitchen Health</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
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
              <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Live Inventory</Text>

                  <View style={{ flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 3, borderRadius: 10 }}>
                    <Pressable
                      onPress={() => setSortBy('location')}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: sortBy === 'location' ? 'white' : 'transparent',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: sortBy === 'location' ? 0.1 : 0,
                        shadowRadius: 2,
                        elevation: sortBy === 'location' ? 1 : 0,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: sortBy === 'location' ? '#10b981' : '#6b7280' }}>Location</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setSortBy('expiry')}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: sortBy === 'expiry' ? 'white' : 'transparent',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: sortBy === 'expiry' ? 0.1 : 0,
                        shadowRadius: 2,
                        elevation: sortBy === 'expiry' ? 1 : 0,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: sortBy === 'expiry' ? '#10b981' : '#6b7280' }}>Expiry</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6' }}>
                  <Search size={18} color="#9ca3af" />
                  <TextInput
                    placeholder="Search your pantry..."
                    placeholderTextColor="#9ca3af"
                    style={{ flex: 1, marginLeft: 12, color: '#111827', fontSize: 16 }}
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
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                paddingHorizontal: 16,
                paddingVertical: 16,
                marginHorizontal: 16,
                marginTop: 8,
                borderRadius: 16,
                borderBottomLeftRadius: collapsedSections[title] ? 16 : 0,
                borderBottomRightRadius: collapsedSections[title] ? 16 : 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  padding: 8,
                  backgroundColor: title === 'Fridge' ? '#dbeafe' : title === 'Freezer' ? '#e0f2fe' : title === 'Expired' || title === 'Critical' ? '#fee2e2' : title === 'Warning' ? '#fef3c7' : title === 'Good' ? '#dcfce7' : '#f3f4f6',
                  borderRadius: 10,
                  marginRight: 12
                }}>
                  <Refrigerator size={18} color={title === 'Fridge' ? '#2563eb' : title === 'Freezer' ? '#0284c7' : title === 'Expired' || title === 'Critical' ? '#ef4444' : title === 'Warning' ? '#f59e0b' : title === 'Good' ? '#22c55e' : '#6b7280'} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{title}</Text>
                <View style={{ marginLeft: 8, backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 }}>
                  <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: 'bold' }}>
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
              <View style={{ backgroundColor: 'white', marginHorizontal: 16, paddingHorizontal: 8 }}>
                <PantryCard
                  item={item}
                  onPress={() => setSelectedItem(item)}
                />
              </View>
            );
          }}
          SectionSeparatorComponent={() => <View style={{ height: 1 }} />}
          renderSectionFooter={({ section }) => (
            !collapsedSections[section.title] ? <View style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: 'white', height: 8, marginHorizontal: 16, marginBottom: 8 }} /> : null
          )}
          contentContainerStyle={{ paddingBottom: 120, backgroundColor: '#f5f7f8' }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 80, padding: 32 }}>
              <View style={{ backgroundColor: '#f3f4f6', padding: 24, borderRadius: 99, marginBottom: 16 }}>
                <Refrigerator size={48} color="#9ca3af" strokeWidth={1} />
              </View>
              <Text style={{ color: '#6b7280', textAlign: 'center', fontSize: 18, fontWeight: '500' }}>
                {searchQuery ? 'No items match your search.' : 'Your pantry is empty.'}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0d7ff2" />
          }
        />
      </View>

      <View style={{ position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' }}>
        <Pressable
          onPress={() => router.push('/modal')}
          style={{
            width: 64,
            height: 64,
            backgroundColor: '#0d7ff2',
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0d7ff2',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8
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
