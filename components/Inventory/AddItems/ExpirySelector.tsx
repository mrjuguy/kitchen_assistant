import { addDays, addWeeks, startOfToday } from 'date-fns';
import { CalendarClock, CalendarDays, CheckCircle2, Calendar as EditCalendar } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface ExpirySelectorProps {
    readonly onSelect: (date: Date) => void;
}

export const ExpirySelector: React.FC<ExpirySelectorProps> = ({ onSelect }) => {
    const [selectedLabel, setSelectedLabel] = useState<string>('');

    const handleSelect = (label: string, calculateDate: () => Date) => {
        setSelectedLabel(label);
        onSelect(calculateDate());
    };

    return (
        <View className="mb-10">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-slate-900 dark:text-white">Best Before</Text>
                <Pressable>
                    <Text className="text-sm font-semibold text-blue-500">View Calendar</Text>
                </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-3">
                {/* Smart Pick: +7 Days */}
                <Pressable
                    onPress={() => handleSelect('+7 Days', () => addWeeks(startOfToday(), 1))}
                    className={`w-[48%] p-3 rounded-xl border flex-row items-center ${selectedLabel === '+7 Days'
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-blue-500 border-blue-500'
                        }`}
                >
                    <View className="items-start">
                        <View className="flex-row items-center gap-2 mb-1">
                            <CalendarClock size={20} color="white" />
                            {selectedLabel === '+7 Days' && <CheckCircle2 size={16} color="white" />}
                        </View>
                        <Text className="text-xs font-medium text-white opacity-90 uppercase tracking-wider">Smart Pick</Text>
                        <Text className="text-base font-bold text-white">+7 Days</Text>
                    </View>
                </Pressable>

                {/* +3 Days */}
                <Pressable
                    onPress={() => handleSelect('+3 Days', () => addDays(startOfToday(), 3))}
                    className={`flex-1 flex-row items-center justify-center gap-2 px-5 py-3 rounded-xl border ${selectedLabel === '+3 Days'
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                >
                    <CalendarClock size={20} color={selectedLabel === '+3 Days' ? '#3b82f6' : '#94a3b8'} />
                    <Text className={`font-semibold ${selectedLabel === '+3 Days' ? 'text-slate-900' : 'text-slate-700 dark:text-slate-200'}`}>+3 Days</Text>
                </Pressable>

                {/* +2 Weeks */}
                <Pressable
                    onPress={() => handleSelect('+2 Weeks', () => addWeeks(startOfToday(), 2))}
                    className={`w-[48%] flex-row items-center justify-center gap-2 px-5 py-3 rounded-xl border ${selectedLabel === '+2 Weeks'
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                >
                    <CalendarDays size={20} color={selectedLabel === '+2 Weeks' ? '#3b82f6' : '#94a3b8'} />
                    <Text className={`font-semibold ${selectedLabel === '+2 Weeks' ? 'text-slate-900' : 'text-slate-700 dark:text-slate-200'}`}>+2 Weeks</Text>
                </Pressable>

                {/* Custom */}
                <Pressable
                    onPress={() => setSelectedLabel('Custom')}
                    className={`flex-1 flex-row items-center justify-center gap-2 px-5 py-3 rounded-xl border ${selectedLabel === 'Custom'
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                >
                    <EditCalendar size={20} color={selectedLabel === 'Custom' ? '#3b82f6' : '#94a3b8'} />
                    <Text className={`font-semibold ${selectedLabel === 'Custom' ? 'text-slate-900' : 'text-slate-700 dark:text-slate-200'}`}>Custom</Text>
                </Pressable>
            </View>
        </View>
    );
};
