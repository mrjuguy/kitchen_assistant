import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Scan, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAddPantryItem } from '../../hooks/usePantry';
import { useAddShoppingItem } from '../../hooks/useShoppingList';
import { fetchProductByBarcode } from '../../services/openFoodFacts';
import { NutritionalInfo } from '../../types/schema';

const CATEGORIES = ['Produce', 'Dairy', 'Spices', 'Protein', 'Pantry', 'Frozen', 'Bakery'];
const UNITS = ['items', 'grams', 'ml', 'kg', 'oz', 'lb', 'cups'];

interface AddItemFormProps {
    onClose: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState(UNITS[0]);
    const [barcode, setBarcode] = useState<string | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [brand, setBrand] = useState<string | undefined>(undefined);
    const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo | undefined>(undefined);
    const [ingredientsText, setIngredientsText] = useState<string | undefined>(undefined);
    const [allergens, setAllergens] = useState<string[] | undefined>(undefined);
    const [labels, setLabels] = useState<string[] | undefined>(undefined);
    const [target, setTarget] = useState<'pantry' | 'shopping'>('pantry');
    const [isScanning, setIsScanning] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);

    const [permission, requestPermission] = useCameraPermissions();
    const addPantryMutation = useAddPantryItem();
    const addShoppingMutation = useAddShoppingItem();

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (!isScanning) return;
        setIsScanning(false);
        setBarcode(data);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setIsFetchingInfo(true);
        const product = await fetchProductByBarcode(data);
        setIsFetchingInfo(false);

        if (product) {
            setName(product.name);
            setCategory(product.category);
            setImageUrl(product.image_url);
            setBrand(product.brand);
            setNutritionalInfo(product.nutritional_info);
            setIngredientsText(product.ingredients_text);
            setAllergens(product.allergens);
            setLabels(product.labels);
        } else {
            Alert.alert('Product Not Found', 'Could not find product info for this barcode. You can still enter details manually.', [{ text: 'OK' }]);
        }
    };

    const startScanning = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert('Permission Required', 'Camera permission is needed to scan barcodes.');
                return;
            }
        }
        setIsScanning(true);
    };

    const handleSubmit = () => {
        if (!name.trim()) return;

        const itemData = {
            name: name.trim(),
            category,
            quantity: parseFloat(quantity) || 1,
            unit,
            barcode,
            image_url: imageUrl,
            brand,
            nutritional_info: nutritionalInfo,
            ingredients_text: ingredientsText,
            allergens,
            labels,
        };

        if (target === 'pantry') {
            addPantryMutation.mutate(itemData, {
                onSuccess: () => onClose()
            });
        } else {
            addShoppingMutation.mutate(itemData, {
                onSuccess: () => onClose()
            });
        }
    };

    if (isScanning) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <CameraView
                    style={{ flex: 1 }}
                    onBarcodeScanned={handleBarcodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
                    }}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: 250, height: 250, borderWidth: 2, borderColor: '#10b981', borderRadius: 24 }} />
                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 32, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
                            Scan a product barcode
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => setIsScanning(false)}
                        style={{ position: 'absolute', top: 48, right: 24, padding: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 99 }}
                    >
                        <X color="white" size={24} />
                    </Pressable>
                </CameraView>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ padding: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Add New Item</Text>
                <Pressable onPress={() => onClose()} style={{ padding: 8 }}>
                    <X color="#10b981" size={24} />
                </Pressable>
            </View>

            {/* Target Selector */}
            <View style={{ flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 6, borderRadius: 16, marginBottom: 32 }}>
                <Pressable
                    onPress={() => setTarget('pantry')}
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                        backgroundColor: target === 'pantry' ? 'white' : 'transparent',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: target === 'pantry' ? 0.1 : 0,
                        shadowRadius: 2,
                    }}
                >
                    <Text style={{ fontWeight: 'bold', color: target === 'pantry' ? '#10b981' : '#6b7280' }}>Pantry</Text>
                </Pressable>
                <Pressable
                    onPress={() => setTarget('shopping')}
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                        backgroundColor: target === 'shopping' ? 'white' : 'transparent',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: target === 'shopping' ? 0.1 : 0,
                        shadowRadius: 2,
                    }}
                >
                    <Text style={{ fontWeight: 'bold', color: target === 'shopping' ? '#10b981' : '#6b7280' }}>Shopping List</Text>
                </Pressable>
            </View>

            {/* Scanner Button */}
            <Pressable
                onPress={startScanning}
                style={{
                    backgroundColor: '#f4f4f5',
                    padding: 24,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: '#e4e4e7',
                    marginBottom: 32
                }}
            >
                <Scan size={32} color="#10b981" />
                <Text style={{ color: '#10b981', fontWeight: 'bold', marginTop: 8 }}>Scan Barcode</Text>
                <Text style={{ color: '#71717a', fontSize: 12, marginTop: 4 }}>Faster entry via scanner</Text>
            </Pressable>

            <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.25 }}>Item Name</Text>
                <View style={{ backgroundColor: '#f9fafb', borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Organic Milk"
                        placeholderTextColor="#999"
                        style={{ flex: 1, paddingVertical: 16, color: 'black', fontSize: 18 }}
                    />
                    {isFetchingInfo && <ActivityIndicator color="#10b981" />}
                </View>
                {(nutritionalInfo || ingredientsText) && (
                    <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 }} />
                        <Text style={{ fontSize: 12, color: '#059669', fontWeight: '600' }}>Nutrition data found</Text>
                    </View>
                )}
            </View>

            <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.25 }}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                    {CATEGORIES.map((cat) => (
                        <Pressable
                            key={cat}
                            onPress={() => setCategory(cat)}
                            style={{
                                marginRight: 8,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 99,
                                borderWidth: 1,
                                backgroundColor: category === cat ? '#10b981' : 'white',
                                borderColor: category === cat ? '#10b981' : '#e5e7eb'
                            }}
                        >
                            <Text style={{ color: category === cat ? 'white' : '#4b5563', fontWeight: category === cat ? 'bold' : 'normal' }}>
                                {cat}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 32 }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.25 }}>Quantity</Text>
                    <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        style={{ backgroundColor: '#f9fafb', color: 'black', padding: 16, borderRadius: 12, fontSize: 18, borderWidth: 1, borderColor: '#f3f4f6' }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.25 }}>Unit</Text>
                    <View style={{ backgroundColor: '#f9fafb', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 8 }}>
                            {UNITS.map((u) => (
                                <Pressable
                                    key={u}
                                    onPress={() => setUnit(u)}
                                    style={{
                                        marginRight: 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 8,
                                        backgroundColor: unit === u ? '#e4e4e7' : 'transparent'
                                    }}
                                >
                                    <Text style={{ color: 'black', fontWeight: '500' }}>{u}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>

            <Pressable
                onPress={handleSubmit}
                disabled={addPantryMutation.isPending || addShoppingMutation.isPending || !name.trim()}
                style={{
                    padding: 16,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: (addPantryMutation.isPending || addShoppingMutation.isPending || !name.trim()) ? '#e5e7eb' : '#10b981',
                    elevation: 5,
                    shadowColor: '#10b981',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8
                }}
            >
                {addPantryMutation.isPending || addShoppingMutation.isPending ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                        {target === 'pantry' ? 'Add to Pantry' : 'Add to Shopping List'}
                    </Text>
                )}
            </Pressable>
        </ScrollView>
    );
};
