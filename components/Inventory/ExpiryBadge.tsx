import React from "react";
import { Text, View } from "react-native";

import { getItemHealth } from "../../utils/itemHealth";

interface ExpiryBadgeProps {
  expiryDate?: string | null;
  showFresh?: boolean;
}

/**
 * A color-coded badge component for displaying item freshness.
 * Uses the traffic light system: Green (Good), Yellow (Warning), Orance (Critical), Red (Expired).
 */
export const ExpiryBadge = React.memo(
  ({ expiryDate, showFresh = false }: ExpiryBadgeProps) => {
    const health = getItemHealth(expiryDate);

    // Don't show anything for items without expiry unless explicitly requested
    if (!expiryDate && !showFresh) return null;

    return (
      <View
        className="flex-row items-center px-2 py-1 rounded-lg border self-start"
        style={{
          backgroundColor: health.color + "15", // 8% opacity for BG
          borderColor: health.color + "40", // 25% opacity for border
        }}
      >
        <View
          className="w-1.5 h-1.5 rounded-full mr-1.5"
          style={{ backgroundColor: health.color }}
        />
        <Text
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: health.color }}
        >
          {health.label}
        </Text>
      </View>
    );
  },
);
