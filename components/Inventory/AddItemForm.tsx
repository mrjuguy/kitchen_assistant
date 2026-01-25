import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { PackageOpen, ShoppingCart, X } from 'lucide-react-native'; // Added icons
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useAddPantryItem } from '../../hooks/usePantry';
import { useAddShoppingItem } from '../../hooks/useShoppingList';
import { fetchProductByBarcode } from '../../services/openFoodFacts';
import { CommonInventoryItemData, CreatePantryItem, CreateShoppingItem, NutritionalInfo } from '../../types/schema';
import { normalizeToUS, UNITS_DB } from '../../utils/units';

// New Components
import { AddItemHeader } from './AddItems/AddItemHeader';
import { ExpirySelector } from './AddItems/ExpirySelector';
import { QuantitySlider } from './AddItems/QuantitySlider';
import { SmartItemInput } from './AddItems/SmartItemInput';
import { StorageCategorySelector } from './AddItems/StorageCategorySelector';

const CATEGORIES = ['Produce', 'Dairy', 'Spices', 'Protein', 'Pantry', 'Frozen', 'Bakery'];
const UNITS = ['items', ...Object.keys(UNITS_DB)];

interface AddItemFormProps {
    onClose: () => void;
    startWithScanner?: boolean;
    defaultTarget?: 'pantry' | 'shopping';
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onClose, startWithScanner = false, defaultTarget = 'pantry' }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState(UNITS[0]);
    const [storageLocation, setStorageLocation] = useState<'pantry' | 'fridge' | 'freezer'>('pantry');
    const [expiryDate, setExpiryDate] = useState<string | undefined>(undefined);
    const [barcode, setBarcode] = useState<string | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [brand, setBrand] = useState<string | undefined>(undefined);
    const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo | undefined>(undefined);
    const [ingredientsText, setIngredientsText] = useState<string | undefined>(undefined);
    const [allergens, setAllergens] = useState<string[] | undefined>(undefined);
    const [labels, setLabels] = useState<string[] | undefined>(undefined);
    const [target, setTarget] = useState<'pantry' | 'shopping'>(defaultTarget);
    const [isScanning, setIsScanning] = useState(startWithScanner);
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

            if (product.quantity && product.unit) {
                const { value: normQty, unit: normUnit } = normalizeToUS(product.quantity, product.unit as any);
                setQuantity(normQty.toString());
                setUnit(normUnit);
            }
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

        const baseData: CommonInventoryItemData = {
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
            const pantryData: CreatePantryItem = {
                ...baseData,
                expiry_date: expiryDate,
                storage_location: storageLocation,
            };
            addPantryMutation.mutate(pantryData, {
                onSuccess: () => onClose(),
                onError: (error) => {
                    Alert.alert('Error', `Failed to add item: ${error.message}`);
                }
            });
        } else {
            const shoppingData: CreateShoppingItem = {
                ...baseData,
                bought: false,
            };
            addShoppingMutation.mutate(shoppingData, {
                onSuccess: () => onClose(),
                onError: (error) => {
                    Alert.alert('Error', `Failed to add item: ${error.message}`);
                }
            });
        }
    };

    if (isScanning) {
        return (
            <View className="flex-1 bg-black">
                <CameraView
                    className="flex-1"
                    onBarcodeScanned={handleBarcodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
                    }}
                >
                    <View className="flex-1 items-center justify-center">
                        <View className="w-[250px] h-[250px] border-2 border-emerald-500 rounded-3xl" />
                        <Text className="text-white font-bold mt-8 bg-black/50 px-4 py-2 rounded-full">
                            Scan a product barcode
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => setIsScanning(false)}
                        className="absolute top-12 right-6 p-4 bg-black/50 rounded-full"
                    >
                        <X color="white" size={24} />
                    </Pressable>
                </CameraView>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-slate-900 w-full h-full">
            <AddItemHeader onClose={onClose} title="Add Item" />

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 150 }}>
                <SmartItemInput
                    value={name}
                    onChangeText={setName}
                    onScanPress={startScanning}
                />

                <StorageCategorySelector
                    selectedLocation={storageLocation}
                    selectedCategory={category}
                    onLocationChange={(loc) => setStorageLocation(loc as any)}
                    onCategoryChange={setCategory}
                />

                {target === 'pantry' && (
                    <ExpirySelector
                        currentDate={expiryDate ? new Date(expiryDate) : null}
                        onSelect={(date) => setExpiryDate(date.toISOString())}
                    />
                )}

                <QuantitySlider
                    value={parseFloat(quantity) || 0}
                    onChange={(val) => setQuantity(val.toString())}
                />

                {/* Target Switcher - Preliminary styling until we integrate it into new designs if not there */}
                {/* The PRD doesn't explicitly show target switcher in the visual references but Goal 3 says "Ensure critical fields (Storage Location, Category, Target) remain available" */}
                {/* I will add a simple styled target switcher for now. */}
                <View className="mb-8 flex-row bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    <Pressable
                        onPress={() => setTarget('pantry')}
                        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${target === 'pantry' ? 'bg-white dark:bg-slate-700' : ''
                            }`}
                    >
                        <PackageOpen size={20} color={target === 'pantry' ? '#0d7ff2' : '#94a3b8'} />
                        <Text className={target === 'pantry' ? 'font-bold text-slate-900 dark:text-white' : 'font-bold text-slate-400'}>
                            Pantry
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setTarget('shopping')}
                        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${target === 'shopping' ? 'bg-white dark:bg-slate-700' : ''
                            }`}
                    >
                        <ShoppingCart size={20} color={target === 'shopping' ? '#0d7ff2' : '#94a3b8'} />
                        <Text className={target === 'shopping' ? 'font-bold text-slate-900 dark:text-white' : 'font-bold text-slate-400'}>
                            Shopping
                        </Text>
                    </Pressable>
                </View>

                {/* Footer / Submit Button */}
                <View className="mt-4 mb-8">
                    <Pressable
                        onPress={handleSubmit}
                        disabled={addPantryMutation.isPending || addShoppingMutation.isPending || !name.trim()}
                        className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-3 ${(addPantryMutation.isPending || addShoppingMutation.isPending || !name.trim())
                            ? 'bg-slate-200 dark:bg-slate-700'
                            : 'bg-blue-500'
                            }`}
                    >
                        {addPantryMutation.isPending || addShoppingMutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <PackageOpen color="white" size={24} />
                                <Text className="text-white text-lg font-bold">
                                    {target === 'pantry' ? 'Add to Pantry' : 'Add to Shopping List'}
                                </Text>
                            </>
                        )}
                    </Pressable>
                    <Text className="text-center text-xs text-slate-400 mt-3 font-medium">Helping you reduce waste, one item at a time.</Text>
                </View>
            </ScrollView>
        </View>
    );
};
