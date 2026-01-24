import { AlertCircle, AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { PantryItem } from '../../types/schema';
import { getItemHealth } from '../../utils/pantry';

interface WastingSoonCardProps {
    item: PantryItem;
    onPress: () => void;
}

export const WastingSoonCard: React.FC<WastingSoonCardProps> = ({ item, onPress }) => {
    const health = getItemHealth(item.expiry_date);

    const getIcon = () => {
        if (health.status === 'expired' || health.status === 'critical') return <AlertCircle size={14} color="#ef4444" />;
        if (health.status === 'warning') return <AlertTriangle size={14} color="#f59e0b" />;
        return null;
    };

    const icon = getIcon();

    return (
        <Pressable
            onPress={onPress}
            style={{
                width: 160,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 12,
                marginVertical: 4,
                marginRight: 12,
                borderWidth: 1,
                borderColor: '#f3f4f6',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            <View style={{ width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f3f4f6', marginBottom: 12 }}>
                {item.image_url ? (
                    <ImageBackground
                        source={{ uri: item.image_url }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                        <AlertTriangle size={32} color="#9ca3af" />
                    </View>
                )}

                {icon && (
                    <View style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: health.status === 'expired' || health.status === 'critical' ? '#fee2e2' : '#fef3c7',
                        padding: 4,
                        borderRadius: 99
                    }}>
                        {icon}
                    </View>
                )}
            </View>

            <View>
                <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>
                    {item.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: health.color,
                        marginRight: 6
                    }} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: health.color }}>
                        {health.label}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};
