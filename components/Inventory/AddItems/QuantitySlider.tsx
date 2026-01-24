import { Info } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, Text, View } from 'react-native';

interface QuantitySliderProps {
    readonly value: number;
    readonly onChange: (value: number) => void;
}

export const QuantitySlider: React.FC<QuantitySliderProps> = ({ value, onChange }) => {
    const [width, setWidth] = useState(0);
    const [pageX, setPageX] = useState(0);
    const trackRef = useRef<View>(null);

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            updateFromGesture(gestureState.moveX);
        },
        onPanResponderMove: (evt, gestureState) => {
            updateFromGesture(gestureState.moveX);
        },
    }), [width, pageX]);

    const updateFromGesture = (moveX: number) => {
        if (width <= 0 || pageX === 0) return;
        // Calculate relative X using absolute moveX and track's absolute pageX
        const relativeX = moveX - pageX;
        const boundedX = Math.max(0, Math.min(relativeX, width));
        const newValue = Math.round((boundedX / width) * 100) / 100;
        onChange(newValue);
    };

    const handleLayout = (e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
        // Use measure to get absolute position for moveX coordinate mapping
        trackRef.current?.measure((x, y, w, h, px, py) => {
            if (px !== undefined) {
                setPageX(px);
            }
        });
    };

    const percentageDisplay = Math.round(value * 100);

    return (
        <View className="mb-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">
                <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white">Quantity</Text>
                    <Info size={16} color="#94a3b8" />
                </View>
                {/* Segmented Control - Visual Only for now */}
                <View className="flex-row bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                    <Text className="px-3 py-1 bg-white dark:bg-slate-600 rounded text-xs font-bold shadow-sm text-slate-900 dark:text-white">%</Text>
                    <Text className="px-3 py-1 text-xs font-medium text-slate-500">Count</Text>
                    <Text className="px-3 py-1 text-xs font-medium text-slate-500">Vol</Text>
                </View>
            </View>

            {/* Card */}
            <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                <View className="items-center mb-6">
                    <Text className="text-4xl font-extrabold text-blue-500 tracking-tight">
                        {percentageDisplay}<Text className="text-2xl">%</Text>
                    </Text>
                </View>

                {/* Track */}
                <View
                    ref={trackRef}
                    onLayout={handleLayout}
                    {...panResponder.panHandlers}
                    className="relative w-full h-8 bg-slate-100 dark:bg-slate-900 rounded-full justify-center"
                >
                    {/* Fill */}
                    <View
                        style={{ width: `${percentageDisplay}%` }}
                        className="h-full bg-blue-500 rounded-full absolute left-0"
                    />

                    {/* Thumb */}
                    <View
                        style={{ left: `${percentageDisplay}%`, transform: [{ translateX: -16 }] }}
                        className="absolute w-8 h-8 bg-white border-4 border-blue-500 rounded-full z-10"
                    />
                </View>

                {/* Labels */}
                <View className="flex-row justify-between mt-2 px-1">
                    <Text className="text-xs font-semibold text-slate-400 uppercase">Empty</Text>
                    <Text className="text-xs font-semibold text-slate-400 uppercase">Half</Text>
                    <Text className="text-xs font-semibold text-slate-400 uppercase">Full</Text>
                </View>

            </View>
            <Text className="text-center text-slate-400 text-xs mt-4">Slide to estimate remaining amount</Text>
        </View>
    );
};
