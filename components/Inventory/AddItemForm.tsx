import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAddPantryItem } from '../../hooks/usePantry';

const CATEGORIES = ['Produce', 'Dairy', 'Spices', 'Protein', 'Pantry', 'Frozen', 'Bakery'];
const UNITS = ['items', 'grams', 'ml', 'kg', 'oz', 'lb', 'cups'];

export const AddItemForm: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState(UNITS[0]);

    const addMutation = useAddPantryItem();
    const router = useRouter();

    const handleSubmit = () => {
        if (!name.trim()) return;

        addMutation.mutate({
            name: name.trim(),
            category,
            quantity: parseFloat(quantity) || 1,
            unit,
        }, {
            onSuccess: () => {
                router.back();
            }
        });
    };

    return (
        <ScrollView className="flex-1 bg-white dark:bg-zinc-950 p-6">
            <View className="flex-row items-center justify-between mb-8">
                <Text className="text-2xl font-bold dark:text-white">Add New Item</Text>
                <Pressable onPress={() => router.back()} className="p-2">
                    <X color="#666" size={24} />
                </Pressable>
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Item Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Organic Milk"
                    placeholderTextColor="#999"
                    className="bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white p-4 rounded-xl text-lg border border-gray-100 dark:border-zinc-800"
                />
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {CATEGORIES.map((cat) => (
                        <Pressable
                            key={cat}
                            onPress={() => setCategory(cat)}
                            className={`mr-2 px-4 py-2 rounded-full border ${category === cat
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'
                                }`}
                        >
                            <Text className={category === cat ? 'text-white font-bold' : 'text-gray-600 dark:text-gray-400'}>
                                {cat}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <View className="flex-row mb-8">
                <View className="flex-1 mr-4">
                    <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Quantity</Text>
                    <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        className="bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white p-4 rounded-xl text-lg border border-gray-100 dark:border-zinc-800"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Unit</Text>
                    <View className="bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
                        {/* Using a simple selector for units */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
                            {UNITS.map((u) => (
                                <Pressable
                                    key={u}
                                    onPress={() => setUnit(u)}
                                    className={`mr-2 px-3 py-1.5 rounded-lg ${unit === u ? 'bg-zinc-200 dark:bg-zinc-700' : ''
                                        }`}
                                >
                                    <Text className="text-gray-700 dark:text-gray-300">{u}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>

            <Pressable
                onPress={handleSubmit}
                disabled={addMutation.isPending || !name.trim()}
                className={`p-4 rounded-2xl items-center justify-center flex-row ${addMutation.isPending || !name.trim() ? 'bg-gray-300 dark:bg-zinc-800' : 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                    }`}
            >
                {addMutation.isPending ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Add to Pantry</Text>
                )}
            </Pressable>
        </ScrollView>
    );
};
