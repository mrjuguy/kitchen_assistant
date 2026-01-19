import * as Haptics from 'expo-haptics';
import { Package, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useDeletePantryItem, useUpdatePantryItem } from '../../hooks/usePantry';
import { PantryItem } from '../../types/schema';
import { QuantityControl } from './QuantityControl';

interface PantryCardProps {
    item: PantryItem;
}

const CATEGORY_COLORS: Record<string, string> = {
    Produce: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Dairy: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Spices: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    Protein: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Pantry: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

export const PantryCard: React.FC<PantryCardProps> = ({ item }) => {
    const updateMutation = useUpdatePantryItem();
    const deleteMutation = useDeletePantryItem();

    const handleIncrease = () => {
        updateMutation.mutate({
            id: item.id,
            updates: { quantity: item.quantity + 1 },
        });
    };

    const handleDecrease = () => {
        if (item.quantity > 0) {
            updateMutation.mutate({
                id: item.id,
                updates: { quantity: Math.max(0, item.quantity - 1) },
            });
        }
    };

    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            'Delete Item',
            `Are you sure you want to remove ${item.name} from your pantry?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate(item.id)
                },
            ]
        );
    };

    const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Pantry;

    return (
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-zinc-800 flex-row items-center">
            {/* Product Image/Icon */}
            <View className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-xl items-center justify-center overflow-hidden mr-4">
                {item.image_url ? (
                    <Image source={{ uri: item.image_url }} className="w-full h-full" />
                ) : (
                    <Package size={32} color="#999" />
                )}
            </View>

            {/* Product Info */}
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${categoryStyle}`}>
                        {item.category}
                    </Text>
                    <Pressable
                        onPress={handleDelete}
                        className="p-1 rounded-full active:bg-red-50 dark:active:bg-red-900/20"
                    >
                        <Trash2 size={16} color="#ef4444" />
                    </Pressable>
                </View>
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1" numberOfLines={1}>
                    {item.name}
                </Text>
                <View className="flex-row items-center justify-between">
                    <QuantityControl
                        quantity={item.quantity}
                        unit={item.unit}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                    />
                </View>
            </View>
        </View>
    );
};
