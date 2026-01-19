import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChefHat, ChevronLeft, Clock, ShoppingCart, Trash2, Users } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IngredientMatcher } from '../../components/Recipes/IngredientMatcher';
import { GapAnalysis, useGapAnalysis } from '../../hooks/useGapAnalysis';
import { useConsumeIngredients } from '../../hooks/usePantry';
import { useDeleteRecipe, useRecipes } from '../../hooks/useRecipes';
import { useAddShoppingItems } from '../../hooks/useShoppingList';

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: recipes, isLoading } = useRecipes();
    const analysis = useGapAnalysis(id) as GapAnalysis | null;

    const consumeMutation = useConsumeIngredients();
    const addShoppingMutation = useAddShoppingItems();
    const deleteMutation = useDeleteRecipe();

    const recipe = recipes?.find(r => r.id === id);

    if (isLoading || !recipe) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#10b981" />
            </SafeAreaView>
        );
    }

    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const status = analysis?.status || 'Red';

    const handleCookNow = () => {
        if (!analysis) return;

        Alert.alert(
            "Cook this recipe?",
            "This will remove the used ingredients from your pantry.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Cook & Eat",
                    onPress: () => {
                        const updates = analysis.ingredientMatches
                            .filter(m => m.pantryItemId) // Only update items we matched
                            .map(m => ({
                                id: m.pantryItemId!,
                                newQuantity: Math.max(0, m.available - m.required)
                            }));

                        consumeMutation.mutate(updates, {
                            onSuccess: () => {
                                Alert.alert("Bon Appétit!", "Ingredients removed from pantry.", [
                                    { text: "OK", onPress: () => router.back() }
                                ]);
                            }
                        });
                    }
                }
            ]
        );
    };

    const handleAddMissing = () => {
        if (!analysis) return;

        const missingItems = analysis.ingredientMatches
            .filter(m => !m.isInStock)
            .map(m => ({
                name: m.name,
                // If we have some, buy the difference. If none, buy the required amount.
                quantity: Math.max(0, m.required - m.available),
                unit: m.unit,
                category: 'produce' // Default category, ideally we'd map this better
            }));

        if (missingItems.length === 0) return;

        Alert.alert(
            "Add to Shopping List?",
            `Add ${missingItems.length} missing ingredients to your list?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add Items",
                    onPress: () => {
                        addShoppingMutation.mutate(missingItems, {
                            onSuccess: () => {
                                Alert.alert("Added!", "Items added to shopping list.", [
                                    { text: "Go to Shopping List", onPress: () => router.push('/(tabs)/shopping') },
                                    { text: "Stay Component" }
                                ]);
                            }
                        });
                    }
                }
            ]
        );
    };

    const getActionButton = () => {
        if (status === 'Green') {
            return (
                <Pressable
                    onPress={handleCookNow}
                    disabled={consumeMutation.isPending}
                    style={{
                        backgroundColor: '#10b981',
                        paddingVertical: 16,
                        borderRadius: 16,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        elevation: 4
                    }}
                >
                    {consumeMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <ChefHat size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                                Cook This Now
                            </Text>
                        </>
                    )}
                </Pressable>
            );
        } else if (status === 'Yellow') {
            return (
                <Pressable
                    onPress={handleAddMissing}
                    disabled={addShoppingMutation.isPending}
                    style={{
                        backgroundColor: '#f59e0b',
                        paddingVertical: 16,
                        borderRadius: 16,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        elevation: 4
                    }}
                >
                    {addShoppingMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <ShoppingCart size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                                Add Missing to List
                            </Text>
                        </>
                    )}
                </Pressable>
            );
        } else {
            return (
                <View
                    style={{
                        backgroundColor: '#ef4444',
                        paddingVertical: 16,
                        borderRadius: 16,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        opacity: 0.8
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                        Unsafe: Allergen Warning
                    </Text>
                </View>
            );
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header Image */}
                <View style={{ height: 300, backgroundColor: '#f3f4f6', position: 'relative' }}>
                    {recipe.image_url ? (
                        <Image source={{ uri: recipe.image_url }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ChefHat size={64} color="#9ca3af" strokeWidth={1} />
                        </View>
                    )}

                    {/* Back Button */}
                    <Pressable
                        onPress={() => router.back()}
                        style={{
                            position: 'absolute',
                            top: 60,
                            left: 20,
                            width: 40,
                            height: 40,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4
                        }}
                    >
                        <ChevronLeft size={24} color="#111827" />
                    </Pressable>

                    {/* Delete Button */}
                    <Pressable
                        onPress={() => {
                            Alert.alert("Delete Recipe", "Are you sure you want to delete this recipe?", [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => {
                                        deleteMutation.mutate(id, {
                                            onSuccess: () => router.back()
                                        });
                                    }
                                }
                            ]);
                        }}
                        style={{
                            position: 'absolute',
                            top: 60,
                            right: 20,
                            width: 40,
                            height: 40,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4
                        }}
                    >
                        <Trash2 size={20} color="#ef4444" />
                    </Pressable>
                </View>

                <View style={{ padding: 24, marginTop: -32, backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32 }}>
                    {/* Title & Stats */}
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                        {recipe.name}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                            <Clock size={16} color="#6b7280" />
                            <Text style={{ color: '#6b7280', marginLeft: 6, fontWeight: '500' }}>{totalTime} mins</Text>
                        </View>
                        <View style={{ width: 1, height: 16, backgroundColor: '#e5e7eb', marginHorizontal: 16 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Users size={16} color="#6b7280" />
                            <Text style={{ color: '#6b7280', marginLeft: 6, fontWeight: '500' }}>2 servings</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {recipe.description && (
                        <Text style={{ fontSize: 16, color: '#4b5563', lineHeight: 24, marginBottom: 24 }}>
                            {recipe.description}
                        </Text>
                    )}

                    {/* Gap Analysis / Matcher */}
                    {analysis && (
                        <IngredientMatcher
                            ingredients={recipe.ingredients}
                            analysis={analysis}
                        />
                    )}

                    {/* Instructions */}
                    <View style={{ marginTop: 32 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
                            Instructions
                        </Text>
                        {/* Instructions */}
                        {(recipe.instructions || []).map((step, index) => (
                            <View key={index} style={{ flexDirection: 'row', marginBottom: 20 }}>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: '#ecfdf5',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                    marginTop: 2
                                }}>
                                    <Text style={{ color: '#059669', fontSize: 12, fontWeight: 'bold' }}>{index + 1}</Text>
                                </View>
                                <Text style={{ flex: 1, fontSize: 16, color: '#374151', lineHeight: 24 }}>
                                    {step}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Action Bar */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 24,
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#f3f4f6'
            }}>
                {getActionButton()}
            </View>
        </View>
    );
}
