import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChefHat, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '../../components/Recipes/RecipeCard';
import { useGapAnalysis } from '../../hooks/useGapAnalysis';
import { useAddToPlan } from '../../hooks/useMealPlan';
import { useRecipes } from '../../hooks/useRecipes';
import { filterRecipes, getAvailableTags } from '../../utils/recipeFilters';

import { GapAnalysis } from '../../hooks/useGapAnalysis';
import { RecipeStackParamList } from '../../types/navigation';

export default function RecipesScreen() {
    const { data: recipes, isLoading, isError, refetch, isRefetching } = useRecipes();
    const router = useRouter();
    const { mode, date, meal_type } = useLocalSearchParams<RecipeStackParamList['(tabs)/recipes']>();
    const addToPlanMutation = useAddToPlan();

    const analysisMap = useGapAnalysis() as Record<string, GapAnalysis> | null;
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'ready' | 'missing'>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleRecipePress = (recipeId: string, recipeName: string) => {
        if (mode === 'select' && date && meal_type) {
            Alert.alert(
                "Schedule Meal",
                `Schedule ${recipeName} for ${meal_type} on ${date}?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "View Details", onPress: () => router.push(`/recipes/${recipeId}`) },
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
            router.push(`/recipes/${recipeId}`);
        }
    };

    const availableTags = useMemo(() => {
        return getAvailableTags(recipes || []);
    }, [recipes]);

    const filteredRecipes = useMemo(() => {
        if (!recipes) return [];
        return filterRecipes(recipes, {
            searchQuery,
            statusFilter: filter,
            tags: selectedTags,
            analysisMap: analysisMap || {}
        });
    }, [recipes, searchQuery, filter, selectedTags, analysisMap]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

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
                <View style={{ marginBottom: 20 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isSearchFocused ? 'white' : '#f8fafc',
                        paddingHorizontal: 16,
                        height: 56,
                        borderRadius: 16,
                        borderWidth: 2,
                        borderColor: isSearchFocused ? '#0d7ff2' : '#f1f5f9',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isSearchFocused ? 0.1 : 0,
                        shadowRadius: 4,
                        elevation: isSearchFocused ? 3 : 0,
                    }}>
                        <Search size={20} color={isSearchFocused ? '#0d7ff2' : '#94a3b8'} />
                        <TextInput
                            placeholder="Find inspiration..."
                            placeholderTextColor="#94a3b8"
                            style={{
                                flex: 1,
                                marginLeft: 12,
                                color: '#1e293b',
                                fontSize: 16,
                                fontWeight: '500'
                            }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable
                                onPress={() => setSearchQuery('')}
                                style={{ padding: 4 }}
                            >
                                <X size={18} color="#94a3b8" />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    {[
                        { id: 'all', label: 'All Recipes' },
                        { id: 'ready', label: 'Ready to Cook' },
                        { id: 'missing', label: 'Missing Ingredients' }
                    ].map((f) => {
                        const isActive = filter === f.id;
                        return (
                            <Pressable
                                key={f.id}
                                onPress={() => setFilter(f.id as any)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 99,
                                    backgroundColor: isActive ? '#1e293b' : '#f1f5f9',
                                    marginRight: 8,
                                    borderWidth: 1,
                                    borderColor: isActive ? '#1e293b' : '#e2e8f0'
                                }}
                            >
                                <Text style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: isActive ? 'white' : '#64748b'
                                }}>
                                    {f.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Tag Chips */}
                {availableTags.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 24, maxHeight: 40 }}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {availableTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <Pressable
                                    key={tag}
                                    onPress={() => toggleTag(tag)}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 6,
                                        borderRadius: 12,
                                        backgroundColor: isSelected ? '#eff6ff' : 'white',
                                        marginRight: 8,
                                        borderWidth: 1,
                                        borderColor: isSelected ? '#3b82f6' : '#e2e8f0',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {isSelected && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6', marginRight: 6 }} />}
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            color: isSelected ? '#1d4ed8' : '#64748b'
                                        }}>
                                            {tag}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                )}

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
                onPress={() => router.push('/recipes/create')}
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
