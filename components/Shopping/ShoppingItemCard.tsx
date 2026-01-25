import * as Haptics from 'expo-haptics';
import { Check, Package, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useDeleteShoppingItem, useUpdateShoppingItem } from '../../hooks/useShoppingList';
import { ShoppingItem } from '../../types/schema';
import { QuantityControl } from '../Inventory/QuantityControl';

interface ShoppingItemCardProps {
    item: ShoppingItem;
    onPress?: () => void;
}

const categoryStyles: Record<string, { bg: string, text: string }> = {
    Produce: { bg: 'bg-green-50', text: 'text-green-800' },
    Dairy: { bg: 'bg-blue-50', text: 'text-blue-800' },
    Spices: { bg: 'bg-amber-50', text: 'text-amber-800' },
    Protein: { bg: 'bg-red-50', text: 'text-red-800' },
    Pantry: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ item, onPress }) => {
    const updateMutation = useUpdateShoppingItem();
    const deleteMutation = useDeleteShoppingItem();

    const handleToggleBought = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        updateMutation.mutate({
            id: item.id,
            updates: { bought: !item.bought },
        });
    };

    const handleIncrease = () => {
        updateMutation.mutate({
            id: item.id,
            updates: { quantity: item.quantity + 1 },
        });
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            updateMutation.mutate({
                id: item.id,
                updates: { quantity: Math.max(1, item.quantity - 1) },
            });
        }
    };

    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            'Delete Item',
            `Are you sure you want to remove ${item.name} from your shopping list?`,
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

    const colors = categoryStyles[item.category] || categoryStyles.Pantry;

    return (
        <View
            className={`bg-white rounded-2xl mb-3 border border-gray-100 shadow-sm overflow-hidden ${item.bought ? 'opacity-60' : 'opacity-100'}`}
            style={{ elevation: 2 }}
        >
            <Pressable
                onPress={onPress}
                className="flex-row items-center p-4"
            >
                {/* Checkbox */}
                <Pressable
                    onPress={handleToggleBought}
                    className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${item.bought ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-gray-300'
                        }`}
                    hitSlop={8}
                >
                    {item.bought && <Check size={14} color="white" strokeWidth={3} />}
                </Pressable>

                {/* Product Image/Icon */}
                <View className="w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center overflow-hidden mr-4">
                    {item.image_url ? (
                        <Image source={{ uri: item.image_url }} className="w-full h-full" />
                    ) : (
                        <Package size={32} color="#10b981" />
                    )}
                </View>

                {/* Product Info */}
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <View className={`${colors.bg} px-2 py-0.5 rounded-full`}>
                            <Text className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>
                                {item.category}
                            </Text>
                        </View>
                        <Pressable
                            onPress={handleDelete}
                            className="p-1 rounded-full"
                            hitSlop={8}
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </Pressable>
                    </View>
                    <Text
                        className={`text-lg font-bold text-gray-900 mb-1 ${item.bought ? 'line-through' : ''}`}
                        numberOfLines={1}
                    >
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
            </Pressable>
        </View>
    );
};
