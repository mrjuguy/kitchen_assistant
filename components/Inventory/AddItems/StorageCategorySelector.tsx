import { Beef, Box, Cookie, Grid, Leaf, Milk, Refrigerator, Snowflake, ThermometerSnowflake, Wheat } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const STORAGE_LOCATIONS = [
    { id: 'fridge', label: 'Fridge', icon: Refrigerator },
    { id: 'freezer', label: 'Freezer', icon: Snowflake },
    { id: 'pantry', label: 'Pantry', icon: Box },
];

const CATEGORIES = [
    { id: 'Produce', icon: Leaf },
    { id: 'Dairy', icon: Milk },
    { id: 'Meat', icon: Beef },
    { id: 'Grains', icon: Wheat },
    { id: 'Spices', icon: Grid },
    { id: 'Frozen', icon: ThermometerSnowflake },
    { id: 'Bakery', icon: Cookie },
];

interface StorageCategorySelectorProps {
    readonly selectedLocation?: string;
    readonly selectedCategory?: string;
    readonly onLocationChange: (loc: string) => void;
    readonly onCategoryChange: (cat: string) => void;
}

export const StorageCategorySelector: React.FC<StorageCategorySelectorProps> = ({
    selectedLocation = 'pantry',
    selectedCategory = 'Produce',
    onLocationChange,
    onCategoryChange
}) => {
    // Hardcoded for now to avoid Hook/Context issues
    const isDark = false;

    return (
        <View className="mb-10">
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Storage & Category</Text>

            {/* Storage Locations */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-4 ml-[-20px] px-5">
                {STORAGE_LOCATIONS.map((loc) => {
                    const isSelected = selectedLocation === loc.id;
                    const Icon = loc.icon;
                    return (
                        <Pressable
                            key={loc.id}
                            onPress={() => onLocationChange(loc.id)}
                            className={`flex-row items-center gap-2 px-5 py-3 rounded-2xl mr-3 border ${isSelected
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            <Icon size={20} color={isSelected ? 'white' : '#94a3b8'} />
                            <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                {loc.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-2 ml-[-20px] px-5 mt-2">
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const Icon = cat.icon;
                    const iconColor = isSelected ? (isDark ? '#0f172a' : '#ffffff') : '#94a3b8';

                    return (
                        <Pressable
                            key={cat.id}
                            onPress={() => onCategoryChange(cat.id)}
                            className={`flex-row items-center gap-2 px-4 py-2.5 rounded-xl mr-3 border ${isSelected
                                    ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            <Icon size={18} color={iconColor} />
                            <Text className={`font-semibold text-sm ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-700 dark:text-slate-200'}`}>
                                {cat.id}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};
