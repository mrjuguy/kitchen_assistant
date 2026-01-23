import { useRouter } from 'expo-router';
import { ArrowRight, Copy, Home, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
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
import { useCurrentHousehold, useHouseholdMembers, useJoinHousehold } from '../../hooks/useHousehold';

export default function HouseholdScreen() {
    const router = useRouter();
    const { currentHousehold, isLoading: householdLoading } = useCurrentHousehold();
    const { data: members, isLoading: membersLoading } = useHouseholdMembers(currentHousehold?.id);
    const joinMutation = useJoinHousehold();

    const [inviteCode, setInviteCode] = useState('');

    const handleJoin = async () => {
        if (!inviteCode.trim()) return;
        try {
            await joinMutation.mutateAsync(inviteCode.trim());
            Alert.alert('Success', 'You have joined the household!');
            setInviteCode('');
        } catch (error) {
            Alert.alert('Error', 'Failed to join household. Check the code and try again.');
        }
    };

    if (householdLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowRight size={24} color="#111827" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Household</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Current Household Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Home size={24} color="#10b981" />
                        <Text style={styles.cardTitle}>{currentHousehold?.name || 'My Household'}</Text>
                    </View>

                    <Text style={styles.label}>Invite Code</Text>
                    <View style={styles.codeContainer}>
                        <Text style={styles.code}>{currentHousehold?.invite_code}</Text>
                        <TouchableOpacity
                            onPress={() => Alert.alert('Copied', 'Invite code copied to clipboard!')}
                            style={styles.copyButton}
                        >
                            <Copy size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.helperText}>Share this code with your family to invite them.</Text>
                </View>

                {/* Members List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Members</Text>
                    {membersLoading ? (
                        <ActivityIndicator color="#10b981" />
                    ) : (
                        <View style={styles.membersList}>
                            {members?.map((member) => (
                                <View key={member.user_id} style={styles.memberItem}>
                                    <View style={styles.memberAvatar}>
                                        <Text style={styles.memberInitials}>
                                            {(member.profile?.display_name || 'U').charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={styles.memberInfo}>
                                        <Text style={styles.memberName}>
                                            {member.profile?.display_name || 'Unknown User'}
                                        </Text>
                                        <Text style={styles.memberRole}>{member.role}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Join Another Household */}
                <View style={[styles.section, styles.joinSection]}>
                    <Text style={styles.sectionTitle}>Join Another Household</Text>
                    <Text style={styles.helperText}>Enter an invite code to join existing household.</Text>

                    <View style={styles.joinInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Invite Code"
                            value={inviteCode}
                            onChangeText={setInviteCode}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={[styles.joinButton, !inviteCode && styles.joinButtonDisabled]}
                            onPress={handleJoin}
                            disabled={!inviteCode || joinMutation.isPending}
                        >
                            {joinMutation.isPending ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Plus size={20} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    scrollContent: {
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginLeft: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    code: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'SpaceMono', // Assuming font is available
        color: '#111827',
        letterSpacing: 1,
    },
    copyButton: {
        padding: 8,
    },
    helperText: {
        fontSize: 14,
        color: '#6b7280',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    membersList: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#d1fae5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberInitials: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#059669',
    },
    memberInfo: {},
    memberName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    memberRole: {
        fontSize: 14,
        color: '#6b7280',
        textTransform: 'capitalize',
    },
    joinSection: {
        marginTop: 24,
    },
    joinInputContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        height: 50,
        marginRight: 12,
    },
    joinButton: {
        width: 50,
        height: 50,
        backgroundColor: '#10b981',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
});
