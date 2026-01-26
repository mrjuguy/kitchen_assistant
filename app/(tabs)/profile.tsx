import { useRouter } from "expo-router";
import {
  ArrowRight,
  Heart,
  LogOut,
  Save,
  ShieldCheck,
  User,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProfile, useUpdateProfile } from "../../hooks/useProfile";
import { supabase } from "../../services/supabase";

const ALLERGENS = [
  "Peanuts",
  "Dairy",
  "Gluten",
  "Eggs",
  "Soy",
  "Fish",
  "Shellfish",
  "Tree Nuts",
];
const DIETARY_PREFERENCES = [
  "Vegan",
  "Vegetarian",
  "Keto",
  "Paleo",
  "Low Carb",
  "Gluten-Free",
];

export default function ProfileScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setSelectedAllergens(profile.allergens || []);
      setSelectedPrefs(profile.dietary_preferences || []);
    }
  }, [profile]);

  const toggleAllergen = (item: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const togglePref = (item: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        display_name: displayName,
        allergens: selectedAllergens,
        dietary_preferences: selectedPrefs,
      });
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f7f8]">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f7f8]" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Profile</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Health & Dietary Settings
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="p-2.5 bg-red-50 rounded-xl"
          >
            <LogOut size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Household */}
        <View className="mb-8">
          <View className="flex-row items-center mb-3">
            <Users size={20} color="#10b981" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-900">
              Household
            </Text>
          </View>
          <TouchableOpacity
            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-row items-center justify-between"
            onPress={() => router.push("/settings/household")}
          >
            <Text className="text-base text-gray-900 font-medium">
              Manage Household
            </Text>
            <ArrowRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Display Name */}
        <View className="mb-8">
          <View className="flex-row items-center mb-3">
            <User size={20} color="#10b981" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-900">
              Display Name
            </Text>
          </View>
          <TextInput
            className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-base text-gray-900"
            placeholder="Your Name"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        {/* Allergens */}
        <View className="mb-8">
          <View className="flex-row items-center mb-3">
            <ShieldCheck size={20} color="#ef4444" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-900">
              Allergens
            </Text>
          </View>
          <Text className="text-sm text-gray-500 mb-4">
            Recipes containing these will be flagged as unsafe.
          </Text>
          <View className="flex-row flex-wrap -m-1">
            {ALLERGENS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleAllergen(item)}
                className={`px-4 py-2.5 rounded-xl m-1 ${
                  selectedAllergens.includes(item)
                    ? "bg-red-100 border border-red-200"
                    : "bg-gray-100 border border-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedAllergens.includes(item)
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dietary Prefs */}
        <View className="mb-8">
          <View className="flex-row items-center mb-3">
            <Heart size={20} color="#10b981" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-900">
              Dietary Preferences
            </Text>
          </View>
          <Text className="text-sm text-gray-500 mb-4">
            Used to personalize recipe recommendations.
          </Text>
          <View className="flex-row flex-wrap -m-1">
            {DIETARY_PREFERENCES.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => togglePref(item)}
                className={`px-4 py-2.5 rounded-xl m-1 ${
                  selectedPrefs.includes(item)
                    ? "bg-emerald-100 border border-emerald-200"
                    : "bg-gray-100 border border-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedPrefs.includes(item)
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-emerald-500 flex-row items-center justify-center py-4 rounded-2xl shadow-lg shadow-emerald-500/20 mt-2"
          style={{ elevation: 4 }}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Save size={20} color="white" className="mr-2" />
              <Text className="text-white text-base font-bold">
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
