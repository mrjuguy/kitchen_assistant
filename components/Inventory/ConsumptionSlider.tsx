import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, View } from "react-native";

interface ConsumptionSliderProps {
  value: number; // Current quantity (e.g. 0.75)
  max?: number; // Reference max (e.g. 1.0), defaults to 1.
  onChange: (newValue: number) => void;
  enabled?: boolean;
}

export const ConsumptionSlider = React.memo(
  ({ value, max = 1, onChange, enabled = true }: ConsumptionSliderProps) => {
    // Generate segments based on logic:
    // If Max > 1.25 (Bulk), likely linear steps?
    // Actually, user wants "Half" of a 12oz box.
    // If we passed max=12, segments=[0.25, 0.5, 0.75, 1.0] implies 3oz, 6oz, 9oz, 12oz.
    // This seems correct for "Mental Model" of shaking a box.
    // It divides the CURRENT recognized "Max" into 4 chunks.

    // Generate segments
    const segments = [0.25, 0.5, 0.75, 1.0];

    // Check if we are in "Bulk/Relativized" mode
    // Meaning the max equals the current value (and it's > 1.25 so not normalized).
    // In this mode, the bars represent "Take Action: Reduce to X%" rather than "State: You have X%".
    const isBulkAction = max === value && value > 1.25;

    return (
      <View
        className="flex-row h-3 rounded-full overflow-hidden mt-3 bg-gray-200"
        style={{ opacity: enabled ? 1 : 0.5 }}
      >
        {segments.map((seg) => {
          // Calculation Logic
          const threshold = seg * max;

          // Visual Logic
          let isActive = false;
          let color = "#10b981"; // Default Green

          if (isBulkAction) {
            // In Bulk Mode, all bars are "Ready to Interact".
            // Let's make them look like buttons? Or just diff color?
            // Maybe Blue to signify "Estimate"?
            // And we show them ALL as 'filled' or 'neutral'?
            // Let's show them as Neutral Gray-Blue to imply "Click me to set".
            isActive = true;
            color = "#60a5fa"; // Blue-400
          } else {
            // Standard State Logic (Progress Bar)
            isActive = value >= threshold - 0.1;
          }

          return (
            <Pressable
              key={seg}
              className="flex-1 mx-[2px] rounded-sm"
              style={{
                backgroundColor: isActive ? color : "#d1d5db",
              }}
              onPress={() => {
                if (!enabled) return;
                Haptics.selectionAsync();
                onChange(Number((seg * max).toFixed(1)));
              }}
            />
          );
        })}
      </View>
    );
  },
);
