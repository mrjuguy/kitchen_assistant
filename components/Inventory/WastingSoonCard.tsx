import { AlertCircle, AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { PantryItem } from '../../types/schema';
import { getItemHealth } from '../../utils/itemHealth';

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
            className="w-40 bg-white rounded-2xl p-3 my-1 mr-3 border border-gray-100 shadow-sm"
            style={{ elevation: 2 }}
        >
            <View className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 relative">
                {item.image_url ? (
                    <ImageBackground
                        source={{ uri: item.image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="flex-1 items-center justify-center opacity-30">
                        <AlertTriangle size={32} color="#9ca3af" />
                    </View>
                )}

                {icon && (
                    <View
                        className="absolute top-2 right-2 p-1 rounded-full"
                        style={{
                            backgroundColor: health.status === 'expired' || health.status === 'critical' ? '#fee2e2' : '#fef3c7',
                        }}
                    >
                        {icon}
                    </View>
                )}
            </View>

            <View>
                <Text numberOfLines={1} className="text-sm font-bold text-gray-900 mb-1">
                    {item.name}
                </Text>
                <View className="flex-row items-center">
                    <View
                        className="w-2 h-2 rounded-full mr-1.5"
                        style={{ backgroundColor: health.color }}
                    />
                    <Text
                        className="text-xs font-semibold"
                        style={{ color: health.color }}
                    >
                        {health.label}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};
