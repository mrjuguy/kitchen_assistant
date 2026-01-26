import { Refrigerator, ShoppingBasket } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { KitchenHealthStat } from "./KitchenHealthStat";

interface KitchenHealthSectionProps {
    totalItems: number;
    freshnessScore: number;
}

export const KitchenHealthSection = React.memo(
    ({ totalItems, freshnessScore }: KitchenHealthSectionProps) => {
        return (
            <View className="px-4 mb-8">
                <Text className="text-xl font-extrabold text-gray-900 mb-4">
                    Kitchen Health
                </Text>
                <View className="flex-row gap-3">
                    <KitchenHealthStat
                        label="Total Items"
                        value={totalItems}
                        trend="+2 new"
                        Icon={Refrigerator}
                        color="#0d7ff2"
                        bgColor="#eff6ff"
                    />
                    <KitchenHealthStat
                        label="Freshness Score"
                        value={`${freshnessScore}%`}
                        trend={freshnessScore > 90 ? "Optimal" : "Check list"}
                        Icon={ShoppingBasket}
                        color="#8b5cf6"
                        bgColor="#f5f3ff"
                    />
                </View>
            </View>
        );
    },
);
