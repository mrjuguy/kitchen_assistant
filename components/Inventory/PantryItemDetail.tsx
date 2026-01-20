import { AlertCircle, Package, ShieldCheck, X } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PantryItem } from '../../types/schema';
import { NutritionLabel } from './NutritionLabel';

interface PantryItemDetailProps {
    item: PantryItem;
    onClose: () => void;
}

export const PantryItemDetail: React.FC<PantryItemDetailProps> = ({ item, onClose }) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{item.name}</Text>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <X color="#6b7280" size={24} />
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Top Section: Image & Brand */}
                    <View style={styles.topSection}>
                        <View style={styles.imageContainer}>
                            {item.image_url ? (
                                <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="contain" />
                            ) : (
                                <Package size={64} color="#e5e7eb" />
                            )}
                        </View>
                        <View style={styles.brandInfo}>
                            <Text style={styles.brandLabel}>BRAND</Text>
                            <Text style={styles.brandName}>{item.brand || 'Unknown Brand'}</Text>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{item.category}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Labels/Tags */}
                    {item.labels && item.labels.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <ShieldCheck size={20} color="#10b981" />
                                <Text style={styles.sectionTitle}>Dietary Labels</Text>
                            </View>
                            <View style={styles.tagContainer}>
                                {item.labels.slice(0, 10).map((label, idx) => (
                                    <View key={idx} style={styles.tag}>
                                        <Text style={styles.tagText}>
                                            {label.replace('en:', '').replace(/-/g, ' ')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Allergens */}
                    {item.allergens && item.allergens.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <AlertCircle size={20} color="#ef4444" />
                                <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Allergens Found</Text>
                            </View>
                            <View style={styles.tagContainer}>
                                {item.allergens.map((allergen, idx) => (
                                    <View key={idx} style={[styles.tag, { backgroundColor: '#fee2e2' }]}>
                                        <Text style={[styles.tagText, { color: '#991b1b' }]}>
                                            {allergen.replace('en:', '').replace(/-/g, ' ')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Nutrition Facts */}
                    {item.nutritional_info && (
                        <View style={styles.section}>
                            <NutritionLabel data={item.nutritional_info} />
                        </View>
                    )}

                    {/* Ingredients */}
                    {item.ingredients_text && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { marginLeft: 0, marginBottom: 12 }]}>Ingredients</Text>
                            <Text style={styles.ingredientsText}>{item.ingredients_text}</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '90%',
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1,
        marginRight: 16,
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 99,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 48,
    },
    topSection: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    imageContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#f9fafb',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    brandInfo: {
        flex: 1,
        marginLeft: 20,
        justifyContent: 'center',
    },
    brandLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#9ca3af',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    brandName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4b5563',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginLeft: 8,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#166534',
        textTransform: 'capitalize',
    },
    ingredientsText: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 22,
    },
});
