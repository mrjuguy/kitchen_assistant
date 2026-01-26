import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface KitchenHealthStatProps {
  label: string;
  value: string | number;
  trend: string;
  Icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const KitchenHealthStat = React.memo(
  ({ label, value, trend, Icon, color, bgColor }: KitchenHealthStatProps) => {
    return (
      <View
        className="flex-1 min-w-[150px] bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        style={{ elevation: 1 }}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="p-2 rounded-xl" style={{ backgroundColor: bgColor }}>
            <Icon size={20} color={color} />
          </View>
          <View className="px-2 py-1 bg-green-50 rounded-full">
            <Text className="text-[10px] font-bold text-green-600">
              {trend}
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        <Text className="text-xs text-gray-500 font-medium">{label}</Text>
      </View>
    );
  },
);
