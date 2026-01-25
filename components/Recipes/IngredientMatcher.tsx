import { AlertTriangle, Check, X } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { GapAnalysis } from '../../hooks/useGapAnalysis';
import { RecipeIngredient } from '../../types/schema';

interface IngredientMatcherProps {
    ingredients: RecipeIngredient[];
    analysis?: GapAnalysis;
}

export const IngredientMatcher: React.FC<IngredientMatcherProps> = ({ ingredients, analysis }) => {
    return (
        <View className="mt-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">
                Ingredients
            </Text>

            <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {ingredients.map((ing, index) => {
                    // Find match data if analysis exists
                    const match = analysis?.ingredientMatches.find(m => m.name === ing.name);
                    const isInStock = match?.isInStock;
                    const isLast = index === ingredients.length - 1;

                    return (
                        <View
                            key={ing.id}
                            className={`flex-row items-center p-4 border-b border-gray-50 ${isInStock ? 'bg-emerald-50/50' : 'bg-white'
                                } ${isLast ? 'border-b-0' : ''}`}
                        >
                            <View className={`w-7 h-7 rounded-full items-center justify-center mr-3 ${isInStock ? 'bg-emerald-500' : 'bg-red-100'
                                }`}>
                                {isInStock ? (
                                    <Check size={16} color="white" strokeWidth={3} />
                                ) : (
                                    <X size={16} color="#ef4444" strokeWidth={3} />
                                )}
                            </View>

                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-900">
                                    {ing.name}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {ing.quantity} {ing.unit}
                                </Text>
                            </View>

                            {!isInStock && match && (
                                <View className="items-end">
                                    <View className="flex-row items-center bg-orange-50 px-2 py-1 rounded-lg">
                                        <AlertTriangle size={12} color="#f59e0b" className="mr-1" />
                                        <Text className="text-[10px] text-orange-800 font-black uppercase tracking-wider">
                                            Missing
                                        </Text>
                                    </View>
                                    <Text className="text-[10px] text-orange-900 mt-1 font-medium">
                                        Have: {match.available} {match.unit}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
