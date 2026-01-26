import { AlertCircle, Package, ShieldCheck, X } from "lucide-react-native";
import React from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";

import { NutritionLabel } from "./NutritionLabel";
import { NutritionalInfo } from "../../types/schema";

export interface ProductDetailItem {
  name: string;
  brand?: string;
  category: string;
  image_url?: string;
  labels?: string[];
  allergens?: string[];
  nutritional_info?: NutritionalInfo;
  ingredients_text?: string;
  quantity?: number;
  unit?: string;
}

interface ProductDetailModalProps {
  item: ProductDetailItem | null;
  visible: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  visible,
  onClose,
}) => {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[32px] h-[90%] pt-2">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <Text
              className="text-xl font-bold text-gray-900 flex-1 mr-4"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Pressable
              onPress={onClose}
              className="p-2 bg-gray-100 rounded-full"
            >
              <X color="#6b7280" size={24} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="p-6 pb-12"
          >
            {/* Top Section: Image & Brand */}
            <View className="flex-row mb-8">
              <View className="w-[120px] h-[120px] bg-gray-50 rounded-3xl items-center justify-center overflow-hidden border border-gray-100">
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                ) : (
                  <Package size={64} color="#e5e7eb" />
                )}
              </View>
              <View className="flex-1 ml-5 justify-center">
                <Text className="text-[10px] font-black text-gray-400 tracking-[1.5px] mb-1">
                  BRAND
                </Text>
                <Text className="text-[22px] font-extrabold text-gray-900 mb-2 leading-7">
                  {item.brand || "Unknown Brand"}
                </Text>
                <View className="self-start bg-gray-100 px-3 py-1.5 rounded-full mb-2">
                  <Text className="text-xs font-bold text-gray-600">
                    {item.category}
                  </Text>
                </View>
                {item.quantity !== undefined && (
                  <Text className="text-sm text-gray-500 font-medium">
                    Quantity: {item.quantity} {item.unit}
                  </Text>
                )}
              </View>
            </View>

            {/* Labels/Tags */}
            {item.labels && item.labels.length > 0 && (
              <View className="mb-8">
                <View className="flex-row items-center mb-3">
                  <ShieldCheck size={20} color="#10b981" />
                  <Text className="text-lg font-bold text-gray-900 ml-2">
                    Dietary Labels
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {item.labels.slice(0, 10).map((label, idx) => (
                    <View
                      key={idx}
                      className="bg-green-50 px-3 py-1.5 rounded-full"
                    >
                      <Text className="text-xs font-semibold text-green-700 capitalize">
                        {label.replace("en:", "").replace(/-/g, " ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Allergens */}
            {item.allergens && item.allergens.length > 0 && (
              <View className="mb-8">
                <View className="flex-row items-center mb-3">
                  <AlertCircle size={20} color="#ef4444" />
                  <Text className="text-lg font-bold text-red-500 ml-2">
                    Allergens Found
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {item.allergens.map((allergen, idx) => (
                    <View
                      key={idx}
                      className="bg-red-100 px-3 py-1.5 rounded-full"
                    >
                      <Text className="text-xs font-semibold text-red-800 capitalize">
                        {allergen.replace("en:", "").replace(/-/g, " ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Nutrition Facts */}
            {item.nutritional_info && (
              <View className="mb-8">
                <NutritionLabel data={item.nutritional_info} />
              </View>
            )}

            {/* Ingredients */}
            {item.ingredients_text && (
              <View className="mb-8">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  Ingredients
                </Text>
                <Text className="text-sm text-gray-600 leading-[22px]">
                  {item.ingredients_text}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
