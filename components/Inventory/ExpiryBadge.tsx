import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getItemHealth } from '../../utils/itemHealth';

interface ExpiryBadgeProps {
    expiryDate?: string | null;
    showFresh?: boolean;
}

/**
 * A color-coded badge component for displaying item freshness.
 * Uses the traffic light system: Green (Good), Yellow (Warning), Orance (Critical), Red (Expired).
 */
export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({ expiryDate, showFresh = false }) => {
    const health = getItemHealth(expiryDate);

    // Don't show anything for items without expiry unless explicitly requested
    if (!expiryDate && !showFresh) return null;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: health.color + '15', // 8% opacity for BG
                borderColor: health.color + '40',       // 25% opacity for border
            }
        ]}>
            <View style={[styles.dot, { backgroundColor: health.color }]} />
            <Text style={[styles.text, { color: health.color }]}>
                {health.label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    text: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
