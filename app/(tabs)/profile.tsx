import { useRouter } from 'expo-router';
import { ArrowRight, Heart, LogOut, Save, ShieldCheck, User, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile, useUpdateProfile } from '../../hooks/useProfile';
import { supabase } from '../../services/supabase';

const ALLERGENS = ['Peanuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Tree Nuts'];
const DIETARY_PREFERENCES = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Low Carb', 'Gluten-Free'];

export default function ProfileScreen() {
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const router = useRouter();

    const [displayName, setDisplayName] = useState('');
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || '');
            setSelectedAllergens(profile.allergens || []);
            setSelectedPrefs(profile.dietary_preferences || []);
        }
    }, [profile]);

    const toggleAllergen = (item: string) => {
        setSelectedAllergens((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const togglePref = (item: string) => {
        setSelectedPrefs((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync({
                display_name: displayName,
                allergens: selectedAllergens,
                dietary_preferences: selectedPrefs,
            });
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <Text style={styles.headerSubtitle}>Health & Dietary Settings</Text>
                    </View>
                    <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                        <LogOut size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                {/* Household */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Users size={20} color="#10b981" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Household</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/settings/household')}
                    >
                        <Text style={styles.actionButtonText}>Manage Household</Text>
                        <ArrowRight size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* Display Name */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <User size={20} color="#10b981" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Display Name</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Your Name"
                        value={displayName}
                        onChangeText={setDisplayName}
                    />
                </View>

                {/* Allergens */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ShieldCheck size={20} color="#ef4444" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Allergens</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Recipes containing these will be flagged as unsafe.
                    </Text>
                    <View style={styles.tagContainer}>
                        {ALLERGENS.map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => toggleAllergen(item)}
                                style={[
                                    styles.tag,
                                    selectedAllergens.includes(item) && styles.tagSelectedAllergen,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tagText,
                                        selectedAllergens.includes(item) && styles.tagTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Dietary Prefs */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Heart size={20} color="#10b981" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Used to personalize recipe recommendations.
                    </Text>
                    <View style={styles.tagContainer}>
                        {DIETARY_PREFERENCES.map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => togglePref(item)}
                                style={[
                                    styles.tag,
                                    selectedPrefs.includes(item) && styles.tagSelectedPref,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tagText,
                                        selectedPrefs.includes(item) && styles.tagTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}
                    disabled={updateProfile.isPending}
                >
                    {updateProfile.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Save size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    logoutButton: {
        padding: 10,
        backgroundColor: '#fef2f2',
        borderRadius: 12,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    tag: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        margin: 4,
    },
    tagSelectedAllergen: {
        backgroundColor: '#fee2e2',
        borderColor: '#fecaca',
        borderWidth: 1,
    },
    tagSelectedPref: {
        backgroundColor: '#d1fae5',
        borderColor: '#a7f3d0',
        borderWidth: 1,
    },
    tagText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    tagTextSelected: {
        color: '#111827',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 8,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionButtonText: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
});
