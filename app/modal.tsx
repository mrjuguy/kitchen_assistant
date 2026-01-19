import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AddItemForm } from '../components/Inventory/AddItemForm';
import { View } from '../components/Themed';

export default function ModalScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AddItemForm />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
