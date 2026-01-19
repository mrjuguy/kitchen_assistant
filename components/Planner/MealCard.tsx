import { ChefHat, Plus } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MealPlan } from '../../types/schema';

interface MealCardProps {
    meal?: MealPlan;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    onPress: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, mealType, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: meal ? '#e5e7eb' : '#f3f4f6',
                flexDirection: 'row',
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
                borderStyle: meal ? 'solid' : 'dashed'
            })}
        >
            <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: meal ? '#f0fdf4' : '#f9fafb',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                overflow: 'hidden'
            }}>
                {meal?.recipe?.image_url ? (
                    <Image source={{ uri: meal.recipe.image_url }} style={{ width: '100%', height: '100%' }} />
                ) : (
                    <ChefHat size={24} color={meal ? '#10b981' : '#d1d5db'} />
                )}
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {mealType}
                </Text>
                {meal ? (
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }} numberOfLines={1}>
                        {meal.recipe?.name}
                    </Text>
                ) : (
                    <Text style={{ fontSize: 16, color: '#9ca3af' }}>Add Meal</Text>
                )}
            </View>

            {!meal && (
                <View style={{ backgroundColor: '#f3f4f6', padding: 8, borderRadius: 99 }}>
                    <Plus size={16} color="#9ca3af" />
                </View>
            )}
        </Pressable>
    );
};
