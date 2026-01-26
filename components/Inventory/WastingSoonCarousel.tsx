import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { PantryItem } from "../../types/schema";
import { WastingSoonCard } from "./WastingSoonCard";

interface WastingSoonCarouselProps {
    items: PantryItem[];
    onItemPress: (item: PantryItem) => void;
}

export const WastingSoonCarousel = React.memo(
    ({ items, onItemPress }: WastingSoonCarouselProps) => {
        if (items.length === 0) return null;

        return (
            <View className="mb-8">
                <View className="flex-row items-center justify-between px-4 mb-4">
                    <Text className="text-xl font-extrabold text-gray-900">
                        Wasting Soon
                    </Text>
                    <Pressable>
                        <Text className="text-blue-600 font-semibold text-sm">
                            View All
                        </Text>
                    </Pressable>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="px-4 pb-1"
                >
                    {items.map((item) => (
                        <WastingSoonCard
                            key={item.id}
                            item={item}
                            onPress={() => onItemPress(item)}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    },
);
