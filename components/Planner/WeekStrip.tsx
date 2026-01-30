import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { formatDate, getDayName, getDayNumber } from "../../utils/date";

interface WeekStripProps {
  days: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  days,
  selectedDate,
  onDateSelect,
}) => {
  const selectedDateStr = formatDate(selectedDate);

  return (
    <View className="mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4"
      >
        {days.map((date) => {
          const isSelected = formatDate(date) === selectedDateStr;
          const isToday = formatDate(date) === formatDate(new Date());

          return (
            <Pressable
              key={date.toISOString()}
              onPress={() => onDateSelect(date)}
              className={`items-center mr-3 py-3 px-4 rounded-2xl min-w-[64px] border ${
                isSelected
                  ? "bg-gray-900 border-gray-900"
                  : isToday
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-white border-gray-100"
              }`}
            >
              <Text
                className={`text-[10px] font-black uppercase mb-1 ${
                  isSelected
                    ? "text-white"
                    : isToday
                      ? "text-emerald-500"
                      : "text-gray-400"
                }`}
              >
                {getDayName(date)}
              </Text>
              <Text
                className={`text-lg font-bold ${
                  isSelected ? "text-white" : "text-gray-900"
                }`}
              >
                {getDayNumber(date)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
