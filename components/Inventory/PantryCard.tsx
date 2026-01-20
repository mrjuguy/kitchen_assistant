import * as Haptics from 'expo-haptics';
import { Package, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useDeletePantryItem, useUpdatePantryItem } from '../../hooks/usePantry';
import { PantryItem } from '../../types/schema';
import { QuantityControl } from './QuantityControl';

interface PantryCardProps {
    item: PantryItem;
    onPress?: () => void;
}

const categoryStyles: Record<string, { bg: string, text: string }> = {
    Produce: { bg: '#dcfce7', text: '#166534' },
    Dairy: { bg: '#dbeafe', text: '#1e40af' },
    Spices: { bg: '#fef3c7', text: '#92400e' },
    Protein: { bg: '#fee2e2', text: '#991b1b' },
    Pantry: { bg: '#f3f4f6', text: '#374151' },
};

export const PantryCard: React.FC<PantryCardProps> = ({ item, onPress }) => {
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

    const colors = categoryStyles[item.category] || categoryStyles.Pantry;

    return (
        <Pressable onPress={onPress}>
            <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#f3f4f6',
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2
            }}>
                {/* Product Image/Icon */}
                <View style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#f9fafb',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginRight: 16
                }}>
                    {item.image_url ? (
                        <Image source={{ uri: item.image_url }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <Package size={32} color="#10b981" />
                    )}
                </View>

                {/* Product Info */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <View style={{
                            backgroundColor: colors.bg,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 99
                        }}>
                            <Text style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: colors.text,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                {item.category}
                            </Text>
                        </View>
                        <Pressable
                            onPress={handleDelete}
                            style={{ padding: 4, borderRadius: 99 }}
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </Pressable>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 4 }} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <QuantityControl
                            quantity={item.quantity}
                            unit={item.unit}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    );
};
