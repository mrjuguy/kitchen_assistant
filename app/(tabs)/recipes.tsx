import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChefHat, Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '../../components/Recipes/RecipeCard';
import { useGapAnalysis } from '../../hooks/useGapAnalysis';
import { useAddToPlan } from '../../hooks/useMealPlan';
import { useRecipes } from '../../hooks/useRecipes';

export default function RecipesScreen() {
    const { data: recipes, isLoading, isError, refetch, isRefetching } = useRecipes();
    const router = useRouter();
    const { mode, date, meal_type } = useLocalSearchParams<{ mode?: string, date?: string, meal_type?: string }>();
    const addToPlanMutation = useAddToPlan();

    const analysisMap = useGapAnalysis() as Record<string, any> | null;
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'ready' | 'missing'>('all');

    const handleRecipePress = (recipeId: string, recipeName: string) => {
        if (mode === 'select' && date && meal_type) {
            Alert.alert(
                "Schedule Meal",
                `Schedule ${recipeName} for ${meal_type} on ${date}?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "View Details", onPress: () => router.push(`/recipes/${recipeId}` as any) },
                    {
                        text: "Schedule",
                        onPress: () => {
                            addToPlanMutation.mutate({
                                date,
                                meal_type: meal_type as any,
                                recipe_id: recipeId
                            }, {
                                onSuccess: () => {
                                    router.replace('/(tabs)/planner');
                                }
                            });
                        }
                    }
                ]
            );
        } else {
            router.push(`/recipes/${recipeId}` as any);
        }
    };

    const filteredRecipes = useMemo(() => {
        if (!recipes || !analysisMap) return [];
        let result = recipes;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r => (r.name?.toLowerCase() || '').includes(query));
        }

        if (filter === 'ready') {
            result = result.filter(r => analysisMap[r.id]?.status === 'Green');
        } else if (filter === 'missing') {
            // Include Yellow (Need Supplies) and Red (Unsafe/Need Supplies, though unsafe might not be wanted here?)
            // Actually, usually user wants to see what they CANNOT cook yet.
            result = result.filter(r => analysisMap[r.id]?.status !== 'Green');
        }

        return result;
    }, [recipes, searchQuery, filter, analysisMap]);

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
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}>
                {mode === 'select' && date && meal_type ? (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 24,
                        backgroundColor: '#eff6ff',
                        padding: 16,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: '#bfdbfe'
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e40af' }}>Select Meal</Text>
                            <Text style={{ fontSize: 14, color: '#3b82f6' }}>
                                Scheduling for <Text style={{ fontWeight: 'bold' }}>{meal_type}</Text> on <Text style={{ fontWeight: 'bold' }}>{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => router.setParams({ mode: undefined, date: undefined, meal_type: undefined })}
                            style={{ backgroundColor: 'white', padding: 8, borderRadius: 20 }}
                        >
                            <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 12 }}>Cancel</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#111827' }}>Recipes</Text>
                            <Text style={{ fontSize: 14, color: '#6b7280' }}>Match with Pantry</Text>
                        </View>
                        <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderRadius: 99 }}>
                            <ChefHat size={24} color="#10b981" />
                        </View>
                    </View>
                )}

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
                    style={{ flex: 1 }}
                    data={filteredRecipes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleRecipePress(item.id, item.name)}>
                            <RecipeCard
                                recipe={item}
                                analysis={analysisMap?.[item.id]}
                            />
                        </Pressable>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
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

            {/* FAB to Add Recipe - Moved outside the padded view */}
            <Pressable
                onPress={() => router.push('/recipes/create' as any)}
                style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 24,
                    zIndex: 999,
                    backgroundColor: '#10b981',
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84
                }}
            >
                <ChefHat size={24} color="white" />
                <View style={{ position: 'absolute', top: 14, right: 14, width: 10, height: 10, backgroundColor: 'white', borderRadius: 5, borderWidth: 2, borderColor: '#10b981', alignItems: 'center', justifyContent: 'center' }} />
            </Pressable>
        </SafeAreaView>
    );
}
