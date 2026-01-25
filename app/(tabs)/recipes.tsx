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
            <SafeAreaView className="flex-1 bg-[#f5f7f8]" edges={['top']}>
                <View className="px-5 py-6">
                    <Text className="text-3xl font-bold text-gray-900">Recipes</Text>
                    <View className="h-4 w-32 bg-gray-100 rounded-lg mt-2 mb-8" />
                    {[1, 2].map((i) => (
                        <View key={i} className="h-64 bg-gray-50 rounded-3xl mb-4 animate-pulse" />
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#f5f7f8]" edges={['top']}>
            <View className="flex-1 px-5 pt-6">
                {mode === 'select' && date && meal_type ? (
                    <View className="flex-row items-center justify-between mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <View className="flex-1">
                            <Text className="text-base font-bold text-blue-900">Select Meal</Text>
                            <Text className="text-sm text-blue-600">
                                Scheduling for <Text className="font-bold">{meal_type}</Text> on <Text className="font-bold">{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => router.setParams({ mode: undefined, date: undefined, meal_type: undefined })}
                            className="bg-white px-3 py-1.5 rounded-full border border-blue-100"
                        >
                            <Text className="text-red-500 font-bold text-xs">Cancel</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between mb-8">
                        <View>
                            <Text className="text-3xl font-bold text-gray-900">Recipes</Text>
                            <Text className="text-sm text-gray-500">Match with Pantry</Text>
                        </View>
                        <View className="bg-emerald-50 p-3 rounded-full">
                            <ChefHat size={24} color="#10b981" />
                        </View>
                    </View>
                )}

                {/* Search & Filter */}
                <View className="mb-5">
                    <View className={`flex-row items-center px-4 h-14 rounded-2xl border-2 transition-all ${isSearchFocused ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-gray-50 border-gray-50'
                        }`}>
                        <Search size={20} color={isSearchFocused ? '#3b82f6' : '#94a3b8'} />
                        <TextInput
                            placeholder="Find inspiration..."
                            placeholderTextColor="#94a3b8"
                            className="flex-1 ml-3 text-gray-900 text-base font-medium"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable
                                onPress={() => setSearchQuery('')}
                                className="p-1"
                            >
                                <X size={18} color="#94a3b8" />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Filter Tabs */}
                <View className="flex-row mb-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
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
                                    className={`px-4 py-2.5 rounded-full mr-2 border ${isActive ? 'bg-gray-900 border-gray-900' : 'bg-gray-50 border-gray-100'
                                        }`}
                                >
                                    <Text className={`text-[12px] font-bold ${isActive ? 'text-white' : 'text-gray-500'
                                        }`}>
                                        {f.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Tag Chips */}
                {availableTags.length > 0 && (
                    <View className="mb-6 h-10">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 px-5"
                            contentContainerClassName="pr-5"
                        >
                            {availableTags.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <Pressable
                                        key={tag}
                                        onPress={() => toggleTag(tag)}
                                        className={`px-4 py-2 rounded-xl mr-2 border flex-row items-center ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'
                                            }`}
                                    >
                                        {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />}
                                        <Text className={`text-[11px] font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-500'
                                            }`}>
                                            {tag}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                <FlatList
                    className="flex-1"
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
                    contentContainerClassName="pb-24"
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20 p-8">
                            <View className="bg-gray-50 p-6 rounded-full mb-4">
                                <ChefHat size={48} color="#9ca3af" strokeWidth={1} />
                            </View>
                            <Text className="text-gray-500 text-center text-lg font-medium leading-6">
                                {searchQuery ? 'No recipes match your search.' : 'No recipes found.'}
                            </Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#10b981" />
                    }
                />
            </View>

            {/* FAB to Add Recipe */}
            <Pressable
                onPress={() => router.push('/recipes/create')}
                className="absolute bottom-10 right-6 z-[999] bg-emerald-500 w-14 h-14 rounded-full items-center justify-center shadow-xl shadow-emerald-500/40"
                style={{ elevation: 5 }}
            >
                <ChefHat size={24} color="white" />
                <View className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-emerald-500 items-center justify-center" />
            </Pressable>
        </SafeAreaView>
    );
}
