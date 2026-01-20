import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface NutritionLabelProps {
    data: {
        calories?: number;
        proteins?: number;
        carbohydrates?: number;
        fat?: number;
        sugar?: number;
        fiber?: number;
    };
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({ data }) => {
    const rows = [
        { label: 'Calories', value: data.calories, unit: 'kcal' },
        { label: 'Total Fat', value: data.fat, unit: 'g' },
        { label: 'Carbohydrates', value: data.carbohydrates, unit: 'g' },
        { label: '  Sugars', value: data.sugar, unit: 'g' },
        { label: '  Fiber', value: data.fiber, unit: 'g' },
        { label: 'Protein', value: data.proteins, unit: 'g' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nutrition Facts</Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>Values per 100g</Text>
            <View style={styles.dividerThick} />

            {rows.map((row, index) => (
                <React.Fragment key={row.label}>
                    <View style={styles.row}>
                        <Text style={[styles.label, row.label.startsWith(' ') && styles.indented]}>
                            {row.label.trim()}
                        </Text>
                        <Text style={styles.value}>
                            {row.value !== undefined ? `${Math.round(row.value * 10) / 10}${row.unit}` : '—'}
                        </Text>
                    </View>
                    {index < rows.length - 1 && <View style={styles.dividerThin} />}
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    dividerThick: {
        height: 6,
        backgroundColor: '#111827',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginBottom: 4,
    },
    dividerThin: {
        height: 1,
        backgroundColor: '#f3f4f6',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
    },
    indented: {
        fontWeight: '400',
        paddingLeft: 16,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
});
