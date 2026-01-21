import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MoreVertical, Plus, ScanBarcode, Search, ShoppingBag, ShoppingBasket } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, SectionList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductDetailModal } from '../../components/Inventory/ProductDetailModal';
import { ShoppingItemCard } from '../../components/Shopping/ShoppingItemCard';
import { useAddShoppingItem, useCheckoutShoppingList, useClearBoughtItems, useDeleteAllShoppingItems, useShoppingList } from '../../hooks/useShoppingList';
import { ProductData, searchProducts } from '../../services/openFoodFacts';
import { ShoppingItem } from '../../types/schema';

export default function ShoppingScreen() {
    const { data: items, isLoading, isError, refetch, isRefetching } = useShoppingList();
    const addMutation = useAddShoppingItem();
    const checkoutMutation = useCheckoutShoppingList();
    const clearBoughtMutation = useClearBoughtItems();
    const deleteAllMutation = useDeleteAllShoppingItems();
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleMorePress = () => {
        Alert.alert(
            'List Actions',
            'Take action on your shopping list items.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Bought Items',
                    onPress: () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        clearBoughtMutation.mutate();
                    }
                },
                {
                    text: 'Delete All Items',
                    style: 'destructive',
                    onPress: () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        deleteAllMutation.mutate();
                    }
                },
            ]
        );
    };

    const handleProductSelect = (product: ProductData) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        addMutation.mutate({
            name: product.name,
            category: product.category,
            quantity: 1,
            unit: 'pc',
            image_url: product.image_url,
            brand: product.brand,
            barcode: product.barcode,
            nutritional_info: product.nutritional_info,
            ingredients_text: product.ingredients_text,
            allergens: product.allergens,
            labels: product.labels,
        });
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleGenericAdd = () => {
        if (!searchQuery.trim()) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        addMutation.mutate({
            name: searchQuery.trim(),
            category: 'Uncategorized',
            quantity: 1,
            unit: 'pc',
        });
        setSearchQuery('');
        setSearchResults([]);
    };

    const groupedItems = useMemo(() => {
        if (!filteredItems.length) return [];

        const groups: Record<string, typeof filteredItems> = {};
        filteredItems.forEach(item => {
            const category = item.category || 'Uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
        });

        const categoryOrder = ['Produce', 'Dairy', 'Protein', 'Pantry', 'Spices', 'Frozen', 'Beverages', 'Snacks', 'Bakery', 'Household', 'Uncategorized'];

        return Object.keys(groups)
            .sort((a, b) => {
                const indexA = categoryOrder.indexOf(a);
                const indexB = categoryOrder.indexOf(b);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.localeCompare(b);
            })
            .map(category => ({
                title: category,
                data: groups[category],
            }));
    }, [filteredItems]);

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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable
                            onPress={handleMorePress}
                            style={({ pressed }) => ({
                                padding: 8,
                                borderRadius: 99,
                                backgroundColor: pressed ? '#f3f4f6' : 'transparent',
                                marginRight: 8
                            })}
                        >
                            <MoreVertical size={24} color="#111827" />
                        </Pressable>
                        <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderRadius: 99 }}>
                            <ShoppingBasket size={24} color="#10b981" />
                        </View>
                    </View>
                </View>

                {/* Quick Add Search Bar */}
                <View style={{ zIndex: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, marginBottom: searchQuery.length >= 3 && (searchResults.length > 0 || isSearching) ? 0 : 24, borderWidth: 1, borderColor: '#f3f4f6', borderBottomLeftRadius: searchQuery.length >= 3 && (searchResults.length > 0 || isSearching) ? 0 : 16, borderBottomRightRadius: searchQuery.length >= 3 && (searchResults.length > 0 || isSearching) ? 0 : 16 }}>
                        <Search size={20} color="#999" />
                        <TextInput
                            placeholder="Add item or search products..."
                            placeholderTextColor="#999"
                            style={{ flex: 1, marginLeft: 12, color: '#111827', fontSize: 16 }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleGenericAdd}
                            returnKeyType="done"
                        />
                        {isSearching && <ActivityIndicator size="small" color="#10b981" />}
                    </View>

                    {searchQuery.length >= 3 && (searchResults.length > 0 || isSearching) && (
                        <View style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: '#f3f4f6',
                            borderTopWidth: 0,
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 12,
                            elevation: 5,
                            maxHeight: 300,
                            marginBottom: 24,
                            overflow: 'hidden'
                        }}>
                            <ScrollView keyboardShouldPersistTaps="handled">
                                {searchResults.map((product, index) => (
                                    <Pressable
                                        key={`${product.barcode}-${index}`}
                                        onPress={() => handleProductSelect(product)}
                                        style={({ pressed }) => ({
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 12,
                                            backgroundColor: pressed ? '#f9fafb' : 'transparent',
                                            borderBottomWidth: index === searchResults.length - 1 ? 0 : 1,
                                            borderBottomColor: '#f3f4f6'
                                        })}
                                    >
                                        <View style={{ width: 40, height: 40, backgroundColor: '#f3f4f6', borderRadius: 8, marginRight: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                                            {product.image_url ? (
                                                <Image source={{ uri: product.image_url }} style={{ width: '100%', height: '100%' }} />
                                            ) : (
                                                <Search size={20} color="#999" />
                                            )}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: '600', color: '#111827' }} numberOfLines={1}>{product.name}</Text>
                                            <Text style={{ fontSize: 12, color: '#6b7280' }}>{product.brand || product.category}</Text>
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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ShoppingItemCard
                            item={item}
                            onPress={() => setSelectedItem(item)}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ backgroundColor: 'white', paddingVertical: 12, marginTop: 8 }}>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                {title}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
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
                    onPress={() => router.push({
                        pathname: '/modal',
                        params: { scanner: 'true', target: 'shopping' }
                    })}
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
                        elevation: 5,
                        marginLeft: boughtCount === 0 ? 'auto' : 0
                    }}
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
