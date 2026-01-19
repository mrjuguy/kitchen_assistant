import { ChefHat, Info, Timer } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { GapAnalysisResult, RecipeWithIngredients } from '../../hooks/useRecipes';

interface RecipeCardProps {
    recipe: RecipeWithIngredients;
    analysis?: GapAnalysisResult;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, analysis }) => {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const isMissing = analysis && !analysis.canCook;

    return (
        <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#f3f4f6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2
        }}>
            {/* Header Image */}
            <View style={{ height: 160, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center' }}>
                {recipe.image_url ? (
                    <Image source={{ uri: recipe.image_url }} style={{ width: '100%', height: '100%' }} />
                ) : (
                    <ChefHat size={48} color="#10b981" strokeWidth={1} />
                )}

                {/* Availability Badge */}
                {analysis && (
                    <View style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 99,
                        backgroundColor: analysis.canCook ? '#10b981' : '#f59e0b'
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {analysis.canCook ? 'Ready to Cook' : `${analysis.missingIngredients.length} Missing`}
                        </Text>
                    </View>
                )}
            </View>

            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 }} numberOfLines={1}>
                    {recipe.name}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Timer size={14} color="#10b981" />
                    <Text style={{ color: '#6b7280', fontSize: 13, marginLeft: 4, marginRight: 16 }}>{totalTime} mins</Text>
                    <Info size={14} color="#10b981" />
                    <Text style={{ color: '#6b7280', fontSize: 13, marginLeft: 4 }}>{recipe.ingredients.length} ingredients</Text>
                </View>

                {/* Gap Analysis Summary */}
                {isMissing && analysis.missingIngredients.length > 0 && (
                    <View style={{ backgroundColor: '#fffbeb', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#fef3c7' }}>
                        <Text style={{ color: '#92400e', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>Missing:</Text>
                        <Text style={{ color: '#b45309', fontSize: 12 }} numberOfLines={2}>
                            {analysis.missingIngredients.map(i => i.name).join(', ')}
                        </Text>
                    </View>
                )}

                {analysis?.canCook && (
                    <View style={{ backgroundColor: '#ecfdf5', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#d1fae5' }}>
                        <Text style={{ color: '#047857', fontSize: 12, fontWeight: '500' }}>
                            You have everything you need in your pantry!
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
