import * as Haptics from 'expo-haptics';
import { ChefHat, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    async function handleAuth() {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = isSignUp
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                Alert.alert('Auth Error', error.message);
                setLoading(false);
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } catch (err) {
            Alert.alert('Unexpected Error', String(err));
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 48 }}>
                    <View style={{ alignItems: 'center', marginBottom: 48 }}>
                        <View style={{
                            backgroundColor: '#10b981',
                            padding: 24,
                            borderRadius: 24,
                            shadowColor: '#10b981',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.3,
                            shadowRadius: 16,
                            elevation: 8,
                            marginBottom: 24
                        }}>
                            <ChefHat size={48} color="white" strokeWidth={1.5} />
                        </View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </Text>
                        <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center' }}>
                            Manage your kitchen like a professional chef.
                        </Text>
                    </View>

                    <View>
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#f9fafb',
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#f3f4f6'
                            }}>
                                <Mail size={20} color="#9ca3af" />
                                <TextInput
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="chef@kitchen.com"
                                    placeholderTextColor="#9ca3af"
                                    style={{ flex: 1, marginLeft: 12, color: '#111827', fontSize: 16 }}
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 32 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Password</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#f9fafb',
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#f3f4f6'
                            }}>
                                <Lock size={20} color="#9ca3af" />
                                <TextInput
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor="#9ca3af"
                                    style={{ flex: 1, marginLeft: 12, color: '#111827', fontSize: 16 }}
                                />
                            </View>
                        </View>

                        <Pressable
                            onPress={handleAuth}
                            disabled={loading}
                            style={{
                                width: '100%',
                                paddingVertical: 16,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                backgroundColor: loading ? '#e5e7eb' : '#10b981',
                                shadowColor: '#10b981',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 4
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            onPress={() => setIsSignUp(!isSignUp)}
                            style={{ marginTop: 24, paddingVertical: 8 }}
                        >
                            <Text style={{ color: '#6b7280', textAlign: 'center', fontSize: 15 }}>
                                {isSignUp
                                    ? 'Already have an account? Set the table (Sign In)'
                                    : "Don't have an account? Start cooking (Sign Up)"}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
