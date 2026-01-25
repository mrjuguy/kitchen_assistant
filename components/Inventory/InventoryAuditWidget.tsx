import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, Pressable, Text, View } from 'react-native';
import { useStalePantryItems, useUpdatePantryItem } from '../../hooks/usePantry';

export const InventoryAuditWidget: React.FC = () => {
    const staleItems = useStalePantryItems();
    const updateMutation = useUpdatePantryItem();
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    // Show first stale item that is not dismissed
    const currentItem = staleItems.find(item => !dismissedIds.includes(item.id));

    if (!currentItem) return null;

    const dismiss = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDismissedIds(prev => [...prev, currentItem.id]);
    };

    const confirmStock = (fraction: number) => {
        // Update updated_at (and quantity implies confirmation)
        if (fraction === 0) {
            // "It's gone". Quantity 0.
            updateMutation.mutate({ id: currentItem.id, updates: { quantity: 0, updated_at: new Date().toISOString() } });
        } else if (fraction === 1) {
            // "Still have it". Just update timestamp.
            updateMutation.mutate({ id: currentItem.id, updates: { updated_at: new Date().toISOString() } });
        } else {
            // "Half full".
            updateMutation.mutate({
                id: currentItem.id,
                updates: {
                    quantity: parseFloat((currentItem.quantity * fraction).toFixed(2)),
                    updated_at: new Date().toISOString()
                }
            });
        }
        dismiss();
    };

    return (
        <View className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-200 shadow-sm" style={{ shadowColor: '#3b82f6', elevation: 2 }}>
            <View className="flex-row justify-between items-start mb-2">
                <Text className="flex-1 text-base text-blue-800 font-bold">
                    Quick Pantry Audit
                </Text>
                <Pressable onPress={dismiss} hitSlop={10}>
                    <X size={16} color="#3b82f6" />
                </Pressable>
            </View>

            <Text className="text-blue-900 mb-4 leading-5">
                You haven't updated <Text className="font-bold">{currentItem.name}</Text> in a while. Do you still have roughly {Math.round(currentItem.quantity * 10) / 10} {currentItem.unit}?
            </Text>

            <View className="flex-row gap-3">
                <Pressable
                    onPress={() => confirmStock(1)}
                    className="flex-1 bg-white py-2.5 rounded-xl items-center border border-blue-100 shadow-sm"
                    style={{ elevation: 1 }}
                >
                    <Text className="text-blue-600 font-semibold text-sm">Yes, Full</Text>
                </Pressable>

                <Pressable
                    onPress={() => confirmStock(0.5)}
                    className="flex-1 bg-white py-2.5 rounded-xl items-center border border-blue-100 shadow-sm"
                    style={{ elevation: 1 }}
                >
                    <Text className="text-blue-600 font-semibold text-sm">~Half</Text>
                </Pressable>

                <Pressable
                    onPress={() => confirmStock(0)}
                    className="flex-1 bg-red-100 py-2.5 rounded-xl items-center border border-red-200 shadow-sm"
                    style={{ elevation: 1 }}
                >
                    <Text className="text-red-600 font-semibold text-sm">Gone</Text>
                </Pressable>
            </View>
        </View>
    );
};
