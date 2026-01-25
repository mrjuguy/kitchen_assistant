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
            const { error } = isSignUp
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
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerClassName="flex-grow px-6 pt-12">
                    <View className="items-center mb-12">
                        <View
                            className="bg-emerald-500 p-6 rounded-3xl mb-6 shadow-lg shadow-emerald-500/30"
                            style={{ elevation: 8 }}
                        >
                            <ChefHat size={48} color="white" strokeWidth={1.5} />
                        </View>
                        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </Text>
                        <Text className="text-base text-gray-500 text-center px-4">
                            Manage your kitchen like a professional chef.
                        </Text>
                    </View>

                    <View>
                        <View className="mb-4">
                            <Text className="text-[13px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">Email Address</Text>
                            <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-100">
                                <Mail size={20} color="#9ca3af" />
                                <TextInput
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="chef@kitchen.com"
                                    placeholderTextColor="#9ca3af"
                                    className="flex-1 ml-3 text-gray-900 text-base"
                                />
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-[13px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">Password</Text>
                            <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-100">
                                <Lock size={20} color="#9ca3af" />
                                <TextInput
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor="#9ca3af"
                                    className="flex-1 ml-3 text-gray-900 text-base"
                                />
                            </View>
                        </View>

                        <Pressable
                            onPress={handleAuth}
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-emerald-500/30 ${loading ? 'bg-gray-200' : 'bg-emerald-500'}`}
                            style={{ elevation: 4 }}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            onPress={() => setIsSignUp(!isSignUp)}
                            className="mt-6 py-2"
                        >
                            <Text className="text-gray-500 text-center text-[15px]">
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
