import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { CalendarClock, CalendarDays, CheckCircle2, Calendar as EditCalendar } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { calculateSmartDate, getLabelForDate } from '../../../utils/date';

interface ExpirySelectorProps {
    readonly currentDate?: Date | null;
    readonly onSelect: (date: Date) => void;
}

export const ExpirySelector: React.FC<ExpirySelectorProps> = ({ currentDate, onSelect }) => {
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    // Sync internal state with external date changes
    useEffect(() => {
        if (currentDate) {
            const label = getLabelForDate(currentDate);
            setSelectedLabel(label || 'Custom');
        } else {
            setSelectedLabel(null);
        }
    }, [currentDate]);

    const handleSelect = (label: string, calculateDate: () => Date) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSelectedLabel(label);
        onSelect(calculateDate());
    };

    const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowPicker(Platform.OS === 'ios'); // iOS stays open, Android closes
        if (date) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSelect(date);
        }
    };

    return (
        <View className="mb-10">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-slate-900 dark:text-white">Best Before</Text>
                <Pressable
                    onPress={() => setShowPicker(true)}
                    accessibilityLabel="Open calendar view"
                    accessibilityRole="button"
                >
                    <Text className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">View Calendar</Text>
                </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-3">
                {/* Smart Pick: +1 Week */}
                <Pressable
                    onPress={() => handleSelect('+1 Week', () => calculateSmartDate({ type: 'weeks', value: 1 }))}
                    className={`w-[48%] p-3 rounded-xl border flex-row items-center ${selectedLabel === '+1 Week'
                        ? 'bg-emerald-600 border-emerald-600 shadow-md'
                        : 'bg-emerald-500 border-emerald-500 shadow-sm'
                        }`}
                    accessibilityLabel="Add 1 Week"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selectedLabel === '+1 Week' }}
                >
                    <View className="items-start">
                        <View className="flex-row items-center gap-2 mb-1">
                            <CalendarClock size={20} color="white" />
                            {selectedLabel === '+1 Week' && <CheckCircle2 size={16} color="white" />}
                        </View>
                        <Text className="text-xs font-medium text-white opacity-90 uppercase tracking-wider">Smart Pick</Text>
                        <Text className="text-base font-bold text-white">+1 Week</Text>
                    </View>
                </Pressable>

                {/* +3 Days */}
                <Pressable
                    onPress={() => handleSelect('+3 Days', () => calculateSmartDate({ type: 'days', value: 3 }))}
                    className={`flex-1 flex-row items-center justify-center gap-2 px-5 py-3 rounded-xl border ${selectedLabel === '+3 Days'
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                    accessibilityLabel="Add 3 Days"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selectedLabel === '+3 Days' }}
                >
                    <CalendarClock size={20} color={selectedLabel === '+3 Days' ? '#10b981' : '#94a3b8'} />
                    <Text className={`font-semibold ${selectedLabel === '+3 Days' ? 'text-emerald-700' : 'text-slate-700 dark:text-slate-200'}`}>+3 Days</Text>
                </Pressable>

                {/* +1 Month */}
                <Pressable
                    onPress={() => handleSelect('+1 Month', () => calculateSmartDate({ type: 'months', value: 1 }))}
                    className={`w-[48%] flex-row items-center justify-center gap-2 px-5 py-3 rounded-xl border ${selectedLabel === '+1 Month'
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                    accessibilityLabel="Add 1 Month"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selectedLabel === '+1 Month' }}
                >
                    <CalendarDays size={20} color={selectedLabel === '+1 Month' ? '#10b981' : '#94a3b8'} />
                    <Text className={`font-semibold ${selectedLabel === '+1 Month' ? 'text-emerald-700' : 'text-slate-700 dark:text-slate-200'}`}>+1 Month</Text>
                </Pressable>

                {/* +1 Year */}
                <Pressable
                    onPress={() => handleSelect('+1 Year', () => calculateSmartDate({ type: 'years', value: 1 }))}
                    className={`flex-1 flex-row items-center justify-center gap-2 px-5 py-3 rounded-xl border ${selectedLabel === '+1 Year'
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                    accessibilityLabel="Add 1 Year"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selectedLabel === '+1 Year' }}
                >
                    <CalendarDays size={20} color={selectedLabel === '+1 Year' ? '#10b981' : '#94a3b8'} />
                    <Text className={`font-semibold ${selectedLabel === '+1 Year' ? 'text-emerald-700' : 'text-slate-700 dark:text-slate-200'}`}>+1 Year</Text>
                </Pressable>

                {/* Custom */}
                <Pressable
                    onPress={() => setShowPicker(true)}
                    className={`w-full flex-row items-center justify-center gap-2 px-5 py-3 rounded-xl border ${selectedLabel === 'Custom'
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                    accessibilityLabel={currentDate ? `Selected date: ${currentDate.toLocaleDateString()}` : "Select custom date"}
                    accessibilityRole="button"
                >
                    <EditCalendar size={20} color={selectedLabel === 'Custom' ? '#10b981' : '#94a3b8'} />
                    <Text className={`font-semibold ${selectedLabel === 'Custom' ? 'text-emerald-700' : 'text-slate-700 dark:text-slate-200'}`}>
                        {selectedLabel === 'Custom' && currentDate ? currentDate.toLocaleDateString() : 'Custom Date'}
                    </Text>
                </Pressable>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={currentDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onPickerChange}
                    minimumDate={new Date()}
                />
            )}
        </View>
    );
};
