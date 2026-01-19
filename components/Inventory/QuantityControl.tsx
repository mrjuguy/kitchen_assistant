import * as Haptics from 'expo-haptics';
import { Minus, Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface QuantityControlProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    unit?: string;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    unit,
}) => {
    const handleIncrease = () => {
        Haptics.selectionAsync();
        onIncrease();
    };

    const handleDecrease = () => {
        if (quantity > 0) {
            Haptics.selectionAsync();
            onDecrease();
        }
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Pressable
                onPress={handleDecrease}
                style={{ padding: 4, borderRadius: 99 }}
            >
                <Minus size={18} color="#10b981" />
            </Pressable>

            <View style={{ flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 8, minWidth: 40, justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>{quantity}</Text>
                {unit && (
                    <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{unit}</Text>
                )}
            </View>

            <Pressable
                onPress={handleIncrease}
                style={{ padding: 4, borderRadius: 99 }}
            >
                <Plus size={18} color="#10b981" />
            </Pressable>
        </View>
    );
};
