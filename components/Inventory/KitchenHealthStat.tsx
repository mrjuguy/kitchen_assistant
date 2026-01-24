import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface KitchenHealthStatProps {
    label: string;
    value: string | number;
    trend: string;
    Icon: LucideIcon;
    color: string;
    bgColor: string;
}

export const KitchenHealthStat: React.FC<KitchenHealthStatProps> = ({
    label,
    value,
    trend,
    Icon,
    color,
    bgColor
}) => {
    return (
        <View style={{
            flex: 1,
            minWidth: 150,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: '#f3f4f6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ padding: 8, backgroundColor: bgColor, borderRadius: 10 }}>
                    <Icon size={20} color={color} />
                </View>
                <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#f0fdf4', borderRadius: 99 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#16a34a' }}>{trend}</Text>
                </View>
            </View>

            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{value}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>{label}</Text>
        </View>
    );
};
