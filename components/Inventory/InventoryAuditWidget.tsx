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
        <View style={{ backgroundColor: '#eff6ff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', shadowColor: '#3b82f6', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ flex: 1, fontSize: 16, color: '#1e40af', fontWeight: 'bold' }}>
                    Quick Pantry Audit
                </Text>
                <Pressable onPress={dismiss} hitSlop={10}>
                    <X size={16} color="#3b82f6" />
                </Pressable>
            </View>

            <Text style={{ color: '#1e3a8a', marginBottom: 16, lineHeight: 20 }}>
                You haven't updated <Text style={{ fontWeight: 'bold' }}>{currentItem.name}</Text> in a while. Do you still have roughly {Math.round(currentItem.quantity * 10) / 10} {currentItem.unit}?
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                    onPress={() => confirmStock(1)}
                    style={{ flex: 1, backgroundColor: 'white', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderColor: '#dbeafe', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
                >
                    <Text style={{ color: '#2563eb', fontWeight: '600', fontSize: 14 }}>Yes, Full</Text>
                </Pressable>

                <Pressable
                    onPress={() => confirmStock(0.5)}
                    style={{ flex: 1, backgroundColor: 'white', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderColor: '#dbeafe', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
                >
                    <Text style={{ color: '#2563eb', fontWeight: '600', fontSize: 14 }}>~Half</Text>
                </Pressable>

                <Pressable
                    onPress={() => confirmStock(0)}
                    style={{ flex: 1, backgroundColor: '#fee2e2', paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderColor: '#fecaca', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
                >
                    <Text style={{ color: '#dc2626', fontWeight: '600', fontSize: 14 }}>Gone</Text>
                </Pressable>
            </View>
        </View>
    );
};
