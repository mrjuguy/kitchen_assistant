import { AlertTriangle, ChefHat, Info, Timer } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { GapAnalysis } from '../../hooks/useGapAnalysis';
import { RecipeWithIngredients } from '../../hooks/useRecipes';

interface RecipeCardProps {
    recipe: RecipeWithIngredients;
    analysis?: GapAnalysis;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, analysis }) => {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Green': return '#10b981'; // Emerald 500
            case 'Yellow': return '#f59e0b'; // Amber 500
            case 'Red': return '#ef4444'; // Red 500
            default: return '#9ca3af'; // Gray 400
        }
    };

    const getStatusBg = (status?: string) => {
        switch (status) {
            case 'Green': return '#ecfdf5';
            case 'Yellow': return '#fff9eb';
            case 'Red': return '#fef2f2';
            default: return '#f9fafb';
        }
    };

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
                        backgroundColor: getStatusColor(analysis.status)
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {analysis.status === 'Green' ? 'Ready to Cook' :
                                analysis.status === 'Yellow' ? `${analysis.missingCount} Missing` :
                                    analysis.allergenWarning ? 'UNSAFE' : 'Incompatible'}
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

                {/* Allergen Warning */}
                {analysis?.allergenWarning && (
                    <View style={{ backgroundColor: '#fef2f2', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#fee2e2', marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <AlertTriangle size={16} color="#ef4444" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#991b1b', fontSize: 12, fontWeight: 'bold' }}>
                            Contains {analysis.allergenWarning}
                        </Text>
                    </View>
                )}

                {/* Gap Analysis Summary */}
                {analysis && analysis.status !== 'Green' && !analysis.allergenWarning && (
                    <View style={{ backgroundColor: getStatusBg(analysis.status), padding: 12, borderRadius: 12, borderWidth: 1, borderColor: analysis.status === 'Yellow' ? '#fef3c7' : '#fee2e2' }}>
                        <Text style={{ color: analysis.status === 'Yellow' ? '#92400e' : '#991b1b', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>
                            {analysis.status === 'Yellow' ? 'Missing:' : 'Missing ingredients:'}
                        </Text>
                        <Text style={{ color: analysis.status === 'Yellow' ? '#b45309' : '#b91c1c', fontSize: 12 }} numberOfLines={2}>
                            {analysis.ingredientMatches.filter(i => !i.isInStock).map(i => i.name).join(', ')}
                        </Text>
                    </View>
                )}

                {analysis?.status === 'Green' && (
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
