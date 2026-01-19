import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { AddItemForm } from '../components/Inventory/AddItemForm';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <AddItemForm onClose={() => router.back()} />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
