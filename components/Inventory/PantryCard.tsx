import * as Haptics from "expo-haptics";
import { Package, Trash2 } from "lucide-react-native";
import React from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";

import {
  useDeletePantryItem,
  useUpdatePantryItem,
} from "../../hooks/usePantry";
import { useLogUsage } from "../../hooks/useUsageLogs";
import { PantryItem, UpdatePantryItem } from "../../types/schema";
import { UNITS_DB, UnitKey } from "../../utils/units";
import { ConsumptionSlider } from "./ConsumptionSlider";
import { ExpiryBadge } from "./ExpiryBadge";
import { QuantityControl } from "./QuantityControl";

interface PantryCardProps {
  item: PantryItem;
  onPress?: () => void;
}

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Produce: { bg: "bg-green-50", text: "text-green-800" },
  Dairy: { bg: "bg-blue-50", text: "text-blue-800" },
  Spices: { bg: "bg-amber-50", text: "text-amber-800" },
  Protein: { bg: "bg-red-50", text: "text-red-800" },
  Pantry: { bg: "bg-gray-100", text: "text-gray-700" },
};

export const PantryCard = React.memo(({ item, onPress }: PantryCardProps) => {
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

  const logMutation = useLogUsage();

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Remove Item", `What happened to ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Expired / Threw Away",
        onPress: () => {
          logMutation.mutate({
            item_name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            action: "expired",
          });
          deleteMutation.mutate(item.id);
        },
      },
      {
        text: "Consumed",
        onPress: () => {
          logMutation.mutate({
            item_name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            action: "consumed",
          });
          deleteMutation.mutate(item.id);
        },
      },
    ]);
  };

  const colors = categoryStyles[item.category] || categoryStyles.Pantry;

  const isConsumable = React.useMemo(() => {
    const def = UNITS_DB[item.unit as UnitKey];
    return def && (def.category === "volume" || def.category === "weight"); // Only show for physical volumes
  }, [item.unit]);

  return (
    <Pressable onPress={onPress}>
      <View
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center shadow-sm"
        style={{ elevation: 2 }}
      >
        {/* Product Image/Icon */}
        <View className="w-16 h-16 bg-gray-50 rounded-xl items-center justify-center overflow-hidden mr-4">
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
              <Text
                className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}
              >
                {item.category}
              </Text>
            </View>
            <Pressable onPress={handleDelete} className="p-1 rounded-full">
              <Trash2 size={16} color="#ef4444" />
            </Pressable>
          </View>
          <Text
            className="text-lg font-bold text-gray-900 mb-1.5"
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <View className="mb-2.5">
            <ExpiryBadge expiryDate={item.expiry_date} />
          </View>

          <View className="flex-row items-center justify-between">
            <QuantityControl
              quantity={item.quantity}
              unit={item.unit}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </View>

          {/* Smart Consumption Slider (For all consumable items) */}
          {isConsumable && item.quantity > 0 && (
            <ConsumptionSlider
              value={item.quantity}
              max={
                item.total_capacity ||
                (item.quantity > 1.25 ? item.quantity : 1)
              }
              onChange={(val) => {
                const updates: UpdatePantryItem = {
                  quantity: val,
                  updated_at: new Date().toISOString(),
                };

                // Auto-Initialize Capacity for Bulk Items if missing
                // If we are interacting with the slider, and capacity is missing,
                // it implies the *current* quantity (before this update) was the effective 'Full' capacity.
                if (!item.total_capacity && item.quantity > 1.25) {
                  updates.total_capacity = item.quantity;
                }

                updateMutation.mutate({
                  id: item.id,
                  updates,
                });
              }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
});
