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
        <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>
                Ingredients
            </Text>

            <View style={{ backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' }}>
                {ingredients.map((ing, index) => {
                    // Find match data if analysis exists
                    const match = analysis?.ingredientMatches.find(m => m.name === ing.name);
                    const isInStock = match?.isInStock;
                    const isLast = index === ingredients.length - 1;

                    return (
                        <View
                            key={ing.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderBottomWidth: isLast ? 0 : 1,
                                borderBottomColor: '#f3f4f6',
                                backgroundColor: isInStock ? '#ecfdf5' : 'white'
                            }}
                        >
                            <View style={{
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isInStock ? '#10b981' : '#fee2e2',
                                marginRight: 12
                            }}>
                                {isInStock ? (
                                    <Check size={16} color="white" strokeWidth={3} />
                                ) : (
                                    <X size={16} color="#ef4444" strokeWidth={3} />
                                )}
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827', textDecorationLine: isInStock ? 'none' : 'none' }}>
                                    {ing.name}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                                    {ing.quantity} {ing.unit}
                                </Text>
                            </View>

                            {!isInStock && match && (
                                <View style={{ alignItems: 'flex-end' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                        <AlertTriangle size={12} color="#f59e0b" style={{ marginRight: 4 }} />
                                        <Text style={{ fontSize: 12, color: '#b45309', fontWeight: 'bold' }}>
                                            Missing
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 11, color: '#92400e', marginTop: 2 }}>
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
