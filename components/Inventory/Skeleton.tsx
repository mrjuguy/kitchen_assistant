import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

export const Skeleton = ({ width, height, borderRadius = 8 }: { width: any, height: any, borderRadius?: number }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.7, { duration: 800 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[{
                width,
                height,
                borderRadius,
            }, animatedStyle]}
            className="bg-gray-200 dark:bg-zinc-800"
        />
    );
};

export const PantryCardSkeleton = () => (
    <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-zinc-800 flex-row items-center">
        <Skeleton width={64} height={64} borderRadius={12} />
        <View className="flex-1 ml-4">
            <Skeleton width={60} height={16} borderRadius={8} />
            <View className="h-2" />
            <Skeleton width="80%" height={24} borderRadius={8} />
            <View className="h-2" />
            <Skeleton width={100} height={32} borderRadius={20} />
        </View>
    </View>
);
