import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddRecipe } from '../../hooks/useRecipes';

export default function CreateRecipeScreen() {
    const router = useRouter();
    const addRecipeMutation = useAddRecipe();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');

    // Ingredients State
    const [ingredients, setIngredients] = useState<{ id: string; name: string; quantity: string; unit: string }[]>([
        { id: '1', name: '', quantity: '', unit: 'items' }
    ]);

    const addIngredientRow = () => {
        setIngredients([...ingredients, { id: Date.now().toString(), name: '', quantity: '', unit: 'items' }]);
    };

    const removeIngredientRow = (id: string) => {
        if (ingredients.length === 1) return;
        setIngredients(ingredients.filter(i => i.id !== id));
    };

    const updateIngredient = (id: string, field: 'name' | 'quantity' | 'unit', value: string) => {
        setIngredients(ingredients.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            Alert.alert("Missing Name", "Please enter a recipe name.");
            return;
        }

        const validIngredients = ingredients.filter(i => i.name.trim() !== '');
        if (validIngredients.length === 0) {
            Alert.alert("Missing Ingredients", "Please add at least one ingredient.");
            return;
        }

        const recipeData = {
            name: name.trim(),
            description: description.trim(),
            prep_time: parseInt(prepTime) || 0,
            cook_time: parseInt(cookTime) || 0,
            servings: parseInt(servings) || 2,
            ingredients: validIngredients.map(i => ({
                name: i.name.trim(),
                quantity: parseFloat(i.quantity) || 0,
                unit: i.unit.trim() || 'items'
            }))
        };

        addRecipeMutation.mutate(recipeData, {
            onSuccess: () => {
                Alert.alert("Success", "Recipe created!", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            },
            onError: (error) => {
                Alert.alert("Error", error.message);
            }
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
                    <ChevronLeft size={24} color="#111827" />
                </Pressable>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>Create Recipe</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                {/* Basic Info */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Recipe Details</Text>

                <TextInput
                    placeholder="Recipe Name (e.g. Avocado Toast)"
                    value={name}
                    onChangeText={setName}
                    style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16 }}
                />

                <TextInput
                    placeholder="Description (optional)"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16, textAlignVertical: 'top' }}
                />

                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Prep Time (mins)</Text>
                        <TextInput
                            value={prepTime}
                            onChangeText={setPrepTime}
                            keyboardType="numeric"
                            style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 12 }}
                        />
                    </View>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Cook Time (mins)</Text>
                        <TextInput
                            value={cookTime}
                            onChangeText={setCookTime}
                            keyboardType="numeric"
                            style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 12 }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Servings</Text>
                        <TextInput
                            value={servings}
                            onChangeText={setServings}
                            keyboardType="numeric"
                            placeholder="2"
                            style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 12 }}
                        />
                    </View>
                </View>

                {/* Ingredients */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Ingredients</Text>
                    <Pressable onPress={addIngredientRow} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Plus size={16} color="#10b981" />
                        <Text style={{ color: '#10b981', fontWeight: 'bold', marginLeft: 4 }}>Add Item</Text>
                    </Pressable>
                </View>

                {ingredients.map((item, index) => (
                    <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flex: 2, marginRight: 8 }}>
                            <TextInput
                                placeholder="Ingredient"
                                value={item.name}
                                onChangeText={(text) => updateIngredient(item.id, 'name', text)}
                                style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 8 }}
                            />
                        </View>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <TextInput
                                placeholder="Qty"
                                value={item.quantity}
                                onChangeText={(text) => updateIngredient(item.id, 'quantity', text)}
                                keyboardType="numeric"
                                style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 8 }}
                            />
                        </View>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <TextInput
                                placeholder="Unit"
                                value={item.unit}
                                onChangeText={(text) => updateIngredient(item.id, 'unit', text)}
                                style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 8 }}
                            />
                        </View>
                        <Pressable onPress={() => removeIngredientRow(item.id)} style={{ padding: 8 }}>
                            <Trash2 size={20} color="#ef4444" />
                        </Pressable>
                    </View>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
                <Pressable
                    onPress={handleSubmit}
                    disabled={addRecipeMutation.isPending}
                    style={{
                        backgroundColor: '#10b981',
                        padding: 16,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {addRecipeMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Save Recipe</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
