import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { formatDate, getDayName, getDayNumber } from '../../utils/date';

interface WeekStripProps {
    days: Date[];
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

export const WeekStrip: React.FC<WeekStripProps> = ({ days, selectedDate, onDateSelect }) => {
    const selectedDateStr = formatDate(selectedDate);

    return (
        <View style={{ marginBottom: 24 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {days.map((date) => {
                    const isSelected = formatDate(date) === selectedDateStr;
                    const isToday = formatDate(date) === formatDate(new Date());

                    return (
                        <Pressable
                            key={date.toISOString()}
                            onPress={() => onDateSelect(date)}
                            style={{
                                alignItems: 'center',
                                marginRight: 12,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 16,
                                backgroundColor: isSelected ? '#111827' : isToday ? '#f0fdf4' : 'white',
                                borderWidth: 1,
                                borderColor: isSelected ? '#111827' : isToday ? '#10b981' : '#f3f4f6',
                                minWidth: 64
                            }}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: isSelected ? 'white' : isToday ? '#10b981' : '#6b7280',
                                marginBottom: 4
                            }}>
                                {getDayName(date)}
                            </Text>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: isSelected ? 'white' : '#111827'
                            }}>
                                {getDayNumber(date)}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};
