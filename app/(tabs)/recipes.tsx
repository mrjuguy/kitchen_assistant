import { ChefHat, Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '../../components/Recipes/RecipeCard';
import { useGapAnalysis, useRecipes } from '../../hooks/useRecipes';

export default function RecipesScreen() {
    const { data: recipes, isLoading, isError, refetch, isRefetching } = useRecipes();
    const analysis = useGapAnalysis();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'ready' | 'missing'>('all');

    const filteredRecipes = useMemo(() => {
        if (!recipes) return [];
        let result = recipes;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r => (r.name?.toLowerCase() || '').includes(query));
        }

        if (filter === 'ready') {
            result = result.filter(r => analysis.find(a => a.recipeId === r.id)?.canCook);
        } else if (filter === 'missing') {
            result = result.filter(r => !analysis.find(a => a.recipeId === r.id)?.canCook);
        }

        return result;
    }, [recipes, searchQuery, filter, analysis]);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black" edges={['top']}>
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 dark:text-white">Recipes</Text>
                    <View className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg mt-2 mb-8" />
                    {[1, 2].map((i) => (
                        <View key={i} className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-2xl mb-4 animate-pulse" />
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-1 px-4 pt-6 bg-white">
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#111827' }}>Recipes</Text>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>Match with Pantry</Text>
                    </View>
                    <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderRadius: 99 }}>
                        <ChefHat size={24} color="#10b981" />
                    </View>
                </View>

                {/* Search & Filter */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginRight: 12 }}>
                        <Search size={20} color="#999" />
                        <TextInput
                            placeholder="Find inspiration..."
                            placeholderTextColor="#999"
                            style={{ flex: 1, marginLeft: 12, color: '#111827', fontSize: 16 }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <Pressable style={{ backgroundColor: 'white', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', elevation: 2 }}>
                        <SlidersHorizontal size={20} color="#666" />
                    </Pressable>
                </View>

                {/* Filter Tabs */}
                <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                    {(['all', 'ready', 'missing'] as const).map((f) => (
                        <Pressable
                            key={f}
                            onPress={() => setFilter(f)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 99,
                                borderWidth: 1,
                                marginRight: 8,
                                backgroundColor: filter === f ? '#111827' : 'transparent',
                                borderColor: filter === f ? '#111827' : '#e5e7eb'
                            }}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                textTransform: 'capitalize',
                                color: filter === f ? 'white' : '#6b7280'
                            }}>
                                {f}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <FlatList
                    data={filteredRecipes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RecipeCard
                            recipe={item}
                            analysis={analysis.find(a => a.recipeId === item.id)}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20 p-8">
                            <View className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-full mb-4">
                                <ChefHat size={48} color="#999" strokeWidth={1} />
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-center text-lg font-medium">
                                {searchQuery ? 'No recipes match your search.' : 'No recipes found.'}
                            </Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#10b981" />
                    }
                />
            </View>
        </SafeAreaView>
    );
}
