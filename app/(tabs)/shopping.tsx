import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Plus, Search, ShoppingBag, ShoppingBasket } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingItemCard } from '../../components/Shopping/ShoppingItemCard';
import { useCheckoutShoppingList, useShoppingList } from '../../hooks/useShoppingList';

export default function ShoppingScreen() {
    const { data: items, isLoading, isError, refetch, isRefetching } = useShoppingList();
    const checkoutMutation = useCheckoutShoppingList();
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

    const boughtCount = useMemo(() => {
        return items?.filter(item => item.bought).length || 0;
    }, [items]);

    const handleCheckout = () => {
        if (boughtCount === 0) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        checkoutMutation.mutate();
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black" edges={['top']}>
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 dark:text-white">Shopping</Text>
                    <View className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg mt-2 mb-8" />
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} className="h-24 bg-gray-200 dark:bg-zinc-800 rounded-2xl mb-3 animate-pulse" />
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-black p-6">
                <ShoppingBag size={48} color="#ef4444" className="mb-4" />
                <Text className="text-red-500 text-center text-lg mb-4">Failed to load shopping list.</Text>
                <Pressable onPress={() => refetch()} className="bg-emerald-500 px-6 py-2 rounded-xl">
                    <Text className="text-white font-bold">Retry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#111827' }}>Shopping</Text>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>Replenish & Restock</Text>
                    </View>
                    <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderRadius: 99 }}>
                        <ShoppingBasket size={24} color="#10b981" />
                    </View>
                </View>

                {/* Search Bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#f3f4f6' }}>
                    <Search size={20} color="#999" />
                    <TextInput
                        placeholder="Search items..."
                        placeholderTextColor="#999"
                        style={{ flex: 1, marginLeft: 12, color: '#111827', fontSize: 16 }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ShoppingItemCard item={item} />}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20 p-8">
                            <View className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-full mb-4">
                                <ShoppingBag size={48} color="#999" strokeWidth={1} />
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-center text-lg font-medium">
                                {searchQuery ? 'No items match your search.' : 'Your shopping list is empty.'}
                            </Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#10b981" />
                    }
                />
            </View>

            {/* Bottom Actions */}
            <View style={{ position: 'absolute', bottom: 24, left: 16, right: 16, flexDirection: 'row', alignItems: 'center' }}>
                {boughtCount > 0 && (
                    <Pressable
                        onPress={handleCheckout}
                        disabled={checkoutMutation.isPending}
                        style={{
                            flex: 1,
                            height: 56,
                            backgroundColor: '#111827',
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16,
                            opacity: checkoutMutation.isPending ? 0.5 : 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 5
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                            {checkoutMutation.isPending ? 'Moving to Pantry...' : `Add ${boughtCount} Items to Pantry`}
                        </Text>
                    </Pressable>
                )}

                <Pressable
                    onPress={() => router.push('/modal')}
                    style={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#10b981',
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#10b981',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                        elevation: 5
                    }}
                >
                    <Plus size={32} color="white" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
