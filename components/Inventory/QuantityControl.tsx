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
        <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 rounded-full px-2 py-1">
            <Pressable
                onPress={handleDecrease}
                className="p-1 rounded-full active:bg-gray-200 dark:active:bg-zinc-700"
            >
                <Minus size={18} color="#666" />
            </Pressable>

            <View className="flex-row items-baseline px-2 min-w-[40px] justify-center">
                <Text className="text-base font-semibold dark:text-white">{quantity}</Text>
                {unit && (
                    <Text className="text-xs text-gray-500 ml-1 dark:text-gray-400">{unit}</Text>
                )}
            </View>

            <Pressable
                onPress={handleIncrease}
                className="p-1 rounded-full active:bg-gray-200 dark:active:bg-zinc-700"
            >
                <Plus size={18} color="#666" />
            </Pressable>
        </View>
    );
};
